import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import postgres from 'postgres';
import * as schema from './schema';

// Use PostgreSQL for production (Railway), SQLite for development
let db: any;

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  const connectionString = process.env.DATABASE_URL;
  const client = postgres(connectionString);
  db = drizzle(client, { schema });
} else {
  const client = createClient({
    url: 'file:local.db',
  });
  db = drizzleSqlite(client, { schema });
}

export { db };
export type DB = typeof db;