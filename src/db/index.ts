import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// For now, use SQLite for both development and production
// In production, Railway will use an in-memory database
const client = createClient({
  url: process.env.NODE_ENV === 'production' ? ':memory:' : 'file:local.db',
});

export const db = drizzle(client, { schema });
export type DB = typeof db;