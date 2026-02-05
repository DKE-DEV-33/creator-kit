/**
 * Creator detail page.
 *
 * Shows a creator profile, platform reach, and current deliverables.
 */
import { AppShell } from '../../../components/shell';
import { SectionHeader } from '../../../components/section-header';
import { CreatorProfileForm } from '../../../components/creator-profile-form';
import { CreatorUpdateButton } from '../../../components/creator-update-button';
import { getCreator, getCreatorAnalytics, getCreatorContent } from '../../../lib/api';

export default async function CreatorDetailPage({ params }: { params: { id: string } }) {
  const creator = await getCreator(params.id).catch(() => null);
  const analytics = creator ? await getCreatorAnalytics(creator.id).catch(() => null) : null;
  const contentItems = creator ? await getCreatorContent(creator.id).catch(() => []) : [];

  if (!creator) {
    return (
      <AppShell>
        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
          <SectionHeader title="Creator not found" subtitle="Missing data" actionLabel="Back to creators" />
          <p className="mt-6 text-sm text-slate-600">
            We could not load this creator from the API. Double-check the creator ID or make sure the backend
            server is running.
          </p>
        </section>
      </AppShell>
    );
  }

  const platformHighlights = creator.platforms.map((platform) => {
    const platformMetrics = analytics?.byPlatform.find((item) => item.platform === platform.platform);
    return {
      platform: platform.platform,
      stat: platformMetrics ? `${platformMetrics.views.toLocaleString()} views` : platform.handle,
      note: platformMetrics
        ? `${platformMetrics.likes.toLocaleString()} likes · ${platformMetrics.comments.toLocaleString()} comments`
        : 'Connected account',
    };
  });
  return (
    <AppShell>
      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Creator</p>
            <h2 className="mt-2 font-display text-3xl text-ink">{creator.name}</h2>
            <p className="mt-2 text-sm text-slate-500">
              {creator.platforms.map((platform) => platform.platform).join(' · ')}
            </p>
          </div>
          <CreatorUpdateButton creatorId={creator.id} creatorName={creator.name} />
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Profile" subtitle="Details" />
        <div className="mt-6">
          <CreatorProfileForm creator={creator} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
          <SectionHeader title="Platform reach" subtitle="Snapshot" />
          <div className="mt-6 space-y-4">
            {platformHighlights.map((platform) => (
              <div key={platform.platform} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{platform.platform}</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{platform.stat}</p>
                <p className="mt-2 text-xs text-slate-500">{platform.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
          <SectionHeader title="Current focus" subtitle="Notes" />
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <p>
              {creator.name} is focused on converting high-performing content into the next batch of deliverables.
              Keep the next touchpoint centered on the platform with the highest momentum.
            </p>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next meeting</p>
              <p className="mt-2 text-sm font-semibold text-ink">Feb 9, 2026 · 10:30 AM PT</p>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Platform breakdown" subtitle="Analytics" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {creator.platforms.map((platform) => {
            const metrics = analytics?.byPlatform.find((item) => item.platform === platform.platform);
            return (
            <div key={platform.platform} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{platform.platform}</p>
              <p className="mt-2 text-lg font-semibold text-ink">
                {metrics ? `${metrics.views.toLocaleString()} views` : 'No data yet'}
              </p>
              {metrics ? (
                <p className="mt-2 text-xs text-slate-500">
                  {metrics.likes.toLocaleString()} likes · {metrics.comments.toLocaleString()} comments
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-500">Awaiting analytics sync.</p>
              )}
            </div>
          );
          })}
          {!analytics ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
              Platform analytics will appear once data is synced.
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Deliverables" subtitle="Queue" actionLabel="Add deliverable" />
        <div className="mt-6 space-y-3">
          {contentItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="text-xs text-slate-500">{item.platform}</p>
              </div>
              <p className="text-xs font-semibold text-slate-600">
                {item.scheduledAt ? new Date(item.scheduledAt).toLocaleDateString() : item.status}
              </p>
            </div>
          ))}
          {contentItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
              Deliverables will appear once content items are connected.
            </div>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
