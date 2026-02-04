/**
 * Postgres-backed data access layer for CreatorKit.
 */
import { randomUUID } from 'node:crypto';
import { getPool } from '../db.js';

export type Platform = 'youtube' | 'tiktok' | 'instagram';
export type CampaignStatus = 'draft' | 'active' | 'reporting' | 'archived';
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

export interface ContentItem {
  id: string;
  campaignId: string;
  title: string;
  platform: Platform;
  status: ContentStatus;
  scheduledAt: string | null;
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

function toDateString(value: string | null): string | null {
  return value ? value.split('T')[0] : null;
}

export async function listCampaigns(): Promise<CampaignSummary[]> {
  const pool = getPool();
  const result = await pool.query(
    `
    SELECT
      c.id,
      c.name,
      c.status,
      c.start_date,
      c.end_date,
      (
        SELECT t.title
        FROM tasks t
        WHERE t.campaign_id = c.id
        ORDER BY t.created_at ASC
        LIMIT 1
      ) AS next_step
    FROM campaigns c
    ORDER BY c.created_at DESC
    `
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    nextStep: row.next_step ?? 'Define next workflow task',
  }));
}

export async function getCampaign(id: string): Promise<CampaignDetail | null> {
  const pool = getPool();
  const campaignResult = await pool.query(
    `SELECT id, name, status, start_date, end_date FROM campaigns WHERE id = $1`,
    [id]
  );

  if (campaignResult.rowCount === 0) {
    return null;
  }

  const campaign = campaignResult.rows[0];
  const briefResult = await pool.query(
    `SELECT summary, objectives, keywords, deliverables FROM briefs WHERE campaign_id = $1`,
    [id]
  );

  const tasksResult = await pool.query(
    `SELECT id, title, status, due_date FROM tasks WHERE campaign_id = $1 ORDER BY created_at ASC`,
    [id]
  );

  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    startDate: campaign.start_date,
    endDate: campaign.end_date,
    nextStep: tasksResult.rows[0]?.title ?? 'Define next workflow task',
    brief: {
      summary: briefResult.rows[0]?.summary ?? 'Draft brief pending.',
      objectives: briefResult.rows[0]?.objectives ?? 'Define objectives.',
      keywords: briefResult.rows[0]?.keywords ?? 'Add keywords.',
      deliverables: briefResult.rows[0]?.deliverables ?? 'Add deliverables.',
    },
    tasks: tasksResult.rows.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      dueDate: task.due_date ? toDateString(task.due_date) : null,
    })),
  };
}

export async function addCampaign(data: {
  name: string;
  startDate: string | null;
  endDate: string | null;
}): Promise<CampaignSummary> {
  const pool = getPool();
  const id = randomUUID();

  await pool.query(
    `
      INSERT INTO campaigns (id, team_id, name, status, start_date, end_date)
      VALUES ($1, $2, $3, 'draft', $4, $5)
    `,
    [id, '11111111-1111-1111-1111-111111111111', data.name, data.startDate, data.endDate]
  );

  await pool.query(
    `
      INSERT INTO briefs (id, campaign_id, summary, objectives, keywords, deliverables)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      randomUUID(),
      id,
      'Draft brief pending.',
      'Define objectives.',
      'Add keywords.',
      'Add deliverables.',
    ]
  );

  return {
    id,
    name: data.name,
    status: 'draft',
    startDate: data.startDate,
    endDate: data.endDate,
    nextStep: 'Define next workflow task',
  };
}

export async function getCampaignTasks(id: string): Promise<CampaignTask[]> {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, campaign_id, title, status, due_date FROM tasks WHERE campaign_id = $1 ORDER BY created_at ASC`,
    [id]
  );

  return result.rows.map((row) => ({
    id: row.id,
    campaignId: row.campaign_id,
    title: row.title,
    status: row.status,
    dueDate: row.due_date ? toDateString(row.due_date) : null,
  }));
}

export async function addCampaignTask(data: {
  campaignId: string;
  title: string;
  status: TaskStatus;
  dueDate: string | null;
}): Promise<CampaignTask> {
  const pool = getPool();
  const id = randomUUID();

  await pool.query(
    `INSERT INTO tasks (id, campaign_id, title, status, due_date) VALUES ($1, $2, $3, $4, $5)`,
    [id, data.campaignId, data.title, data.status, data.dueDate]
  );

  return {
    id,
    campaignId: data.campaignId,
    title: data.title,
    status: data.status,
    dueDate: data.dueDate,
  };
}

