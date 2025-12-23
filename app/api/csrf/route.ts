/**
 * CSRF Token Generation API Route
 * GET /api/csrf/
 * Generates CSRF tokens for form security
 */

import { NextRequest, NextResponse } from "next/server";
import { generateCSRFToken, getSessionId } from "@dealertower/lib/security/csrf";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  console.log('[API] GET /api/csrf/ - Request started');
  
  try {
    const sessionId = getSessionId(request);
    const dealerId = process.env.NEXTJS_APP_DEALER_ID;
    const token = await generateCSRFToken(sessionId, dealerId);

    const response = NextResponse.json({
      success: true,
      token,
    });

    // Set session ID cookie for consistent validation
    response.cookies.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    const duration = Date.now() - startTime;
    console.log(`[API] GET /api/csrf/ - 200 (${duration}ms)`);
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API] GET /api/csrf/ - 500 (${duration}ms) - Error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate security token",
      },
      { status: 500 }
    );
  }
}
