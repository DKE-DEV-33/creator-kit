'use client';

/**
 * CreatorUpdateButton
 *
 * Sends a lightweight update signal for a creator.
 */
import { useState } from 'react';
import { useToast } from './toast';
import { sendCreatorUpdate } from '../lib/api';

export interface CreatorUpdateButtonProps {
  creatorId: string;
  creatorName: string;
}

export function CreatorUpdateButton({ creatorId, creatorName }: CreatorUpdateButtonProps) {
  const { pushToast } = useToast();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      await sendCreatorUpdate(creatorId, `Update sent to ${creatorName}`);
      pushToast('Update sent.', 'success');
    } catch (error) {
      pushToast('Unable to send update. Check the API and try again.', 'error');
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-ink/20"
    >
      {pending ? 'Sending...' : 'Send update'}
    </button>
  );
}
