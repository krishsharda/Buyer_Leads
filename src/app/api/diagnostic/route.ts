import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Basic health check called');
    return NextResponse.json({ 
      status: 'ok', 
      message: 'API is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== DIAGNOSTIC API ===');
    
    // Test 1: Can we receive a request?
    console.log('✓ Request received');
    
    // Test 2: Can we parse JSON?
    let body;
    try {
      body = await request.json();
      console.log('✓ JSON parsed:', body);
    } catch (e) {
      console.log('✗ JSON parse failed:', e);
      return NextResponse.json({ error: 'JSON parse failed', details: e instanceof Error ? e.message : 'Unknown' }, { status: 400 });
    }
    
    // Test 3: Can we import auth?
    let authModule;
    try {
      authModule = await import('@/lib/auth');
      console.log('✓ Auth module imported');
    } catch (e) {
      console.log('✗ Auth import failed:', e);
      return NextResponse.json({ error: 'Auth import failed', details: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
    }
    
    // Test 4: Can we get session?
    let session;
    try {
      session = await authModule.auth();
      console.log('✓ Session retrieved:', session ? 'Found' : 'Not found');
    } catch (e) {
      console.log('✗ Session retrieval failed:', e);
      return NextResponse.json({ error: 'Session retrieval failed', details: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
    }
    
    // Test 5: Can we import database?
    let dbModule;
    try {
      dbModule = await import('@/db');
      console.log('✓ Database module imported');
    } catch (e) {
      console.log('✗ Database import failed:', e);
      return NextResponse.json({ error: 'Database import failed', details: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
    }
    
    // Test 6: Can we query database?
    try {
      const { users } = await import('@/db/schema');
      const result = await dbModule.db.select().from(users).limit(1);
      console.log('✓ Database query successful, user count:', result.length);
    } catch (e) {
      console.log('✗ Database query failed:', e);
      return NextResponse.json({ error: 'Database query failed', details: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      tests: {
        request: '✓ Received',
        json: '✓ Parsed',
        auth: '✓ Imported',
        session: session ? '✓ Found' : '✗ Not found',
        database: '✓ Connected',
        query: '✓ Working'
      },
      message: 'All diagnostics passed'
    });
    
  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json({
      error: 'Diagnostic failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}