"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Building2, Home, HousePlus, Layers3 } from 'lucide-react';
import { apiRequest, buildQueryString } from '@/lib/api';
import type { Property, PropertyFilters as FilterType, PropertySummary } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { PropertyFilters } from '@/components/properties/PropertyFilters';
import { PropertyTable } from '@/components/properties/PropertyTable';

type PropertiesResponse = {
  items: Property[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

const defaultSummary: PropertySummary = {
  total: 0,
  today: 0,
  residential: 0,
  commercial: 0,
};

export default function DashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<PropertySummary>(defaultSummary);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({});

  const fetchSummary = async () => {
    if (!token) return;
    if (user?.role === 'admin') {
      const data = await apiRequest<PropertySummary>('/api/properties/summary', { token });
      setSummary(data);
    } else {
      const residential = properties.filter((item) => item.type === 'residential').length;
      const commercial = properties.filter((item) => item.type === 'commercial').length;
      setSummary({
        total: properties.length,
        today: properties.filter((item) => {
          const created = new Date(item.createdAt);
          const today = new Date();
          return (
            created.getDate() === today.getDate() &&
            created.getMonth() === today.getMonth() &&
            created.getFullYear() === today.getFullYear()
          );
        }).length,
        residential,
        commercial,
      });
    }
  };

  const fetchProperties = async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      const query = buildQueryString({
        type: filters.type,
        area: filters.area,
        search: filters.search,
        createdBy: user.role === 'admin' ? undefined : user.id,
      });
      const data = await apiRequest<PropertiesResponse>(`/api/properties${query}`, { token });
      setProperties(data.items);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, token, user?.id, user?.role]);

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, token, user?.role]);

  const handleDelete = async (property: Property) => {
    if (!window.confirm(`Delete ${property.title}?`)) return;
    try {
      await apiRequest(`/api/properties/${property._id}`, {
        method: 'DELETE',
        token,
      });
      toast.success('Property removed');
      fetchProperties();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const canManage = (property: Property) => {
    if (user?.role === 'admin') return true;
    const ownerId =
      typeof property.createdBy === 'string' ? property.createdBy : property.createdBy?._id;
    return ownerId === user?.id;
  };

  const areas = useMemo(() => properties.map((property) => property.area), [properties]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Track portfolio health and manage listings.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total properties" value={summary.total} icon={Layers3} trendLabel="Live listings" />
        <SummaryCard
          label="Uploaded today"
          value={summary.today}
          icon={HousePlus}
          trendLabel="24h window"
          accent="bg-emerald-500"
        />
        <SummaryCard
          label="Residential"
          value={summary.residential}
          icon={Building2}
          accent="bg-indigo-500"
        />
        <SummaryCard
          label="Commercial"
          value={summary.commercial}
          icon={Home}
          accent="bg-rose-500"
        />
      </div>
      <PropertyFilters filters={filters} onChange={setFilters} areas={areas} />
      {loading ? (
        <p className="card text-center text-sm text-slate-500">Loading properties...</p>
      ) : (
        <PropertyTable
          items={properties}
          onEdit={(property) => router.push(`/properties/${property._id}/edit`)}
          onDelete={user?.role === 'admin' ? handleDelete : undefined}
          canManage={canManage}
        />
      )}
    </div>
  );
}

