import { notFound } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import type { Property } from '@/types';
import { formatCurrency } from '@/lib/format';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { SocialShare } from '@/components/ui/SocialShare';

type PublicPropertyPageProps = {
  params: Promise<{ id: string }>;
};

const fetchProperty = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/properties/${id}`, { cache: 'no-store' });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as Property;
};

const resolveImage = (src: string) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return `${API_BASE_URL}${src}`;
};

const convertToEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // If already an embed URL, return as is
  if (url.includes('/embed')) return url;
  
  try {
    // Handle Google Maps share links
    if (url.includes('maps.google.com') || url.includes('goo.gl/maps')) {
      // Extract coordinates or place ID
      const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordMatch) {
        return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`;
      }
      
      // Extract place query
      const placeMatch = url.match(/place\/([^/]+)/);
      if (placeMatch) {
        const place = decodeURIComponent(placeMatch[1]);
        return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
      }
      
      // Extract q parameter
      const qMatch = url.match(/[?&]q=([^&]+)/);
      if (qMatch) {
        return `https://maps.google.com/maps?q=${qMatch[1]}&output=embed`;
      }
    }
    
    // If it's already a working embed URL format, return as is
    if (url.includes('output=embed')) return url;
    
    // Default: try to use as embed with output parameter
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('output', 'embed');
      return urlObj.toString();
    }
  } catch (error) {
    console.error('Error converting maps URL:', error);
  }
  
  return url;
};

export default async function PublicPropertyPage({ params }: PublicPropertyPageProps) {
  const { id } = await params;
  const property = await fetchProperty(id);

  if (!property) {
    notFound();
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/p/${id}`;
  const description = `${property.type} property in ${property.location} - ${property.area}. Rent: ${formatCurrency(property.rent)}`;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl space-y-6 px-4">
        {/* Header */}
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
            {property.type}
          </p>
          <h1 className="text-4xl font-semibold text-slate-900">{property.title}</h1>
          <p className="text-sm text-slate-500">{property.location}</p>
        </div>

        {/* Image Carousel */}
        <ImageCarousel 
          images={property.images} 
          alt={property.title}
          apiBaseUrl={API_BASE_URL}
        />

        {/* Pricing & Details Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card space-y-2">
            <p className="text-sm font-semibold text-slate-500">Rent</p>
            <p className="text-3xl font-semibold text-slate-900">{formatCurrency(property.rent)}</p>
            <p className="text-sm font-semibold text-slate-500">Deposit</p>
            <p className="text-xl font-semibold text-slate-900">{formatCurrency(property.deposit)}</p>
          </div>
          <div className="card space-y-2">
            <p className="text-sm font-semibold text-slate-500">Area</p>
            <p className="text-lg text-slate-900">{property.area}</p>
            {property.ownerDetails && (
              <>
                <p className="text-sm font-semibold text-slate-500">Owner details</p>
                <p className="text-slate-900">{property.ownerDetails}</p>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        {!!property.features.length && (
          <div className="card space-y-2">
            <p className="text-sm font-semibold text-slate-500">Features</p>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature) => (
                <span key={feature} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Google Maps */}
        {property.mapsLink && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-soft">
            <iframe
              src={convertToEmbedUrl(property.mapsLink)}
              title="Property location"
              className="h-96 w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        {/* Social Share Buttons */}
        <div className="card">
          <SocialShare 
            url={publicUrl}
            title={property.title}
            description={description}
          />
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-xs text-slate-400">
            Powered by Real Estate Property Management
          </p>
        </div>
      </div>
    </div>
  );
}