export async function updateCampaignTask(
  campaignId: string,
  taskId: string,
  updates: Partial<Pick<CampaignTask, 'title' | 'status' | 'dueDate'>>
): Promise<CampaignTask | null> {
  const pool = getPool();
  const current = await pool.query(
    `SELECT id, campaign_id, title, status, due_date FROM tasks WHERE id = $1 AND campaign_id = $2`,
    [taskId, campaignId]
  );

  if (current.rowCount === 0) {
    return null;
  }

  const row = current.rows[0];
  const nextTitle = updates.title ?? row.title;
  const nextStatus = updates.status ?? row.status;
  const nextDue = updates.dueDate ?? row.due_date;

  await pool.query(
    `UPDATE tasks SET title = $1, status = $2, due_date = $3 WHERE id = $4 AND campaign_id = $5`,
    [nextTitle, nextStatus, nextDue, taskId, campaignId]
  );

  return {
    id: taskId,
    campaignId,
    title: nextTitle,
    status: nextStatus,
    dueDate: nextDue ? toDateString(nextDue) : null,
  };
}

export async function removeCampaignTask(campaignId: string, taskId: string): Promise<boolean> {
  const pool = getPool();
  const result = await pool.query(`DELETE FROM tasks WHERE id = $1 AND campaign_id = $2`, [taskId, campaignId]);
  return result.rowCount > 0;
}

export async function getCampaignContent(id: string): Promise<ContentItem[]> {
  const pool = getPool();
  const result = await pool.query(
    `SELECT id, campaign_id, title, platform, status, scheduled_at FROM content_items WHERE campaign_id = $1 ORDER BY created_at ASC`,
    [id]
  );

  return result.rows.map((row) => ({
    id: row.id,
    campaignId: row.campaign_id,
    title: row.title,
    platform: row.platform,
    status: row.status,
    scheduledAt: row.scheduled_at ? row.scheduled_at.toISOString() : null,
  }));
}

