'use client'

import { useSearchParams } from 'next/navigation'

/**
 * Gets the popup slug from URL query parameter (?popup=xxx)
 * This is set by middleware for domain-based routing (e.g., ripple.egypt-eclipse.com)
 */
export function usePopupSlug(): string | null {
  const params = useSearchParams()
  return params.get('popup')
}

