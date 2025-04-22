import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Optional: protect specific routes
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  
  // Check for session token from NextAuth.js
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  
  // Get custom token from cookies (for backward compatibility)
  const customToken = req.cookies.get('token')?.value
  
  // User is authenticated if either token exists
  const isAuthenticated = !!token || !!customToken
  
  // Protect dashboard and any other protected routes
  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    const url = new URL('/signin', req.url)
    return NextResponse.redirect(url)
  }
  
  // If user is already logged in, redirect from auth pages to dashboard
  if ((pathname === '/signin' || pathname === '/signup') && isAuthenticated) {
    const url = new URL('/dashboard', req.url)
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/signin',
    '/signup',
  ],
}
