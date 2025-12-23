/**
 * CSRF Token Utilities
 * Protects against Cross-Site Request Forgery attacks
 * Uses Redis with TTL for automatic token expiration
 */

import { randomBytes, createHash } from "crypto";
import { getRedisClient } from "@dealertower/lib/redis/client";

// CSRF Configuration
const CSRF_ENABLED = process.env.CSRF_ENABLED !== "0"; // Enabled by default, set to "0" to disable
const TOKEN_TTL = parseInt(process.env.CSRF_TOKEN_TTL || "3600", 10); // Default: 1 hour (3600 seconds)
const MAX_TOKENS_PER_SESSION = 3;

/**
 * Generate Redis key for CSRF tokens
 * @param dealerId - Dealer identifier
 * @param sessionId - Session identifier
 */
function getRedisKey(dealerId: string, sessionId: string): string {
  return `csrf:${dealerId}:${sessionId}`;
}

/**
 * Generate CSRF token
 * @param sessionId - Session identifier
 * @param dealerId - Dealer identifier (required for Redis multi-tenancy)
 * @returns CSRF token
 */
export async function generateCSRFToken(
  sessionId: string,
  dealerId?: string
): Promise<string> {
  if (!CSRF_ENABLED) {
    return 'csrf-disabled';
  }
  
  if (!dealerId) {
    throw new Error('[CSRF] Dealer ID is required for token generation');
  }
  
  const redis = getRedisClient();
  
  if (!redis) {
    throw new Error('[CSRF] Redis connection required for CSRF tokens');
  }
  
  const token = randomBytes(32).toString("hex");
  const key = getRedisKey(dealerId, sessionId);
  
  // Get existing tokens (Redis handles expiration via TTL, but we keep token array for grace period)
  const existingData = await redis.get(key);
  const existing: string[] = existingData ? JSON.parse(existingData) : [];
  
  // Add new token (keep last N tokens for grace period)
  const updatedTokens = [...existing, token].slice(-MAX_TOKENS_PER_SESSION);
  
  // Store in Redis with TTL - Redis automatically expires the key
  await redis.setex(key, TOKEN_TTL, JSON.stringify(updatedTokens));
  
  return token;
}

/**
 * Validate CSRF token
 * @param sessionId - Session identifier
 * @param token - Token to validate
 * @param dealerId - Dealer identifier (required for Redis multi-tenancy)
 * @returns True if valid
 */
export async function validateCSRFToken(
  sessionId: string,
  token: string,
  dealerId?: string
): Promise<boolean> {
  if (!CSRF_ENABLED) {
    return true;
  }
  
  if (!dealerId) {
    throw new Error('[CSRF] Dealer ID is required for token validation');
  }
  
  const redis = getRedisClient();
  
  if (!redis) {
    throw new Error('[CSRF] Redis connection required for CSRF tokens');
  }
  
  const key = getRedisKey(dealerId, sessionId);
  const existingData = await redis.get(key);
  
  if (!existingData) {
    return false;
  }
  
  const tokens: string[] = JSON.parse(existingData);
  
  // Check if any token matches (all tokens in Redis are valid due to TTL)
  const isValid = tokens.includes(token);
  
  return isValid;
}

/**
 * Generate session ID from request
 * @param request - Request object
 * @returns Session ID
 */
export function getSessionId(request: Request): string {
  // Try to get from cookie first
  const cookie = request.headers.get("cookie");
  if (cookie) {
    const match = cookie.match(/session_id=([^;]+)/);
    if (match) {
      return match[1];
    }
  }

  // Generate from IP + User-Agent
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
             request.headers.get("x-real-ip") || 
             "unknown";
  const userAgent = request.headers.get("user-agent") || "";
  
  return createHash("sha256")
    .update(`${ip}:${userAgent}`)
    .digest("hex");
}

/**
 * Generate session ID from Next.js headers (for Server Components)
 * @param headersList - Headers from await headers()
 * @returns Session ID
 */
export function getSessionIdFromHeaders(headersList: Headers): string {
  // Try to get from cookie first
  const cookie = headersList.get("cookie");
  if (cookie) {
    const match = cookie.match(/session_id=([^;]+)/);
    if (match) {
      return match[1];
    }
  }

  // Generate from IP + User-Agent
  const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || 
             headersList.get("x-real-ip") || 
             "unknown";
  const userAgent = headersList.get("user-agent") || "";
  
  return createHash("sha256")
    .update(`${ip}:${userAgent}`)
    .digest("hex");
}
