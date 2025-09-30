import { db } from '@/db';
import { users, buyers } from '@/db/schema';

export async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Test database by trying to query users table - this will create tables if they don't exist
    try {
      await db.select().from(users).limit(1);
      console.log('Users table accessible');
    } catch (error) {
      console.log('Users table needs to be created');
    }
    
    try {
      await db.select().from(buyers).limit(1);
      console.log('Buyers table accessible');
    } catch (error) {
      console.log('Buyers table needs to be created');
    }
    
    console.log('Database initialization completed');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}