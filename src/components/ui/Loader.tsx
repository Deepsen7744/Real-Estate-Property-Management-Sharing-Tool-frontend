"use client";

export const Loader = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
    <p className="text-sm font-medium">{label}</p>
  </div>
);

