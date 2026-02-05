'use client';

/**
 * CreatorProfileForm
 *
 * Client-side form to update a creator profile and linked platforms.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './toast';
import { updateCreator } from '../lib/api';
import type { CreatorDetail, Platform } from '../lib/types';

export interface CreatorProfileFormProps {
  creator: CreatorDetail;
}

const platformOptions: Platform[] = ['youtube', 'tiktok', 'instagram'];

export function CreatorProfileForm({ creator }: CreatorProfileFormProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [name, setName] = useState(creator.name);
  const [email, setEmail] = useState(creator.email);
  const [platforms, setPlatforms] = useState(
    creator.platforms.length > 0
      ? creator.platforms
      : [{ platform: 'youtube' as Platform, handle: '' }]
  );
  const [saving, setSaving] = useState(false);

  function updatePlatform(index: number, field: 'platform' | 'handle', value: string) {
    setPlatforms((current) =>
      current.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  }

  function addPlatform() {
    setPlatforms((current) => [...current, { platform: 'instagram', handle: '' }]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 3) {
      pushToast('Creator name must be at least 3 characters.', 'error');
      return;
    }

    const filteredPlatforms = platforms.filter((platform) => platform.handle.trim().length > 0);

    setSaving(true);
    try {
      await updateCreator(creator.id, {
        name: name.trim(),
        email: email || null,
        platforms: filteredPlatforms,
      });
      pushToast('Creator profile updated.', 'success');
      router.refresh();
    } catch (error) {
      pushToast('Unable to update creator. Check the API and try again.', 'error');
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
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Platforms</p>
          <button
            type="button"
            onClick={addPlatform}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
          >
            Add platform
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {platforms.map((platform, index) => (
            <div key={`${platform.platform}-${index}`} className="grid gap-3 md:grid-cols-[1fr_2fr]">
              <select
                value={platform.platform}
                onChange={(event) => updatePlatform(index, 'platform', event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {platformOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                value={platform.handle}
                onChange={(event) => updatePlatform(index, 'handle', event.target.value)}
                placeholder="@handle"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          ))}
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
