import { Metadata } from "next"
import { headers } from "next/headers"
import { getPopupBranding } from "@/constants/popupBranding"

type Props = {
  params: Promise<{ popupSlug: string }>
  children: React.ReactNode
}

const DOMAIN_OG_OVERRIDES: Record<string, string> = {
  'volunteers.icelandeclipse.com': 'https://storage.googleapis.com/icelandeclipse/iceland-eclipse__social-preview.jpg',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { popupSlug } = await params
  const branding = getPopupBranding(popupSlug)

  const headersList = await headers()
  const host = headersList.get('x-forwarded-host') || headersList.get('host') || ''
  const hostname = host.split(':')[0]
  const ogImage = DOMAIN_OG_OVERRIDES[hostname] || branding.heroImage

  return {
    title: branding.name,
    description: branding.welcomeMessage || `Welcome to ${branding.name}`,
    openGraph: {
      type: 'website',
      title: branding.name,
      description: branding.welcomeMessage || `Welcome to ${branding.name}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: branding.heroAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: branding.name,
      description: branding.welcomeMessage || `Welcome to ${branding.name}`,
      images: [ogImage],
    },
  }
}

export default function PopupLayout({ children }: Props) {
  return <>{children}</>
}

