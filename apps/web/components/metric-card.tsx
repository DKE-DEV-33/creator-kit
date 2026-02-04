/**
 * MetricCard
 *
 * Shows a headline KPI and its supporting label/trend information.
 */
export interface MetricCardProps {
  label: string;
  value: string;
  change: string;
}

export function MetricCard({ label, value, change }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-2 text-sm text-emerald-700">{change}</p>
    </div>
  );
}
