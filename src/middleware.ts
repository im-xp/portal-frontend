import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Map of domains to popup slugs
const domainToPopup: Record<string, string> = {
  'ripple.egypt-eclipse.com': 'ripple-on-the-nile',
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const popupSlug = domainToPopup[host]
  
  // If this domain has a popup mapping and the URL doesn't already have the popup param
  if (popupSlug && !request.nextUrl.searchParams.has('popup')) {
    const url = request.nextUrl.clone()
    url.searchParams.set('popup', popupSlug)
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}

// Only run middleware on these paths
export const config = {
  matcher: [
    '/',
    '/auth',
    '/portal/:path*',
  ],
}
