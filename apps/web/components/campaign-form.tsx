'use client';

/**
 * CampaignForm
 *
 * Client-side form to create a new campaign.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './toast';

export function CampaignForm() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving'>('idle');

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 3) {
      pushToast('Campaign name must be at least 3 characters.', 'error');
      return;
    }

    setStatus('saving');

    try {
      const response = await fetch(`${baseUrl}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-user': 'demo@pulsecreative.com',
          'x-demo-team': 'Pulse Creative',
        },
        body: JSON.stringify({
          name,
          startDate: startDate || null,
          endDate: endDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      setName('');
      setStartDate('');
      setEndDate('');
      setStatus('idle');
      pushToast('Campaign created.', 'success');
      router.refresh();
    } catch (error) {
      setStatus('idle');
      pushToast('Unable to create campaign. Check the API and try again.', 'error');
    }
  }

  return (
    <form id="campaign-form" onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Campaign name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="New campaign"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">End date</label>
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={status === 'saving'}
            className="w-full rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
          >
            {status === 'saving' ? 'Saving...' : 'Create'}
          </button>
        </div>
      </div>
    </form>
  );
}
