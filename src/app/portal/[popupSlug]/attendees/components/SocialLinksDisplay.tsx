'use client'

import { Twitter, Instagram, Linkedin, Youtube, Globe, Link2 } from 'lucide-react'
import { ParsedSocialLink, parseSocialLinks } from '../utils/parseSocialLinks'

// TikTok icon (not in lucide)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

const getIcon = (iconType: ParsedSocialLink['icon'], className: string) => {
  switch (iconType) {
    case 'twitter':
      return <Twitter className={className} />
    case 'instagram':
      return <Instagram className={className} />
    case 'linkedin':
      return <Linkedin className={className} />
    case 'youtube':
      return <Youtube className={className} />
    case 'tiktok':
      return <TikTokIcon className={className} />
    case 'link':
      return <Link2 className={className} />
    case 'globe':
    default:
      return <Globe className={className} />
  }
}

interface SocialLinksDisplayProps {
  text: string | null | undefined
  className?: string
}

export const SocialLinksDisplay = ({ text, className = '' }: SocialLinksDisplayProps) => {
  const links = parseSocialLinks(text)
  
  if (links.length === 0) {
    // If no links parsed but there's text, just show it as-is
    if (text) {
      return <span className={className}>{text}</span>
    }
    return null
  }
  
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {links.map((link, index) => (
        <a
          key={`${link.url}-${index}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-sm text-foreground hover:bg-primary/20 transition-colors"
          title={`${link.platform}: ${link.url}`}
        >
          {getIcon(link.icon, 'w-4 h-4')}
          <span className="max-w-[150px] truncate">{link.displayText}</span>
        </a>
      ))}
    </div>
  )
}

// Inline version for card views - just shows icons (uses spans to avoid nested <a> issues)
export const SocialLinksInline = ({ text, className = '' }: SocialLinksDisplayProps) => {
  const links = parseSocialLinks(text)
  
  if (links.length === 0) return null
  
  // Limit to first 4 links for card view
  const displayLinks = links.slice(0, 4)
  const remaining = links.length - 4
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {displayLinks.map((link, index) => (
        <span
          key={`${link.url}-${index}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            window.open(link.url, '_blank')
          }}
          className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          title={`${link.platform}: ${link.displayText}`}
        >
          {getIcon(link.icon, 'w-4 h-4')}
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-xs text-muted-foreground">+{remaining}</span>
      )}
    </div>
  )
}

export default SocialLinksDisplay
