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
    // Placeholder images - replace with actual Ripple branding assets
    logo: 'https://placehold.co/200x80/1a365d/gold?text=RIPPLE',
    logoAlt: 'Ripple on the Nile logo',
    heroImage: 'https://images.unsplash.com/photo-1568322503652-5306a7417be9?w=400&h=400&fit=crop&q=80',
    heroAlt: 'Ripple on the Nile hero image',
    backgroundImage: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920&q=80',
    welcomeMessage: 'Welcome to Ripple on the Nile!',
    colors: {
      // Ripple on the Nile - Warm sandy/gold with terracotta accent
      background: '35 30% 12%',          // Dark warm brown
      foreground: '45 30% 90%',          // Warm off-white
      primary: '38 92% 50%',             // Gold/amber
      primaryForeground: '35 30% 10%',   // Dark brown text on gold
      secondary: '25 60% 25%',           // Terracotta brown
      secondaryForeground: '45 30% 90%',
      muted: '35 25% 18%',
      mutedForeground: '45 20% 65%',
      accent: '38 92% 50%',              // Gold
      accentForeground: '35 30% 10%',
      border: '45 30% 80%',              // Light warm border
      input: '35 25% 18%',
      ring: '38 92% 50%',
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

