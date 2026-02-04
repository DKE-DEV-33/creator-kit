/**
 * Mock data layer for CreatorKit.
 *
 * This is intentionally simple so the API can ship quickly while
 * the database layer is wired up. Replace these functions with
 * real SQL queries once the DB client is added.
 */

import { randomUUID } from 'node:crypto';

export type Platform = 'youtube' | 'tiktok' | 'instagram';

export interface CampaignSummary {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'reporting' | 'archived';
  startDate: string | null;
  endDate: string | null;
  nextStep: string;
}

export interface CampaignDetail extends CampaignSummary {
  brief: {
    summary: string;
    objectives: string;
    keywords: string;
    deliverables: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    status: 'todo' | 'in_progress' | 'needs_review' | 'done';
    dueDate: string | null;
  }>;
}

export interface CampaignTask {
  id: string;
  campaignId: string;
  title: string;
  status: 'todo' | 'in_progress' | 'needs_review' | 'done';
  dueDate: string | null;
}

export interface ContentItem {
  id: string;
  campaignId: string;
  title: string;
  platform: Platform;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  scheduledAt: string | null;
}

export interface Integration {
  id: string;
  platform: Platform;
  status: 'connected' | 'disconnected' | 'error';
  detail: string;
  action: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  platforms: Array<{
    platform: Platform;
    handle: string;
  }>;
}

export interface CampaignAnalytics {
  campaignId: string;
  totals: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  byCreator: Array<{
    creatorId: string;
    creatorName: string;
    platform: Platform;
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }>;
}

export interface CreatorAnalytics {
  creatorId: string;
  totals: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  byPlatform: Array<{
    platform: Platform;
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }>;
}

export interface SettingsPayload {
  team: {
    name: string;
    region: string;
    reportingWindow: string;
  };
  aiPreferences: Array<{
    label: string;
    description: string;
    enabled: boolean;
  }>;
  workflowDefaults: Array<{
    label: string;
    value: string;
  }>;
}

const campaigns: CampaignDetail[] = [
  {
    id: '77777777-7777-7777-7777-777777777777',
    name: 'GlowUp Launch',
    status: 'active',
    startDate: '2026-02-01',
    endDate: '2026-03-15',
    brief: {
      summary: 'Launch GlowUp skincare to Gen Z with creator-led tutorials.',
      objectives: 'Drive awareness and 3% click-through to landing page.',
      keywords: 'glowup, skincare routine, dewy skin, morning routine',
      deliverables: '2x YouTube videos per creator, 1x short clip, 1x community post',
    },
    tasks: [
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        title: 'Draft first video concept',
        status: 'in_progress',
        dueDate: '2026-02-08',
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        title: 'Review script outline',
        status: 'todo',
        dueDate: '2026-02-10',
      },
    ],
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    name: 'Spring Refresh',
    status: 'draft',
    startDate: '2026-03-20',
    endDate: '2026-04-30',
    brief: {
      summary: 'Prep a spring content reset with soft-launch teasers.',
      objectives: 'Collect 1,500 waitlist sign-ups from creator traffic.',
      keywords: 'spring reset, refresh, skincare, glow',
      deliverables: '1 teaser video, 1 behind-the-scenes short',
    },
    tasks: [],
  },
];

const creators: CreatorProfile[] = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Avery Chen',
    email: 'avery@creators.com',
    avatarUrl: null,
    platforms: [
      {
        platform: 'youtube',
        handle: '@averyplays',
      },
      {
        platform: 'tiktok',
        handle: '@averyskincare',
      },
    ],
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Riley Patel',
    email: 'riley@creators.com',
    avatarUrl: null,
    platforms: [
      {
        platform: 'youtube',
        handle: '@rileycooks',
      },
      {
        platform: 'instagram',
        handle: '@rileyeats',
      },
    ],
  },
];

const analytics: CampaignAnalytics = {
  campaignId: '77777777-7777-7777-7777-777777777777',
  totals: {
    views: 22200,
    likes: 1740,
    comments: 218,
    shares: 70,
  },
  byCreator: [
    {
      creatorId: '33333333-3333-3333-3333-333333333333',
      creatorName: 'Avery Chen',
      platform: 'youtube',
      views: 12400,
      likes: 980,
      comments: 120,
      shares: 40,
    },
    {
      creatorId: '44444444-4444-4444-4444-444444444444',
      creatorName: 'Riley Patel',
      platform: 'youtube',
      views: 9800,
      likes: 760,
      comments: 98,
      shares: 30,
    },
  ],
};

