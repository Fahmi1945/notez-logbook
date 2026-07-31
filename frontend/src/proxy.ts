import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface TokenPayload {
  role?: 'user' | 'mentor';
  [key: string]: unknown;
}

function decodeJwtPayload(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/mentor') ||
    pathname.startsWith('/logbook') ||
    pathname.startsWith('/profile');

  const payload = token ? decodeJwtPayload(token) : null;
  const isValidSession = !!payload;
  const role = payload?.role;

  // Sudah login (token valid) tapi buka /login atau /register -> lempar ke dashboard
  if (isAuthPage && isValidSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Belum login buka rute terproteksi -> lempar ke /login
  if (isProtectedRoute && !isValidSession) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Bersihkan cookie yang sudah tidak valid biar tidak nyangkut di browser
    response.cookies.delete('token');
    return response;
  }

  // Role tidak cocok dengan prefix rute -> lempar ke dashboard
  if (isValidSession && role) {
    const isMentorRoute = pathname.startsWith('/mentor');
    const isUserOnlyRoute = pathname.startsWith('/logbook');

    if (isMentorRoute && role !== 'mentor') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (isUserOnlyRoute && role !== 'user') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
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
    '/profile/:path*',
  ],
};