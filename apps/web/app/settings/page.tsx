/**
 * Settings page.
 *
 * Captures team configuration, workflow defaults, and AI preferences.
 */
import { AppShell } from '../../components/shell';
import { SectionHeader } from '../../components/section-header';
import { getSettings } from '../../lib/api';

export default async function SettingsPage() {
  const settings = await getSettings().catch(() => null);

  return (
    <AppShell>
      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Settings" subtitle="Workspace" actionLabel="Save changes" />
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Team profile</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div>
                <p className="text-xs text-slate-400">Team name</p>
                <p className="mt-1 font-semibold text-ink">{settings?.team.name ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Primary region</p>
                <p className="mt-1 font-semibold text-ink">{settings?.team.region ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Default reporting window</p>
                <p className="mt-1 font-semibold text-ink">{settings?.team.reportingWindow ?? '—'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">AI preferences</p>
            <div className="mt-4 space-y-4">
              {settings?.aiPreferences.map((toggle) => (
                <div key={toggle.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-ink">{toggle.label}</p>
                      <p className="text-xs text-slate-500">{toggle.description}</p>
                    </div>
                    <button className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold text-slate-700">
                      {toggle.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
              {!settings ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                  Settings are unavailable. Start the API to load AI preferences.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Workflow defaults" subtitle="Automation" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {settings?.workflowDefaults.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-ink">{item.value}</p>
            </div>
          ))}
          {!settings ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
              Workflow defaults will show once settings are available.
            </div>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
