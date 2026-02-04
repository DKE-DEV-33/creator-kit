'use client';

/**
 * TaskForm
 *
 * Client-side form to create a new campaign task.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './toast';
import { createCampaignTask } from '../lib/api';

export interface TaskFormProps {
  campaignId: string;
}

export function TaskForm({ campaignId }: TaskFormProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'todo' | 'in_progress' | 'needs_review' | 'done'>('todo');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title.trim().length < 3) {
      pushToast('Task title must be at least 3 characters.', 'error');
      return;
    }

    setSaving(true);

    try {
      await createCampaignTask(campaignId, {
        title: title.trim(),
        status,
        dueDate: dueDate || null,
      });

      setTitle('');
      setDueDate('');
      setStatus('todo');
      pushToast('Task created.', 'success');
      router.refresh();
    } catch (error) {
      pushToast('Unable to create task. Check the API and try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form id="task-form" onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Task</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="Task name"
            required
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="needs_review">Needs review</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white"
          >
            {saving ? 'Saving...' : 'Add task'}
          </button>
        </div>
      </div>
    </form>
  );
}
