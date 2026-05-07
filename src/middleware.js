import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('admin_auth');
    
    if (!authCookie || authCookie.value !== 'true') {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
