import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import { TenantProvider } from "@dealertower/lib/tenant/context";
import { getTenantContext } from "@dealertower/lib/tenant/server-context";
import { generateThemeStyleTag } from "@dealertower/lib/dealers/theme";
import { getDealerIconLinks } from "@dealertower/lib/dealers/assets";
import { loadDealerCSSVariables } from "@dealertower/lib/dealers/styles";
import { HeadScripts } from "@dealertower/components/scripts/HeadScripts";
import { BodyScripts, GenericBodyScripts } from "@dealertower/components/scripts/BodyScripts";
import { HeaderWrapper } from "@dealertower/components/layout/HeaderWrapper";
import { FooterWrapper } from "@dealertower/components/layout/FooterWrapper";
import { buildTenantMetadata } from "@dealertower/lib/seo/metadata";
import { JsonLd } from "@dealertower/lib/seo/jsonld";
import { buildBaseSchemaGraph } from "@dealertower/lib/seo/schema";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap",
});

const baseMetadata: Metadata = {
	title: "Dealer Tower SRP",
	description: "Multi-tenant Search Results Page for automotive dealerships",
};

export async function generateMetadata(): Promise<Metadata> {
	const { hostname } = await getTenantContext();
	return {
		...baseMetadata,
		...buildTenantMetadata({
			hostname,
			pathname: "/",
		}),
	};
}

/**
 * Force dynamic rendering since we use headers() for tenant detection
 */
export const dynamic = 'force-dynamic';

export default async function SiteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Get tenant context (cached - will be reused by all child components)
	const { hostname, dealerIdentifier, websiteInfo } = await getTenantContext();

	// Note: We don't call notFound() here because Next.js doesn't allow it in root layout
	// Individual pages will handle unsupported websites by checking for null websiteInfo
	// and calling notFound() at the page level

	// Get website scripts from website info (empty array if null)
	const websiteScripts = websiteInfo?.website_scripts || [];

	// Determine location - for layout, we use "everywhere" as default
	// Individual pages can pass their specific location
	const location = "everywhere";

	// Generate dynamic theme styles from websiteInfo
	const themeStyles = websiteInfo ? generateThemeStyleTag(websiteInfo) : null;

	// Load dealer-specific CSS variables (from dealers/{id}/styles/globals.css)
	const dealerCSSVariables = loadDealerCSSVariables();

	// Get dealer-specific icon links
	const iconLinks = getDealerIconLinks();

	const baseSchema = buildBaseSchemaGraph({ hostname, websiteInfo });

	return (
		<html lang="en">
			<head>
				{themeStyles && (
					<style dangerouslySetInnerHTML={{ __html: themeStyles }} />
				)}
				{/* Dealer-specific CSS variables (from dealers/{id}/styles/globals.css) */}
				{dealerCSSVariables && (
					<style dangerouslySetInnerHTML={{ __html: dealerCSSVariables }} />
				)}
				{/* Dealer-specific favicons and icons */}
				{iconLinks.map((link, index) => (
					<link key={index} {...link} />
				))}
				{/* Head scripts from API */}
				<HeadScripts scripts={websiteScripts} location={location} />
				{baseSchema && <JsonLd data={baseSchema} id="dt-schema-base" />}
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{/* Before body scripts */}
				<BodyScripts scripts={websiteScripts} location={location} position="before" />
				<GenericBodyScripts scripts={websiteScripts} location={location} />

				<TenantProvider
					hostname={hostname}
					dealerIdentifier={dealerIdentifier}
					websiteInfo={websiteInfo}
				>
					<Suspense fallback={<div className="h-20" />}>
						<HeaderWrapper websiteInfo={websiteInfo} />
					</Suspense>
					<main>
						{children}
					</main>
					<Suspense fallback={<div className="h-96" />}>
						<FooterWrapper websiteInfo={websiteInfo} />
					</Suspense>
				</TenantProvider>

				{/* After body scripts */}
				<BodyScripts scripts={websiteScripts} location={location} position="after" />
			</body>
		</html>
	);
}
