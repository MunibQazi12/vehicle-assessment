/**
 * Specials Page
 * Displays vehicle special offers and promotions
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { getTenantContext } from "@dealertower/lib/tenant/server-context";
import { fetchHomepageSpecials } from "@dealertower/lib/api/specials";
import { SpecialsGrid } from "@dealertower/components/specials";

export const metadata: Metadata = {
	title: "Special Offers | Vehicle Specials & Promotions",
	description:
		"Browse our current vehicle special offers, financing deals, and lease promotions.",
};

// Loading skeleton for the grid
function SpecialsGridSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
			{[...Array(4)].map((_, i) => (
				<div
					key={i}
					className="flex flex-col rounded-lg border border-zinc-200 bg-white overflow-hidden animate-pulse"
				>
					<div className="aspect-[4/3] w-full bg-zinc-200" />
					<div className="flex flex-1 flex-col p-4 space-y-3">
						<div className="h-6 w-3/4 bg-zinc-200 rounded" />
						<div className="h-4 w-1/2 bg-zinc-200 rounded" />
						<div className="h-12 w-1/2 bg-zinc-200 rounded mt-2" />
						<div className="h-4 w-2/3 bg-zinc-200 rounded" />
						<div className="mt-auto space-y-2">
							<div className="h-10 w-full bg-zinc-200 rounded" />
							<div className="h-10 w-full bg-zinc-200 rounded" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

async function SpecialsContent() {
	const { hostname, websiteInfo } = await getTenantContext();

	// Fetch specials from API
	const specials = await fetchHomepageSpecials(hostname);

	// Get primary color from website info
	const primaryColor = websiteInfo?.main_colors?.[0] || "#c8102e";

	if (specials.length === 0) {
		return (
			<div className="flex items-center justify-center py-12">
				<p className="text-zinc-500">
					No special offers available at this time.
				</p>
			</div>
		);
	}

	return (
		<SpecialsGrid
			specials={specials}
			primaryColor={primaryColor}
			columns={{ default: 1, sm: 2, lg: 3, xl: 4 }}
		/>
	);
}

export default function SpecialsPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-zinc-900 md:text-4xl">
					Special Offers
				</h1>
				<p className="mt-2 text-lg text-zinc-600">
					Explore our current financing and lease specials on new vehicles.
				</p>
			</div>

			{/* Specials Grid */}
			<Suspense fallback={<SpecialsGridSkeleton />}>
				<SpecialsContent />
			</Suspense>
		</div>
	);
}
