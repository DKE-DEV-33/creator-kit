/**
 * Campaign routes.
 *
 * These endpoints back the campaign list, detail page, briefs, and tasks.
 * Replace mock data calls with real SQL queries as soon as the DB layer
 * is wired into the API.
 */
import { type FastifyInstance } from 'fastify';
import { getCampaign, listCampaigns } from '../data/mock.js';

export function registerCampaignRoutes(server: FastifyInstance): void {
  server.get('/campaigns', async () => ({ campaigns: listCampaigns() }));

  server.get<{ Params: { id: string } }>('/campaigns/:id', async (request, reply) => {
    const campaign = getCampaign(request.params.id);

    if (!campaign) {
      return reply.code(404).send({ error: 'Campaign not found' });
    }

    return { campaign };
  });
}
