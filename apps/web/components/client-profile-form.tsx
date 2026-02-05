'use client';

/**
 * ClientProfileForm
 *
 * Client-side form to update client profile settings.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './toast';
import { updateClientProfile } from '../lib/api';
import type { ClientProfile } from '../lib/types';

export interface ClientProfileFormProps {
  profile: ClientProfile;
}

const reportingOptions = ['Weekly', 'Biweekly', 'Monthly'] as const;

export function ClientProfileForm({ profile }: ClientProfileFormProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [name, setName] = useState(profile.name);
  const [region, setRegion] = useState(profile.region);
  const [reportingWindow, setReportingWindow] = useState(profile.reportingWindow);
  const [approvalSlaHours, setApprovalSlaHours] = useState(profile.approvalSlaHours);
  const [contentCadencePerWeek, setContentCadencePerWeek] = useState(profile.contentCadencePerWeek);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 3) {
      pushToast('Client name must be at least 3 characters.', 'error');
      return;
    }

    setSaving(true);
    try {
      await updateClientProfile({
        name: name.trim(),
        region,
        reportingWindow,
        approvalSlaHours,
        contentCadencePerWeek,
      });
      pushToast('Client profile updated.', 'success');
      router.refresh();
    } catch (error) {
      pushToast('Unable to update client profile. Check the API and try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Client name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Primary region</label>
          <input
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Reporting cadence</label>
          <select
            value={reportingWindow}
            onChange={(event) => setReportingWindow(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            {reportingOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Approval SLA (hours)</label>
          <input
            type="number"
            min={1}
            value={approvalSlaHours}
            onChange={(event) => setApprovalSlaHours(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Content cadence (per week)</label>
          <input
            type="number"
            min={1}
            value={contentCadencePerWeek}
            onChange={(event) => setContentCadencePerWeek(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-ink/20"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
