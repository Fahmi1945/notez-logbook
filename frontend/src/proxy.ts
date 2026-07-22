import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/mentor') || pathname.startsWith('/logbook');

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login', 
    '/register', 
    '/dashboard/:path*', 
    '/logbook/:path*', 
    '/mentor/:path*', 
    '/profile/:path*'
  ],
};