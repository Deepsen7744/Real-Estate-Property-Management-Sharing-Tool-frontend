"use client";

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    {children}
    <Toaster position="top-right" />
  </AuthProvider>
);

