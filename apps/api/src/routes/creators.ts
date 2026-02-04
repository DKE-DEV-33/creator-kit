/**
 * Creator routes.
 *
 * These endpoints power the creator directory and profile views.
 */
import { type FastifyInstance } from 'fastify';
import { listCreators } from '../data/mock.js';

export function registerCreatorRoutes(server: FastifyInstance): void {
  server.get('/creators', async () => ({ creators: listCreators() }));
}
