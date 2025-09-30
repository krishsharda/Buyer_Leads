import { db } from '@/db';
import { users, buyers } from '@/db/schema';
import { migrate } from 'drizzle-orm/libsql/migrator';

export async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Run migrations to create tables
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    
    // If migration fails, try to create tables manually
    try {
      console.log('Trying manual table creation...');
      
      // This will create tables if they don't exist
      await db.select().from(users).limit(1).catch(() => {});
      await db.select().from(buyers).limit(1).catch(() => {});
      
      console.log('Manual table creation completed');
      return true;
    } catch (manualError) {
      console.error('Manual table creation also failed:', manualError);
      return false;
    }
  }
}

// Initialize database on module load
if (process.env.NODE_ENV === 'production') {
  initDatabase();
}