'use client';

/**
 * IntegrationList
 *
 * Client-side list that triggers integration actions and refreshes data.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Integration } from '../lib/types';
import { performIntegrationAction } from '../lib/api';
import { StatusPill } from './status-pill';
import { useToast } from './toast';

export interface IntegrationListProps {
  integrations: Integration[];
}

const statusTone: Record<string, 'emerald' | 'amber' | 'slate'> = {
  connected: 'emerald',
  disconnected: 'slate',
  pending: 'amber',
  error: 'amber',
};

function actionToast(action: Integration['action']): string {
  switch (action) {
    case 'connect':
      return 'Integration connected.';
    case 'refresh':
      return 'Integration refreshed.';
    case 'request_access':
      return 'Access request submitted.';
    case 'reconnect':
      return 'Integration reconnected.';
    default:
      return 'Integration updated.';
  }
}

export function IntegrationList({ integrations }: IntegrationListProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [pending, setPending] = useState<string | null>(null);

  async function handleAction(integration: Integration) {
    setPending(integration.id);
    try {
      await performIntegrationAction(integration.platform, integration.action);
      pushToast(actionToast(integration.action), 'success');
      router.refresh();
    } catch (error) {
      pushToast('Unable to update integration. Check the API and try again.', 'error');
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-4">
      {integrations.map((integration) => (
        <article key={integration.id} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-ink">{integration.platform}</h3>
              <p className="text-xs text-slate-500">{integration.detail}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Updated {new Date(integration.updatedAt).toLocaleString()}
              </p>
            </div>
            <StatusPill label={integration.status} tone={statusTone[integration.status]} />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => handleAction(integration)}
              disabled={pending === integration.id}
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
            >
              {pending === integration.id ? 'Working...' : integration.actionLabel}
            </button>
          </div>
        </article>
      ))}
      {integrations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
          Integrations will appear once the API is available.
        </div>
      ) : null}
    </div>
  );
}
