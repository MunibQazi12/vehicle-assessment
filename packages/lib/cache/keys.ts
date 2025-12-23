/**
 * Cache key generation utilities
 * Generates deterministic cache keys for request deduplication
 */

import { createHash } from "crypto";
import type { SRPRowsRequest, FiltersRequest } from "@dealertower/types/api";

/**
 * Generates a deterministic cache key from request parameters
 *
 * @param hostname - The tenant hostname
 * @param path - The API endpoint path
 * @param body - The request body
 * @returns A cache key in the format: {hostname}:{path}:{bodyHash}
 */
export function generateCacheKey(
  hostname: string,
  path: string,
  body: Record<string, unknown> | SRPRowsRequest | FiltersRequest
): string {
  // Sort keys for consistent hashing
  const sortedBody = JSON.stringify(body, Object.keys(body).sort());
  const bodyHash = createHash("sha256")
    .update(sortedBody)
    .digest("hex")
    .slice(0, 12);

  // Normalize hostname
  const normalizedHostname = hostname.toLowerCase().replace(/^www\./, "");

  return `${normalizedHostname}:${path}:${bodyHash}`;
}

/**
 * Generates cache key for SRP rows request
 *
 * @param hostname - The tenant hostname
 * @param requestBody - The SRP rows request body
 * @returns Cache key for the SRP rows request
 */
export function generateSRPCacheKey(
  hostname: string,
  requestBody: SRPRowsRequest
): string {
  return generateCacheKey(hostname, "/vehicles/srp/rows", requestBody);
}

/**
 * Generates cache key for filters request
 *
 * @param hostname - The tenant hostname
 * @param requestBody - The filters request body
 * @returns Cache key for the filters request
 */
export function generateFiltersCacheKey(
  hostname: string,
  requestBody: FiltersRequest
): string {
  return generateCacheKey(hostname, "/vehicles/srp/filters", requestBody);
}

/**
 * Generates cache key for filter values request
 *
 * @param hostname - The tenant hostname
 * @param filterName - The name of the filter
 * @param requestBody - The filter values request body
 * @returns Cache key for the filter values request
 */
export function generateFilterValuesCacheKey(
  hostname: string,
  filterName: string,
  requestBody: FiltersRequest
): string {
  return generateCacheKey(
    hostname,
    `/vehicles/srp/filters/${filterName}`,
    requestBody
  );
}
