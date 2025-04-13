import { NextRequest, NextResponse } from 'next/server'

// Optional: protect specific routes
export function middleware(req: NextRequest) {
  // Example: you can add auth protection here
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apply middleware to everything except:
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
