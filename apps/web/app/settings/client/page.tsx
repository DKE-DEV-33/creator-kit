/**
 * Client profile page.
 *
 * Allows updating core client workspace details.
 */
export const dynamic = 'force-dynamic';

import { AppShell } from '../../../components/shell';
import { SectionHeader } from '../../../components/section-header';
import { ClientProfileForm } from '../../../components/client-profile-form';
import { getClientProfile } from '../../../lib/api';

export default async function ClientProfilePage() {
  const profile = await getClientProfile().catch(() => ({
    name: 'Pulse Creative',
    region: 'San Francisco, CA',
    reportingWindow: 'Weekly',
    approvalSlaHours: 48,
    contentCadencePerWeek: 2,
  }));

  return (
    <AppShell>
      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Client Profile" subtitle="Workspace" />
        <div className="mt-6">
          <ClientProfileForm profile={profile} />
        </div>
      </section>
    </AppShell>
  );
}
