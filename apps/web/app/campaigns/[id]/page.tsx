/**
 * Campaign detail page.
 *
 * Shows brief, tasks, content plan, and performance highlights.
 */
export const dynamic = 'force-dynamic';
import { AppShell } from '../../../components/shell';
import { SectionHeader } from '../../../components/section-header';
import { StatusPill } from '../../../components/status-pill';
import { ContentForm } from '../../../components/content-form';
import { ContentItemRow } from '../../../components/content-item-row';
import { TaskForm } from '../../../components/task-form';
import { TaskList } from '../../../components/task-list';
import { MockActionButton } from '../../../components/mock-action-button';
import { getCampaign, getCampaignAnalytics, getCampaignContent, getCampaignTasks } from '../../../lib/api';

const statusTone: Record<string, 'emerald' | 'amber' | 'slate'> = {
  active: 'emerald',
  draft: 'amber',
  reporting: 'slate',
  archived: 'slate',
};

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = await getCampaign(params.id).catch(() => null);
  const analytics = await getCampaignAnalytics(params.id).catch(() => null);
  const contentItems = await getCampaignContent(params.id).catch(() => []);
  const tasks = await getCampaignTasks(params.id).catch(() => []);

  if (!campaign) {
    return (
      <AppShell>
        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
          <SectionHeader title="Campaign not found" subtitle="Missing data" actionLabel="Back to campaigns" />
          <p className="mt-6 text-sm text-slate-600">
            We could not load this campaign from the API. Double-check the campaign ID or make sure the backend
            server is running.
          </p>
        </section>
      </AppShell>
    );
  }
  return (
    <AppShell>
      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Campaign</p>
            <h2 className="mt-2 font-display text-3xl text-ink">{campaign.name}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {campaign.startDate ? `Starts ${campaign.startDate}` : 'Start date TBD'} ·{' '}
              {campaign.endDate ? `Ends ${campaign.endDate}` : 'End date TBD'}
            </p>
          </div>
          <StatusPill label={campaign.status} tone={statusTone[campaign.status]} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
          <SectionHeader
            title="Brief"
            subtitle="Strategy"
            actionSlot={<MockActionButton label="Generate update" message="Brief update queued for AI." tone="success" />}
          />
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <p>{campaign.brief.summary}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Objectives</p>
                <p className="mt-2">{campaign.brief.objectives}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Keywords</p>
                <p className="mt-2">{campaign.brief.keywords}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
          <SectionHeader title="Performance" subtitle="Live metrics" />
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total Views</p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {analytics ? analytics.totals.views.toLocaleString() : '—'}
              </p>
              <p className="mt-2 text-xs text-emerald-700">
                {analytics ? 'Based on latest sync' : 'Analytics unavailable'}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Best performing</p>
              {analytics && analytics.byCreator.length > 0 ? (
                <>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {analytics.byCreator[0].creatorName} · {analytics.byCreator[0].platform}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {analytics.byCreator[0].views.toLocaleString()} views
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No analytics yet.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Workflow" subtitle="Tasks" actionLabel="Jump to form" actionHref="#task-form" />
        <div className="mt-6">
          <TaskForm campaignId={campaign.id} />
        </div>
        <div className="mt-6">
          <TaskList tasks={tasks} />
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Content plan" subtitle="Schedule" actionLabel="Jump to form" actionHref="#content-form" />
        <div className="mt-6 space-y-3">
          <ContentForm campaignId={campaign.id} />
          {contentItems.map((item) => (
            <ContentItemRow key={item.id} item={item} />
          ))}
          {contentItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
              Content items will appear here once the content plan is created.
            </div>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
