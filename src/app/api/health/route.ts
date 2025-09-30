import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function GET() {
  try {
    // Test database connection
    let dbStatus = 'disconnected';
    let userCount = 0;
    try {
      const result = await db.select().from(users).limit(1);
      dbStatus = 'connected';
      userCount = result.length;
    } catch (dbError) {
      console.error('Database test failed:', dbError);
      dbStatus = 'error';
    }

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        status: dbStatus,
        userCount,
        url: process.env.DATABASE_URL || 'file:local.db'
      },
      variables: {
        NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not-set',
        RAILWAY_PUBLIC_DOMAIN: process.env.RAILWAY_PUBLIC_DOMAIN || 'not-set',
        DATABASE_URL: !!process.env.DATABASE_URL,
      },
      railway: {
        // Railway automatically provides these
        PORT: process.env.PORT || 'not-set',
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT || 'not-set',
      }
    };

    return NextResponse.json(health);
  } catch (error) {
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