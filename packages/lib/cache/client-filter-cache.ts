/**
 * Client-Side Filter Cache with FIFO (First In, First Out)
 * 
 * Caches filter API responses to avoid redundant requests when users
 * apply the same filter combinations repeatedly.
 * 
 * - Capacity: 10 entries (configurable)
 * - Eviction: FIFO - oldest entry is removed when cache is full
 * - Key: Hash of filter state + sort + search parameters
 */

import type { SRPRowsResponse, FiltersResponse } from "@dealertower/types/api";
import type { FilterState } from "@dealertower/types/filters";

interface CacheEntry {
  vehicleData: SRPRowsResponse;
  filterData: FiltersResponse;
  timestamp: number;
}

export class ClientFilterCache {
  private cache: Map<string, CacheEntry>;
  private insertionOrder: string[];
  private maxSize: number;

  constructor(maxSize: number = 10) {
    this.cache = new Map();
    this.insertionOrder = [];
    this.maxSize = maxSize;
  }

  /**
   * Generate cache key from filter parameters
   */
  private generateKey(
    filters: FilterState,
    sortBy?: string | null,
    order?: "asc" | "desc" | null,
    search?: string | null,
    page: number = 1
  ): string {
    // Create a deterministic string by sorting all keys recursively
    const sortedFilters = this.sortObjectKeys(filters);
    const keyObject = {
      filters: sortedFilters,
      sortBy: sortBy || null,
      order: order || null,
      search: search || null,
      page,
    };
    const key = JSON.stringify(keyObject);
    return key;
  }

  /**
   * Recursively sort object keys for consistent serialization
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sortObjectKeys(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectKeys(item));
    }
    if (typeof obj === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sorted: any = {};
      Object.keys(obj).sort().forEach(key => {
        sorted[key] = this.sortObjectKeys(obj[key]);
      });
      return sorted;
    }
    return obj;
  }

  /**
   * Get cached data if available
   */
  get(
    filters: FilterState,
    sortBy?: string | null,
    order?: "asc" | "desc" | null,
    search?: string | null,
    page: number = 1
  ): CacheEntry | null {
    const key = this.generateKey(filters, sortBy, order, search, page);
    const entry = this.cache.get(key);
    
    if (entry) {
      return entry;
    }
    
    return null;
  }

  /**
   * Set cache entry with FIFO eviction
   */
  set(
    filters: FilterState,
    vehicleData: SRPRowsResponse,
    filterData: FiltersResponse,
    sortBy?: string | null,
    order?: "asc" | "desc" | null,
    search?: string | null,
    page: number = 1
  ): void {
    const key = this.generateKey(filters, sortBy, order, search, page);

    // If key already exists, remove it from insertion order
    if (this.cache.has(key)) {
      const index = this.insertionOrder.indexOf(key);
      if (index > -1) {
        this.insertionOrder.splice(index, 1);
      }
    }

    // FIFO eviction: remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const oldestKey = this.insertionOrder.shift();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    // Add new entry
    this.cache.set(key, {
      vehicleData,
      filterData,
      timestamp: Date.now(),
    });
    this.insertionOrder.push(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.insertionOrder = [];
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
      oldestKey: this.insertionOrder[0] || null,
      newestKey: this.insertionOrder[this.insertionOrder.length - 1] || null,
    };
  }

  /**
   * Check if cache has entry
   */
  has(
    filters: FilterState,
    sortBy?: string | null,
    order?: "asc" | "desc" | null,
    search?: string | null,
    page: number = 1
  ): boolean {
    const key = this.generateKey(filters, sortBy, order, search, page);
    return this.cache.has(key);
  }
}

// Singleton instance for global use
let cacheInstance: ClientFilterCache | null = null;

export function getFilterCache(): ClientFilterCache {
  if (!cacheInstance) {
    cacheInstance = new ClientFilterCache(10);
  }
  return cacheInstance;
}
