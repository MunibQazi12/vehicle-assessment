/**
 * Image utility functions
 * Handles image URL transformations and optimizations
 */

/**
 * Ensures image URL uses HTTPS protocol
 * Critical for PageSpeed performance score and security
 * 
 * @param url - The image URL to transform
 * @returns The same URL with HTTPS protocol
 * 
 * @example
 * ```ts
 * ensureHttps('http://vehicle-photos.com/image.jpg')
 * // Returns: 'https://vehicle-photos.com/image.jpg'
 * ```
 */
export function ensureHttps(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // Already HTTPS
  if (url.startsWith('https://')) {
    return url;
  }
  
  // Protocol-relative URL (//example.com/image.jpg) - check before relative paths
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // Relative URL
  if (url.startsWith('/')) {
    return url;
  }
  
  // Convert HTTP to HTTPS
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  
  return url;
}

/**
 * Transforms vehicle photo URL to HTTPS
 * Used specifically for vehicle images from various sources
 * 
 * @param photoUrl - Vehicle photo URL
 * @returns HTTPS version of the URL
 */
export function getSecureVehicleImageUrl(photoUrl: string | null | undefined): string | null {
  return ensureHttps(photoUrl);
}

/**
 * Converts double-base64 encoded WebP photo preview to Next.js Image blur data URL
 * API always returns double-base64 encoded WebP thumbnails: Base64(Base64(WebP_bytes))
 * Optimized for guaranteed format - single decode operation, no format detection
 * 
 * @param photoPreview - Double-base64 encoded WebP string from API
 * @returns Data URL formatted string for Next.js Image blurDataURL prop
 * 
 * @example
 * ```ts
 * getBlurDataURL('VWtsR1JtUUFBQUJYUlVKUVZsQTRJRmdBQUFBd0FnQ2RBU29N...')
 * // Returns: 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4...'
 * 
 * getBlurDataURL(null)
 * // Returns: undefined
 * ```
 */
export function getBlurDataURL(photoPreview: string | null | undefined): string | undefined {
  if (!photoPreview) return undefined;
  
  // Already in data URL format - return as-is
  if (photoPreview.startsWith('data:')) {
    return photoPreview;
  }
  
  // API always returns double-base64 encoded WebP
  // Decode once to get actual WebP base64, then wrap in data URL
  // Fast path: Node.js SSR environment
  if (typeof Buffer !== 'undefined') {
    return `data:image/webp;base64,${Buffer.from(photoPreview, 'base64').toString('ascii')}`;
  }
  
  // Browser environment fallback
  try {
    return `data:image/webp;base64,${atob(photoPreview)}`;
  } catch {
    // If decode fails, return original as-is (shouldn't happen with valid API data)
    return `data:image/webp;base64,${photoPreview}`;
  }
}
