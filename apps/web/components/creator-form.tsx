'use client';

/**
 * CreatorForm
 *
 * Client-side form to create a new creator.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './toast';
import { createCreator } from '../lib/api';

export function CreatorForm() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 3) {
      pushToast('Creator name must be at least 3 characters.', 'error');
      return;
    }

    setStatus('saving');

    try {
      await createCreator({
        name: name.trim(),
        email: email || null,
      });

      setName('');
      setEmail('');
      setStatus('idle');
      pushToast('Creator added.', 'success');
      router.refresh();
    } catch (error) {
      setStatus('idle');
      pushToast('Unable to add creator. Check the API and try again.', 'error');
    }
  }

  return (
    <form id="creator-form" onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[2fr_2fr_auto]">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Creator name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Creator name"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="creator@email.com"
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
    </form>
  );
}
