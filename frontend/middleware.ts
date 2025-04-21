import { NextRequest, NextResponse } from 'next/server'

// Optional: protect specific routes
export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;
  
  // Protect dashboard and any other protected routes
  if (pathname.startsWith('/dashboard') && !token) {
    const url = new URL('/signin', req.url);
    return NextResponse.redirect(url);
  }
  
  // If user is already logged in, redirect from auth pages to dashboard
  if ((pathname === '/signin' || pathname === '/signup') && token) {
    const url = new URL('/dashboard', req.url);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/signin',
    '/signup',
  ],
}
