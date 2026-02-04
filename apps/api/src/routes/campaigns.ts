/**
 * Campaign routes.
 *
 * These endpoints back the campaign list, detail page, briefs, and tasks.
 * Replace mock data calls with real SQL queries as soon as the DB layer
 * is wired into the API.
 */
import { type FastifyInstance } from 'fastify';
import {
  addCampaign,
  addCampaignContent,
  addCampaignTask,
  getCampaign,
  getCampaignContent,
  getCampaignTasks,
  listCampaigns,
  removeCampaignContent,
  removeCampaignTask,
  updateCampaignContent,
  updateCampaignTask,
} from '../data/db.js';

export function registerCampaignRoutes(server: FastifyInstance): void {
  server.get('/campaigns', async () => ({ campaigns: await listCampaigns() }));

  server.post<{ Body: { name?: string; startDate?: string | null; endDate?: string | null } }>(
    '/campaigns',
    async (request, reply) => {
      const { name, startDate, endDate } = request.body ?? {};

      if (!name || name.trim().length < 3) {
        return reply.code(400).send({ error: 'Campaign name is required' });
      }

      const campaign = await addCampaign({
        name: name.trim(),
        startDate: startDate ?? null,
        endDate: endDate ?? null,
      });

      return reply.code(201).send({ campaign });
    }
  );

  server.get<{ Params: { id: string } }>('/campaigns/:id', async (request, reply) => {
    const campaign = await getCampaign(request.params.id);

    if (!campaign) {
      return reply.code(404).send({ error: 'Campaign not found' });
    }

    return { campaign };
  });

  server.get<{ Params: { id: string } }>('/campaigns/:id/content', async (request, reply) => {
    const campaign = await getCampaign(request.params.id);

    if (!campaign) {
      return reply.code(404).send({ error: 'Campaign not found' });
    }

    return { content: await getCampaignContent(request.params.id) };
  });

  server.get<{ Params: { id: string } }>('/campaigns/:id/tasks', async (request, reply) => {
    const campaign = await getCampaign(request.params.id);

    if (!campaign) {
      return reply.code(404).send({ error: 'Campaign not found' });
    }

    return { tasks: await getCampaignTasks(request.params.id) };
  });

  server.post<{
    Params: { id: string };
    Body: { title?: string; status?: 'todo' | 'in_progress' | 'needs_review' | 'done'; dueDate?: string | null };
  }>('/campaigns/:id/tasks', async (request, reply) => {
    const campaign = await getCampaign(request.params.id);

    if (!campaign) {
      return reply.code(404).send({ error: 'Campaign not found' });
    }

    const { title, status, dueDate } = request.body ?? {};

    if (!title || title.trim().length < 3) {
      return reply.code(400).send({ error: 'Task title is required' });
    }

    const task = await addCampaignTask({
      campaignId: request.params.id,
      title: title.trim(),
      status: status ?? 'todo',
      dueDate: dueDate ?? null,
    });

    if (!task) {
      return reply.code(404).send({ error: 'Campaign not found' });
    }

    return reply.code(201).send({ task });
  });

  server.put<{
    Params: { id: string; taskId: string };
    Body: { title?: string; status?: 'todo' | 'in_progress' | 'needs_review' | 'done'; dueDate?: string | null };
  }>('/campaigns/:id/tasks/:taskId', async (request, reply) => {
    const campaign = await getCampaign(request.params.id);

    if (!campaign) {
      return reply.code(404).send({ error: 'Campaign not found' });
    }

    const updated = await updateCampaignTask(request.params.id, request.params.taskId, request.body ?? {});

    if (!updated) {
      return reply.code(404).send({ error: 'Task not found' });
    }

    return { task: updated };
  });

  server.delete<{ Params: { id: string; taskId: string } }>(
    '/campaigns/:id/tasks/:taskId',
    async (request, reply) => {
      const campaign = await getCampaign(request.params.id);

      if (!campaign) {
        return reply.code(404).send({ error: 'Campaign not found' });
      }

      const removed = await removeCampaignTask(request.params.id, request.params.taskId);

      if (!removed) {
        return reply.code(404).send({ error: 'Task not found' });
      }

      return reply.code(204).send();
    }
  );

  server.post<{
    Params: { id: string };
    Body: { title: string; platform: 'youtube' | 'tiktok' | 'instagram'; scheduledAt?: string | null };
  }>('/campaigns/:id/content', async (request, reply) => {
    const campaign = await getCampaign(request.params.id);

    if (!campaign) {
      return reply.code(404).send({ error: 'Campaign not found' });
    }

    const { title, platform, scheduledAt } = request.body ?? {};

    if (!title || !platform) {
      return reply.code(400).send({ error: 'Title and platform are required' });
    }

    const item = await addCampaignContent({
      campaignId: request.params.id,
      title,
      platform,
      scheduledAt: scheduledAt ?? null,
    });

    return reply.code(201).send({ content: item });
  });

  server.put<{
    Params: { id: string; contentId: string };
    Body: { title?: string; platform?: 'youtube' | 'tiktok' | 'instagram'; scheduledAt?: string | null };
  }>('/campaigns/:id/content/:contentId', async (request, reply) => {
    const campaign = await getCampaign(request.params.id);

    if (!campaign) {
      return reply.code(404).send({ error: 'Campaign not found' });
    }

    const updated = await updateCampaignContent(request.params.id, request.params.contentId, request.body ?? {});

    if (!updated) {
      return reply.code(404).send({ error: 'Content item not found' });
    }

    return { content: updated };
  });

  server.delete<{ Params: { id: string; contentId: string } }>(
    '/campaigns/:id/content/:contentId',
    async (request, reply) => {
      const campaign = getCampaign(request.params.id);

      if (!campaign) {
        return reply.code(404).send({ error: 'Campaign not found' });
      }

      const removed = await removeCampaignContent(request.params.id, request.params.contentId);

      if (!removed) {
        return reply.code(404).send({ error: 'Content item not found' });
      }

      return reply.code(204).send();
    }
  );
}
