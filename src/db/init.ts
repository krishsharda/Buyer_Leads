import { db } from './index';
import { users, buyers } from './schema';
import { createId } from '@paralleldrive/cuid2';

let isInitialized = false;

export async function initializeDatabase() {
  if (isInitialized) return;
  
  try {
    console.log('🔧 Initializing database...');
    
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