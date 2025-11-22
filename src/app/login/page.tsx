"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully');
      router.replace('/dashboard');
    } catch (error) {
      toast.error((error as Error).message || 'Unable to login');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-indigo-100/70">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">Sign in to continue</h1>
          <p className="text-sm text-slate-500">Use the credentials shared in the README to explore.</p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-500">
          Need credentials? Check the{' '}
          <Link
            className="font-semibold text-indigo-600"
            href="https://github.com/zikrabyte"
            target="_blank"
          >
            project README
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

