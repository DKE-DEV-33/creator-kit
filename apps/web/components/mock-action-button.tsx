'use client';

/**
 * MockActionButton
 *
 * Reusable button that triggers a toast for non-functional actions.
 */
import { useToast } from './toast';

export interface MockActionButtonProps {
  label: string;
  message: string;
  className?: string;
  tone?: 'success' | 'error' | 'info';
}

export function MockActionButton({ label, message, className, tone = 'info' }: MockActionButtonProps) {
  const { pushToast } = useToast();

  return (
    <button
      type="button"
      onClick={() => pushToast(message, tone)}
      className={className ?? 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700'}
    >
      {label}
    </button>
  );
}
