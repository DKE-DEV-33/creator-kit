/**
 * Creator routes.
 *
 * These endpoints power the creator directory and profile views.
 */
import { type FastifyInstance } from 'fastify';
import {
  addCreator,
  createCreatorUpdate,
  getCreator,
  listCreatorContent,
  listCreators,
  replaceCreatorPlatforms,
  updateCreator,
} from '../data/db.js';

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

  server.put<{
    Params: { id: string };
    Body: {
      name?: string;
      email?: string | null;
      platforms?: Array<{ platform: 'youtube' | 'tiktok' | 'instagram'; handle: string; externalId?: string }>;
    };
  }>('/creators/:id', async (request, reply) => {
    const { name, email, platforms } = request.body ?? {};

    if (!name || name.trim().length < 3) {
      return reply.code(400).send({ error: 'Creator name is required' });
    }

    const updated = await updateCreator(request.params.id, {
      name: name.trim(),
      email: email ?? null,
    });

    if (!updated) {
      return reply.code(404).send({ error: 'Creator not found' });
    }

    if (platforms) {
      await replaceCreatorPlatforms(request.params.id, platforms);
    }

    const creator = await getCreator(request.params.id);
    return { creator };
  });

  server.get<{ Params: { id: string } }>('/creators/:id/content', async (request, reply) => {
    const creator = await getCreator(request.params.id);

    if (!creator) {
      return reply.code(404).send({ error: 'Creator not found' });
    }

    return { content: await listCreatorContent(request.params.id) };
  });

  server.post<{ Params: { id: string }; Body: { message?: string } }>(
    '/creators/:id/updates',
    async (request, reply) => {
      const creator = await getCreator(request.params.id);

      if (!creator) {
        return reply.code(404).send({ error: 'Creator not found' });
      }

      const message = request.body?.message?.trim() || `Update sent to ${creator.name}`;
      await createCreatorUpdate(request.params.id, message);
      return reply.code(201).send({ status: 'ok' });
    }
  );
}
