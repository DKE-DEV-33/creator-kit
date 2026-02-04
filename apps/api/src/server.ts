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
import { registerSettingsRoutes } from './routes/settings.js';
import { registerIntegrationsRoutes } from './routes/integrations.js';

export async function buildServer(): Promise<FastifyInstance> {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
    },
  });

  server.addHook('onRequest', async (request) => {
    const demoUser = request.headers['x-demo-user'];
    const demoTeam = request.headers['x-demo-team'];

    if (demoUser || demoTeam) {
      request.log.info(
        { demoUser, demoTeam },
        'Demo auth headers received for request context'
      );
    }
  });

  await server.register(cors, {
    origin: true,
  });

  server.get('/health', async () => ({ status: 'ok' }));

  registerCampaignRoutes(server);
  registerCreatorRoutes(server);
  registerAnalyticsRoutes(server);
  registerSettingsRoutes(server);
  registerIntegrationsRoutes(server);

  return server;
}
