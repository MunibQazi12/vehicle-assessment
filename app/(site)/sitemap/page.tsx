import type { Metadata } from "next";
import { getLazyDealerRegistry } from "@dealertower/lib/dealers/registry-map";
import { getDealerId } from "@dealertower/lib/dealers/loader";
import { fetchWebsiteInformation } from "@dealertower/lib/api/dealer";
import { getTenantHostname } from "@dealertower/lib/tenant/server-context";
import Link from "next/link";
import { buildTenantMetadata } from "@dealertower/lib/seo/metadata";
import { shouldLoadStaticPages } from "@dealertower/lib/utils/pageLoader";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { cache } from "react";

export async function generateMetadata(): Promise<Metadata> {
	const hostname = await getTenantHostname();
	return {
		title: "Sitemap",
		description: "Complete sitemap of all pages on this website",
		...buildTenantMetadata({
			hostname,
			pathname: "/sitemap/",
		}),
	};
}

/**
 * Force dynamic rendering since we use tenant context
 */
export const dynamic = "force-dynamic";

interface SitemapEntry {
	url: string;
	label: string;
	category: string;
	priority: number;
}

/**
 * HTML Sitemap Page
 *
 * Displays a user-friendly HTML sitemap with all pages organized by category.
 * Uses the same logic as sitemap.xml but presents it in an accessible format.
 */
export default async function SitemapPage() {
	// Get hostname and dealer info for brand colors
	const hostname = await getTenantHostname();
	const dealerInfo = await fetchWebsiteInformation(hostname);

	// dealerId is the UUID from env variable (used for registry lookup)
	const dealerId = getDealerId();

	// Extract brand colors (fallback to default blue colors if not available)
	const mainColors = dealerInfo?.main_colors || [];
	const primaryColor = mainColors[0] || "#000";
	const accentColor = mainColors[1] || "#fff";

	const sitemapEntries: SitemapEntry[] = [];

	// ============================================================================
	// 1. Static Core Pages
	// ============================================================================
	sitemapEntries.push(
		{
			url: "/",
			label: "Home",
			category: "Main Pages",
			priority: 1.0,
		},
		{
			url: "/new-vehicles/",
			label: "New Vehicles",
			category: "Main Pages",
			priority: 0.9,
		},
		{
			url: "/used-vehicles/",
			label: "Used Vehicles",
			category: "Main Pages",
			priority: 0.9,
		}
	);

	// ============================================================================
	// 2. Dealer-Specific Custom Pages (Registry or CMS)
	// ============================================================================
	if (dealerId) {
		if (shouldLoadStaticPages()) {
			// Load pages from dealer registry (static pages)
			try {
				const registry = await getLazyDealerRegistry(dealerId);

				if (registry?.routes) {
					const customPageEntries = Object.entries(registry.routes)
						.filter(([route]) => route !== "") // Skip home page (already added)
						.map(([route]) => ({
							url: `/${route}/`,
							label: formatRouteLabel(route),
							category: "Dealer Pages",
							priority: 0.7,
						}));

					sitemapEntries.push(...customPageEntries);
				}
			} catch {
				// Registry not found for this dealer - that's OK, skip custom pages
				console.log(
					`[Sitemap Page] No custom registry found for dealer ${dealerId}`
				);
			}
		} else {
			// Load pages from Payload CMS
			const cmsPages = await queryCMSPages();

			if (cmsPages && cmsPages.length > 0) {
				const cmsPageEntries = cmsPages
					.filter((page) => page.slug !== "/") // Skip home page (already added)
					.map((page) => ({
						url: page.slug === "/" ? "/" : `/${page.slug}/`,
						label: page.title || formatRouteLabel(page.slug),
						category: "Pages",
						priority: 0.7,
					}));

				sitemapEntries.push(...cmsPageEntries);
			}
		}
	}

	// Separate home page from other entries
	const homeEntry = sitemapEntries.find((entry) => entry.url === "/");
	const otherEntries = sitemapEntries.filter((entry) => entry.url !== "/");

	return (
		<main>
			<section
				className="py-12 md:py-16 lg:py-20 bg-white"
				style={{
					["--primary-color" as string]: primaryColor,
					["--accent-color" as string]: accentColor,
				}}
			>
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Page Title */}
					<h1
						className="font-sans font-bold text-3xl md:text-4xl mb-8 text-center"
						style={{ color: primaryColor }}
					>
						Sitemap
					</h1>

					{/* Single Column List */}
					<div className="bg-gray-50 rounded-lg p-6 sm:p-8 shadow-sm">
						{/* Home Page - Featured */}
						{homeEntry && (
							<div className="mb-6 pb-4 border-b border-gray-200">
								<Link
									href={homeEntry.url}
									className="font-sans text-lg font-semibold transition-colors duration-200 cursor-pointer [color:var(--primary-color)] hover:[color:var(--accent-color)]"
								>
									{homeEntry.label}
								</Link>
							</div>
						)}

						{/* All Other Pages */}
						<ul className="grid grid-cols-1 gap-4">
							{otherEntries.map((entry, index) => (
								<li key={index}>
									<Link
										href={entry.url}
										className="font-sans text-base text-gray-700 hover:[color:var(--accent-color)] transition-colors duration-200 flex items-center group cursor-pointer"
									>
										<span className="w-2 h-2 rounded-full mr-3 opacity-60 group-hover:opacity-100 transition-opacity duration-200 [background-color:var(--accent-color)]"></span>
										{entry.label}
									</Link>
								</li>
							))}
						</ul>

						{/* Page Count Info */}
						<div className="mt-6 pt-4 border-t border-gray-200">
							<p className="text-sm text-gray-500 text-center">
								Total pages: {sitemapEntries.length}
							</p>
						</div>
					</div>

					{/* XML Sitemap Reference */}
					<div className="mt-8 text-center">
						<p className="text-sm text-gray-600 mb-2">
							For search engines and automated tools:
						</p>
						<Link
							href="/sitemap.xml"
							className="inline-flex items-center [color:var(--accent-color)] hover:[color:var(--primary-color)] transition-colors duration-200 text-sm font-medium"
						>
							<svg
								className="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								/>
							</svg>
							View XML Sitemap
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}

/**
 * Format route path to human-readable label
 */
function formatRouteLabel(route: string): string {
	return route
		.split("/")
		.filter(Boolean)
		.map((segment) =>
			segment
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")
		)
		.join(" / ");
}

/**
 * Query all published pages from Payload CMS
 */
const queryCMSPages = cache(async (): Promise<{ slug: string; title: string }[]> => {
	try {
		const payload = await getPayload({ config: configPromise });

		const result = await payload.find({
			collection: "pages",
			limit: 1000,
			depth: 0,
			pagination: false,
			where: {
				_status: {
					equals: "published",
				},
			},
			select: {
				slug: true,
				title: true,
			},
		});

		return (result.docs || []) as { slug: string; title: string }[];
	} catch (error) {
		console.error("[Sitemap Page] Error fetching CMS pages:", error);
		return [];
	}
});
