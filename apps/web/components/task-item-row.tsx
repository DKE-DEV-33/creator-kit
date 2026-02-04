'use client';

/**
 * TaskItemRow
 *
 * Client-side row with edit/delete actions for campaign tasks.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CampaignTask, TaskStatus } from '../lib/types';
import { deleteCampaignTask, updateCampaignTask } from '../lib/api';
import { useToast } from './toast';
import { StatusPill } from './status-pill';

const statusTone: Record<TaskStatus, 'emerald' | 'amber' | 'slate'> = {
  todo: 'slate',
  in_progress: 'emerald',
  needs_review: 'amber',
  done: 'emerald',
};

export interface TaskItemRowProps {
  task: CampaignTask;
  onEditChange?: (isEditing: boolean) => void;
}

export function TaskItemRow({ task, onEditChange }: TaskItemRowProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate ?? '');
  const [saving, setSaving] = useState(false);

  async function saveChanges() {
    setSaving(true);
    try {
      await updateCampaignTask(task.campaignId, task.id, {
        title,
        status,
        dueDate: dueDate || null,
      });
      setIsEditing(false);
      onEditChange?.(false);
      pushToast('Task updated.', 'success');
      router.refresh();
    } catch (error) {
      pushToast('Unable to update task. Check the API and try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function removeTask() {
    setSaving(true);
    try {
      await deleteCampaignTask(task.campaignId, task.id);
      setConfirmDelete(false);
      pushToast('Task deleted.', 'success');
      router.refresh();
    } catch (error) {
      pushToast('Unable to delete task. Check the API and try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className={`flex flex-wrap items-center justify-between gap-3 ${isEditing ? 'w-full' : ''}`}>
        {isEditing ? (
          <div className="w-full space-y-2">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <div className="grid gap-3 md:grid-cols-2">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as TaskStatus)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                aria-label="Task status"
              >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="needs_review">Needs review</option>
                <option value="done">Done</option>
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-ink">{task.title}</p>
            <p className="text-xs text-slate-500">{task.dueDate ? `Due ${task.dueDate}` : 'No due date'}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          {!isEditing ? <StatusPill label={status.replace('_', ' ')} tone={statusTone[status]} /> : null}
          {isEditing ? (
            <>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                onEditChange?.(false);
              }}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveChanges}
                disabled={saving}
                className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  onEditChange?.(true);
                }}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {confirmDelete ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <p className="font-semibold">Delete this task?</p>
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
              onClick={removeTask}
              disabled={saving}
              className="rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white"
            >
              {saving ? 'Deleting...' : 'Confirm delete'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