const creatorAnalytics: CreatorAnalytics[] = [
  {
    creatorId: '33333333-3333-3333-3333-333333333333',
    totals: {
      views: 12400,
      likes: 980,
      comments: 120,
      shares: 40,
    },
    byPlatform: [
      {
        platform: 'youtube',
        views: 12400,
        likes: 980,
        comments: 120,
        shares: 40,
      },
    ],
  },
  {
    creatorId: '44444444-4444-4444-4444-444444444444',
    totals: {
      views: 9800,
      likes: 760,
      comments: 98,
      shares: 30,
    },
    byPlatform: [
      {
        platform: 'youtube',
        views: 9800,
        likes: 760,
        comments: 98,
        shares: 30,
      },
    ],
  },
];

const contentItems: ContentItem[] = [
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    campaignId: '77777777-7777-7777-7777-777777777777',
    title: 'GlowUp AM Routine',
    platform: 'youtube',
    status: 'scheduled',
    scheduledAt: '2026-02-12T16:00:00Z',
  },
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    campaignId: '77777777-7777-7777-7777-777777777777',
    title: 'Dewy Skin 5-Min Hacks',
    platform: 'youtube',
    status: 'draft',
    scheduledAt: null,
  },
  {
    id: 'edededed-eded-eded-eded-edededededed',
    campaignId: '77777777-7777-7777-7777-777777777777',
    title: 'GlowUp quick tips',
    platform: 'tiktok',
    status: 'draft',
    scheduledAt: '2026-02-18T18:00:00Z',
  },
];

const integrations: Integration[] = [
  {
    id: '12121212-1212-1212-1212-121212121212',
    platform: 'youtube',
    status: 'connected',
    detail: 'Syncing every 12 hours · 2 channels linked',
    action: 'Refresh token',
  },
  {
    id: '13131313-1313-1313-1313-131313131313',
    platform: 'tiktok',
    status: 'disconnected',
    detail: 'Mock adapter active · API approval pending',
    action: 'Request access',
  },
  {
    id: '14141414-1414-1414-1414-141414141414',
    platform: 'instagram',
    status: 'disconnected',
    detail: 'Mock adapter active · Connect when ready',
    action: 'Connect',
  },
];

const settings: SettingsPayload = {
  team: {
    name: 'Pulse Creative',
    region: 'San Francisco, CA',
    reportingWindow: 'Weekly',
  },
  aiPreferences: [
    {
      label: 'Auto-generate brief drafts',
      description: 'Create AI drafts when a campaign is created.',
      enabled: true,
    },
    {
      label: 'Require approvals before publishing',
      description: 'Block content from scheduling without a reviewer sign-off.',
      enabled: true,
    },
    {
      label: 'Weekly performance digest',
      description: 'Email summary to campaign owners every Monday at 9 AM.',
      enabled: false,
    },
  ],
  workflowDefaults: [
    { label: 'Approval SLA', value: '48 hours' },
    { label: 'Content cadence', value: '2 posts / week' },
    { label: 'Reporting day', value: 'Monday' },
  ],
};

/**
 * Return all campaigns for the demo team.
 */
export function listCampaigns(): CampaignSummary[] {
  return campaigns.map(({ brief, tasks, ...summary }) => ({
    ...summary,
    nextStep: tasks[0]?.title ?? 'Define next workflow task',
  }));
}

/**
 * Append a new campaign to the in-memory store.
 */
export function addCampaign(data: {
  name: string;
  startDate: string | null;
  endDate: string | null;
}): CampaignSummary {
  const id = randomUUID();
  const campaign: CampaignDetail = {
    id,
    name: data.name,
    status: 'draft',
    startDate: data.startDate,
    endDate: data.endDate,
    brief: {
      summary: 'Draft brief pending.',
      objectives: 'Define objectives.',
      keywords: 'Add keywords.',
      deliverables: 'Add deliverables.',
    },
    tasks: [],
  };

  campaigns.push(campaign);

  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    nextStep: 'Define next workflow task',
  };
}

/**
 * Return a single campaign by ID, if it exists.
 */
export function getCampaign(id: string): CampaignDetail | null {
  return campaigns.find((campaign) => campaign.id === id) ?? null;
}

/**
 * Return all creators for the demo team.
 */
export function listCreators(): CreatorProfile[] {
  return creators;
}

/**
 * Append a new creator to the in-memory store.
 */
export function addCreator(data: { name: string; email: string | null }): CreatorProfile {
  const creator: CreatorProfile = {
    id: randomUUID(),
    name: data.name,
    email: data.email ?? '',
    avatarUrl: null,
    platforms: [],
  };

  creators.push(creator);
  return creator;
}

