/**
 * Cache revalidation webhook endpoint
 * Provides tag-based cache invalidation via POST requests
 */

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getInvalidationTagsFromBody } from "@dealertower/lib/cache/tags";

/**
 * Handle GET requests to redirect to trailing slash
 */
export async function GET(request: NextRequest) {
	const url = new URL(request.url);
	if (!url.pathname.endsWith('/')) {
		url.pathname = url.pathname + '/';
		return NextResponse.redirect(url, 308);
	}
	return NextResponse.json(
		{ error: "Method not allowed. Use POST." },
		{ status: 405 }
	);
}

/**
 * POST /api/revalidate/
 *
 * Webhook endpoint for cache invalidation
 * SECURITY: Dealer ID is read from NEXTJS_APP_DEALER_ID environment variable only.
 * Request body cannot specify dealer_id to prevent cross-tenant cache attacks.
 *
 * Headers:
 *   x-revalidation-secret: <secret>
 *
 * Body:
 *   {
 *     "tags": ["srp:vehicles"]  // optional - specific tags to invalidate
 *   }
 *
 * @example
 * ```bash
 * # Invalidate all dealer cache
 * curl -X POST https://your-app.com/api/revalidate/ \
 *   -H "Content-Type: application/json" \
 *   -H "x-revalidation-secret: your-secret" \
 *   -d '{}'
 *
 * # Invalidate specific tags
 * curl -X POST https://your-app.com/api/revalidate/ \
 *   -H "Content-Type: application/json" \
 *   -H "x-revalidation-secret: your-secret" \
 *   -d '{"tags": ["srp:vehicles"]}'
 * ```
 */
export async function POST(request: NextRequest) {
	const startTime = Date.now();
	console.log('[API] POST /api/revalidate/ - Request started');

	// Redirect to trailing slash if missing
	const url = new URL(request.url);
	if (!url.pathname.endsWith('/')) {
		url.pathname = url.pathname + '/';
		return NextResponse.redirect(url, 308);
	}
	// Validate secret
	const secret = request.headers.get("x-revalidation-secret");
	if (secret !== process.env.REVALIDATION_SECRET) {
		const duration = Date.now() - startTime;
		console.warn(`[API] POST /api/revalidate/ - 401 (${duration}ms) - Invalid secret`);
		return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { tags } = body;

		// SECURITY: Always use dealer ID from environment, never from request
		const dealerId = process.env.NEXTJS_APP_DEALER_ID;
		if (!dealerId) {
			console.error('[API] NEXTJS_APP_DEALER_ID not configured');
			return NextResponse.json(
				{ error: "Server configuration error" },
				{ status: 500 }
			);
		}

		// Generate tags to invalidate for the environment-configured dealer
		const tagsToInvalidate = getInvalidationTagsFromBody({ dealer_id: dealerId, tags });

		// Invalidate all tags
		const invalidated: string[] = [];
		for (const tag of tagsToInvalidate) {
			try {
				revalidateTag(tag, '/');
				invalidated.push(tag);
			} catch (err) {
				console.error(`Failed to revalidate tag ${tag}:`, err);
			}
		}

		const duration = Date.now() - startTime;
		console.log(`[API] POST /api/revalidate/ - 200 (${duration}ms) - Invalidated: ${invalidated.join(', ')}`);
		return NextResponse.json({
			success: true,
			invalidated,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		const duration = Date.now() - startTime;
		console.error(`[API] POST /api/revalidate/ - 500 (${duration}ms) - Error:`, error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
