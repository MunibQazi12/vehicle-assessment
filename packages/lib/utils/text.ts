/**
 * Text normalization utilities for URL-safe slug generation
 * Mirrors OpenSearch lowercase_asciifolding_hyphen_normalizer behavior
 */

/**
 * Normalize text to lowercase, ASCII-folded, hyphenated form suitable for URLs
 * 
 * This function converts text to a normalized form used by OpenSearch indexes
 * with the lowercase_asciifolding_hyphen_normalizer. This ensures consistency
 * between user input and indexed values when building URLs.
 * 
 * Normalization steps:
 * 1. Converts to lowercase
 * 2. Removes accents/diacritics (ASCII folding)
 * 3. Converts spaces and special characters to hyphens
 * 4. Removes multiple consecutive hyphens
 * 5. Strips leading/trailing hyphens
 * 
 * @param text - Original text to normalize
 * @returns Normalized text suitable for URLs and filtering against OpenSearch indexes
 * 
 * @example
 * ```ts
 * normalizeForUrl("Ford F-150")       // => "ford-f-150"
 * normalizeForUrl("Alfa Romeo")       // => "alfa-romeo"
 * normalizeForUrl("SUV")              // => "suv"
 * normalizeForUrl("Café Racer")       // => "cafe-racer"
 * normalizeForUrl("GMC Sierra 1500")  // => "gmc-sierra-1500"
 * normalizeForUrl("4 Door")           // => "4-door"
 * normalizeForUrl("Coupé")            // => "coupe"
 * ```
 */
export function normalizeForUrl(text: string): string {
  if (!text) {
    return "";
  }

  // Convert to lowercase
  let normalized = text.toLowerCase();

  // ASCII folding - remove accents and diacritics
  // NFD = Canonical Decomposition (separates base characters from combining marks)
  normalized = normalized.normalize("NFD");
  
  // Remove combining diacritical marks (category Mn = Nonspacing_Mark)
  normalized = normalized.replace(/[\u0300-\u036f]/g, "");

  // Replace spaces and special characters with hyphens
  // Keep alphanumeric characters (a-z, 0-9) and existing hyphens
  normalized = normalized.replace(/[^a-z0-9-]/g, "-");

  // Remove multiple consecutive hyphens
  normalized = normalized.replace(/-+/g, "-");

  // Remove leading/trailing hyphens
  normalized = normalized.replace(/^-+|-+$/g, "");

  return normalized;
}

/**
 * Build a URL path segment from multiple parts with proper normalization
 * 
 * @param parts - Array of path segments to normalize and join
 * @returns URL path string with normalized segments joined by slashes
 * 
 * @example
 * ```ts
 * buildUrlPath("Ford", "F-150")              // => "ford/f-150"
 * buildUrlPath("Alfa Romeo", "Giulia")       // => "alfa-romeo/giulia"
 * buildUrlPath("GMC", "Sierra 1500", "SLE")  // => "gmc/sierra-1500/sle"
 * ```
 */
export function buildUrlPath(...parts: (string | undefined | null)[]): string {
  return parts
    .filter(Boolean)
    .map((part) => normalizeForUrl(part as string))
    .filter((part) => part.length > 0)
    .join("/");
}

/**
 * Standardize brand/manufacturer names from API format to display format
 * 
 * Transforms:
 * - lowercase to Title Case
 * - underscores to spaces
 * 
 * Examples:
 * - "nissan" → "Nissan"
 * - "land_rover" → "Land Rover"
 * - "mercedes_benz" → "Mercedes Benz"
 * 
 * @param brand - Raw brand name from API (lowercase with underscores)
 * @returns Standardized brand name for display
 */
export function standardizeBrandName(brand: string): string {
  if (!brand) return brand;
  
  return brand
    .split('_') // Split on underscores
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Title case each word
    .join(' '); // Join with spaces
}

/**
 * Standardize an array of brand names
 * 
 * @param brands - Array of raw brand names from API
 * @returns Array of standardized brand names
 */
export function standardizeBrandNames(brands: string[]): string[] {
  return brands.map(standardizeBrandName);
}
