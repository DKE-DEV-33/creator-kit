/**
 * Dashboard page.
 *
 * This is the primary demo surface for the CreatorKit UI.
 */
import { AppShell } from '../components/shell';
import { MetricCard } from '../components/metric-card';
import { SectionHeader } from '../components/section-header';
import { StatusPill } from '../components/status-pill';

const campaignHighlights = [
  {
    name: 'GlowUp Launch',
    status: 'Active',
    tone: 'emerald' as const,
    summary: '2 creators · 4 deliverables · 6 week sprint',
  },
  {
    name: 'Spring Refresh',
    status: 'Draft',
    tone: 'amber' as const,
    summary: 'Brief draft in review · 1 creator pending',
  },
];

const creatorSignals = [
  {
    name: 'Avery Chen',
    platform: 'YouTube',
    kpi: '12.4k views',
    note: 'Top performer in GlowUp',
  },
  {
    name: 'Riley Patel',
    platform: 'YouTube',
    kpi: '9.8k views',
    note: 'Draft video due in 2 days',
  },
  {
    name: 'Nova Lane',
    platform: 'TikTok',
    kpi: 'Mock data connected',
    note: 'Awaiting access approval',
  },
];

export default function HomePage() {
  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-3">
        <MetricCard label="Total Views" value="22.2k" change="+18% WoW" />
        <MetricCard label="CTR" value="3.1%" change="+0.4% last week" />
        <MetricCard label="Approvals" value="6/8" change="2 items need review" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
          <SectionHeader title="Campaigns in motion" subtitle="Now running" actionLabel="View all" />
          <div className="mt-6 space-y-4">
            {campaignHighlights.map((campaign) => (
              <div key={campaign.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">{campaign.name}</p>
                    <p className="text-xs text-slate-500">{campaign.summary}</p>
                  </div>
                  <StatusPill label={campaign.status} tone={campaign.tone} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
          <SectionHeader title="Creator signals" subtitle="Spotlight" />
          <div className="mt-6 space-y-4">
            {creatorSignals.map((creator) => (
              <div key={creator.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">{creator.name}</p>
                    <p className="text-xs text-slate-500">{creator.platform}</p>
                  </div>
                  <p className="text-xs font-semibold text-forest">{creator.kpi}</p>
                </div>
                <p className="mt-2 text-xs text-slate-500">{creator.note}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Workflow timeline" subtitle="Today" actionLabel="Open queue" />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Briefs</p>
            <p className="mt-3 text-sm font-semibold text-ink">GlowUp brief auto-drafted</p>
            <p className="mt-2 text-xs text-slate-500">AI summary ready for review.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Approvals</p>
            <p className="mt-3 text-sm font-semibold text-ink">Script review · Riley Patel</p>
            <p className="mt-2 text-xs text-slate-500">Due in 2 days.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Analytics</p>
            <p className="mt-3 text-sm font-semibold text-ink">YouTube sync complete</p>
            <p className="mt-2 text-xs text-slate-500">Next sync scheduled in 12 hours.</p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
