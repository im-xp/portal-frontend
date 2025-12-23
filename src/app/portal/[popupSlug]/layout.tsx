import { Metadata } from "next"
import { getPopupBranding } from "@/constants/popupBranding"

type Props = {
  params: Promise<{ popupSlug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { popupSlug } = await params
  const branding = getPopupBranding(popupSlug)
  
  return {
    title: branding.name,
    description: branding.welcomeMessage || `Welcome to ${branding.name}`,
    openGraph: {
      title: branding.name,
      description: branding.welcomeMessage || `Welcome to ${branding.name}`,
      images: [{
        url: branding.heroImage,
        width: 1200,
        height: 630,
        alt: branding.heroAlt,
      }],
    },
  }
}

export default function PopupLayout({ children }: Props) {
  return <>{children}</>
}

