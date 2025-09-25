import { db } from './index';
import { users, buyers } from './schema';
import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';

let isInitialized = false;

export async function initializeDatabase() {
  if (isInitialized) return;
  
  try {
    console.log('🔧 Initializing database...');
    
    // For production in-memory database, create tables manually since migrations don't work
    if (process.env.NODE_ENV === 'production') {
      try {
        await db.run(sql`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            is_admin INTEGER DEFAULT 0 NOT NULL,
            created_at INTEGER DEFAULT (unixepoch()) NOT NULL
          )
        `);
        
        await db.run(sql`
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
            created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
            updated_at INTEGER DEFAULT (unixepoch()) NOT NULL
          )
        `);
      } catch (tableError) {
        console.log('Tables might already exist, continuing...');
      }
    }
    
    // Create demo users for production first
    const demoUser = await db.insert(users).values([
      {
        id: 'demo-admin-id',
        email: 'admin@example.com',
        name: 'Admin User',
        isAdmin: true,
      },
      {
        id: 'demo-user-id',
        email: 'demo@example.com', 
        name: 'Demo User',
        isAdmin: false,
      }
    ]).onConflictDoNothing().returning();

    // Create a demo buyer
    await db.insert(buyers).values([
      {
        id: createId(),
        fullName: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+91-9876543210',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: '2',
        purpose: 'Buy',
        budgetMin: 4000000,
        budgetMax: 6000000,
        timeline: '3-6m',
        source: 'Walk-in',
        status: 'New',
        notes: 'Looking for a modern apartment in Chandigarh. Flexible on move-in date.',
        ownerId: 'demo-admin-id',
      }
    ]).onConflictDoNothing();

    isInitialized = true;
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    // Don't throw error to prevent app from crashing
  }
}