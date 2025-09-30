import { db } from './index';
import { sql } from 'drizzle-orm';

let isInitialized = false;

export async function initializeDatabase() {
  if (isInitialized) return;
  
  try {
    console.log('🔧 Initializing database...');
    
    // Create tables for production PostgreSQL
    if (process.env.NODE_ENV === 'production') {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          is_admin INTEGER DEFAULT 0 NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
      `);
      
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS buyers (
          id TEXT PRIMARY KEY,
          full_name TEXT NOT NULL,
          email TEXT,
          phone TEXT NOT NULL,
          city TEXT NOT NULL,
          property_type TEXT NOT NULL,
          bhk TEXT,
          purpose TEXT NOT NULL,
          budget_min INTEGER,
          budget_max INTEGER,
          timeline TEXT NOT NULL,
          source TEXT NOT NULL,
          status TEXT DEFAULT 'New' NOT NULL,
          notes TEXT,
          tags TEXT DEFAULT '[]',
          owner_id TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
      `);
    }

    isInitialized = true;
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    // Don't throw to prevent app crash
  }
}