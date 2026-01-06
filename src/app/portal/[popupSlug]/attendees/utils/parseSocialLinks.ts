// Utility to parse messy social media text and extract structured links

export interface ParsedSocialLink {
  platform: string
  url: string
  displayText: string
  icon: 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'globe' | 'link'
}

// Platform detection from URL domains
const PLATFORM_PATTERNS: { pattern: RegExp; platform: string; icon: ParsedSocialLink['icon'] }[] = [
  { pattern: /twitter\.com/i, platform: 'Twitter', icon: 'twitter' },
  { pattern: /x\.com/i, platform: 'X', icon: 'twitter' },
  { pattern: /instagram\.com/i, platform: 'Instagram', icon: 'instagram' },
  { pattern: /linkedin\.com/i, platform: 'LinkedIn', icon: 'linkedin' },
  { pattern: /youtube\.com/i, platform: 'YouTube', icon: 'youtube' },
  { pattern: /youtu\.be/i, platform: 'YouTube', icon: 'youtube' },
  { pattern: /tiktok\.com/i, platform: 'TikTok', icon: 'tiktok' },
  { pattern: /linktr\.ee/i, platform: 'Linktree', icon: 'link' },
  { pattern: /bsky\.(app|social)/i, platform: 'Bluesky', icon: 'globe' },
  { pattern: /pinterest\.(com|ca)/i, platform: 'Pinterest', icon: 'globe' },
  { pattern: /insighttimer\.com/i, platform: 'Insight Timer', icon: 'globe' },
  { pattern: /facebook\.com/i, platform: 'Facebook', icon: 'globe' },
  { pattern: /threads\.net/i, platform: 'Threads', icon: 'globe' },
  { pattern: /github\.com/i, platform: 'GitHub', icon: 'globe' },
]

// Context keywords that hint at platform for @handles
const HANDLE_CONTEXT_PATTERNS: { pattern: RegExp; platform: string; icon: ParsedSocialLink['icon'] }[] = [
  { pattern: /instagram/i, platform: 'Instagram', icon: 'instagram' },
  { pattern: /twitter/i, platform: 'Twitter', icon: 'twitter' },
  { pattern: /\bx\b/i, platform: 'X', icon: 'twitter' },
  { pattern: /tiktok/i, platform: 'TikTok', icon: 'tiktok' },
  { pattern: /youtube/i, platform: 'YouTube', icon: 'youtube' },
  { pattern: /bluesky|bsky/i, platform: 'Bluesky', icon: 'globe' },
]

function identifyPlatformFromUrl(url: string): { platform: string; icon: ParsedSocialLink['icon'] } {
  for (const { pattern, platform, icon } of PLATFORM_PATTERNS) {
    if (pattern.test(url)) {
      return { platform, icon }
    }
  }
  // Try to extract domain as platform name
  try {
    const domain = new URL(url).hostname.replace('www.', '')
    return { platform: domain, icon: 'globe' }
  } catch {
    return { platform: 'Link', icon: 'link' }
  }
}

function extractDisplayFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const path = urlObj.pathname.replace(/\/$/, '')
    
    // For profile URLs, try to extract username
    const usernameMatch = path.match(/\/@?([^/]+)$/)
    if (usernameMatch) {
      return `@${usernameMatch[1]}`
    }
    
    // For LinkedIn profiles
    if (path.includes('/in/')) {
      const match = path.match(/\/in\/([^/]+)/)
      if (match) return match[1]
    }
    
    // Just show the domain
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

export function parseSocialLinks(text: string | null | undefined): ParsedSocialLink[] {
  if (!text || typeof text !== 'string') return []
  
  const links: ParsedSocialLink[] = []
  const seenUrls = new Set<string>()
  
  // 1. Extract all URLs
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/gi
  const urls = text.match(urlRegex) || []
  
  for (const url of urls) {
    // Clean up URL (remove trailing punctuation)
    const cleanUrl = url.replace(/[.,;:!?)]+$/, '')
    
    if (seenUrls.has(cleanUrl.toLowerCase())) continue
    seenUrls.add(cleanUrl.toLowerCase())
    
    const { platform, icon } = identifyPlatformFromUrl(cleanUrl)
    links.push({
      platform,
      url: cleanUrl,
      displayText: extractDisplayFromUrl(cleanUrl),
      icon,
    })
  }
  
  // 2. Extract @handles that aren't part of URLs
  // Remove URLs first to avoid double-matching
  let textWithoutUrls = text
  for (const url of urls) {
    textWithoutUrls = textWithoutUrls.replace(url, ' ')
  }
  
  // Find @handles
  const handleRegex = /@([a-zA-Z0-9_]+)/g
  let match
  const handles: { handle: string; context: string }[] = []
  
  while ((match = handleRegex.exec(textWithoutUrls)) !== null) {
    const handle = match[1]
    // Skip common false positives
    if (['gmail', 'yahoo', 'hotmail', 'outlook', 'icloud'].some(e => handle.toLowerCase().includes(e))) {
      continue
    }
    // Get surrounding context (50 chars before)
    const startIndex = Math.max(0, match.index - 50)
    const context = textWithoutUrls.slice(startIndex, match.index)
    handles.push({ handle, context })
  }
  
  // Group handles by inferred platform
  for (const { handle, context } of handles) {
    // Check if we already have a URL for this handle
    if (links.some(l => l.displayText.toLowerCase().includes(handle.toLowerCase()))) {
      continue
    }
    
    // Try to identify platform from context
    let platform = 'X' // Default to X/Twitter for @handles
    let icon: ParsedSocialLink['icon'] = 'twitter'
    let url = `https://x.com/${handle}`
    
    for (const { pattern, platform: p, icon: i } of HANDLE_CONTEXT_PATTERNS) {
      if (pattern.test(context)) {
        platform = p
        icon = i
        
        // Build appropriate URL
        if (p === 'Instagram') {
          url = `https://instagram.com/${handle}`
        } else if (p === 'TikTok') {
          url = `https://tiktok.com/@${handle}`
        } else if (p === 'YouTube') {
          url = `https://youtube.com/@${handle}`
        }
        break
      }
    }
    
    // Avoid duplicates
    if (seenUrls.has(url.toLowerCase())) continue
    seenUrls.add(url.toLowerCase())
    
    links.push({
      platform,
      url,
      displayText: `@${handle}`,
      icon,
    })
  }
  
  return links
}

// Simple check if text contains any parseable social content
export function hasSocialLinks(text: string | null | undefined): boolean {
  if (!text) return false
  return /https?:\/\/|@[a-zA-Z0-9_]+/.test(text)
}
