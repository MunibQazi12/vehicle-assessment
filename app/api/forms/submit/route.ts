/**
 * Form Submission API Route
 * POST /api/forms/submit/
 * Handles form submissions and forwards to backend API
 */

import { NextRequest, NextResponse } from "next/server";
import type { FormSubmissionResponse } from "@dealertower/types";
import { checkRateLimit, getClientIdentifier } from "@dealertower/lib/security/rateLimit";
import { validateCSRFToken, getSessionId } from "@dealertower/lib/security/csrf";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('[API] POST /api/forms/submit/ - Request started');
  
  try {
    // Read dealer ID from environment (used for rate limiting and CSRF)
    const dealerId = process.env.NEXTJS_APP_DEALER_ID;
    
    // 1. Rate Limiting (configurable via env)
    const rateLimitMax = process.env.RATE_LIMIT_MAX_REQUESTS;
    
    if (rateLimitMax) {
      const maxRequests = parseInt(rateLimitMax, 10);
      const clientId = getClientIdentifier(request);
      const rateLimit = await checkRateLimit(clientId, { maxRequests, windowMs: 60000 }, dealerId);
      
      if (!rateLimit.allowed) {
        const secondsUntilReset = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
        console.warn(`[API] Rate limit exceeded for client ${clientId} - Reset in ${secondsUntilReset}s`);
        return NextResponse.json<FormSubmissionResponse>(
          {
            success: false,
            error: `Please wait ${secondsUntilReset} second${secondsUntilReset !== 1 ? 's' : ''} before trying again.`,
          },
          { 
            status: 429,
            headers: {
              "X-RateLimit-Limit": rateLimit.limit.toString(),
              "X-RateLimit-Remaining": rateLimit.remaining.toString(),
              "X-RateLimit-Reset": new Date(rateLimit.resetAt).toISOString(),
              "Retry-After": secondsUntilReset.toString(),
            }
          }
        );
      }
    }

    // 2. Origin Validation (configurable via env flag: 0=disabled, 1=enabled)
    const validateOrigin = process.env.VALIDATE_ORIGIN === "1";
    
    if (validateOrigin) {
      const origin = request.headers.get("origin");
      const envHostname = process.env.NEXTJS_APP_HOSTNAME;
      
      if (origin && envHostname) {
        const originUrl = new URL(origin);
        const expectedHost = envHostname.replace(/^www\./, "");
        const actualHost = originUrl.hostname.replace(/^www\./, "");
        
        if (actualHost !== expectedHost && !actualHost.endsWith(".dealertower.com")) {
          console.warn(`[API] Invalid origin: ${origin} (expected: ${envHostname})`);
          return NextResponse.json<FormSubmissionResponse>(
            {
              success: false,
              error: "Invalid request origin",
            },
            { status: 403 }
          );
        }
      }
    }

    const formData = await request.formData();
    const formId = formData.get("form_id") as string;

    // Read from environment variables only - not from request to prevent injection
    const hostname = process.env.NEXTJS_APP_HOSTNAME;
    const apiUrl = process.env.DEALER_TOWER_API_URL;

    if (!hostname || !dealerId || !apiUrl) {
      console.error(
        "[API] Missing required environment variables: NEXTJS_APP_HOSTNAME, NEXTJS_APP_DEALER_ID, or DEALER_TOWER_API_URL"
      );
      return NextResponse.json<FormSubmissionResponse>(
        {
          success: false,
          error: "Server configuration error",
        },
        { status: 500 }
      );
    }

    // 3. CSRF Token Validation
    const csrfToken = formData.get("csrf_token") as string;
    const sessionId = getSessionId(request);
    
    if (!await validateCSRFToken(sessionId, csrfToken, dealerId)) {
      return NextResponse.json<FormSubmissionResponse>(
        {
          success: false,
          error: "Invalid security token. Please refresh the page and try again.",
        },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!formId) {
      return NextResponse.json<FormSubmissionResponse>(
        {
          success: false,
          error: "Form ID is required",
        },
        { status: 400 }
      );
    }

    // Prepare form data for backend API
    const backendFormData = new FormData();
    
    // Copy all form data except csrf_token (internal Next.js use only)
    for (const [key, value] of formData.entries()) {
      if (key !== "csrf_token") {
        backendFormData.append(key, value);
      }
    }

    console.log(`[API] Form ID: ${formId}, data: `, Object.fromEntries(backendFormData.entries()));

    // Submit to Dealer Tower API
    // const backendUrl = `${apiUrl}/${hostname}/v2/forms/${formId}/submit`;
    
    // console.log(`[API] Submitting form to: ${backendUrl}`);
    
    // const backendResponse = await fetch(backendUrl, {
    //   method: "POST",
    //   body: backendFormData,
    // });

    // if (!backendResponse.ok) {
    //   const errorText = await backendResponse.text();
    //   console.error(
    //     `[API] Backend form submission failed: ${backendResponse.status} - ${errorText}`
    //   );
      
    //   return NextResponse.json<FormSubmissionResponse>(
    //     {
    //       success: false,
    //       error: "Failed to submit form",
    //     },
    //     { status: backendResponse.status }
    //   );
    // }

    // const result = await backendResponse.json();

    const duration = Date.now() - startTime;
    console.log(`[API] POST /api/forms/submit/ - 200 (${duration}ms)`);
    return NextResponse.json<FormSubmissionResponse>({
      success: true,
    //   message: result.message || "Form submitted successfully",
      message: "Form submitted successfully",
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API] POST /api/forms/submit/ - 500 (${duration}ms) - Error:`, error);
    return NextResponse.json<FormSubmissionResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
