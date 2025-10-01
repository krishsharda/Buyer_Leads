import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    console.log('Test API called');
    
    const session = await auth();
    console.log('Session:', session);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized', session: null }, { status: 401 });
    }

    // Test database connection
    const userCount = await db.select().from(users);
    console.log('Users in database:', userCount);

    return NextResponse.json({ 
      success: true, 
      session: session, 
      userCount: userCount.length,
      message: 'Test successful' 
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { 
        error: 'Test failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}