import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Use persistent SQLite database in both development and production
const client = createClient({
  url: process.env.DATABASE_URL || 'file:local.db',
});

export const db = drizzle(client, { schema });
export type DB = typeof db;