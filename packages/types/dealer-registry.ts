/**
 * Dealer Registry Types
 * 
 * Defines the structure for dealer-specific route registries with lazy loading.
 * Uses dynamic imports for optimal code splitting - only loads components when needed.
 */

import { ComponentType } from 'react';
import { Metadata } from 'next';

/**
 * A lazy component loader function
 * Returns a promise that resolves to the component
 */
export type LazyComponentLoader = () => Promise<{ default: ComponentType<unknown> }>;

/**
 * A single route entry in the lazy dealer registry
 */
export interface LazyDealerRouteEntry {
  /** Lazy loader for the page component */
  loader: LazyComponentLoader;
  /** Optional Next.js metadata for the page */
  metadata?: Metadata;
}

/**
 * The lazy dealer registry maps route paths to their lazy page entries
 * Route paths should NOT have leading/trailing slashes
 * Empty string '' represents the home page (/)
 * 
 * @example
 * {
 *   '': { loader: () => import('./pages/Home') },
 *   'contact-us': { loader: () => import('./pages/ContactUs'), metadata: { title: 'Contact Us' } },
 * }
 */
export interface LazyDealerRegistry {
  [route: string]: LazyDealerRouteEntry;
}

/**
 * Structure for a dealer's lazy registry module
 */
export interface LazyDealerRegistryModule {
  routes: LazyDealerRegistry;
  notFoundLoader?: LazyComponentLoader;
}