export async function addCampaignContent(data: {
  campaignId: string;
  title: string;
  platform: Platform;
  scheduledAt: string | null;
}): Promise<ContentItem> {
  const pool = getPool();
  const id = randomUUID();
  const status: ContentStatus = data.scheduledAt ? 'scheduled' : 'draft';

  await pool.query(
    `INSERT INTO content_items (id, campaign_id, creator_id, platform, title, status, scheduled_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, data.campaignId, '33333333-3333-3333-3333-333333333333', data.platform, data.title, status, data.scheduledAt]
  );

  return {
    id,
    campaignId: data.campaignId,
    title: data.title,
    platform: data.platform,
    status,
    scheduledAt: data.scheduledAt,
  };
}

export async function updateCampaignContent(
  campaignId: string,
  contentId: string,
  updates: Partial<Pick<ContentItem, 'title' | 'platform' | 'scheduledAt'>>
): Promise<ContentItem | null> {
  const pool = getPool();
  const current = await pool.query(
    `SELECT id, campaign_id, title, platform, status, scheduled_at FROM content_items WHERE id = $1 AND campaign_id = $2`,
    [contentId, campaignId]
  );

  if (current.rowCount === 0) {
    return null;
  }

  const row = current.rows[0];
  const nextTitle = updates.title ?? row.title;
  const nextPlatform = updates.platform ?? row.platform;
  const nextScheduled = updates.scheduledAt ?? row.scheduled_at;
  const nextStatus: ContentStatus = nextScheduled ? 'scheduled' : 'draft';

  await pool.query(
    `UPDATE content_items SET title = $1, platform = $2, scheduled_at = $3, status = $4 WHERE id = $5 AND campaign_id = $6`,
    [nextTitle, nextPlatform, nextScheduled, nextStatus, contentId, campaignId]
  );

  return {
    id: contentId,
    campaignId,
    title: nextTitle,
    platform: nextPlatform,
    status: nextStatus,
    scheduledAt: nextScheduled ? new Date(nextScheduled).toISOString() : null,
  };
}

export async function removeCampaignContent(campaignId: string, contentId: string): Promise<boolean> {
  const pool = getPool();
  const result = await pool.query(`DELETE FROM content_items WHERE id = $1 AND campaign_id = $2`, [contentId, campaignId]);
  return result.rowCount > 0;
}

export async function listCreators(): Promise<CreatorProfile[]> {
  const pool = getPool();
  const creatorsResult = await pool.query(`SELECT id, name, email, avatar_url FROM creators ORDER BY created_at DESC`);
  const creators = creatorsResult.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email ?? '',
    avatarUrl: row.avatar_url,
  }));

  if (creators.length === 0) {
    return [];
  }

  const ids = creators.map((creator) => creator.id);
  const accountsResult = await pool.query(
    `SELECT creator_id, platform, handle FROM platform_accounts WHERE creator_id = ANY($1::uuid[])`,
    [ids]
  );

  return creators.map((creator) => ({
    ...creator,
    platforms: accountsResult.rows
      .filter((row) => row.creator_id === creator.id)
      .map((row) => ({ platform: row.platform, handle: row.handle })),
  }));
}

export async function getCreator(id: string): Promise<CreatorProfile | null> {
  const pool = getPool();
  const creatorResult = await pool.query(
    `SELECT id, name, email, avatar_url FROM creators WHERE id = $1`,
    [id]
  );

  if (creatorResult.rowCount === 0) {
    return null;
  }

  const accountsResult = await pool.query(
    `SELECT platform, handle FROM platform_accounts WHERE creator_id = $1`,
    [id]
  );

  const creator = creatorResult.rows[0];
  return {
    id: creator.id,
    name: creator.name,
    email: creator.email ?? '',
    avatarUrl: creator.avatar_url,
    platforms: accountsResult.rows.map((row) => ({ platform: row.platform, handle: row.handle })),
  };
}

export async function addCreator(data: { name: string; email: string | null }): Promise<CreatorProfile> {
  const pool = getPool();
  const id = randomUUID();

  await pool.query(
    `INSERT INTO creators (id, team_id, name, avatar_url, email) VALUES ($1, $2, $3, $4, $5)`,
    [id, '11111111-1111-1111-1111-111111111111', data.name, null, data.email]
  );

  return {
    id,
    name: data.name,
    email: data.email ?? '',
    avatarUrl: null,
    platforms: [],
  };
}

export async function getCampaignAnalytics(id: string): Promise<CampaignAnalytics | null> {
  const pool = getPool();
  const totalsResult = await pool.query(
    `
    SELECT
      COALESCE(SUM(views), 0) AS views,
      COALESCE(SUM(likes), 0) AS likes,
      COALESCE(SUM(comments), 0) AS comments,
      COALESCE(SUM(shares), 0) AS shares
    FROM kpi_snapshots
    WHERE campaign_id = $1
    `,
    [id]
  );

  const byCreatorResult = await pool.query(
    `
    SELECT
      k.creator_id,
      c.name AS creator_name,
      k.platform,
      SUM(k.views) AS views,
      SUM(k.likes) AS likes,
      SUM(k.comments) AS comments,
      SUM(k.shares) AS shares
    FROM kpi_snapshots k
    JOIN creators c ON c.id = k.creator_id
    WHERE k.campaign_id = $1
    GROUP BY k.creator_id, c.name, k.platform
    ORDER BY views DESC
    `,
    [id]
  );

  if (totalsResult.rowCount === 0) {
    return null;
  }

  return {
    campaignId: id,
    totals: {
      views: Number(totalsResult.rows[0].views ?? 0),
      likes: Number(totalsResult.rows[0].likes ?? 0),
      comments: Number(totalsResult.rows[0].comments ?? 0),
      shares: Number(totalsResult.rows[0].shares ?? 0),
    },
    byCreator: byCreatorResult.rows.map((row) => ({
      creatorId: row.creator_id,
      creatorName: row.creator_name,
      platform: row.platform,
      views: Number(row.views ?? 0),
      likes: Number(row.likes ?? 0),
      comments: Number(row.comments ?? 0),
      shares: Number(row.shares ?? 0),
    })),
  };
}

export async function getCreatorAnalytics(id: string): Promise<CreatorAnalytics | null> {
  const pool = getPool();
  const totalsResult = await pool.query(
    `
    SELECT
      COALESCE(SUM(views), 0) AS views,
      COALESCE(SUM(likes), 0) AS likes,
      COALESCE(SUM(comments), 0) AS comments,
      COALESCE(SUM(shares), 0) AS shares
    FROM kpi_snapshots
    WHERE creator_id = $1
    `,
    [id]
  );

  const byPlatformResult = await pool.query(
    `
    SELECT
      platform,
      SUM(views) AS views,
      SUM(likes) AS likes,
      SUM(comments) AS comments,
      SUM(shares) AS shares
    FROM kpi_snapshots
    WHERE creator_id = $1
    GROUP BY platform
    ORDER BY views DESC
    `,
    [id]
  );

  if (totalsResult.rowCount === 0) {
    return null;
  }

  return {
    creatorId: id,
    totals: {
      views: Number(totalsResult.rows[0].views ?? 0),
      likes: Number(totalsResult.rows[0].likes ?? 0),
      comments: Number(totalsResult.rows[0].comments ?? 0),
      shares: Number(totalsResult.rows[0].shares ?? 0),
    },
    byPlatform: byPlatformResult.rows.map((row) => ({
      platform: row.platform,
      views: Number(row.views ?? 0),
      likes: Number(row.likes ?? 0),
      comments: Number(row.comments ?? 0),
      shares: Number(row.shares ?? 0),
    })),
  };
}
