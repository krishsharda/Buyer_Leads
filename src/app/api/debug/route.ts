import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Test endpoint working' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received data:', body);
    
    // Just return the data back - no database operations
    return NextResponse.json({ 
      success: true, 
      received: body,
      message: 'POST endpoint working' 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: 'Failed', 
      details: error instanceof Error ? error.message : 'Unknown' 
    }, { status: 500 });
  }
}