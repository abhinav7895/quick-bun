import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })

  const isAuthenticated = !!token
  const isAuthPage = request.nextUrl.pathname.startsWith('/signin')

  if (isAuthPage) {
    if (isAuthenticated) {
      // Redirect to home if user is already authenticated
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Allow access to signin page if not authenticated
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    // Redirect to signin page if user is not authenticated
    const signInUrl = new URL('/signin', request.url)
    return NextResponse.redirect(signInUrl)
  }

  // Allow access to other routes if authenticated
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}