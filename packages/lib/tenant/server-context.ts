/**
 * Server-side Tenant Context Utilities
 * 
 * Provides cached access to tenant data for server components.
 * Uses React cache() to ensure data is fetched once per request and shared
 * across all server components in the render tree.
 * 
 * This is more explicit than relying on Next.js fetch deduplication and
 * provides a clear API for accessing tenant data in server components.
 */

import { cache } from 'react';
import { headers } from 'next/headers';
import { fetchWebsiteInformation } from '@dealertower/lib/api/dealer';
import type { DealerInfoWithGroup } from '@dealertower/lib/api/dealer';

/**
 * Get hostname for the current request
 * Cached per request to avoid reading headers multiple times
 * 
 * Resolution priority:
 * 1. NEXTJS_APP_HOSTNAME environment variable (for local dev override)
 * 2. x-forwarded-host header (from load balancer)
 * 3. host header (direct request)
 * 4. 'localhost' fallback
 * 
 * Note: Returns lowercase hostname which is also used as the dealer identifier
 */
const getHostname = cache(async (): Promise<string> => {
  // Priority 1: Environment variable override (for local development)
  const envHostname = process.env.NEXTJS_APP_HOSTNAME;
  if (envHostname) {
    return envHostname.toLowerCase();
  }

  const headersList = await headers();
  
  // Priority 2: x-forwarded-host (from load balancer)
  const forwardedHost = headersList.get('x-forwarded-host');
  if (forwardedHost) {
    return forwardedHost.split(',')[0].trim().toLowerCase();
  }

  // Priority 3: host header (direct request)
  const host = headersList.get('host');
  if (host) {
    return host.split(':')[0].toLowerCase();
  }

  // Priority 4: Fallback
  return 'localhost';
});

/**
 * Get website information for current request
 * Cached per request - will only fetch once even if called from multiple components
 * 
 * @returns DealerInfoWithGroup or null if website not found
 * 
 * @example
 * ```tsx
 * import { getTenantWebsiteInfo } from '@dealertower/lib/tenant/server-context';
 * 
 * export default async function MyPage() {
 *   const websiteInfo = await getTenantWebsiteInfo();
 *   return <div>{websiteInfo?.name}</div>;
 * }
 * ```
 */
export const getTenantWebsiteInfo = cache(async (): Promise<DealerInfoWithGroup | null> => {
  const hostname = await getHostname();
  return fetchWebsiteInformation(hostname);
});

/**
 * Get all tenant context data in one call
 * Useful when you need multiple pieces of tenant data
 * 
 * @example
 * ```tsx
 * import { getTenantContext } from '@dealertower/lib/tenant/server-context';
 * 
 * export default async function MyPage() {
 *   const { hostname, dealerIdentifier, websiteInfo } = await getTenantContext();
 *   return <div>{websiteInfo?.name}</div>;
 * }
 * ```
 */
export const getTenantContext = cache(async () => {
  const [hostname, websiteInfo] = await Promise.all([
    getHostname(),
    getTenantWebsiteInfo(),
  ]);

  return {
    hostname,
    dealerIdentifier: hostname, // hostname is already lowercase
    websiteInfo,
  };
});

/**
 * Get just hostname for current request
 * Useful when you only need the hostname without other tenant data
 * 
 * @example
 * ```tsx
 * import { getTenantHostname } from '@dealertower/lib/tenant/server-context';
 * 
 * export default async function MyComponent() {
 *   const hostname = await getTenantHostname();
 *   return <div>Hostname: {hostname}</div>;
 * }
 * ```
 */
export const getTenantHostname = getHostname;

/**
 * Get just dealer identifier for current request
 * This is the same as hostname (lowercase)
 * 
 * @example
 * ```tsx
 * import { getTenantDealerId } from '@dealertower/lib/tenant/server-context';
 * 
 * export default async function MyComponent() {
 *   const dealerId = await getTenantDealerId();
 *   return <div>Dealer: {dealerId}</div>;
 * }
 * ```
 */
export const getTenantDealerId = getHostname;
