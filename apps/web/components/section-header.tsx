/**
 * SectionHeader
 *
 * Provides a heading with optional supporting copy and actions.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionHref?: string;
  actionSlot?: ReactNode;
}

export function SectionHeader({ title, subtitle, actionLabel, actionHref, actionSlot }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{subtitle}</p>
        <h2 className="mt-2 font-display text-2xl text-ink">{title}</h2>
      </div>
      {actionSlot}
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-ink/20"
        >
          {actionLabel}
        </Link>
      ) : null}
      {actionLabel && !actionHref ? (
        <button className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-ink/20">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
