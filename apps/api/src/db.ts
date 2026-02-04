/**
 * Postgres connection helper.
 */
import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is required to connect to Postgres');
    }
    pool = new Pool({ connectionString });
  }

  return pool;
}
