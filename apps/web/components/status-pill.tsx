/**
 * StatusPill
 *
 * Displays a compact status label with color coding.
 */
export interface StatusPillProps {
  label: string;
  tone: 'emerald' | 'amber' | 'slate';
}

const toneStyles: Record<StatusPillProps['tone'], string> = {
  emerald: 'bg-emerald-100 text-emerald-900',
  amber: 'bg-amber-100 text-amber-900',
  slate: 'bg-slate-200 text-slate-800',
};

export function StatusPill({ label, tone }: StatusPillProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[tone]}`}>
      {label}
    </span>
  );
}
