/**
 * AppShell
 *
 * Defines the core page chrome: sidebar navigation, top bar, and content.
 */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { MockActionButton } from './mock-action-button';
import { SyncAnalyticsButton } from './sync-analytics-button';
import { getUserProfile, getWorkspaceStats } from '../lib/api';

export interface AppShellProps {
  children: ReactNode;
}

const demoTeam = {
  name: process.env.NEXT_PUBLIC_DEMO_TEAM ?? 'Pulse Creative',
};

const navItems = [
  { label: 'Dashboard', href: '/' },
  { label: 'Campaigns', href: '/campaigns' },
  { label: 'Creators', href: '/creators' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Settings', href: '/settings' },
];

export async function AppShell({ children }: AppShellProps) {
  const stats = await getWorkspaceStats().catch(() => ({ liveCampaigns: 0, creators: 0 }));
  const user = await getUserProfile().catch(() => ({
    name: 'Jordan Lee',
    email: 'demo@pulsecreative.com',
    role: 'Account Owner',
    timezone: 'America/Los_Angeles',
    teamId: '11111111-1111-1111-1111-111111111111',
    id: '22222222-2222-2222-2222-222222222222',
  }));

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit rounded-3xl border border-white/60 bg-white/70 p-6 shadow-glow backdrop-blur lg:sticky lg:top-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-forest text-white">
              <div className="flex h-full items-center justify-center font-display text-xl">CK</div>
            </div>
            <div>
              <p className="font-display text-lg text-ink">CreatorKit</p>
              <p className="text-xs text-slate-500">Agency Ops</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-full px-4 py-2 text-sm text-slate-600 hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl bg-ember/10 p-4 text-sm text-ink">
            <p className="font-semibold">Live sprint</p>
            <p className="mt-2 text-xs text-slate-600">GlowUp Launch · Week 1 of 6</p>
            <MockActionButton
              label="Generate Brief Draft"
              message="Brief draft queued for AI generation."
              className="mt-4 w-full rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white"
              tone="success"
            />
          </div>
        </aside>

        <section className="space-y-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-glow backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Welcome back</p>
              <h1 className="mt-2 font-display text-3xl text-ink">Pulse Creative Ops</h1>
              <p className="mt-2 text-sm text-slate-500">
                Agency workspace · {stats.liveCampaigns} live campaigns · {stats.creators} creators
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 md:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-white">
                  {user.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-ink">{user.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{demoTeam.name}</p>
                </div>
              </div>
              <SyncAnalyticsButton />
              <Link
                href="/campaigns#campaign-form"
                className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-ink/20"
              >
                New Campaign
              </Link>
            </div>
          </header>

          {children}
        </section>
      </div>
    </div>
  );
}
