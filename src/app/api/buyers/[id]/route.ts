import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { buyers, buyerHistory, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { updateBuyerSchema } from '@/lib/validations';
import { z } from 'zod';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const [buyer] = await db
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
      .where(eq(buyers.id, id))
      .limit(1);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    return NextResponse.json(buyer);
  } catch (error) {
    console.error('Error fetching buyer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    // Validate the input
    const validatedData = updateBuyerSchema.parse(body);

    // Check if the buyer exists and get current data
    const [existingBuyer] = await db
      .select()
      .from(buyers)
      .where(eq(buyers.id, id))
      .limit(1);

    if (!existingBuyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Check ownership (user can only edit their own buyers unless admin)
    if (existingBuyer.ownerId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check for concurrency conflicts
    if (validatedData.updatedAt && existingBuyer.updatedAt.getTime() / 1000 > validatedData.updatedAt) {
      return NextResponse.json(
        { error: 'Record has been modified by another user. Please refresh and try again.' },
        { status: 409 }
      );
    }

    // Calculate the changes for history tracking
    const changes: Record<string, { old: any; new: any }> = {};
    const fieldsToTrack = [
      'fullName', 'email', 'phone', 'city', 'propertyType', 'bhk',
      'purpose', 'budgetMin', 'budgetMax', 'timeline', 'source', 'status', 'notes'
    ];

    fieldsToTrack.forEach(field => {
      const oldValue = (existingBuyer as any)[field];
      const newValue = (validatedData as any)[field];
      
      if (oldValue !== newValue) {
        changes[field] = { old: oldValue, new: newValue };
      }
    });

    // Check if tags changed
    const oldTags = existingBuyer.tags || [];
    const newTags = validatedData.tags || [];
    if (JSON.stringify(oldTags.sort()) !== JSON.stringify(newTags.sort())) {
      changes.tags = { old: oldTags, new: newTags };
    }

    const currentTime = Math.floor(Date.now() / 1000);

    // Update the buyer
    const [updatedBuyer] = await db
      .update(buyers)
      .set({
        fullName: validatedData.fullName,
        email: validatedData.email || null,
        phone: validatedData.phone,
        city: validatedData.city,
        propertyType: validatedData.propertyType,
        bhk: validatedData.bhk || null,
        purpose: validatedData.purpose,
        budgetMin: validatedData.budgetMin || null,
        budgetMax: validatedData.budgetMax || null,
        timeline: validatedData.timeline,
        source: validatedData.source,
        status: validatedData.status,
        notes: validatedData.notes || null,
        tags: validatedData.tags || [],
        updatedAt: new Date(currentTime),
      })
      .where(eq(buyers.id, id))
      .returning();

    // Log the changes if there are any
    if (Object.keys(changes).length > 0) {
      await db.insert(buyerHistory).values({
        buyerId: id,
        changedBy: session.user.id,
        changedAt: new Date(),
        diff: changes,
      });
    }

    return NextResponse.json(updatedBuyer);

  } catch (error) {
    console.error('Error updating buyer:', error);
    
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

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Check if the buyer exists
    const [existingBuyer] = await db
      .select()
      .from(buyers)
      .where(eq(buyers.id, id))
      .limit(1);

    if (!existingBuyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Check ownership (user can only delete their own buyers unless admin)
    if (existingBuyer.ownerId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete buyer history first (due to foreign key constraints)
    await db.delete(buyerHistory).where(eq(buyerHistory.buyerId, id));

    // Delete the buyer
    await db.delete(buyers).where(eq(buyers.id, id));

    return NextResponse.json({ message: 'Buyer deleted successfully' });

  } catch (error) {
    console.error('Error deleting buyer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}