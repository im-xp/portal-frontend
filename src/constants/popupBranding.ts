export type PopupColors = {
  // HSL values (without hsl() wrapper) for CSS variables
  background: string        // Main background
  foreground: string        // Main text color
  primary: string           // Primary accent (buttons, links)
  primaryForeground: string // Text on primary
  secondary: string         // Secondary color
  secondaryForeground: string
  muted: string             // Muted backgrounds
  mutedForeground: string   // Muted text
  accent: string            // Accent color
  accentForeground: string
  border: string            // Border color
  input: string             // Input background
  ring: string              // Focus ring
  // Card colors (for content cards)
  card: string
  cardForeground: string
  // Sidebar colors
  sidebarBackground: string
  sidebarForeground: string
  sidebarPrimary: string
  sidebarPrimaryForeground: string
  sidebarAccent: string
  sidebarAccentForeground: string
  sidebarBorder: string
  sidebarRing: string
}

export type PopupBranding = {
  name: string
  logo: string
  logoAlt: string
  heroImage: string
  heroAlt: string
  backgroundImage: string
  welcomeMessage?: string
  colors: PopupColors
}

export const popupBranding: Record<string, PopupBranding> = {
  'iceland-eclipse': {
    name: 'The Portal at Iceland Eclipse',
    logo: 'https://storage.googleapis.com/icelandeclipse/the-portal-at-iceland-eclipse-logo.png',
    logoAlt: 'The Portal at Iceland Eclipse logo',
    heroImage: 'https://storage.googleapis.com/icelandeclipse/portal-black-hole__square.png',
    heroAlt: 'The Portal at Iceland Eclipse wormhole image',
    backgroundImage: 'https://images.typeform.com/images/gAqmGWTiyfrT/background/large',
    colors: {
      // Iceland Eclipse - Light theme matching production globals.css
      background: '0 0% 98%',             // Off-white page background
      foreground: '217 92% 15%',          // #021849 Dark blue text
      primary: '189 69% 56%',             // #3cc7e1 Cyan
      primaryForeground: '0 0% 100%',     // White text on cyan (for tabs)
      secondary: '217 92% 15%',           // Dark blue (for purchased passes)
      secondaryForeground: '0 0% 100%',   // White text on dark blue
      muted: '210 20% 93%',               // Light grey (page background)
      mutedForeground: '217 50% 35%',     // Dark muted text
      accent: '189 69% 56%',              // Cyan (for section headers)
      accentForeground: '217 92% 15%',    // Dark text on cyan
      border: '210 25% 85%',              // Light grey borders
      input: '210 25% 90%',               // Light input backgrounds
      ring: '189 69% 56%',
      // Card colors - white cards with dark text
      card: '0 0% 100%',
      cardForeground: '217 92% 15%',
      // Sidebar - Iceland Eclipse dark theme
      sidebarBackground: '217 92% 13%',
      sidebarForeground: '210 8% 90%',
      sidebarPrimary: '189 69% 56%',
      sidebarPrimaryForeground: '0 0% 100%',
      sidebarAccent: '217 85% 18%',
      sidebarAccentForeground: '210 8% 90%',
      sidebarBorder: '217 70% 25%',
      sidebarRing: '189 69% 56%',
    },
  },
  'ripple-on-the-nile': {
    name: 'Ripple on the Nile',
    logo: 'https://storage.googleapis.com/egypt-eclipse/ripple-on-the-nile-logo.png',
    logoAlt: 'Ripple on the Nile logo',
    heroImage: 'https://storage.googleapis.com/egypt-eclipse/ripple-on-nile-icon.png',
    heroAlt: 'Ripple on the Nile hero image',
    backgroundImage: 'https://storage.googleapis.com/egypt-eclipse/egypt-bg.jpg',
    welcomeMessage: 'Welcome to Ripple on the Nile!',
    colors: {
      // Ripple on the Nile - Dark brown with pale yellow accent
      // Primary: #170c02, Secondary/Accent: #fdfca6, Hover: #281504
      background: '27 79% 5%',           // #170c02 - Dark brown
      foreground: '59 94% 82%',          // #fdfca6 - Pale yellow
      primary: '59 94% 82%',             // #fdfca6 - Pale yellow (buttons)
      primaryForeground: '27 79% 5%',    // Dark brown text on yellow
      secondary: '27 82% 9%',            // #281504 - Hover brown
      secondaryForeground: '59 94% 82%',
      muted: '27 70% 8%',
      mutedForeground: '59 70% 70%',
      accent: '59 94% 82%',              // #fdfca6 - Pale yellow
      accentForeground: '27 79% 5%',
      border: '59 94% 82%',              // Pale yellow border
      input: '27 82% 9%',                // #281504
      ring: '59 94% 82%',
      // Card colors - dark brown cards with light text for Ripple
      card: '27 79% 8%',                 // Dark brown card background
      cardForeground: '0 0% 95%',        // Near-white text on cards for readability
      // Sidebar - Ripple dark brown theme
      sidebarBackground: '27 79% 4%',    // Slightly darker brown
      sidebarForeground: '59 94% 82%',   // Pale yellow text
      sidebarPrimary: '59 94% 82%',
      sidebarPrimaryForeground: '27 79% 5%',
      sidebarAccent: '27 82% 9%',        // Hover brown
      sidebarAccentForeground: '59 94% 82%',
      sidebarBorder: '27 70% 12%',
      sidebarRing: '59 94% 82%',
    },
  },
}

export const defaultPopupSlug = 'iceland-eclipse'

export function getPopupBranding(popupSlug: string | null): PopupBranding {
  if (popupSlug && popupBranding[popupSlug]) {
    return popupBranding[popupSlug]
  }
  return popupBranding[defaultPopupSlug]
}

