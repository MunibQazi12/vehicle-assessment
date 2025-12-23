/**
 * Cache configuration constants
 */

/**
 * Default cache TTL in seconds (6 hours)
 * This serves as a fallback when tag-based invalidation doesn't occur
 */
export const CACHE_TTL = parseInt(process.env.CACHE_TTL || "21600", 10);

/**
 * Short cache TTL for frequently changing data (5 minutes)
 * Used for immediate user-facing content with stale-while-revalidate
 */
export const CACHE_TTL_SHORT = parseInt(process.env.CACHE_TTL_SHORT || "300", 10);

/**
 * Maximum cache size for ISR memory cache (50MB)
 */
export const ISR_MEMORY_CACHE_SIZE = 50 * 1024 * 1024;

/**
 * Cache key prefix for SRP-related caches
 */
export const CACHE_KEY_PREFIX = "srp";
