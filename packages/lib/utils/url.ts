/**
 * URL Utility Functions
 */

/**
 * Check if a URL is external (starts with http:// or https://)
 * @param url - The URL to check
 * @returns true if the URL is external, false otherwise
 */
export function isExternalUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Adds base URL to relative URLs, returns absolute URLs unchanged
 *
 * @param url - The URL to process (can be relative or absolute)
 * @param base - The base URL to prepend to relative URLs
 * @returns The full URL or null if input is invalid
 *
 * @example
 * addBaseIfRelative('/about', 'https://example.com') // 'https://example.com/about'
 * addBaseIfRelative('https://other.com/page', 'https://example.com') // 'https://other.com/page'
 */
export function addBaseIfRelative(
  url: string | null | undefined,
  base: string
): string | null {
  if (!url) return null;
  if (isExternalUrl(url)) return url;
  return `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
}
