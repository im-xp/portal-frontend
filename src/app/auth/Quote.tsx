'use client'

import Image from 'next/image'
import { getPopupBranding } from '@/constants/popupBranding'

interface QuoteProps {
  popupSlug: string | null
}

export default function Quote({ popupSlug }: QuoteProps) {
  const branding = getPopupBranding(popupSlug)

  return (
    <div 
      className="hidden md:flex md:w-1/2 relative p-8" 
      style={{ 
        backgroundImage: `url(${branding.backgroundImage})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute top-8 left-8">
        <Image
          src={branding.logo}
          alt={branding.logoAlt}
          width={branding.logoSize.width}
          height={branding.logoSize.height}
          priority
        />
      </div>
    </div>
  )
}
