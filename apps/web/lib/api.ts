/**
 * API client helpers for the CreatorKit web app.
 *
 * These functions fetch data from the Fastify backend and keep
 * the UI decoupled from specific HTTP details.
 */
import type {
  CampaignAnalytics,
  CampaignDetail,
  CampaignSummary,
  CampaignTask,
  ContentItem,
  Integration,
  CreatorDetail,
  CreatorAnalytics,
  CreatorProfile,
  SettingsPayload,
} from './types';

interface ApiConfig {
  baseUrl: string;
}

/**
 * Resolve the API base URL from environment variables.
 */
function getApiConfig(): ApiConfig {
  return {
    baseUrl: process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000',
  };
}

/**
 * Perform a JSON fetch with consistent error handling.
 */
async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const { baseUrl } = getApiConfig();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      ...(init?.headers ?? {}),
      'x-demo-user': 'demo@pulsecreative.com',
      'x-demo-team': 'Pulse Creative',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetch all campaigns.
 */
export async function getCampaigns(): Promise<CampaignSummary[]> {
  const data = await fetchJson<{ campaigns: CampaignSummary[] }>('/campaigns');
  return data.campaigns;
}

/**
 * Fetch a campaign by ID.
 */
export async function getCampaign(id: string): Promise<CampaignDetail> {
  const data = await fetchJson<{ campaign: CampaignDetail }>(`/campaigns/${id}`);
  return data.campaign;
}

/**
 * Fetch all creators.
 */
export async function getCreators(): Promise<CreatorProfile[]> {
  const data = await fetchJson<{ creators: CreatorProfile[] }>('/creators');
  return data.creators;
}

/**
 * Create a new creator.
 */
export async function createCreator(payload: { name: string; email?: string | null }): Promise<CreatorDetail> {
  const data = await fetchJson<{ creator: CreatorDetail }>('/creators', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return data.creator;
}

/**
 * Fetch a creator by ID.
 */
export async function getCreator(id: string): Promise<CreatorDetail> {
  const data = await fetchJson<{ creator: CreatorDetail }>(`/creators/${id}`);
  return data.creator;
}

/**
 * Fetch campaign analytics by ID.
 */
export async function getCampaignAnalytics(id: string): Promise<CampaignAnalytics> {
  const data = await fetchJson<{ analytics: CampaignAnalytics }>(`/analytics/campaign/${id}`);
  return data.analytics;
}

/**
 * Fetch creator analytics by ID.
 */
export async function getCreatorAnalytics(id: string): Promise<CreatorAnalytics> {
  const data = await fetchJson<{ analytics: CreatorAnalytics }>(`/analytics/creator/${id}`);
  return data.analytics;
}

/**
 * Fetch content items for a campaign by ID.
 */
export async function getCampaignContent(id: string): Promise<ContentItem[]> {
  const data = await fetchJson<{ content: ContentItem[] }>(`/campaigns/${id}/content`);
  return data.content;
}

/**
 * Fetch tasks for a campaign by ID.
 */
export async function getCampaignTasks(id: string): Promise<CampaignTask[]> {
  const data = await fetchJson<{ tasks: CampaignTask[] }>(`/campaigns/${id}/tasks`);
  return data.tasks;
}

/**
 * Create a task for a campaign.
 */
export async function createCampaignTask(
  id: string,
  payload: { title: string; status?: CampaignTask['status']; dueDate?: string | null }
): Promise<CampaignTask> {
  const data = await fetchJson<{ task: CampaignTask }>(`/campaigns/${id}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return data.task;
}

/**
 * Update a task for a campaign.
 */
export async function updateCampaignTask(
  id: string,
  taskId: string,
  payload: { title?: string; status?: CampaignTask['status']; dueDate?: string | null }
): Promise<CampaignTask> {
  const data = await fetchJson<{ task: CampaignTask }>(`/campaigns/${id}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return data.task;
}

/**
 * Delete a task for a campaign.
 */
export async function deleteCampaignTask(id: string, taskId: string): Promise<void> {
  await fetchJson<unknown>(`/campaigns/${id}/tasks/${taskId}`, {
    method: 'DELETE',
  });
}
/**
 * Fetch integration status for the demo workspace.
 */
export async function getIntegrations(): Promise<Integration[]> {
  const data = await fetchJson<{ integrations: Integration[] }>('/integrations');
  return data.integrations;
}

/**
 * Fetch settings for the demo workspace.
 */
export async function getSettings(): Promise<SettingsPayload> {
  const data = await fetchJson<{ settings: SettingsPayload }>('/settings');
  return data.settings;
}
