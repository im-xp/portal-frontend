'use client'

import { useSearchParams } from 'next/navigation'

/**
 * Gets the popup slug from cookie (set by middleware) or URL query parameter
 * Middleware sets cookie for domain-based routing (e.g., ripple.egypt-eclipse.com)
 */
export function usePopupSlug(): string | null {
  const params = useSearchParams()
  
  // First check query param (for direct links with ?popup=xxx)
  const queryPopup = params.get('popup')
  if (queryPopup) return queryPopup
  
  // Then check cookie (set by middleware for domain-based routing)
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'popup_slug') {
        return decodeURIComponent(value)
      }
    }
  }
  
  return null
}

