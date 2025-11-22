"use client";

import { Pencil, Trash2, Share2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Property } from '@/types';
import { SharePropertyModal } from './SharePropertyModal';

type PropertyTableProps = {
  items: Property[];
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  canManage?: (property: Property) => boolean;
  showShare?: boolean;
};

export const PropertyTable = ({ items, onEdit, onDelete, canManage, showShare = true }: PropertyTableProps) => {
  if (!items.length) {
    return <p className="card text-center text-sm text-slate-500">No properties match the filters.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">Property</th>
            <th className="px-4 py-3 text-left">Area</th>
            <th className="px-4 py-3 text-left">Rent</th>
            <th className="px-4 py-3 text-left">Created By</th>
            <th className="px-4 py-3 text-left">Created</th>
            {onEdit && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((property) => {
            const creator = typeof property.createdBy === 'object' ? property.createdBy : null;
            return (
              <tr key={property._id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <div className="flex flex-col gap-1">
                    <span>{property.title}</span>
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                      {property.type}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{property.area}</td>
                <td className="px-4 py-3 text-slate-900">{formatCurrency(property.rent)}</td>
                <td className="px-4 py-3 text-slate-600">
                  <div className="flex flex-col">
                    <span>{creator?.name || '—'}</span>
                    <span className="text-xs text-slate-400">{creator?.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{formatDate(property.createdAt)}</td>
                {onEdit && (
                  <td className="px-4 py-3">
                    {canManage?.(property) ? (
                      <div className="flex justify-end gap-2">
                        {showShare && (
                          <SharePropertyModal 
                            propertyId={property._id} 
                            propertyTitle={property.title}
                          />
                        )}
                        <button
                          onClick={() => onEdit(property)}
                          className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-white"
                          aria-label="Edit property"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {onDelete && (
                          <button
                            onClick={() => onDelete(property)}
                            className="rounded-full border border-slate-200 p-2 text-rose-500 hover:bg-white"
                            aria-label="Delete property"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">View only</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

