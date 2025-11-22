"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { uploadRequest } from '@/lib/api';
import { PropertyForm } from '@/components/forms/PropertyForm';
import { useAuth } from '@/context/AuthContext';

export default function NewPropertyPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (!token) return;
    setSubmitting(true);
    try {
      await uploadRequest('/api/properties', formData, token);
      toast.success('Property published');
      router.push('/dashboard');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PropertyForm onSubmit={handleSubmit} submitting={submitting} role={user?.role || 'residential'} />
  );
}

