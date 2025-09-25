import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { initializeDatabase } from './init';

const client = createClient({
  url: process.env.NODE_ENV === 'production' ? ':memory:' : 'file:local.db',
});

export const db = drizzle(client, { schema });

// Initialize database for production
if (process.env.NODE_ENV === 'production') {
  initializeDatabase().catch(console.error);
}

export type DB = typeof db;