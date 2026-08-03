import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Pastikan kamu sudah menginstal jose: npm install jose
import { jwtVerify } from 'jose'; 

interface TokenPayload {
  role?: 'user' | 'mentor';
  [key: string]: unknown;
}

// Rahasia untuk memverifikasi token (Bisa ambil dari .env)
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia-super-kuat';

// Fungsi terpisah untuk memverifikasi token menggunakan jose (Aman untuk Next.js Edge Runtime)
async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as TokenPayload;
  } catch (error) {
    // Token invalid, expired, atau signature tidak cocok
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

  // Verifikasi token (jika ada)
  const payload = token ? await verifyToken(token) : null;
  const isValidSession = !!payload;

  // 1. Sudah login tapi membuka halaman Auth (/login, /register) -> Lempar ke dashboard
  if (isAuthPage && isValidSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Belum login / token invalid tapi membuka rute terproteksi -> Lempar ke /login
  if (isProtectedRoute && !isValidSession) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    // Bersihkan cookie yang sudah tidak valid biar tidak nyangkut di browser
    response.cookies.delete('token');
    return response;
  }

  // 3. Pengecekan Role (Role-Based Access Control)
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

  // Jika semua lolos, lanjutkan perjalanan!
  return NextResponse.next();
}

// Konfigurasi wajib berada di luar (top-level)
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