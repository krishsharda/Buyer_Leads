import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Debug the buyers store
    const { getAllBuyers } = await import('@/lib/buyers-store');
    const allBuyers = getAllBuyers();
    
    return NextResponse.json({
      count: allBuyers.length,
      buyers: allBuyers.map(b => ({ id: b.id, fullName: b.fullName })),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}