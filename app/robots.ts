import type { MetadataRoute } from "next";
import { getTenantHostname } from "@dealertower/lib/tenant/server-context";

/**
 * Dynamic robots.txt generator for multi-tenant dealer websites.
 *
 * This generates SEO-optimized robots.txt rules that:
 * - Allow all crawlers (search engines, AI/LLMs, etc.) to access public content
 * - Block internal API routes (/api/)
 * - Block Next.js internal files (/_next/)
 * - Block Vercel internal routes (/_vercel/)
 * - Include sitemap.xml reference for better indexing
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const hostname = await getTenantHostname();

  // Build the base URL for sitemap reference
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${hostname}`;

  return {
    rules: [
      {
        // All crawlers (search engines, AI/LLMs, etc.) can access public content
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // API routes - internal endpoints
          "/_next/", // Next.js internal files
          "/_vercel/", // Vercel internal routes
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
