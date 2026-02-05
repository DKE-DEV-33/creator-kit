/**
 * Campaigns page.
 *
 * Lists active and draft campaigns with quick workflow context.
 */
import Link from 'next/link';
import { AppShell } from '../../components/shell';
import { CampaignForm } from '../../components/campaign-form';
import { SectionHeader } from '../../components/section-header';
import { StatusPill } from '../../components/status-pill';
import { getCampaigns } from '../../lib/api';

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

export default async function CampaignsPage() {
  const campaigns = await getCampaigns().catch(() => []);
  return (
    <AppShell>
      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Campaigns" subtitle="Portfolio" actionLabel="New campaign" actionHref="#campaign-form" />
        <div className="mt-6">
          <CampaignForm />
        </div>
        <div className="mt-6 space-y-4">
          {campaigns.map((campaign) => (
            <article key={campaign.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{campaign.name}</h3>
                  <p className="text-xs text-slate-500">
                    Starts {formatDate(campaign.startDate)} · Ends {formatDate(campaign.endDate)}
                  </p>
                </div>
                <StatusPill label={campaign.status} tone={statusTone[campaign.status]} />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-slate-600">Next: {campaign.nextStep}</p>
                <Link
                  href={`/campaigns/${campaign.id}`}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  Open workspace
                </Link>
              </div>
            </article>
          ))}
          {campaigns.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
              No campaigns yet. Start by creating your first brief.
            </div>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
