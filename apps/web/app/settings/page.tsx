/**
 * Settings page.
 *
 * Captures team configuration, workflow defaults, and AI preferences.
 */
export const dynamic = 'force-dynamic';
import { AppShell } from '../../components/shell';
import { SectionHeader } from '../../components/section-header';
import { getAiPreferences, getClientProfile } from '../../lib/api';
import Link from 'next/link';
import { SettingsPreferencesForm } from '../../components/settings-preferences-form';

export default async function SettingsPage() {
  const clientProfile = await getClientProfile().catch(() => null);
  const aiPreferences = await getAiPreferences().catch(() => []);

  return (
    <AppShell>
      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Settings" subtitle="Workspace" />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Team profile</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div>
                <p className="text-xs text-slate-400">Team name</p>
                <p className="mt-1 font-semibold text-ink">{clientProfile?.name ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Primary region</p>
                <p className="mt-1 font-semibold text-ink">{clientProfile?.region ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Default reporting window</p>
                <p className="mt-1 font-semibold text-ink">{clientProfile?.reportingWindow ?? '—'}</p>
              </div>
              <Link
                href="/settings/client"
                className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                Manage Client Profile
              </Link>
              <Link
                href="/settings/profile"
                className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                Manage My Profile
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">AI preferences</p>
            <div className="mt-4">
              <SettingsPreferencesForm preferences={aiPreferences} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Workflow defaults" subtitle="Automation" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {clientProfile ? (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Approval SLA</p>
                <p className="mt-2 text-lg font-semibold text-ink">{clientProfile.approvalSlaHours} hours</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Content cadence</p>
                <p className="mt-2 text-lg font-semibold text-ink">{clientProfile.contentCadencePerWeek} posts / week</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Reporting day</p>
                <p className="mt-2 text-lg font-semibold text-ink">{clientProfile.reportingWindow}</p>
              </div>
            </>
          ) : null}
          {!clientProfile ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
              Workflow defaults will show once settings are available.
            </div>
          ) : null}
        </div>
        <div className="mt-4">
          <Link
            href="/settings/client"
            className="inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
          >
            Edit workflow defaults
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
