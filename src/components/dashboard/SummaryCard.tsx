import { LucideIcon } from 'lucide-react';

type SummaryCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  trendLabel?: string;
  accent?: string;
};

export const SummaryCard = ({ label, value, icon: Icon, trendLabel, accent }: SummaryCardProps) => (
  <div className="card flex items-center gap-4">
    <div className={`rounded-2xl p-3 text-white ${accent || 'bg-indigo-500'}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      {trendLabel && <p className="text-xs text-slate-500">{trendLabel}</p>}
    </div>
  </div>
);

