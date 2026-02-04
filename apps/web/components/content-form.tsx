'use client';

/**
 * ContentForm
 *
 * Client-side form to create a content item for a campaign.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './toast';

const platformOptions = ['youtube', 'tiktok', 'instagram'] as const;

export interface ContentFormProps {
  campaignId: string;
}

export function ContentForm({ campaignId }: ContentFormProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<(typeof platformOptions)[number]>('youtube');
  const [scheduledAt, setScheduledAt] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title.trim().length < 3) {
      pushToast('Title must be at least 3 characters.', 'error');
      return;
    }

    setStatus('saving');

    try {
      const response = await fetch(`${baseUrl}/campaigns/${campaignId}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-user': 'demo@pulsecreative.com',
          'x-demo-team': 'Pulse Creative',
        },
        body: JSON.stringify({
          title,
          platform,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create content item');
      }

      setTitle('');
      setScheduledAt('');
      setStatus('idle');
      pushToast('Content item added.', 'success');
      router.refresh();
    } catch (error) {
      setStatus('error');
      pushToast('Unable to save. Check the API and try again.', 'error');
    }
  }

  return (
    <form id="content-form" onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="New content idea"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Platform</label>
          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value as (typeof platformOptions)[number])}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            {platformOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Schedule</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="w-full rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
          >
            {status === 'saving' ? 'Saving...' : 'Add'}
          </button>
        </div>
      </div>
      {status === 'error' ? (
        <p className="mt-3 text-xs text-amber-600">Unable to save. Check the API and try again.</p>
      ) : null}
    </form>
  );
}
