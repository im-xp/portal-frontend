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
      // Iceland Eclipse - Dark blue with cyan accent
      background: '217 92% 15%',        // #021849 Dark Blue
      foreground: '210 8% 90%',         // Light grey text
      primary: '189 69% 56%',           // #3cc7e1 Cyan
      primaryForeground: '0 0% 100%',   // White
      secondary: '217 85% 22%',         // Lighter blue
      secondaryForeground: '210 8% 90%',
      muted: '217 70% 20%',
      mutedForeground: '210 20% 70%',
      accent: '189 69% 56%',            // Cyan
      accentForeground: '0 0% 100%',
      border: '0 0% 100%',              // White borders
      input: '217 85% 22%',
      ring: '189 69% 56%',
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

