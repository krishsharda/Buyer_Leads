import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { buyers, users, buyerHistory } from '@/db/schema';
import { eq, desc, and, or, like, count, gte, lte } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

// Simple validation schema that matches database exactly
const createBuyerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  city: z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']),
  propertyType: z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']),
  bhk: z.enum(['1', '2', '3', '4', 'Studio']).optional().nullable(),
  purpose: z.enum(['Buy', 'Rent']),
  budgetMin: z.number().optional().nullable(),
  budgetMax: z.number().optional().nullable(),
  timeline: z.enum(['0-3m', '3-6m', '>6m', 'Exploring']),
  source: z.enum(['Website', 'Referral', 'Walk-in', 'Call', 'Other']),
  status: z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped']).default('New'),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const city = url.searchParams.get('city') || '';

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [eq(buyers.ownerId, session.user.id)];

    if (search) {
      conditions.push(
        or(
          like(buyers.fullName, `%${search}%`),
          like(buyers.phone, `%${search}%`),
          like(buyers.email, `%${search}%`)
        )!
      );
    }

    if (status) {
      conditions.push(eq(buyers.status, status as any));
    }

    if (city) {
      conditions.push(eq(buyers.city, city as any));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Get buyers
    const buyersList = await db
      .select()
      .from(buyers)
      .where(whereClause)
      .orderBy(desc(buyers.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(buyers)
      .where(whereClause);

    return NextResponse.json({
      buyers: buyersList,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching buyers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buyers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== BUYER CREATION START ===');
    
    // Check authentication
    const session = await auth();
    console.log('Session:', session?.user?.id ? 'Valid' : 'Invalid');
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    console.log('Raw request data:', JSON.stringify(body, null, 2));

    // Validate data
    const validatedData = createBuyerSchema.parse(body);
    console.log('Validated data:', JSON.stringify(validatedData, null, 2));

    // Prepare buyer data for database
    const buyerData = {
      id: createId(),
      fullName: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      city: validatedData.city,
      propertyType: validatedData.propertyType,
      bhk: validatedData.bhk,
      purpose: validatedData.purpose,
      budgetMin: validatedData.budgetMin,
      budgetMax: validatedData.budgetMax,
      timeline: validatedData.timeline,
      source: validatedData.source,
      status: validatedData.status || 'New',
      notes: validatedData.notes,
      tags: validatedData.tags || [],
      profileImage: null,
      documents: [],
      ownerId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Final buyer data for DB:', JSON.stringify(buyerData, null, 2));

    // Insert buyer
    const [newBuyer] = await db
      .insert(buyers)
      .values(buyerData)
      .returning();

    console.log('Successfully created buyer:', newBuyer.id);

    // Create history entry (optional - if this fails, don't fail the whole operation)
    try {
      await db.insert(buyerHistory).values({
        id: createId(),
        buyerId: newBuyer.id,
        changedBy: session.user.id,
        changedAt: new Date(),
        diff: {
          created: { old: null, new: validatedData }
        },
      });
      console.log('History entry created');
    } catch (historyError) {
      console.warn('Failed to create history entry:', historyError);
      // Don't fail the whole operation for history
    }

    console.log('=== BUYER CREATION SUCCESS ===');
    return NextResponse.json(newBuyer, { status: 201 });

  } catch (error) {
    console.error('=== BUYER CREATION FAILED ===');
    console.error('Error:', error);
    
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.issues);
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}