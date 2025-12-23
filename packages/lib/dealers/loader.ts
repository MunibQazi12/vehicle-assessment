/**
 * Lazy Dynamic Component/Page Loader for Dealer-Specific Content
 * 
 * Uses dynamic imports for optimal code splitting.
 * Components are only loaded when their routes are accessed.
 */

import { ComponentType, ReactNode } from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { 
  getLazyDealerRegistry, 
  getLazyDealerRoute,
  getLazyDealerRoutes,
  hasLazyDealerRegistry
} from './registry-map';
import { LazyComponentLoader, LazyDealerRouteEntry } from '@dealertower/types/dealer-registry';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>;

/**
 * Get dealer ID from environment variable
 * This is the primary source of truth for identifying the dealer
 * 
 * @returns Dealer ID from environment variable or null if not set
 */
export function getDealerId(): string | null {
  return process.env.NEXTJS_APP_DEALER_ID || null;
}

/**
 * Get a dealer route entry by path (async)
 * Uses the lazy registry map for optimal code splitting
 * 
 * @param route - The route path (e.g., 'contact-us', '' for home)
 * @returns The lazy route entry with loader and metadata, or null if not found
 */
export async function getDealerRouteLazy(route: string = ''): Promise<LazyDealerRouteEntry | null> {
  const dealerId = getDealerId();
  if (!dealerId) return null;

  return getLazyDealerRoute(dealerId, route);
}

/**
 * Load and return a page component for a dealer route
 * The component is dynamically imported only when this function is called
 * 
 * @param route - The route path
 * @returns The loaded page component or null if not found
 */
export async function loadDealerPageComponent(route: string = ''): Promise<ComponentType<unknown> | null> {
  const entry = await getDealerRouteLazy(route);
  if (!entry) return null;

  try {
    const loadedModule = await entry.loader();
    return loadedModule.default;
  } catch (error) {
    console.error(`Failed to load component for route "${route}":`, error);
    return null;
  }
}

/**
 * Get a dynamically imported page component wrapped with next/dynamic
 * Use this for client-side rendering with loading states
 * 
 * @param route - The route path
 * @param loadingFn - Optional loading function that returns a ReactNode
 * @returns A dynamic component or null
 */
export async function getDealerDynamicPage(
  route: string = '',
  loadingFn?: () => ReactNode
): Promise<AnyComponent | null> {
  const entry = await getDealerRouteLazy(route);
  if (!entry) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return dynamic(entry.loader as any, {
    loading: loadingFn,
  });
}

/**
 * Get the metadata for a dealer route (async)
 * 
 * @param route - The route path
 * @returns The metadata object or null if not found
 */
export async function getDealerPageMetadataLazy(route: string = ''): Promise<Metadata | null> {
  const entry = await getDealerRouteLazy(route);
  return entry?.metadata || null;
}

/**
 * Load the not-found component for the current dealer
 * 
 * @returns The loaded not-found component or null
 */
export async function loadDealerNotFoundComponent(): Promise<AnyComponent | null> {
  const dealerId = getDealerId();
  if (!dealerId) return null;

  const registry = await getLazyDealerRegistry(dealerId);
  if (!registry?.notFoundLoader) return null;

  try {
    const loadedModule = await registry.notFoundLoader();
    return loadedModule.default;
  } catch (error) {
    console.error('Failed to load not-found component:', error);
    return null;
  }
}

/**
 * Check if a dealer route exists (async)
 * 
 * @param route - The route path to check
 * @returns True if the route exists
 */
export async function dealerRouteExistsLazy(route: string = ''): Promise<boolean> {
  const entry = await getDealerRouteLazy(route);
  return entry !== null;
}

/**
 * Get all available routes for the current dealer (async)
 * 
 * @returns Array of route paths
 */
export async function getDealerRoutesLazy(): Promise<string[]> {
  const dealerId = getDealerId();
  if (!dealerId) return [];

  return getLazyDealerRoutes(dealerId);
}

/**
 * Check if the current dealer has a lazy registry
 */
export function hasDealerLazyRegistry(): boolean {
  const dealerId = getDealerId();
  if (!dealerId) return false;
  return hasLazyDealerRegistry(dealerId);
}

/**
 * Create a lazy component loader for use with next/dynamic
 * Utility for creating dynamic imports from a loader function
 * 
 * @param loader - The lazy component loader function
 * @param loadingFn - Optional loading function that returns a ReactNode
 * @returns A dynamically loaded component
 */
export function createDynamicComponent(
  loader: LazyComponentLoader,
  loadingFn?: () => ReactNode
): AnyComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return dynamic(loader as any, {
    loading: loadingFn,
  });
}

// ============================================================================
// Individual Component Loaders (for headers, footers, and ad-hoc pages)
// These use direct dynamic imports rather than the registry system
// ============================================================================

/**
 * Get dealer ID from environment variable or fallback to normalized hostname
 * 
 * @param hostname - The dealer hostname (used as fallback)
 * @returns Dealer ID from environment or normalized hostname
 */
function getDealerIdFromEnv(hostname: string): string {
  const envDealerId = getDealerId();
  if (envDealerId) {
    return envDealerId;
  }
  return hostname.replace(/^www\./, '').toLowerCase();
}

/**
 * Load a dealer-specific page component by name (ad-hoc, not registry-based)
 * 
 * @param hostname - The dealer hostname
 * @param pageName - The page name (e.g., 'About', 'Contact')
 * @returns The dealer-specific page component or null if not found
 */
export async function loadDealerPage<T = Record<string, unknown>>(
  hostname: string,
  pageName: string
): Promise<ComponentType<T> | null> {
  const dealerId = getDealerIdFromEnv(hostname);
  if (!dealerId) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loadedModule: any = await import(`@dealers/${dealerId}/pages/${pageName}`);
    return loadedModule.default || loadedModule[pageName];
  } catch {
    return null;
  }
}

/**
 * Load a dealer-specific header component
 * 
 * @param hostname - The dealer hostname
 * @returns The dealer-specific header component or null if not found
 */
export async function loadDealerHeader<T = Record<string, unknown>>(
  hostname: string
): Promise<ComponentType<T> | null> {
  const dealerId = getDealerIdFromEnv(hostname);
  if (!dealerId) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loadedModule: any = await import(`@dealers/${dealerId}/components/Header`);
    return loadedModule.default || loadedModule.Header;
  } catch {
    return null;
  }
}

/**
 * Load a dealer-specific footer component
 * 
 * @param hostname - The dealer hostname
 * @returns The dealer-specific footer component or null if not found
 */
export async function loadDealerFooter<T = Record<string, unknown>>(
  hostname: string
): Promise<ComponentType<T> | null> {
  const dealerId = getDealerIdFromEnv(hostname);
  if (!dealerId) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loadedModule: any = await import(`@dealers/${dealerId}/components/Footer`);
    return loadedModule.default || loadedModule.Footer;
  } catch {
    return null;
  }
}
