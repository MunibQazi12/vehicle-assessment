/**
 * Client-Side Form Cache with FIFO (First In, First Out)
 * 
 * Caches form API responses to avoid redundant requests when users
 * open the same forms repeatedly within a session.
 * 
 * - Capacity: 10 entries (configurable)
 * - Eviction: FIFO - oldest entry is removed when cache is full
 * - Key: Form ID
 * - Lifetime: In-memory only (cleared on page refresh)
 */

import type { DealerTowerForm } from "@dealertower/types";

interface FormCacheEntry {
  form: DealerTowerForm;
  timestamp: number;
}

export class ClientFormCache {
  private cache: Map<string, FormCacheEntry>;
  private insertionOrder: string[];
  private maxSize: number;

  constructor(maxSize: number = 10) {
    this.cache = new Map();
    this.insertionOrder = [];
    this.maxSize = maxSize;
  }

  /**
   * Get cached form data if available
   */
  get(formId: string): FormCacheEntry | null {
    const entry = this.cache.get(formId);
    
    if (entry) {
      return entry;
    }
    
    return null;
  }

  /**
   * Set cache entry with FIFO eviction
   */
  set(formId: string, form: DealerTowerForm): void {
    // If key already exists, remove it from insertion order
    if (this.cache.has(formId)) {
      const index = this.insertionOrder.indexOf(formId);
      if (index > -1) {
        this.insertionOrder.splice(index, 1);
      }
    }

    // FIFO eviction: remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize && !this.cache.has(formId)) {
      const oldestKey = this.insertionOrder.shift();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    // Add new entry
    this.cache.set(formId, {
      form,
      timestamp: Date.now(),
    });
    this.insertionOrder.push(formId);
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
  has(formId: string): boolean {
    return this.cache.has(formId);
  }

  /**
   * Remove specific entry from cache
   */
  delete(formId: string): boolean {
    const index = this.insertionOrder.indexOf(formId);
    if (index > -1) {
      this.insertionOrder.splice(index, 1);
    }
    return this.cache.delete(formId);
  }
}

// Singleton instance for global use
let cacheInstance: ClientFormCache | null = null;

export function getFormCache(): ClientFormCache {
  if (!cacheInstance) {
    cacheInstance = new ClientFormCache(10);
  }
  return cacheInstance;
}