/**
 * Return a single creator by ID, if it exists.
 */
export function getCreator(id: string): CreatorProfile | null {
  return creators.find((creator) => creator.id === id) ?? null;
}

/**
 * Return analytics for a campaign ID.
 */
export function getCampaignAnalytics(id: string): CampaignAnalytics | null {
  if (analytics.campaignId !== id) {
    return null;
  }
  return analytics;
}

/**
 * Return analytics for a creator ID.
 */
export function getCreatorAnalytics(id: string): CreatorAnalytics | null {
  return creatorAnalytics.find((entry) => entry.creatorId === id) ?? null;
}

/**
 * Return content items for a campaign ID.
 */
export function getCampaignContent(id: string): ContentItem[] {
  return contentItems.filter((item) => item.campaignId === id);
}

/**
 * Return tasks for a campaign ID.
 */
export function getCampaignTasks(id: string): CampaignTask[] {
  const campaign = campaigns.find((entry) => entry.id === id);
  if (!campaign) {
    return [];
  }
  return campaign.tasks.map((task) => ({
    ...task,
    campaignId: id,
  }));
}

/**
 * Append a task to the in-memory store.
 */
export function addCampaignTask(data: {
  campaignId: string;
  title: string;
  status: CampaignTask['status'];
  dueDate: string | null;
}): CampaignTask | null {
  const campaign = campaigns.find((entry) => entry.id === data.campaignId);

  if (!campaign) {
    return null;
  }

  const task: CampaignTask = {
    id: randomUUID(),
    campaignId: data.campaignId,
    title: data.title,
    status: data.status,
    dueDate: data.dueDate,
  };

  campaign.tasks.push({
    id: task.id,
    title: task.title,
    status: task.status,
    dueDate: task.dueDate,
  });

  return task;
}

/**
 * Update a task in the in-memory store.
 */
export function updateCampaignTask(
  campaignId: string,
  taskId: string,
  updates: Partial<Pick<CampaignTask, 'title' | 'status' | 'dueDate'>>
): CampaignTask | null {
  const campaign = campaigns.find((entry) => entry.id === campaignId);

  if (!campaign) {
    return null;
  }

  const task = campaign.tasks.find((entry) => entry.id === taskId);

  if (!task) {
    return null;
  }

  if (updates.title !== undefined) {
    task.title = updates.title;
  }

  if (updates.status !== undefined) {
    task.status = updates.status;
  }

  if (updates.dueDate !== undefined) {
    task.dueDate = updates.dueDate;
  }

  return {
    id: task.id,
    campaignId,
    title: task.title,
    status: task.status,
    dueDate: task.dueDate,
  };
}

/**
 * Remove a task from the in-memory store.
 */
export function removeCampaignTask(campaignId: string, taskId: string): boolean {
  const campaign = campaigns.find((entry) => entry.id === campaignId);

  if (!campaign) {
    return false;
  }

  const index = campaign.tasks.findIndex((entry) => entry.id === taskId);

  if (index === -1) {
    return false;
  }

  campaign.tasks.splice(index, 1);
  return true;
}

/**
 * Append a content item to the in-memory store.
 */
export function addCampaignContent(item: ContentItem): ContentItem {
  contentItems.push(item);
  return item;
}

/**
 * Update a content item in the in-memory store.
 */
export function updateCampaignContent(
  campaignId: string,
  contentId: string,
  updates: Partial<Pick<ContentItem, 'title' | 'platform' | 'scheduledAt'>>
): ContentItem | null {
  const item = contentItems.find((entry) => entry.campaignId === campaignId && entry.id === contentId);

  if (!item) {
    return null;
  }

  if (updates.title !== undefined) {
    item.title = updates.title;
  }

  if (updates.platform !== undefined) {
    item.platform = updates.platform;
  }

  if (updates.scheduledAt !== undefined) {
    item.scheduledAt = updates.scheduledAt;
    item.status = updates.scheduledAt ? 'scheduled' : 'draft';
  }

  return item;
}

/**
 * Remove a content item from the in-memory store.
 */
export function removeCampaignContent(campaignId: string, contentId: string): boolean {
  const index = contentItems.findIndex((entry) => entry.campaignId === campaignId && entry.id === contentId);

  if (index === -1) {
    return false;
  }

  contentItems.splice(index, 1);
  return true;
}

/**
 * Return integration status for the demo team.
 */
export function listIntegrations(): Integration[] {
  return integrations;
}

/**
 * Return settings payload for the demo team.
 */
export function getSettings(): SettingsPayload {
  return settings;
}
