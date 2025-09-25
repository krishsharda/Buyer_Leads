import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  // Public routes
  const publicRoutes = ['/auth/signin', '/'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // If accessing auth pages while logged in, redirect to buyers
  if (session && pathname.startsWith('/auth/')) {
    return NextResponse.redirect(new URL('/buyers', request.url));
  }

  // If accessing protected routes without session, redirect to signin
  if (!session && !isPublicRoute) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};