import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { buyers, users, buyerHistory } from '@/db/schema';
import { eq, and, or, like, desc, asc, count, isNull, gte, lte } from 'drizzle-orm';
import { searchFiltersSchema, createBuyerSchema } from '@/lib/validations';
import { z } from 'zod';
import { initDatabase } from '@/lib/init-db';

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

export async function GET(request: NextRequest) {
  try {
    // Initialize database if in production
    if (process.env.NODE_ENV === 'production') {
      await initDatabase();
    }
    
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    // Validate and parse filters
    const filters = searchFiltersSchema.parse(params);

    // Build WHERE conditions
    const conditions = [];

    // Search across name, phone, and email
    if (filters.search) {
      const searchTerm = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          like(buyers.fullName, searchTerm),
          like(buyers.phone, searchTerm),
          like(buyers.email, searchTerm)
        )
      );
    }

    // Apply individual filters
    if (filters.city) {
      conditions.push(eq(buyers.city, filters.city));
    }
    
    if (filters.propertyType) {
      conditions.push(eq(buyers.propertyType, filters.propertyType));
    }
    
    if (filters.status) {
      conditions.push(eq(buyers.status, filters.status));
    }
    
    if (filters.timeline) {
      conditions.push(eq(buyers.timeline, filters.timeline));
    }
    
    if (filters.purpose) {
      conditions.push(eq(buyers.purpose, filters.purpose));
    }
    
    if (filters.bhk) {
      conditions.push(eq(buyers.bhk, filters.bhk));
    }

    // Budget range filters
    if (filters.budgetMin) {
      conditions.push(
        or(
          isNull(buyers.budgetMax),
          gte(buyers.budgetMax, filters.budgetMin)
        )
      );
    }

    if (filters.budgetMax) {
      conditions.push(
        or(
          isNull(buyers.budgetMin),
          lte(buyers.budgetMin, filters.budgetMax)
        )
      );
    }

    // Get total count for pagination
    const countResult = await db
      .select({ count: count() })
      .from(buyers)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalCount = countResult[0].count;

    // Build the main query with sorting and pagination
    const orderByFn = filters.sortOrder === 'asc' ? asc : desc;
    let orderByColumn;
    
    switch (filters.sortBy) {
      case 'fullName':
        orderByColumn = buyers.fullName;
        break;
      case 'createdAt':
        orderByColumn = buyers.createdAt;
        break;
      case 'updatedAt':
      default:
        orderByColumn = buyers.updatedAt;
        break;
    }

    const offset = (filters.page - 1) * filters.pageSize;

    // Execute the query
    const results = await db
      .select({
        id: buyers.id,
        fullName: buyers.fullName,
        email: buyers.email,
        phone: buyers.phone,
        city: buyers.city,
        propertyType: buyers.propertyType,
        bhk: buyers.bhk,
        purpose: buyers.purpose,
        budgetMin: buyers.budgetMin,
        budgetMax: buyers.budgetMax,
        timeline: buyers.timeline,
        source: buyers.source,
        status: buyers.status,
        notes: buyers.notes,
        tags: buyers.tags,
        createdAt: buyers.createdAt,
        updatedAt: buyers.updatedAt,
        owner: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(buyers)
      .leftJoin(users, eq(buyers.ownerId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByFn(orderByColumn))
      .limit(filters.pageSize)
      .offset(offset);

    const totalPages = Math.ceil(totalCount / filters.pageSize);

    return NextResponse.json({
      buyers: results,
      totalCount,
      currentPage: filters.page,
      totalPages,
      filters,
    });

  } catch (error) {
    console.error('Error fetching buyers:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/buyers called');
    
    // Initialize database if in production
    if (process.env.NODE_ENV === 'production') {
      console.log('Initializing database for production...');
      await initDatabase();
    }
    
    console.log('Getting session...');
    const session = await auth();
    console.log('Session result:', session);
    
    if (!session || !session.user || !session.user.id) {
      console.log('Session validation failed:', session);
      return NextResponse.json({ error: 'Unauthorized - No valid session' }, { status: 401 });
    }

    console.log('Reading request body...');
    const body = await request.json();
    console.log('Received buyer data:', JSON.stringify(body, null, 2));
    
    // Clean budget values before validation
    const cleanBody = {
      ...body,
      budgetMin: cleanBudgetValue(body.budgetMin),
      budgetMax: cleanBudgetValue(body.budgetMax),
    };
    console.log('Cleaned buyer data:', JSON.stringify(cleanBody, null, 2));
    
    // Validate the buyer data
    console.log('Validating buyer data...');
    const validatedData = createBuyerSchema.parse(cleanBody);
    console.log('Validated buyer data:', JSON.stringify(validatedData, null, 2));

    // Prepare buyer data for insertion
    const buyerData = {
      ...validatedData,
      ownerId: session.user.id,
      status: validatedData.status || 'New',
      tags: validatedData.tags || [],
    };
    console.log('Buyer data for insertion:', JSON.stringify(buyerData, null, 2));

    // Create the buyer
    console.log('Inserting buyer into database...');
    const [newBuyer] = await db
      .insert(buyers)
      .values(buyerData)
      .returning();

    console.log('Created buyer:', JSON.stringify(newBuyer, null, 2));

    // Log the creation in buyer history
    console.log('Creating buyer history entry...');
    await db.insert(buyerHistory).values({
      buyerId: newBuyer.id,
      changedBy: session.user.id,
      diff: {
        created: { old: null, new: validatedData }
      },
    });

    console.log('Buyer creation completed successfully');
    return NextResponse.json(newBuyer, { status: 201 });

  } catch (error) {
    console.error('Error creating buyer:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.issues);
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}