/**
 * Proxy for session management
 * Runs on every request to manage session cookies
 * Tenant context is resolved in server-context.ts via headers/env
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHash } from "crypto";

/**
 * Generate session ID from request (same logic as csrf.ts)
 */
function generateSessionId(request: NextRequest): string {
  // Try to get from cookie first
  const sessionCookie = request.cookies.get("session_id");
  if (sessionCookie?.value) {
    return sessionCookie.value;
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
 * Proxy function that runs on every request
 * Manages session cookies for CSRF protection and user tracking
 */
export function proxy(request: NextRequest) {
  // Generate or retrieve session ID
  const sessionId = generateSessionId(request);

  // Create response (tenant context is resolved in server-context.ts)
  const response = NextResponse.next();

  // Set session ID cookie if not already set
  if (!request.cookies.get("session_id")) {
    response.cookies.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });
  }

  return response;
}

// Config for proxy to run on all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
