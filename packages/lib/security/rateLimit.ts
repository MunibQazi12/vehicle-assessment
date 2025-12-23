/**
 * Rate Limiting Utility
 * Prevents spam submissions by tracking requests per IP
 * Uses Redis with TTL for automatic cleanup
 */

import { getRedisClient } from "@dealertower/lib/redis/client";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Check if request is within rate limit
 * @param identifier - Unique identifier (IP address, session ID, etc.)
 * @param config - Rate limit configuration
 * @param dealerId - Dealer ID for multi-tenant isolation (optional)
 * @returns Rate limit result
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { 
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "10", 10), 
    windowMs: 60000 
  }, // Default from env or 10 requests per minute
  dealerId?: string
): Promise<RateLimitResult> {
  const now = Date.now();
  const redis = getRedisClient();
  
  // If Redis not available, allow all requests (rate limiting disabled)
  if (!redis) {
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      resetAt: now + config.windowMs,
    };
  }
  
  try {
    // Include dealer ID in key for multi-tenant isolation
    const key = dealerId 
      ? `ratelimit:${dealerId}:${identifier}`
      : `ratelimit:${identifier}`;
    const ttlSeconds = Math.ceil(config.windowMs / 1000);
    
    // Get current count
    const currentCount = await redis.get(key);
    const count = currentCount ? parseInt(currentCount, 10) : 0;
    const resetAt = now + config.windowMs;
    
    // Check if limit exceeded
    if (count >= config.maxRequests) {
      const ttl = await redis.ttl(key);
      const actualResetAt = ttl > 0 ? now + (ttl * 1000) : resetAt;
      
      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetAt: actualResetAt,
      };
    }
    
    // Increment counter
    const newCount = await redis.incr(key);
    
    // Set TTL only on first request (when count was 0)
    if (newCount === 1) {
      await redis.expire(key, ttlSeconds);
    }
    
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - newCount,
      resetAt,
    };
  } catch (error) {
    console.error('[RateLimit] Redis error, allowing request:', error);
    // On error, allow the request (fail open)
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      resetAt: now + config.windowMs,
    };
  }
}

/**
 * Get client identifier from request
 * @param request - Next.js request object
 * @returns Client identifier (IP address)
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (for proxies/CDNs)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to connection IP (not available in Edge runtime)
  return "unknown";
}
