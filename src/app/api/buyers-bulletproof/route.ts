import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { buyers } from '@/db/schema';
import { createId } from '@paralleldrive/cuid2';

// Helper function to clean budget values
function cleanBudgetValue(value: any): number | null {
  if (!value) return null;
  
  // Convert to string and remove currency symbols, commas, spaces
  const cleanValue = String(value)
    .replace(/[₹$,\s]/g, '')
    .replace(/[^\d.]/g, '');
  
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? null : numValue;
}

// Helper function to ensure valid enum values
function validateEnumValue<T extends readonly string[]>(value: any, validValues: T, defaultValue: T[number]): T[number] {
  return validValues.includes(value) ? value : defaultValue;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== BULLETPROOF BUYER CREATION ===');
    
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Raw form data:', JSON.stringify(body, null, 2));

    // Clean and validate all data with bulletproof handling
    const cleanData = {
      fullName: String(body.fullName || 'Unknown').trim() || 'Unknown User',
      email: body.email ? String(body.email).trim() : null,
      phone: String(body.phone || '0000000000').replace(/[^\d]/g, '') || '0000000000',
      city: validateEnumValue(body.city, ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'], 'Other'),
      propertyType: validateEnumValue(body.propertyType, ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'], 'Apartment'),
      bhk: body.bhk ? validateEnumValue(body.bhk, ['1', '2', '3', '4', 'Studio'], '2') : null,
      purpose: validateEnumValue(body.purpose, ['Buy', 'Rent'], 'Buy'),
      budgetMin: cleanBudgetValue(body.budgetMin),
      budgetMax: cleanBudgetValue(body.budgetMax),
      timeline: validateEnumValue(body.timeline, ['0-3m', '3-6m', '>6m', 'Exploring'], '3-6m'),
      source: validateEnumValue(body.source, ['Website', 'Referral', 'Walk-in', 'Call', 'Other'], 'Website'),
      status: validateEnumValue(body.status, ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'], 'New'),
      notes: body.notes ? String(body.notes).trim() : null,
    };

    console.log('Cleaned data:', JSON.stringify(cleanData, null, 2));

    // Create buyer with explicit field mapping
    const buyerData = {
      id: createId(),
      fullName: cleanData.fullName,
      email: cleanData.email,
      phone: cleanData.phone,
      city: cleanData.city,
      propertyType: cleanData.propertyType,
      bhk: cleanData.bhk,
      purpose: cleanData.purpose,
      budgetMin: cleanData.budgetMin,
      budgetMax: cleanData.budgetMax,
      timeline: cleanData.timeline,
      source: cleanData.source,
      status: cleanData.status,
      notes: cleanData.notes,
      tags: [], // Always empty array
      profileImage: null,
      documents: [],
      ownerId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Database insert data:', JSON.stringify(buyerData, null, 2));

    const [newBuyer] = await db
      .insert(buyers)
      .values(buyerData)
      .returning();

    console.log('SUCCESS: Created buyer with ID:', newBuyer.id);

    return NextResponse.json({
      success: true,
      buyer: newBuyer,
      message: 'Buyer created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('FAILED: Buyer creation error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json({
      error: 'Failed to create buyer',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : 'Unknown',
      }
    }, { status: 500 });
  }
}