import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Intercept any check-result requests and redirect to Student Portal
  if (pathname === '/check-result') {
    return NextResponse.redirect(new URL('/login?role=student', request.url));
  }

  // Protect role routes
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (pathname === '/admin' && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const isProtectedRoute =
    (pathname.startsWith('/admin') && pathname !== '/admin/login') ||
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/student');

  if (isProtectedRoute && !token) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/teacher/:path*', '/student/:path*', '/check-result'],
};
