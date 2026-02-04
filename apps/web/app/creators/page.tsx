/**
 * Creators page.
 *
 * Highlights creator profiles, platform focus, and current priorities.
 */
import Link from 'next/link';
import { AppShell } from '../../components/shell';
import { SectionHeader } from '../../components/section-header';
import { getCreators } from '../../lib/api';

export default async function CreatorsPage() {
  const creators = await getCreators().catch(() => []);
  return (
    <AppShell>
      <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur">
        <SectionHeader title="Creators" subtitle="Roster" actionLabel="Add creator" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {creators.map((creator) => (
            <article key={creator.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{creator.name}</h3>
                  <p className="text-xs text-slate-500">
                    {creator.platforms.map((platform) => platform.platform).join(' · ')}
                  </p>
                </div>
                <Link
                  href={`/creators/${creator.id}`}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  View profile
                </Link>
              </div>
              <p className="mt-4 text-sm text-forest">
                {creator.platforms.length > 0 ? `Primary: ${creator.platforms[0].handle}` : 'No platforms linked'}
              </p>
              <p className="mt-2 text-xs text-slate-500">{creator.email}</p>
            </article>
          ))}
          {creators.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
              No creators yet. Add your first creator to start tracking performance.
            </div>
          ) : null}
        </div>
      </section>
    </AppShell>
  );
}
