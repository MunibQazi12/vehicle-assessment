/**
 * Client-Side Filter Options Fetching API Route
 * POST /api/srp/filters/
 * 
 * Fetches updated filter options and counts for client-side filtering
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchFilters } from "@dealertower/lib/api/srp";
import type { FilterState } from "@dealertower/types/filters";

export const dynamic = "force-dynamic";

interface ClientFiltersRequest {
	filters: FilterState;
}

export async function POST(request: NextRequest) {
	const startTime = Date.now();
	console.log('[API] POST /api/srp/filters/ - Request started');

	try {
		const body = (await request.json()) as ClientFiltersRequest;

		const { filters } = body;

		// Read from environment variables only - not from request to prevent injection
		const hostname = process.env.NEXTJS_APP_HOSTNAME;
		const dealerId = process.env.NEXTJS_APP_DEALER_ID;

		if (!hostname || !dealerId) {
			console.error("[API] Missing required environment variables: NEXTJS_APP_HOSTNAME or NEXTJS_APP_DEALER_ID");
			return NextResponse.json(
				{ error: "Server configuration error" },
				{ status: 500 }
			);
		}

		// Fetch filter options from backend API
		const filtersData = await fetchFilters(hostname, filters);

		const duration = Date.now() - startTime;
		console.log(`[API] POST /api/srp/filters/ - 200 (${duration}ms)`);
		return NextResponse.json(filtersData);
	} catch (error) {
		const duration = Date.now() - startTime;
		console.error(`[API] POST /api/srp/filters/ - 500 (${duration}ms) - Error:`, error);
		return NextResponse.json(
			{
				error: "Failed to fetch filters",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
