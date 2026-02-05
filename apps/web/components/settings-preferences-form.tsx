'use client';

/**
 * SettingsPreferencesForm
 *
 * Client-side form for AI preferences toggles.
 */
import { useState } from 'react';
import { useToast } from './toast';
import { updateAiPreferences } from '../lib/api';
import type { AiPreference } from '../lib/types';

export interface SettingsPreferencesFormProps {
  preferences: AiPreference[];
}

export function SettingsPreferencesForm({ preferences }: SettingsPreferencesFormProps) {
  const { pushToast } = useToast();
  const [items, setItems] = useState(preferences);
  const [saving, setSaving] = useState(false);

  function togglePreference(index: number) {
    setItems((current) =>
      current.map((item, idx) => (idx === index ? { ...item, enabled: !item.enabled } : item))
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateAiPreferences(items);
      pushToast('AI preferences saved.', 'success');
    } catch (error) {
      pushToast('Unable to save preferences. Check the API and try again.', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {items.map((toggle, index) => (
        <div key={toggle.label} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">{toggle.label}</p>
              <p className="text-xs text-slate-500">{toggle.description}</p>
            </div>
            <button
              type="button"
              onClick={() => togglePreference(index)}
              className="rounded-full border border-slate-200 px-4 py-1 text-xs font-semibold text-slate-700"
            >
              {toggle.enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-ink/20"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
