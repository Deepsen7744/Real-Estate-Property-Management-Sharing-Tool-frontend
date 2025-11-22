"use client";

import { useMemo } from 'react';
import { Search } from 'lucide-react';
import type { PropertyFilters as FilterType } from '@/types';

type PropertyFiltersProps = {
  filters: FilterType;
  onChange: (filters: FilterType) => void;
  areas: string[];
};

export const PropertyFilters = ({ filters, onChange, areas }: PropertyFiltersProps) => {
  const uniqueAreas = useMemo(() => Array.from(new Set(areas)).sort(), [areas]);

  return (
    <div className="card flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1">
        <label className="text-sm font-medium text-slate-600">Search</label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Property title or area"
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full border-none bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-1">
        <label className="text-sm font-medium text-slate-600">Property Type</label>
        <select
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          value={filters.type || ''}
          onChange={(e) => onChange({ ...filters, type: e.target.value as FilterType['type'] })}
        >
          <option value="">All</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>
      <div className="flex-1">
        <label className="text-sm font-medium text-slate-600">Area</label>
        <select
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          value={filters.area || ''}
          onChange={(e) => onChange({ ...filters, area: e.target.value })}
        >
          <option value="">All Areas</option>
          {uniqueAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

