"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiRequest, putUploadRequest } from '@/lib/api';
import { PropertyForm } from '@/components/forms/PropertyForm';
import type { Property } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token, user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id || !token) return;
      try {
        const data = await apiRequest<Property>(`/api/properties/${id}`, { token });
        setProperty(data);
      } catch (error) {
        toast.error((error as Error).message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, token]);

  const handleSubmit = async (formData: FormData) => {
    if (!token || !id) return;
    setSubmitting(true);
    try {
      await putUploadRequest(`/api/properties/${id}`, formData, token);
      toast.success('Property updated');
      router.push('/dashboard');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to update property');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !property) {
    return <p className="card text-center text-sm text-slate-500">Loading property...</p>;
  }

  return (
    <PropertyForm
      initialData={property}
      onSubmit={handleSubmit}
      submitting={submitting}
      role={user?.role || 'residential'}
    />
  );
}

