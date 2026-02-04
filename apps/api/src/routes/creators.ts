/**
 * Creator routes.
 *
 * These endpoints power the creator directory and profile views.
 */
import { type FastifyInstance } from 'fastify';
import { getCreator, listCreators } from '../data/mock.js';

export function registerCreatorRoutes(server: FastifyInstance): void {
  server.get('/creators', async () => ({ creators: listCreators() }));

  server.get<{ Params: { id: string } }>('/creators/:id', async (request, reply) => {
    const creator = getCreator(request.params.id);

    if (!creator) {
      return reply.code(404).send({ error: 'Creator not found' });
    }

    return { creator };
  });
}
