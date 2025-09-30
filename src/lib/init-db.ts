import { createClient } from '@libsql/client';

export async function initDatabase() {
  try {
    console.log('Initializing database with direct SQL...');
    
    const client = createClient({
      url: process.env.DATABASE_URL || 'file:./sqlite.db',
    });
    
    // Create users table directly with SQL
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        isAdmin INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create buyers table directly with SQL  
    await client.execute(`
      CREATE TABLE IF NOT EXISTS buyers (
        id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        city TEXT NOT NULL,
        propertyType TEXT NOT NULL,
        bhk TEXT NOT NULL,
        purpose TEXT NOT NULL,
        budgetMin INTEGER NOT NULL,
        budgetMax INTEGER NOT NULL,
        timeline TEXT NOT NULL,
        source TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        notes TEXT,
        userId TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
    
    console.log('Database tables created successfully');
    
    // Test database by trying to query users table
    const result = await client.execute('SELECT COUNT(*) as count FROM users');
    console.log('Database test successful, user count:', result.rows[0]);
    
    client.close();
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

// Initialize database on module load
if (process.env.NODE_ENV === 'production') {
  initDatabase();
}