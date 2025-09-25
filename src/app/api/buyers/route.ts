import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { buyers, users } from '@/db/schema';
import { eq, and, or, like, desc, asc, count, isNull, gte, lte } from 'drizzle-orm';
import { searchFiltersSchema } from '@/lib/validations';
import { z } from 'zod';
import { initializeDatabase } from '@/db/init';

export async function GET(request: NextRequest) {
  try {
    // Initialize database if in production
    if (process.env.NODE_ENV === 'production') {
      await initializeDatabase();
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
    // Initialize database if in production
    if (process.env.NODE_ENV === 'production') {
      await initializeDatabase();
    }
    
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate the buyer data
    const { createBuyerSchema } = await import('@/lib/validations');
    const validatedData = createBuyerSchema.parse(body);

    // Create the buyer
    const [newBuyer] = await db
      .insert(buyers)
      .values({
        ...validatedData,
        ownerId: session.user.id,
        status: validatedData.status || 'New',
        tags: validatedData.tags || [],
      })
      .returning();

    // Log the creation in buyer history
    const { buyerHistory } = await import('@/db/schema');
    await db.insert(buyerHistory).values({
      buyerId: newBuyer.id,
      changedBy: session.user.id,
      diff: {
        created: { old: null, new: validatedData }
      },
    });

    return NextResponse.json(newBuyer, { status: 201 });

  } catch (error) {
    console.error('Error creating buyer:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}