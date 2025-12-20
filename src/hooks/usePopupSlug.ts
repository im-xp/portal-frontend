'use client'

import { useSearchParams } from 'next/navigation'

/**
 * Gets the popup slug from either:
 * 1. URL query parameter (?popup=xxx)
 * 2. Cookie set by middleware (popup_slug)
 */
export function usePopupSlug(): string | null {
  const params = useSearchParams()
  
  // First check query param
  const queryPopup = params.get('popup')
  if (queryPopup) return queryPopup
  
  // Fall back to cookie (set by middleware for domain-based routing)
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

