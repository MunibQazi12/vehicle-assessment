/**
 * Client-Side Vehicle Fetching API Route
 * POST /api/srp/vehicles/
 * 
 * Fetches filtered vehicle data for client-side filtering without page reloads
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchSRPRows } from "@dealertower/lib/api/srp";
import type { FilterState } from "@dealertower/types/filters";

export const dynamic = "force-dynamic";

interface ClientVehicleRequest {
	filters: FilterState;
	page?: number;
	itemsPerPage?: number;
	sortBy?: string;
	order?: "asc" | "desc";
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as ClientVehicleRequest;

		const {
			filters,
			page = 1,
			itemsPerPage = 24,
			sortBy,
			order,
		} = body;

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

		// Build API request payload
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const apiRequest: Record<string, any> = {
			...filters,
			page,
			items_per_page: itemsPerPage,
			...(sortBy && { sort_by: sortBy }),
			...(order && { order }),
		};

		// Fetch vehicle data from backend API
		const vehicleData = await fetchSRPRows(hostname, apiRequest);

		return NextResponse.json(vehicleData);
	} catch (error) {
		console.error("[API] Error fetching vehicles:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch vehicles",
				message: error instanceof Error ? error.message : "Unknown error"
			},
			{ status: 500 }
		);
	}
}
