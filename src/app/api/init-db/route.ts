import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/init-db';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function GET() {
  try {
    console.log('Testing database initialization...');
    
    // Initialize database
    const initResult = await initDatabase();
    if (!initResult) {
      throw new Error('Database initialization failed');
    }
    
    // Test database connection
    let testResult;
    try {
      const result = await db.select().from(users).limit(1);
      testResult = { success: true, userCount: result.length };
    } catch (dbError) {
      console.error('Database test query failed:', dbError);
      testResult = { success: false, error: dbError instanceof Error ? dbError.message : 'Unknown database error' };
    }
    
    return NextResponse.json({
      status: 'ok',
      message: 'Database initialization tested',
      initialization: initResult,
      databaseTest: testResult,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database init test failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}