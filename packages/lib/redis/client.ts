/**
 * Shared Redis Client
 * Provides a singleton Redis connection for all services
 */

import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

// Redis client singleton
let redisClient: Redis | null = null;
let redisInitialized = false;

/**
 * Get or create Redis client singleton
 */
export function getRedisClient(): Redis | null {
  if (redisClient && redisInitialized) {
    return redisClient;
  }
  
  if (!REDIS_URL) {
    if (!redisInitialized) {
      console.warn('[Redis] REDIS_URL not configured, Redis features disabled');
      redisInitialized = true;
    }
    return null;
  }
  
  if (!redisInitialized) {
    redisInitialized = true;
    
    try {
      redisClient = new Redis(REDIS_URL, {
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true,
      });
      
      redisClient.on('connect', () => {
        console.log('[Redis] Connected successfully');
      });
      
      redisClient.on('error', (err) => {
        console.error('[Redis] Connection error:', err.message);
      });
      
      redisClient.on('close', () => {
        console.log('[Redis] Connection closed');
      });
      
      // Attempt to connect
      redisClient.connect().catch((err) => {
        console.error('[Redis] Failed to connect:', err.message);
      });
    } catch (error) {
      console.error('[Redis] Error initializing client:', error);
      return null;
    }
  }
  
  return redisClient;
}

/**
 * Close Redis connection (for graceful shutdown)
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    redisInitialized = false;
    console.log('[Redis] Connection closed gracefully');
  }
}
