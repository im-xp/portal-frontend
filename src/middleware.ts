import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Map of domains to popup slugs
const domainToPopup: Record<string, string> = {
  'ripple.egypt-eclipse.com': 'ripple-on-the-nile',
}

export function middleware(request: NextRequest) {
  // On Vercel, use x-forwarded-host for the original domain
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
  const popupSlug = domainToPopup[host]
  
  if (popupSlug) {
    // Set cookie so client-side JS can read the popup slug
    const response = NextResponse.next()
    response.cookies.set('popup_slug', popupSlug, {
      path: '/',
      sameSite: 'lax',
      secure: true,
    })
    return response
  }
  
  return NextResponse.next()
}

// Only run middleware on these paths
export const config = {
  matcher: [
    '/',
    '/auth',
    '/portal/:path*',
    '/api/debug-headers',  // Temporary for debugging
  ],
}
