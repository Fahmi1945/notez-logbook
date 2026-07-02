import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ambil token dari cookie (nama sesuai BSD)
  const token = request.cookies.get('notez_session')?.value;

  // 1. Jika mencoba akses halaman protected tanpa token, lempar ke /login
  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/logbook') || pathname.startsWith('/mentor'))) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname); // Simpan URL asal untuk redirect setelah login
    return NextResponse.redirect(url);
  }

  // 2. Jika sudah punya token tapi mencoba akses /login atau /register, lempar ke /dashboard
  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Tentukan route mana saja yang akan diawasi oleh middleware ini
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/logbook/:path*',
    '/mentor/:path*',
    '/login',
    '/register'
  ],
};