"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from '@/components/ui/Loader';
import { hasRole, useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: Role[];
};

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (roles && !hasRole(user, roles)) {
        router.replace('/dashboard');
      }
    }
  }, [user, loading, roles, router]);

  if (loading || !user) {
    return <Loader />;
  }

  if (roles && !hasRole(user, roles)) {
    return <Loader label="Checking permissions..." />;
  }

  return <>{children}</>;
};

