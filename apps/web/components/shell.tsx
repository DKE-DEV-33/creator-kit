/**
 * AppShell
 *
 * Defines the core page chrome: sidebar navigation, top bar, and content.
 */
import type { ReactNode } from 'react';

export interface AppShellProps {
  children: ReactNode;
}

const navItems = [
  { label: 'Dashboard', active: true },
  { label: 'Campaigns', active: false },
  { label: 'Creators', active: false },
  { label: 'Integrations', active: false },
  { label: 'Settings', active: false },
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-glow backdrop-blur">
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
              <div
                key={item.label}
                className={
                  item.active
                    ? 'rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white'
                    : 'rounded-full px-4 py-2 text-sm text-slate-600 hover:bg-white'
                }
              >
                {item.label}
              </div>
            ))}
          </nav>

          <div className="mt-10 rounded-2xl bg-ember/10 p-4 text-sm text-ink">
            <p className="font-semibold">Live sprint</p>
            <p className="mt-2 text-xs text-slate-600">GlowUp Launch · Week 1 of 6</p>
            <button className="mt-4 w-full rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white">
              Generate Brief Draft
            </button>
          </div>
        </aside>

        <section className="space-y-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-glow backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Welcome back</p>
              <h1 className="mt-2 font-display text-3xl text-ink">Pulse Creative Ops</h1>
              <p className="mt-2 text-sm text-slate-500">Agency workspace · 2 live campaigns · 8 creators</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                Sync Analytics
              </button>
              <button className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-ink/20">
                New Campaign
              </button>
            </div>
          </header>

          {children}
        </section>
      </div>
    </div>
  );
}
