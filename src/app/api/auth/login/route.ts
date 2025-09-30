import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { initDatabase } from '@/lib/init-db';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    console.log('=== CUSTOM AUTH LOGIN START ===');
    
    const body = await request.json();
    const { email } = body;
    
    console.log('Login attempt for email:', email);
    
    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email format');
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    
    // Initialize database
    console.log('🔄 Initializing database...');
    await initDatabase();
    
    // Find or create user
    let user;
    try {
      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      user = result[0];
      console.log('🔍 Found existing user:', !!user);
    } catch (dbError) {
      console.error('❌ Database query failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    if (!user) {
      // Create new user
      console.log('👤 Creating new user...');
      try {
        const [newUser] = await db
          .insert(users)
          .values({
            email,
            name: email.split('@')[0],
            isAdmin: false,
          })
          .returning();
        
        user = newUser;
        console.log('✅ Created new user:', user.id);
      } catch (insertError) {
        console.error('❌ User creation failed:', insertError);
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        );
      }
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        name: user.name,
        isAdmin: user.isAdmin 
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );
    
    console.log('✅ Login successful for user:', user.id);
    console.log('=== CUSTOM AUTH LOGIN END ===');
    
    // Set cookie and return success
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      }
    });
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    
    return response;
    
  } catch (error) {
    console.error('❌ Custom auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}