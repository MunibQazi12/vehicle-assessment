/**
 * API Route: Dealer Lineup
 * Normalizes upstream line-up responses for all dealership types
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchLineup } from "@dealertower/lib/api/lineup";

function ensureTrailingSlash(request: NextRequest) {
	const url = new URL(request.url);
	if (!url.pathname.endsWith('/')) {
		url.pathname = `${url.pathname}/`;
		return NextResponse.redirect(url, 308);
	}
	return null;
}

export async function GET(request: NextRequest) {
	const redirectResponse = ensureTrailingSlash(request);
	if (redirectResponse) return redirectResponse;

	try {
		const hostname = process.env.NEXTJS_APP_HOSTNAME;
		const dealerId = process.env.NEXTJS_APP_DEALER_ID;

		if (!hostname || !dealerId) {
			console.error("[API /api/lineup] Missing NEXTJS_APP_HOSTNAME or NEXTJS_APP_DEALER_ID env vars");
			return NextResponse.json(
				{ error: "Server configuration error" },
				{ status: 500 }
			);
		}

		const data = await fetchLineup(hostname);
		return NextResponse.json(data);
	} catch (error) {
		console.error("[API /api/lineup] Error fetching lineup:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch lineup",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	const redirectResponse = ensureTrailingSlash(request);
	if (redirectResponse) return redirectResponse;

	return NextResponse.json(
		{ error: "Method not allowed. Use GET." },
		{ status: 405 }
	);
}
