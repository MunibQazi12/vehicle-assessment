/**
 * API Route: Fetch Vehicles
 * Proxies requests to Dealer Tower API with caching
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchSRPRows } from "@dealertower/lib/api/srp";

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

export async function POST(request: NextRequest) {
	// Redirect to trailing slash if missing
	const url = new URL(request.url);
	if (!url.pathname.endsWith('/')) {
		url.pathname = url.pathname + '/';
		return NextResponse.redirect(url, 308);
	}
	try {
		// Read from environment variables only - not from request to prevent injection
		const hostname = process.env.NEXTJS_APP_HOSTNAME;
		const dealerId = process.env.NEXTJS_APP_DEALER_ID;

		if (!hostname || !dealerId) {
			console.error("[API /api/vehicles] Missing required environment variables: NEXTJS_APP_HOSTNAME or NEXTJS_APP_DEALER_ID");
			return NextResponse.json(
				{ error: "Server configuration error" },
				{ status: 500 }
			);
		}

		const body = await request.json();

		console.log("[API /api/vehicles] Fetching vehicles:", {
			dealerId,
			hostname,
			body,
		});

		const data = await fetchSRPRows(hostname, body);

		return NextResponse.json(data);
	} catch (error) {
		console.error("[API /api/vehicles] Error fetching vehicles:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch vehicles",
				details: error instanceof Error ? error.message : String(error)
			},
			{ status: 500 }
		);
	}
}
