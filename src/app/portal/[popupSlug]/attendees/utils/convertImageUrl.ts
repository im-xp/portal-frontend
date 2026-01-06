/**
 * Converts cloud storage share URLs to direct/embeddable image URLs
 */

export function convertToEmbeddableImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null
  
  const trimmedUrl = url.trim()
  
  // Skip non-URLs
  if (!trimmedUrl.startsWith('http')) return null
  
  // Google Drive file links
  // Format: https://drive.google.com/file/d/{FILE_ID}/view?...
  // Use thumbnail endpoint which is more reliable for embedding
  // sz=w1000 gives us a 1000px wide image
  const googleDriveFileMatch = trimmedUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (googleDriveFileMatch) {
    const fileId = googleDriveFileMatch[1]
    // Try the lh3 googleusercontent URL which works better for images
    return `https://lh3.googleusercontent.com/d/${fileId}`
  }
  
  // Google Drive open links
  // Format: https://drive.google.com/open?id={FILE_ID}
  const googleDriveOpenMatch = trimmedUrl.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/)
  if (googleDriveOpenMatch) {
    const fileId = googleDriveOpenMatch[1]
    return `https://lh3.googleusercontent.com/d/${fileId}`
  }
  
  // Skip Google Drive folder links (can't embed these)
  if (trimmedUrl.includes('drive.google.com/drive/folders')) {
    return null
  }
  
  // Dropbox share links
  // Format: https://www.dropbox.com/...?dl=0 or ?rlkey=...&dl=0
  // Convert by changing dl=0 to dl=1, or use raw=1
  if (trimmedUrl.includes('dropbox.com')) {
    // Replace dl=0 with raw=1 for direct access
    let convertedUrl = trimmedUrl
    if (convertedUrl.includes('dl=0')) {
      convertedUrl = convertedUrl.replace('dl=0', 'raw=1')
    } else if (!convertedUrl.includes('raw=1') && !convertedUrl.includes('dl=1')) {
      // Add raw=1 if no download param exists
      convertedUrl += convertedUrl.includes('?') ? '&raw=1' : '?raw=1'
    }
    return convertedUrl
  }
  
  // iCloud links - can't be converted to direct images
  if (trimmedUrl.includes('icloud.com')) {
    return null
  }
  
  // Already a direct image URL - return as-is
  // Common image CDNs and direct URLs
  if (
    trimmedUrl.includes('gstatic.com') ||
    trimmedUrl.includes('googleusercontent.com') ||
    trimmedUrl.includes('cloudinary.com') ||
    trimmedUrl.includes('imgur.com') ||
    trimmedUrl.includes('githubusercontent.com') ||
    trimmedUrl.includes('s3.amazonaws.com') ||
    trimmedUrl.includes('storage.googleapis.com') ||
    /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(trimmedUrl)
  ) {
    return trimmedUrl
  }
  
  // For other URLs, try to use them as-is (might work, might not)
  return trimmedUrl
}

/**
 * Check if URL is likely a valid embeddable image
 */
export function isLikelyValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false
  
  const converted = convertToEmbeddableImageUrl(url)
  return converted !== null
}
