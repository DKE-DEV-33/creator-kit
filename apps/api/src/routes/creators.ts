/**
 * Creator routes.
 *
 * These endpoints power the creator directory and profile views.
 */
import { type FastifyInstance } from 'fastify';
import { addCreator, getCreator, listCreators } from '../data/db.js';

export function registerCreatorRoutes(server: FastifyInstance): void {
  server.get('/creators', async () => ({ creators: await listCreators() }));

  server.post<{ Body: { name?: string; email?: string | null } }>('/creators', async (request, reply) => {
    const { name, email } = request.body ?? {};

    if (!name || name.trim().length < 3) {
      return reply.code(400).send({ error: 'Creator name is required' });
    }

    const creator = await addCreator({
      name: name.trim(),
      email: email ?? null,
    });

    return reply.code(201).send({ creator });
  });

  server.get<{ Params: { id: string } }>('/creators/:id', async (request, reply) => {
    const creator = await getCreator(request.params.id);

    if (!creator) {
      return reply.code(404).send({ error: 'Creator not found' });
    }

    return { creator };
  });
}
