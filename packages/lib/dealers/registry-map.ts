/**
 * Lazy Dealer Registry Map
 * 
 * Uses dynamic imports to load dealer registries on-demand.
 * Only the registry for the requested dealer is loaded, and components
 * within that registry are also lazy-loaded when accessed.
 * 
 * This provides two levels of optimization:
 * 1. Dealer registry is only loaded for the active dealer
 * 2. Page components are only loaded when their route is accessed
 */

import { LazyDealerRegistryModule, LazyDealerRouteEntry } from '@dealertower/types/dealer-registry';

/**
 * Map of dealer IDs to their lazy registry import functions
 * Add new dealers here when onboarding
 */
const dealerRegistryLoaders: Record<string, () => Promise<LazyDealerRegistryModule>> = {
  '73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63': () => 
    import('@dealers/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/registry').then(m => m.default),
};

/**
 * Cache for loaded registries to avoid re-importing
 */
const registryCache = new Map<string, LazyDealerRegistryModule>();

/**
 * Get a dealer's lazy registry by their ID
 * Loads and caches the registry on first access
 * 
 * @param dealerId - The dealer's UUID
 * @returns The lazy registry module or null if not found
 */
export async function getLazyDealerRegistry(dealerId: string): Promise<LazyDealerRegistryModule | null> {
  // Check cache first
  const cached = registryCache.get(dealerId);
  if (cached) {
    return cached;
  }

  // Get the loader for this dealer
  const loader = dealerRegistryLoaders[dealerId];
  if (!loader) {
    return null;
  }

  try {
    // Load and cache the registry
    const registry = await loader();
    registryCache.set(dealerId, registry);
    return registry;
  } catch (error) {
    console.error(`Failed to load registry for dealer ${dealerId}:`, error);
    return null;
  }
}

/**
 * Get a specific route entry from a dealer's lazy registry
 * 
 * @param dealerId - The dealer's UUID
 * @param route - The route path (e.g., 'contact-us', '' for home)
 * @returns The lazy route entry or null if not found
 */
export async function getLazyDealerRoute(
  dealerId: string, 
  route: string = ''
): Promise<LazyDealerRouteEntry | null> {
  const registry = await getLazyDealerRegistry(dealerId);
  if (!registry) {
    return null;
  }

  return registry.routes[route] || null;
}

/**
 * Check if a dealer has a registered lazy registry
 */
export function hasLazyDealerRegistry(dealerId: string): boolean {
  return dealerId in dealerRegistryLoaders;
}

/**
 * Get all registered dealer IDs
 */
export function getRegisteredDealerIds(): string[] {
  return Object.keys(dealerRegistryLoaders);
}

/**
 * Get all route paths for a dealer (for sitemap generation)
 * 
 * @param dealerId - The dealer's UUID
 * @returns Array of route paths
 */
export async function getLazyDealerRoutes(dealerId: string): Promise<string[]> {
  const registry = await getLazyDealerRegistry(dealerId);
  if (!registry) {
    return [];
  }

  return Object.keys(registry.routes);
}
