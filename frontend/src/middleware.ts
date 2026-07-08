import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil token dari Cookies
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Daftar halaman Auth
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  
  // Daftar halaman yang wajib login (Dashboard User & Mentor)
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/mentor') || pathname.startsWith('/logbook');

  // SKENARIO 1: Jika sudah login tapi mencoba buka halaman Login/Register
  if (isAuthPage && token) {
    // Tendang kembali ke dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // SKENARIO 2: Jika belum login tapi mencoba buka halaman terproteksi
  if (isProtectedRoute && !token) {
    // Tendang ke halaman Login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // SKENARIO 3: Aman, silakan lewat
  return NextResponse.next();
}

// Tentukan rute mana saja yang harus diawasi oleh satpam ini
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