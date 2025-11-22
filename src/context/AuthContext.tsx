"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { apiRequest } from '@/lib/api';
import type { Role, User } from '@/types';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'zikra_auth_v1';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persist = useCallback((nextUser: User | null, nextToken: string | null) => {
    setUser(nextUser);
    setToken(nextToken);
    if (nextUser && nextToken) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiRequest<{ user: User; token: string }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      persist(data.user, data.token);
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const logout = useCallback(() => persist(null, null), [persist]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
    }),
    [user, token, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const hasRole = (user: User | null, roles: Role[]) => {
  if (!user) return false;
  return roles.includes(user.role);
};

