/**
 * Forms List API Route
 * GET /api/forms
 * Fetches all available forms for the current dealer
 */

import { NextResponse } from "next/server";
import { fetchFormsList } from "@dealertower/lib/api/forms";
import type { FormsListAPIResponse } from "@dealertower/types";

export async function GET() {
	const startTime = Date.now();

	try {
		console.log(`[API] GET /api/forms/ - Request started`);

		// Read from environment variables only - not from request to prevent injection
		const hostname = process.env.NEXTJS_APP_HOSTNAME;
		const dealerIdentifier = process.env.NEXTJS_APP_DEALER_ID;

		if (!hostname || !dealerIdentifier) {
			console.error("[API] Missing required environment variables: NEXTJS_APP_HOSTNAME or NEXTJS_APP_DEALER_ID");
			return NextResponse.json<FormsListAPIResponse>(
				{
					success: false,
					error: "Server configuration error",
				},
				{ status: 500 }
			);
		}

		const response = await fetchFormsList(hostname);

		if (!response.success) {
			const duration = Date.now() - startTime;
			console.warn(`[API] GET /api/forms/ - Error (${duration}ms)`);
			return NextResponse.json<FormsListAPIResponse>(response, { status: 500 });
		}

		const duration = Date.now() - startTime;
		console.log(`[API] GET /api/forms/ - 200 (${duration}ms) - ${response.data?.length || 0} forms`);
		return NextResponse.json<FormsListAPIResponse>(response);
	} catch (error) {
		console.error("Error fetching forms list:", error);
		return NextResponse.json<FormsListAPIResponse>(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 }
		);
	}
}
