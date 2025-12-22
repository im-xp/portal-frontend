import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Map of domains to popup slugs
const domainToPopup: Record<string, string> = {
  'ripple.egypt-eclipse.com': 'ripple-on-the-nile',
}

export function middleware(request: NextRequest) {
  // Check multiple host headers - Vercel may use x-forwarded-host
  const host = request.headers.get('x-forwarded-host') 
    || request.headers.get('host') 
    || ''
  
  // Strip port if present
  const hostname = host.split(':')[0]
  
  const popupSlug = domainToPopup[hostname]
  
  if (popupSlug) {
    // Clone the URL and add the popup param
    const url = request.nextUrl.clone()
    
    // Only add if not already present
    if (!url.searchParams.has('popup')) {
      url.searchParams.set('popup', popupSlug)
    }
    
    // Rewrite to include the popup param
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}

// Run middleware on all paths except static files and api
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

