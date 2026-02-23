const domainToPopup: Record<string, string> = {
  'volunteers.icelandeclipse.com': 'iceland-eclipse-volunteers',
  'ripple.egypt-eclipse.com': 'ripple-on-the-nile',
}

export const resolvePopupSlugFromHost = (host: string): string | null => {
  const hostname = host.split(':')[0]
  return domainToPopup[hostname] ?? null
}

export { domainToPopup }
