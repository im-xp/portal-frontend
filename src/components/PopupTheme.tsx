'use client'

import { PopupColors } from '@/constants/popupBranding'

interface PopupThemeProps {
  colors: PopupColors
  children: React.ReactNode
}

export function PopupTheme({ colors, children }: PopupThemeProps) {
  const cssVariables = `
    :root {
      --background: ${colors.background};
      --foreground: ${colors.foreground};
      --primary: ${colors.primary};
      --primary-foreground: ${colors.primaryForeground};
      --secondary: ${colors.secondary};
      --secondary-foreground: ${colors.secondaryForeground};
      --muted: ${colors.muted};
      --muted-foreground: ${colors.mutedForeground};
      --accent: ${colors.accent};
      --accent-foreground: ${colors.accentForeground};
      --border: ${colors.border};
      --input: ${colors.input};
      --ring: ${colors.ring};
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      {children}
    </>
  )
}

