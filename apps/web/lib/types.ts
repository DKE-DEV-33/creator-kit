/**
 * Shared API response types for CreatorKit.
 *
 * Keep this file in sync with the Fastify mock data layer until
 * real API contracts are generated.
 */

export type CampaignStatus = 'draft' | 'active' | 'reporting' | 'archived';
export type Platform = 'youtube' | 'tiktok' | 'instagram';
export type TaskStatus = 'todo' | 'in_progress' | 'needs_review' | 'done';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface CampaignSummary {
  id: string;
  name: string;
  status: CampaignStatus;
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
    status: TaskStatus;
    dueDate: string | null;
  }>;
}

export interface CampaignTask {
  id: string;
  campaignId: string;
  title: string;
  status: TaskStatus;
  dueDate: string | null;
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

export interface CreatorDetail extends CreatorProfile {}

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

export interface ContentItem {
  id: string;
  campaignId: string;
  title: string;
  platform: Platform;
  status: ContentStatus;
  scheduledAt: string | null;
}

export interface Integration {
  id: string;
  platform: Platform;
  status: 'connected' | 'disconnected' | 'error';
  detail: string;
  action: string;
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
