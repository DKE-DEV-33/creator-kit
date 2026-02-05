/**
 * Dashboard page.
 *
 * This is the primary demo surface for the CreatorKit UI.
 */
import Link from 'next/link';
import { AppShell } from '../components/shell';
import { MetricCard } from '../components/metric-card';
import { SectionHeader } from '../components/section-header';
import { StatusPill } from '../components/status-pill';
import { MockActionButton } from '../components/mock-action-button';
import { getCampaignAnalytics, getCampaigns, getCreators } from '../lib/api';

const statusTone: Record<string, 'emerald' | 'amber' | 'slate'> = {
  active: 'emerald',
  draft: 'amber',
  reporting: 'slate',
  archived: 'slate',
};

function formatDate(value: string | null): string {
  if (!value) {
    return 'TBD';
  }
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function HomePage() {
  const campaigns = await getCampaigns().catch(() => []);
  const creators = await getCreators().catch(() => []);
  const primaryCampaignId = campaigns[0]?.id;
  const analytics = primaryCampaignId
    ? await getCampaignAnalytics(primaryCampaignId).catch(() => null)
    : null;
  const campaignHighlights = campaigns.slice(0, 2);
  const creatorSignals = creators.slice(0, 3);

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-3">
        <MetricCard
          label="Total Views"
          value={analytics ? analytics.totals.views.toLocaleString() : '—'}
          change={analytics ? 'Based on latest sync' : 'No analytics yet'}
        />
        <MetricCard
          label="Likes"
          value={analytics ? analytics.totals.likes.toLocaleString() : '—'}
          change={analytics ? 'Latest sync' : 'No analytics yet'}
        />
        <MetricCard
          label="Comments"
          value={analytics ? analytics.totals.comments.toLocaleString() : '—'}
          change={analytics ? 'Latest sync' : 'No analytics yet'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
          <SectionHeader title="Campaigns in motion" subtitle="Now running" actionLabel="View all" actionHref="/campaigns" />
          <div className="mt-6 space-y-4">
            {campaignHighlights.map((campaign) => (
              <div key={campaign.name} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">{campaign.name}</p>
                    <p className="text-xs text-slate-500">
                      Starts {formatDate(campaign.startDate)} · Ends {formatDate(campaign.endDate)}
                    </p>
                  </div>
                  <StatusPill label={campaign.status} tone={statusTone[campaign.status]} />
                </div>
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/campaigns/${campaign.id}`}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                  >
                    Open campaign
                  </Link>
                </div>
              </div>
            ))}
            {campaignHighlights.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
                No campaigns yet. Create your first campaign to see highlights here.
              </div>
            ) : null}
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
                    <p className="text-xs text-slate-500">
                      {creator.platforms.map((platform) => platform.platform).join(' · ')}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-forest">
                    {creator.platforms[0] ? creator.platforms[0].handle : 'No platform linked'}
                  </p>
                </div>
                <p className="mt-2 text-xs text-slate-500">{creator.email}</p>
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/creators/${creator.id}`}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                  >
                    View creator
                  </Link>
                </div>
              </div>
            ))}
            {creatorSignals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
                No creators yet. Add a creator to surface spotlight data.
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader
          title="Workflow timeline"
          subtitle="Today"
          actionSlot={
            <MockActionButton
              label="Open queue"
              message="Queue view is coming soon."
            />
          }
        />
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
