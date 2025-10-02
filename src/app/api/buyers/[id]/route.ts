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

    // STATIC SOLUTION: Get buyer from in-memory store
    const { getBuyerById } = await import('@/lib/buyers-store');
    const buyer = getBuyerById(id);

    if (!buyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Format buyer to match expected structure
    const formattedBuyer = {
      id: buyer.id,
      fullName: buyer.fullName,
      email: buyer.email,
      phone: buyer.phone,
      city: buyer.city,
      propertyType: buyer.propertyType,
      bhk: buyer.bhk,
      purpose: buyer.purpose,
      budgetMin: buyer.budgetMin,
      budgetMax: buyer.budgetMax,
      timeline: buyer.timeline,
      source: buyer.source,
      status: buyer.status,
      notes: buyer.notes,
      tags: buyer.tags,
      createdAt: buyer.createdAt,
      updatedAt: buyer.updatedAt,
      owner: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    };

    return NextResponse.json(formattedBuyer);
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

    // STATIC SOLUTION: Update buyer in in-memory store
    const { getBuyerById, updateBuyer } = await import('@/lib/buyers-store');
    const existingBuyer = getBuyerById(id);

    if (!existingBuyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Check ownership (user can only edit their own buyers unless admin)
    if (existingBuyer.ownerId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the buyer in the store
    const updatedBuyer = updateBuyer(id, {
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
      status: validatedData.status,
      notes: validatedData.notes,
      tags: validatedData.tags || [],
    });

    // Format response to match expected structure
    const response = {
      id: updatedBuyer.id,
      fullName: updatedBuyer.fullName,
      email: updatedBuyer.email,
      phone: updatedBuyer.phone,
      city: updatedBuyer.city,
      propertyType: updatedBuyer.propertyType,
      bhk: updatedBuyer.bhk,
      purpose: updatedBuyer.purpose,
      budgetMin: updatedBuyer.budgetMin,
      budgetMax: updatedBuyer.budgetMax,
      timeline: updatedBuyer.timeline,
      source: updatedBuyer.source,
      status: updatedBuyer.status,
      notes: updatedBuyer.notes,
      tags: updatedBuyer.tags,
      createdAt: updatedBuyer.createdAt,
      updatedAt: updatedBuyer.updatedAt,
      owner: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    };

    return NextResponse.json(response);

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

    // STATIC SOLUTION: Delete buyer from in-memory store
    const { getBuyerById, deleteBuyer } = await import('@/lib/buyers-store');
    const existingBuyer = getBuyerById(id);

    if (!existingBuyer) {
      return NextResponse.json({ error: 'Buyer not found' }, { status: 404 });
    }

    // Check ownership (user can only delete their own buyers unless admin)
    if (existingBuyer.ownerId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the buyer from store
    const deleted = deleteBuyer(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete buyer' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Buyer deleted successfully' });

  } catch (error) {
    console.error('Error deleting buyer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}