/**
 * Settings routes.
 *
 * Returns read-only workspace settings for the demo experience.
 */
import { type FastifyInstance } from 'fastify';
import { getSettings } from '../data/mock.js';

export function registerSettingsRoutes(server: FastifyInstance): void {
  server.get('/settings', async () => ({ settings: getSettings() }));
}
