'use client';

/**
 * ContentItemRow
 *
 * Client-side row with edit/delete actions for campaign content items.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ContentItem, Platform } from '../lib/types';
import { StatusPill } from './status-pill';

const platformOptions: Platform[] = ['youtube', 'tiktok', 'instagram'];

export interface ContentItemRowProps {
  item: ContentItem;
}

export function ContentItemRow({ item }: ContentItemRowProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [platform, setPlatform] = useState<Platform>(item.platform);
  const [scheduledAt, setScheduledAt] = useState(item.scheduledAt ?? '');
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
  const statusTone: Record<ContentItem['status'], 'emerald' | 'amber' | 'slate'> = {
    draft: 'amber',
    scheduled: 'emerald',
    published: 'emerald',
    archived: 'slate',
  };

  async function updateItem() {
    setStatus('saving');
    try {
      const response = await fetch(`${baseUrl}/campaigns/${item.campaignId}/content/${item.id}`, {
        method: 'PUT',
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
        throw new Error('Failed to update content item');
      }

      setIsEditing(false);
      setStatus('idle');
      router.refresh();
    } catch (error) {
      setStatus('error');
    }
  }

  async function deleteItem() {
    setStatus('saving');
    try {
      const response = await fetch(`${baseUrl}/campaigns/${item.campaignId}/content/${item.id}`, {
        method: 'DELETE',
        headers: {
          'x-demo-user': 'demo@pulsecreative.com',
          'x-demo-team': 'Pulse Creative',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete content item');
      }

      setStatus('idle');
      setConfirmDelete(false);
      router.refresh();
    } catch (error) {
      setStatus('error');
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="min-w-[220px] flex-1">
        {isEditing ? (
          <div className="grid gap-2">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <div className="grid gap-2 md:grid-cols-2">
              <select
                value={platform}
                onChange={(event) => setPlatform(event.target.value as Platform)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {platformOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(event) => setScheduledAt(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-ink">{item.title}</p>
            <p className="text-xs text-slate-500">{item.platform}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-semibold text-slate-600">
          {item.scheduledAt ? new Date(item.scheduledAt).toLocaleDateString() : item.status}
        </p>
      {isEditing ? (
        <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={updateItem}
              disabled={status === 'saving'}
              className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white"
            >
              {status === 'saving' ? 'Saving...' : 'Save'}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={status === 'saving'}
              className="rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {confirmDelete ? (
        <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <p className="font-semibold">Delete this content item?</p>
          <p className="mt-1 text-amber-800">This can’t be undone.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={deleteItem}
              disabled={status === 'saving'}
              className="rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white"
            >
              {status === 'saving' ? 'Deleting...' : 'Confirm delete'}
            </button>
          </div>
        </div>
      ) : null}

      {!isEditing ? (
        <div className="flex w-full flex-wrap items-center gap-3 pt-3">
          <StatusPill label={item.status} tone={statusTone[item.status]} />
          {item.scheduledAt ? (
            <p className="text-xs text-slate-500">
              Scheduled {new Date(item.scheduledAt).toLocaleDateString()}
            </p>
          ) : null}
        </div>
      ) : null}

      {status === 'error' ? (
        <p className="w-full text-xs text-amber-600">Action failed. Check the API and try again.</p>
      ) : null}
    </div>
  );
}
