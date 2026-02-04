/**
 * Integrations page.
 *
 * Shows integration status and provides clear connect actions.
 */
import { AppShell } from '../../components/shell';
import { SectionHeader } from '../../components/section-header';
import { StatusPill } from '../../components/status-pill';
import { getIntegrations } from '../../lib/api';

const statusTone: Record<string, 'emerald' | 'amber' | 'slate'> = {
  connected: 'emerald',
  disconnected: 'slate',
  error: 'amber',
};

export default async function IntegrationsPage() {
  const integrations = await getIntegrations().catch(() => []);

  return (
    <AppShell>
      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Integrations" subtitle="Channels" actionLabel="Sync analytics" />
        <div className="mt-6 space-y-4">
          {integrations.map((integration) => (
            <article key={integration.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{integration.platform}</h3>
                  <p className="text-xs text-slate-500">{integration.detail}</p>
                </div>
                <StatusPill label={integration.status} tone={statusTone[integration.status]} />
              </div>
              <div className="mt-4 flex justify-end">
                <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">
                  {integration.action}
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
      </section>
    </AppShell>
  );
}
