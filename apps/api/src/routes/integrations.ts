/**
 * Integrations routes.
 *
 * Surfaces platform connection status for the demo UI.
 */
import { type FastifyInstance } from 'fastify';
import { listIntegrations } from '../data/mock.js';

export function registerIntegrationsRoutes(server: FastifyInstance): void {
  server.get('/integrations', async () => ({ integrations: listIntegrations() }));
}
