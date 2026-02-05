'use client';

/**
 * UserProfileForm
 *
 * Client-side form to update the current user profile.
 */
import { useState } from 'react';
import { useToast } from './toast';
import { updateUserProfile } from '../lib/api';
import type { UserProfile } from '../lib/types';

export interface UserProfileFormProps {
  profile: UserProfile;
}

const timezoneOptions = ['America/Los_Angeles', 'America/New_York', 'Europe/London'] as const;

export function UserProfileForm({ profile }: UserProfileFormProps) {
  const { pushToast } = useToast();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [role, setRole] = useState(profile.role);
  const [timezone, setTimezone] = useState(profile.timezone);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 3) {
      pushToast('Name must be at least 3 characters.', 'error');
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile({
        ...profile,
        name: name.trim(),
        email,
        role,
        timezone,
      });
      pushToast('Profile updated.', 'success');
    } catch (error) {
      pushToast('Unable to update profile. Check the API and try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Role</label>
          <input
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Timezone</label>
          <select
            value={timezone}
            onChange={(event) => setTimezone(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            {timezoneOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
