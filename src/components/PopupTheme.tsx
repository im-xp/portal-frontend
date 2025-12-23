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
      --card: ${colors.card};
      --card-foreground: ${colors.cardForeground};
      --popover: ${colors.popover};
      --popover-foreground: ${colors.popoverForeground};
      --sidebar-background: ${colors.sidebarBackground};
      --sidebar-foreground: ${colors.sidebarForeground};
      --sidebar-primary: ${colors.sidebarPrimary};
      --sidebar-primary-foreground: ${colors.sidebarPrimaryForeground};
      --sidebar-accent: ${colors.sidebarAccent};
      --sidebar-accent-foreground: ${colors.sidebarAccentForeground};
      --sidebar-border: ${colors.sidebarBorder};
      --sidebar-ring: ${colors.sidebarRing};
    }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      {children}
    </>
  )
}

