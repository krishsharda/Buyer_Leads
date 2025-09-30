import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(
      token, 
      process.env.NEXTAUTH_SECRET || 'fallback-secret'
    ) as any;
    
    return {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      isAdmin: decoded.isAdmin || false
    };
  } catch (error) {
    console.error('Auth token verification failed:', error);
    return null;
  }
}

export function createAuthToken(user: User): string {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      name: user.name,
      isAdmin: user.isAdmin 
    },
    process.env.NEXTAUTH_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );
}