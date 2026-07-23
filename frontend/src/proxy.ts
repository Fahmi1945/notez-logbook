import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

interface TokenPayload {
  role?: 'user' | 'mentor';
  [key: string]: unknown;
}

async function verifyToken(token: string): Promise<TokenPayload | null> {
  if (!JWT_SECRET) {
    console.error('[middleware] JWT_SECRET belum diset di environment variables.');
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch {
    // Token invalid, expired, atau signature tidak cocok
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/mentor') ||
    pathname.startsWith('/logbook') ||
    pathname.startsWith('/profile');

  const payload = token ? await verifyToken(token) : null;
  const isValidSession = !!payload;

  // Sudah login (token valid) tapi buka /login atau /register -> lempar ke dashboard
  if (isAuthPage && isValidSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Belum login, atau token invalid/kedaluwarsa, buka rute terproteksi -> lempar ke /login
  if (isProtectedRoute && !isValidSession) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Bersihkan cookie token yang sudah tidak valid biar tidak nyangkut di browser
    response.cookies.delete('token');
    return response;
  }

  // Role tidak cocok dengan prefix rute -> lempar ke dashboard
  if (isValidSession && payload) {
    const role = payload.role;
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