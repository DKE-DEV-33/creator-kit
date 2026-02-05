'use client';

/**
 * IntegrationSyncAction
 *
 * Triggers a sync and refreshes the integrations list.
 */
import { useRouter } from 'next/navigation';
import { SyncAnalyticsButton } from './sync-analytics-button';

export function IntegrationSyncAction() {
  const router = useRouter();

  return <SyncAnalyticsButton onComplete={() => router.refresh()} />;
}
