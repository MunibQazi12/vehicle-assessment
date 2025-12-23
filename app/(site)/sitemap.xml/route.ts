import { fetchVDPSlugs } from "@dealertower/lib/api/srp";
import { getLazyDealerRegistry } from "@dealertower/lib/dealers/registry-map";
import { getDealerId } from "@dealertower/lib/dealers/loader";
import { getTenantHostname } from "@dealertower/lib/tenant/server-context";
import { shouldLoadStaticPages } from "@dealertower/lib/utils/pageLoader";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { cache } from "react";

interface SitemapEntry {
	url: string;
	lastModified: Date;
	changeFrequency: string;
	priority: number;
}

/**
 * Dynamic sitemap.xml generator for multi-tenant dealer websites.
 *
 * Generates a comprehensive sitemap including:
 * - Static pages (homepage, SRP routes)
 * - Dealer-specific custom pages from registry
 * - Vehicle detail pages (VDP) from inventory
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-handlers
 */
export async function GET() {
	const hostname = await getTenantHostname();

	// dealerId is the UUID from env variable (used for registry lookup)
	const dealerId = getDealerId();

	// Build the base URL
	const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
	const baseUrl = `${protocol}://${hostname}`;

	const sitemapEntries: SitemapEntry[] = [];

	// Current date for lastModified
	const now = new Date();

	// ============================================================================
	// 1. Static Core Pages
	// ============================================================================
	sitemapEntries.push(
		{
			url: baseUrl,
			lastModified: now,
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/new-vehicles/`,
			lastModified: now,
			changeFrequency: "hourly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/used-vehicles/`,
			lastModified: now,
			changeFrequency: "hourly",
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
					const customPageEntries = Object.keys(registry.routes)
						.filter((route) => route !== "") // Skip home page (already added)
						.map((route) => ({
							url: `${baseUrl}/${route}/`,
							lastModified: now,
							changeFrequency: "weekly",
							priority: 0.7,
						}));

					sitemapEntries.push(...customPageEntries);
				}
			} catch {
				// Registry not found for this dealer - that's OK, skip custom pages
				console.log(
					`[Sitemap] No custom registry found for dealer ${dealerId}`
				);
			}
		} else {
			// Load pages from Payload CMS
			const cmsPages = await queryCMSPages();

			if (cmsPages && cmsPages.length > 0) {
				const cmsPageEntries = cmsPages
					.filter((page) => page.slug !== "/") // Skip home page (already added)
					.map((page) => ({
						url: page.slug === "/" ? baseUrl : `${baseUrl}/${page.slug}/`,
						lastModified:
							page.updatedAt && typeof page.updatedAt === "string"
								? new Date(page.updatedAt)
								: now,
						changeFrequency: "weekly",
						priority: 0.7,
					}));

				sitemapEntries.push(...cmsPageEntries);
			}
		}
	}

	// ============================================================================
	// 3. Vehicle Detail Pages (VDP) from Inventory
	// ============================================================================
	try {
		// Fetch all VDP slugs for sitemap
		const vdpSlugsResponse = await fetchVDPSlugs(hostname);

		if (vdpSlugsResponse?.success && vdpSlugsResponse?.data?.slugs) {
			const vdpEntries = vdpSlugsResponse.data.slugs.map((slug) => ({
				url: `${baseUrl}/vehicle/${slug}/`,
				lastModified: now,
				changeFrequency: "daily",
				priority: 0.8,
			}));

			sitemapEntries.push(...vdpEntries);
		}
	} catch (error) {
		console.error("[Sitemap] Error fetching VDP slugs:", error);
		// Continue without vehicle pages if API fails
	}

	// Generate XML
	const xml = generateSitemapXML(sitemapEntries);

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	});
}

/**
 * Generate sitemap XML from entries
 */
function generateSitemapXML(entries: SitemapEntry[]): string {
	const urlset = entries
		.map((entry) => {
			const lastmod = entry.lastModified.toISOString();
			return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

/**
 * Query all published pages from Payload CMS
 */
const queryCMSPages = cache(async () => {
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
				updatedAt: true,
			},
		});

		return result.docs || [];
	} catch (error) {
		console.error("[Sitemap] Error fetching CMS pages:", error);
		return [];
	}
});
