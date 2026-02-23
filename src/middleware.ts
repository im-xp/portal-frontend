import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolvePopupSlugFromHost } from '@/lib/domainPopup'

export function middleware(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
  const popupSlug = resolvePopupSlugFromHost(host)
  
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
