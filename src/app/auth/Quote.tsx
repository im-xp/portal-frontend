'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { getPopupBranding } from '@/constants/popupBranding'

export default function Quote() {
  const params = useSearchParams()
  const popupSlug = params.get('popup')
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
          width={200}
          height={80}
          priority
        />
      </div>
    </div>
  )
}
