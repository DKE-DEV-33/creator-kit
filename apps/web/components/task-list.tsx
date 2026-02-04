'use client';

/**
 * TaskList
 *
 * Client-side list with tabs to filter active/completed tasks.
 */
import { useMemo, useState } from 'react';
import type { CampaignTask } from '../lib/types';
import { TaskItemRow } from './task-item-row';

export interface TaskListProps {
  tasks: CampaignTask[];
}

type TabKey = 'active' | 'completed' | 'all';

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'active', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' },
];

export function TaskList({ tasks }: TaskListProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (activeTab === 'all') {
      return tasks;
    }
    if (activeTab === 'completed') {
      return tasks.filter((task) => task.status === 'done');
    }
    return tasks.filter((task) => task.status !== 'done');
  }, [activeTab, tasks]);

  const visible = editingId ? filtered.filter((task) => task.id === editingId) : filtered;

  return (
    <div>
      {editingId ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900">
          Editing task · Other tasks hidden until you finish.
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={
              activeTab === tab.key
                ? 'rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white'
                : 'rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={editingId ? 'mt-4' : 'mt-4 grid gap-4 md:grid-cols-3'}>
        {visible.map((task) => (
          <TaskItemRow
            key={task.id}
            task={task}
            onEditChange={(isEditing) => setEditingId(isEditing ? task.id : null)}
          />
        ))}
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
            {activeTab === 'completed'
              ? 'No completed tasks yet.'
              : 'No in-progress tasks yet. Add a task to kick off the workflow.'}
          </div>
        ) : null}
      </div>
    </div>
  );
}
