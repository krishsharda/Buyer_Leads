import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { buyers } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    console.log('=== MINIMAL TEST API CALLED ===');
    
    // Check auth
    const session = await auth();
    if (!session?.user?.id) {
      console.log('No session found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.log('Session OK, user ID:', session.user.id);

    // Get body (but ignore it for now)
    const body = await request.json();
    console.log('Received body:', body);

    // Create buyer with completely safe, hardcoded data
    const safeData = {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      city: 'Chandigarh' as const,
      propertyType: 'Apartment' as const,
      bhk: '2' as const,
      purpose: 'Buy' as const,
      budgetMin: 1000000,
      budgetMax: 2000000,
      timeline: '3-6m' as const,
      source: 'Website' as const,
      status: 'New' as const,
      notes: 'Test buyer created',
      tags: [],
      profileImage: null,
      documents: [],
      ownerId: session.user.id,
    };

    console.log('Attempting to create buyer with safe data:', safeData);

    const [newBuyer] = await db
      .insert(buyers) 
      .values(safeData)
      .returning();

    console.log('SUCCESS! Created buyer:', newBuyer);

    return NextResponse.json({
      success: true,
      buyer: newBuyer,
      message: 'Test buyer created successfully'
    });

  } catch (error) {
    console.error('MINIMAL API ERROR:', error);
    return NextResponse.json({
      error: 'Minimal API failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}