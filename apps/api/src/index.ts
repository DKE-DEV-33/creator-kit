/**
 * CreatorKit API entrypoint.
 *
 * This file is intentionally small so the server can be constructed
 * and tested in isolation from the process startup.
 */
import { buildServer } from './server.js';

const server = await buildServer();

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? '0.0.0.0';

try {
  await server.listen({ port, host });
  server.log.info(`CreatorKit API listening on http://${host}:${port}`);
} catch (error) {
  server.log.error({ error }, 'Failed to start server');
  process.exit(1);
}
