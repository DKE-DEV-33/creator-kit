'use client';

/**
 * SyncAnalyticsButton
 *
 * Client-side action to trigger an integrations sync.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './toast';
import { syncIntegrations } from '../lib/api';

export interface SyncAnalyticsButtonProps {
  onComplete?: () => void;
}

export function SyncAnalyticsButton({ onComplete }: SyncAnalyticsButtonProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [pending, setPending] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const storageKey = 'ck_last_sync';

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      setLastSync(stored);
    }
  }, []);

  async function handleClick() {
    setPending(true);
    try {
      const result = await syncIntegrations();
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, now);
      }
      setLastSync(now);
      pushToast(`Analytics sync started. Updated ${result.updated} integrations.`, 'success');
      onComplete?.();
    } catch (error) {
      pushToast('Unable to start sync. Check the API and try again.', 'error');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
      >
        {pending ? 'Syncing...' : 'Sync Analytics'}
      </button>
      {lastSync ? <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Last sync {lastSync}</p> : null}
    </div>
  );
}
