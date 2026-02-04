/**
 * Fastify server builder for CreatorKit.
 *
 * Keep all plugins and routes registered here so we can import
 * `buildServer` in tests or other scripts without side effects.
 */
import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { registerCampaignRoutes } from './routes/campaigns.js';
import { registerCreatorRoutes } from './routes/creators.js';
import { registerAnalyticsRoutes } from './routes/analytics.js';

export async function buildServer(): Promise<FastifyInstance> {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
    },
  });

  await server.register(cors, {
    origin: true,
  });

  server.get('/health', async () => ({ status: 'ok' }));

  registerCampaignRoutes(server);
  registerCreatorRoutes(server);
  registerAnalyticsRoutes(server);

  return server;
}
