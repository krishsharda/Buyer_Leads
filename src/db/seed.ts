import { db } from './index';
import { users, buyers, buyerHistory } from './schema';
import { createId } from '@paralleldrive/cuid2';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create demo users
    const demoUsers = await db.insert(users).values([
      {
        id: createId(),
        email: 'admin@example.com',
        name: 'Admin User',
        isAdmin: true,
      },
      {
        id: createId(),
        email: 'agent@example.com', 
        name: 'Sales Agent',
        isAdmin: false,
      },
    ]).returning();

    console.log('✅ Created demo users:', demoUsers.length);

    // Create sample buyers
    const sampleBuyers = await db.insert(buyers).values([
      {
        id: createId(),
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: '2',
        purpose: 'Buy',
        budgetMin: 2500000,
        budgetMax: 3500000,
        timeline: '3-6m',
        source: 'Website',
        status: 'New',
        notes: 'Looking for a well-ventilated apartment',
        tags: ['urgent', 'first-time-buyer'],
        ownerId: demoUsers[1].id,
      },
      {
        id: createId(),
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543211',
        city: 'Mohali',
        propertyType: 'Villa',
        bhk: '3',
        purpose: 'Buy',
        budgetMin: 5000000,
        budgetMax: 7000000,
        timeline: '0-3m',
        source: 'Referral',
        status: 'Qualified',
        notes: 'Prefers gated community',
        tags: ['premium', 'ready-to-buy'],
        ownerId: demoUsers[1].id,
      },
      {
        id: createId(),
        fullName: 'Amit Kumar',
        phone: '9876543212',
        city: 'Zirakpur',
        propertyType: 'Plot',
        purpose: 'Buy',
        budgetMin: 1500000,
        budgetMax: 2000000,
        timeline: '>6m',
        source: 'Walk-in',
        status: 'Contacted',
        notes: 'Planning to build house in 2 years',
        tags: ['future-construction'],
        ownerId: demoUsers[0].id,
      },
    ]).returning();

    console.log('✅ Created sample buyers:', sampleBuyers.length);

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seed function
seed();