/**
 * Form Fetch API Route
 * GET /api/forms/[formId]
 * Fetches a form by ID with caching
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchForm } from "@dealertower/lib/api/forms";
import type { FormAPIResponse } from "@dealertower/types";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ formId: string }> }
) {
	const startTime = Date.now();

	try {
		const { formId } = await params;
		console.log(`[API] GET /api/forms/${formId}/ - Request started`);

		// Read from environment variables only - not from request to prevent injection
		const hostname = process.env.NEXTJS_APP_HOSTNAME;
		const dealerIdentifier = process.env.NEXTJS_APP_DEALER_ID;

		if (!hostname || !dealerIdentifier) {
			console.error("[API] Missing required environment variables: NEXTJS_APP_HOSTNAME or NEXTJS_APP_DEALER_ID");
			return NextResponse.json<FormAPIResponse>(
				{
					success: false,
					error: "Server configuration error",
				},
				{ status: 500 }
			);
		}

		if (!formId) {
			return NextResponse.json<FormAPIResponse>(
				{
					success: false,
					error: "Form ID is required",
				},
				{ status: 400 }
			);
		}

		const response = await fetchForm(hostname, formId);

		if (!response.success) {
			const duration = Date.now() - startTime;
			console.warn(`[API] GET /api/forms/${formId}/ - 404 (${duration}ms)`);
			return NextResponse.json<FormAPIResponse>(response, { status: 404 });
		}

		const duration = Date.now() - startTime;
		console.log(`[API] GET /api/forms/${formId}/ - 200 (${duration}ms)`);
		return NextResponse.json<FormAPIResponse>(response);
	} catch (error) {
		console.error("Error fetching form:", error);
		return NextResponse.json<FormAPIResponse>(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 }
		);
	}
}
