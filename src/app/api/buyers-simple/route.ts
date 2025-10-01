import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { buyers, type NewBuyer } from '@/db/schema';
import { createId } from '@paralleldrive/cuid2';

export async function POST(request: NextRequest) {
  try {
    console.log('Simple buyer creation started');
    
    // Get session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get request data
    const body = await request.json();
    console.log('Request body:', body);

    // Create buyer with minimal validation and proper types
    const buyerData: NewBuyer = {
      fullName: body.fullName || 'Test User',
      email: body.email || null,
      phone: body.phone || '1234567890',
      city: (body.city || 'Chandigarh') as 'Chandigarh' | 'Mohali' | 'Zirakpur' | 'Panchkula' | 'Other',
      propertyType: (body.propertyType || 'Apartment') as 'Apartment' | 'Villa' | 'Plot' | 'Office' | 'Retail',
      bhk: (body.bhk || '2') as '1' | '2' | '3' | '4' | 'Studio' | null,
      purpose: (body.purpose || 'Buy') as 'Buy' | 'Rent',
      budgetMin: body.budgetMin || null,
      budgetMax: body.budgetMax || null,
      timeline: (body.timeline || '3-6m') as '0-3m' | '3-6m' | '>6m' | 'Exploring',
      source: (body.source || 'Website') as 'Website' | 'Referral' | 'Walk-in' | 'Call' | 'Other',
      status: 'New' as 'New' | 'Qualified' | 'Contacted' | 'Visited' | 'Negotiation' | 'Converted' | 'Dropped',
      notes: body.notes || null,
      tags: [],
      profileImage: null,
      documents: [],
      ownerId: session.user.id,
    };

    console.log('Buyer data to insert:', buyerData);

    // Insert into database
    const [newBuyer] = await db
      .insert(buyers)
      .values(buyerData)
      .returning();

    console.log('Created buyer:', newBuyer);

    return NextResponse.json(newBuyer, { status: 201 });

  } catch (error) {
    console.error('Error in simple buyer creation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create buyer', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}