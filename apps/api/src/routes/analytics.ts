/**
 * Analytics routes.
 *
 * These endpoints are designed to mirror the analytics widgets in the UI.
 */
import { type FastifyInstance } from 'fastify';
import { getCampaignAnalytics, getCreatorAnalytics } from '../data/db.js';

export function registerAnalyticsRoutes(server: FastifyInstance): void {
  server.get<{ Params: { id: string } }>('/analytics/campaign/:id', async (request, reply) => {
    const analytics = await getCampaignAnalytics(request.params.id);

    if (!analytics) {
      return reply.code(404).send({ error: 'Analytics not found' });
    }

    return { analytics };
  });

  server.get<{ Params: { id: string } }>('/analytics/creator/:id', async (request, reply) => {
    const analytics = await getCreatorAnalytics(request.params.id);

    if (!analytics) {
      return reply.code(404).send({ error: 'Analytics not found' });
    }

    return { analytics };
  });
}
