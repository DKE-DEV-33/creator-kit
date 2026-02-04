/**
 * Mock data layer for CreatorKit.
 *
 * This is intentionally simple so the API can ship quickly while
 * the database layer is wired up. Replace these functions with
 * real SQL queries once the DB client is added.
 */

export type Platform = 'youtube' | 'tiktok' | 'instagram';

export interface CampaignSummary {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'reporting' | 'archived';
  startDate: string | null;
  endDate: string | null;
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

/**
 * Return all campaigns for the demo team.
 */
export function listCampaigns(): CampaignSummary[] {
  return campaigns.map(({ brief, tasks, ...summary }) => summary);
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
 * Return analytics for a campaign ID.
 */
export function getCampaignAnalytics(id: string): CampaignAnalytics | null {
  if (analytics.campaignId !== id) {
    return null;
  }
  return analytics;
}
