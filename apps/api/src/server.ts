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
import { getPool } from './db.js';
import {
  getAiPreferences,
  getClientProfile,
  getUserProfile,
  getWorkspaceStats,
  updateAiPreferences,
  updateClientProfile,
  updateUserProfile,
} from './data/db.js';

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

  server.get('/health', async () => {
    try {
      const pool = getPool();
      await pool.query('SELECT 1');
      return { status: 'ok', db: 'connected' };
    } catch (error) {
      server.log.error({ error }, 'Database health check failed');
      return { status: 'degraded', db: 'error' };
    }
  });

  server.get('/stats', async () => {
    const stats = await getWorkspaceStats();
    return { stats };
  });

  server.get('/client-profile', async () => {
    const profile = await getClientProfile();
    return { profile };
  });

  server.put<{
    Body: {
      name?: string;
      region?: string;
      reportingWindow?: string;
      approvalSlaHours?: number;
      contentCadencePerWeek?: number;
    };
  }>('/client-profile', async (request, reply) => {
    const { name, region, reportingWindow, approvalSlaHours, contentCadencePerWeek } = request.body ?? {};

    if (!name || name.trim().length < 3) {
      return reply.code(400).send({ error: 'Client name is required' });
    }

    const profile = await updateClientProfile({
      name: name.trim(),
      region: region ?? 'San Francisco, CA',
      reportingWindow: reportingWindow ?? 'Weekly',
      approvalSlaHours: Number.isFinite(approvalSlaHours) ? Number(approvalSlaHours) : 48,
      contentCadencePerWeek: Number.isFinite(contentCadencePerWeek) ? Number(contentCadencePerWeek) : 2,
    });

    return { profile };
  });

  server.get('/user-profile', async () => {
    const profile = await getUserProfile();
    return { profile };
  });

  server.put<{ Body: { id?: string; name?: string; email?: string; role?: string; timezone?: string } }>(
    '/user-profile',
    async (request, reply) => {
      const { id, name, email, role, timezone } = request.body ?? {};

      if (!id || !name || name.trim().length < 3) {
        return reply.code(400).send({ error: 'User id and name are required' });
      }

      const profile = await updateUserProfile({
        id,
        name: name.trim(),
        email: email ?? '',
        role: role ?? 'Account Owner',
        timezone: timezone ?? 'America/Los_Angeles',
        teamId: '11111111-1111-1111-1111-111111111111',
      });

      return { profile };
    }
  );

  server.get('/ai-preferences', async () => {
    const preferences = await getAiPreferences();
    return { preferences };
  });

  server.put<{ Body: { preferences?: Array<{ label: string; description: string; enabled: boolean }> } }>(
    '/ai-preferences',
    async (request, reply) => {
      const preferences = request.body?.preferences;
      if (!preferences) {
        return reply.code(400).send({ error: 'Preferences are required' });
      }
      const updated = await updateAiPreferences(preferences);
      return { preferences: updated };
    }
  );

  registerCampaignRoutes(server);
  registerCreatorRoutes(server);
  registerAnalyticsRoutes(server);
  registerSettingsRoutes(server);
  registerIntegrationsRoutes(server);

  return server;
}
