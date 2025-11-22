"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, PlusCircle, ShieldCheck, LogOut, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { hasRole, useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';

const navItems: { label: string; href: string; icon: LucideIcon; roles: Role[] }[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Building2,
    roles: ['admin', 'residential', 'commercial'],
  },
  {
    label: 'Add Property',
    href: '/properties/new',
    icon: PlusCircle,
    roles: ['admin', 'residential', 'commercial'],
  },
  {
    label: 'Employees',
    href: '/employees',
    icon: ShieldCheck,
    roles: ['admin'],
  },
];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
              onClick={() => setOpen((prev) => !prev)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
              Real Estate Solutions
            </Link>
            <span className="hidden rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 lg:inline-flex">
              {user?.role?.toUpperCase()}
            </span>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside
          className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block ${
            open ? 'block' : 'hidden'
          }`}
        >
          <nav className="flex flex-col gap-2">
            {navItems
              .filter((item) => hasRole(user, item.roles))
              .map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      active
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
};

