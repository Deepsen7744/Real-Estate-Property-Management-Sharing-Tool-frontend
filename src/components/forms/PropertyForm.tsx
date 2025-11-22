"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';
import type { Property, Role } from '@/types';

type PropertyFormProps = {
  initialData?: Partial<Property>;
  onSubmit: (payload: FormData) => Promise<void>;
  submitting?: boolean;
  role: Role;
};

type FormState = {
  title: string;
  location: string;
  area: string;
  mapsLink: string;
  rent: string;
  deposit: string;
  features: string;
  ownerDetails: string;
  type: 'residential' | 'commercial';
};

const defaultState: FormState = {
  title: '',
  location: '',
  area: '',
  mapsLink: '',
  rent: '',
  deposit: '',
  features: '',
  ownerDetails: '',
  type: 'residential',
};

export const PropertyForm = ({ initialData, onSubmit, submitting, role }: PropertyFormProps) => {
  const [formState, setFormState] = useState<FormState>({
    ...defaultState,
    ...initialData,
    rent: initialData?.rent ? String(initialData.rent) : '',
    deposit: initialData?.deposit ? String(initialData.deposit) : '',
    features: initialData?.features?.join(', ') || '',
    mapsLink: initialData?.mapsLink || '',
    type: initialData?.type || 'residential',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(initialData?.images || []);

  const resolveImageUrl = (src: string) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) {
      return src;
    }
    return `${API_BASE_URL}${src}`;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files ? Array.from(event.target.files) : [];
    setFiles(selected);
    const urls = selected.map((file) => URL.createObjectURL(file));
    setPreviews([
      ...(initialData?.images || []),
      ...urls,
    ]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!initialData && previews.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    const payload = new FormData();
    payload.append('title', formState.title);
    payload.append('location', formState.location);
    payload.append('area', formState.area);
    if (formState.mapsLink) payload.append('mapsLink', formState.mapsLink);
    payload.append('rent', formState.rent);
    if (formState.deposit) payload.append('deposit', formState.deposit);
    if (formState.features) payload.append('features', formState.features);
    if (formState.ownerDetails) payload.append('ownerDetails', formState.ownerDetails);
    if (role === 'admin') {
      payload.append('type', formState.type);
    }

    files.forEach((file) => {
      payload.append('images', file);
    });

    await onSubmit(payload);
  };

  const title = initialData ? 'Update Property' : 'Create Property';
  const description = initialData
    ? 'Update the property details below.'
    : 'Fill in the details to publish a new property.';

  return (
    <form className="card space-y-6" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">
          Title
          <input
            required
            value={formState.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Location
          <input
            required
            value={formState.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Area
          <input
            required
            value={formState.area}
            onChange={(e) => handleChange('area', e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Google Maps Link
          <input
            value={formState.mapsLink}
            onChange={(e) => handleChange('mapsLink', e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            placeholder="https://maps.google.com/..."
          />
          <p className="mt-1 text-xs text-slate-500">
            Paste any Google Maps link (share link, place URL, or coordinates)
          </p>
        </label>
        <label className="text-sm font-medium text-slate-700">
          Rent (INR)
          <input
            required
            type="number"
            min={0}
            value={formState.rent}
            onChange={(e) => handleChange('rent', e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-medium text-slate-700">
          Deposit (INR)
          <input
            type="number"
            min={0}
            value={formState.deposit}
            onChange={(e) => handleChange('deposit', e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
          />
        </label>
        <label className="text-sm font-medium text-slate-700 md:col-span-2">
          Features (comma separated)
          <input
            value={formState.features}
            onChange={(e) => handleChange('features', e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            placeholder="2BHK, Furnished, Parking"
          />
        </label>
        <label className="text-sm font-medium text-slate-700 md:col-span-2">
          Owner Details
          <textarea
            value={formState.ownerDetails}
            onChange={(e) => handleChange('ownerDetails', e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
            rows={3}
          />
        </label>
        {role === 'admin' && (
          <label className="text-sm font-medium text-slate-700">
            Property Type
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={formState.type}
              onChange={(e) => handleChange('type', e.target.value as FormState['type'])}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </label>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">
          Property Images
          <input
            type="file"
            multiple
            accept="image/*"
            className="mt-2 w-full rounded-xl border border-dashed border-slate-300 px-4 py-8 text-sm"
            onChange={handleFiles}
          />
        </label>
        {!!previews.length && (
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {previews.map((src) => (
              <div key={src} className="overflow-hidden rounded-xl border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImageUrl(src)} alt="Preview" className="h-32 w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Saving...' : initialData ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  );
};

