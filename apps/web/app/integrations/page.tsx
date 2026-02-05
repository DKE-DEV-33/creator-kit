/**
 * Integrations page.
 *
 * Shows integration status and provides clear connect actions.
 */
export const dynamic = 'force-dynamic';

import { AppShell } from '../../components/shell';
import { IntegrationList } from '../../components/integration-list';
import { SectionHeader } from '../../components/section-header';
import { IntegrationSyncAction } from '../../components/integration-sync-action';
import { getIntegrations } from '../../lib/api';

export default async function IntegrationsPage() {
  const integrations = await getIntegrations().catch(() => []);

  return (
    <AppShell>
      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader
          title="Integrations"
          subtitle="Channels"
          actionSlot={<IntegrationSyncAction />}
        />
        <div className="mt-6">
          <IntegrationList integrations={integrations} />
        </div>
      </section>
    </AppShell>
  );
}
