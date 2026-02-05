/**
 * User profile page.
 *
 * Allows updating the current user's settings.
 */
export const dynamic = 'force-dynamic';

import { AppShell } from '../../../components/shell';
import { SectionHeader } from '../../../components/section-header';
import { UserProfileForm } from '../../../components/user-profile-form';
import { getUserProfile } from '../../../lib/api';

export default async function UserProfilePage() {
  const profile = await getUserProfile().catch(() => ({
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Jordan Lee',
    email: 'demo@pulsecreative.com',
    role: 'Account Owner',
    timezone: 'America/Los_Angeles',
    teamId: '11111111-1111-1111-1111-111111111111',
  }));

  return (
    <AppShell>
      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="My Profile" subtitle="Account" />
        <div className="mt-6">
          <UserProfileForm profile={profile} />
        </div>
      </section>
    </AppShell>
  );
}
