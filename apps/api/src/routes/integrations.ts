/**
 * Integrations routes.
 *
 * Surfaces platform connection status for the demo UI.
 */
import { type FastifyInstance } from 'fastify';
import { applyIntegrationAction, listIntegrations, syncIntegrations } from '../data/db.js';

export function registerIntegrationsRoutes(server: FastifyInstance): void {
  server.get('/integrations', async () => ({ integrations: await listIntegrations() }));

  server.post<{ Params: { platform: 'youtube' | 'tiktok' | 'instagram' }; Body: { action?: string } }>(
    '/integrations/:platform/action',
    async (request, reply) => {
      const action = request.body?.action;
      if (!action || !['connect', 'refresh', 'request_access', 'reconnect'].includes(action)) {
        return reply.code(400).send({ error: 'Invalid action' });
      }

      const integration = await applyIntegrationAction(request.params.platform, action as any);

      if (!integration) {
        return reply.code(404).send({ error: 'Integration not found' });
      }

      return { integration };
    }
  );

  server.post('/integrations/sync', async () => {
    const result = await syncIntegrations();
    return { status: 'ok', updated: result.updated };
  });
}
