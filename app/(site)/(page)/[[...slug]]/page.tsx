import { notFound } from "next/navigation";
import { Metadata } from "next";
import type { Metadata as NextMetadata } from 'next'

// Static page imports
import {
	getDealerPageMetadataLazy,
	dealerRouteExistsLazy,
	getDealerId,
	loadDealerPageComponent,
} from "@dealertower/lib/dealers/loader";
import { getTenantContext } from "@dealertower/lib/tenant/server-context";
import { buildTenantMetadata } from "@dealertower/lib/seo/metadata";
import { JsonLd } from "@dealertower/lib/seo/jsonld";
import { buildWebPageSchemaGraph } from "@dealertower/lib/seo/schema";
import { shouldLoadStaticPages } from "@dealertower/lib/utils/pageLoader";

// CMS page imports
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { cache } from 'react'

import { RenderBlocks } from '@dtcms/blocks/RenderBlocks'
import { RenderHero } from '@dtcms/heros/RenderHero'
import { generateMeta } from '@dtcms/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@dtcms/components/LivePreviewListener'
import { Breadcrumb } from '@dtcms/components/Breadcrumb'

interface PageProps {
	params: Promise<{
		slug?: string[];
	}>;
}

/**
 * Generate metadata - delegates to static or CMS based on env
 */
export async function generateMetadata({
	params,
}: PageProps): Promise<NextMetadata> {
	if (shouldLoadStaticPages()) {
		return generateStaticMetadata({ params })
	}
	return generateCMSMetadata({ params })
}

/**
 * Static pages metadata generation
 */
async function generateStaticMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const route = slug?.join("/") || "";
	const canonicalPath = route ? `/${route}/` : "/";

	const [metadata, { hostname }] = await Promise.all([
		getDealerPageMetadataLazy(route),
		getTenantContext(),
	]);

	const canonical = buildTenantMetadata({
		hostname,
		pathname: canonicalPath,
	});

	return {
		...(metadata || {}),
		metadataBase: metadata?.metadataBase ?? canonical.metadataBase,
		alternates: {
			...metadata?.alternates,
			canonical:
				metadata?.alternates?.canonical ?? canonical.alternates?.canonical,
		},
	};
}

/**
 * CMS pages metadata generation
 */
async function generateCMSMetadata({ params: paramsPromise }: PageProps): Promise<NextMetadata> {
	const { slug } = await paramsPromise

	const tenantId = getDealerId()

	if (!tenantId) {
		return {}
	}

	// Join slug array and decode to support slugs with special characters
	const slugString = slug ? slug.map(decodeURIComponent).join('/') : '/'

	const page = await queryPageBySlug({
		slug: slugString,
	})

	return generateMeta({ doc: page })
}

/**
 * Unified page component - renders static or CMS pages based on LOAD_STATIC_PAGES env
 */
export default async function Page({ params }: PageProps) {
	const resolvedParams = await params;
	const route = resolvedParams.slug?.join("/") || "";
	const canonicalPath = route ? `/${route}/` : "/";
	const { hostname } = await getTenantContext();
	const canonicalUrl = buildTenantMetadata({
		hostname,
		pathname: canonicalPath,
	}).alternates?.canonical as string | undefined;

	const paramsPromise = Promise.resolve(resolvedParams);

	const pageName =
		route === ""
			? "Home"
			: route
				.split("/")
				.slice(-1)[0]
				.replace(/[-_]+/g, " ")
				.trim();

	const pageSchema =
		canonicalUrl
			? buildWebPageSchemaGraph({
				hostname,
				canonicalUrl,
				name: pageName || undefined,
			})
			: null;

	if (shouldLoadStaticPages()) {
		return (
			<>
				{pageSchema && <JsonLd data={pageSchema} id="dt-schema-webpage" />}
				<StaticPage params={paramsPromise} />
			</>
		);
	}
	return (
		<>
			{pageSchema && <JsonLd data={pageSchema} id="dt-schema-webpage" />}
			<CMSPage params={paramsPromise} />
		</>
	);
}

/**
 * Static page renderer
 * Routes are resolved from the dealer's lazy registry based on NEXTJS_APP_DEALER_ID
 * Components are dynamically imported only when their route is accessed.
 */
async function StaticPage({ params }: PageProps) {
	const { slug } = await params;
	const route = slug?.join("/") || "";

	// Check if dealer is configured
	const dealerId = getDealerId();
	if (!dealerId) {
		notFound();
	}

	// Check if route exists for this dealer
	const routeExists = await dealerRouteExistsLazy(route);
	if (!routeExists) {
		notFound();
	}

	// Dynamically load the component for this route
	const Component = await loadDealerPageComponent(route);
	if (!Component) {
		notFound();
	}

	// Render the dynamically loaded component
	return <Component />;
}

/**
 * CMS page renderer
 * Pages are loaded from Payload CMS based on slug and tenant ID from env
 */
async function CMSPage({ params: paramsPromise }: PageProps) {
	const { isEnabled: draft } = await draftMode()
	const { slug } = await paramsPromise

	const dealerId = getDealerId()

	if (!dealerId) {
		notFound()
	}

	// Join slug array and decode to support slugs with special characters
	// Empty slug means home page ('/')
	const slugString = slug ? slug.map(decodeURIComponent).join('/') : '/'

	const page = await queryPageBySlug({
		slug: slugString,
	})

	if (!page) {
		notFound()
	}

	const { hero, layout, breadcrumbs, enableBreadcrumb } = page

	return (
		<article>
			<PageClient />

			{draft && <LivePreviewListener />}

			{enableBreadcrumb && <Breadcrumb breadcrumbs={breadcrumbs} />}
			<RenderHero {...hero} />
			<RenderBlocks blocks={layout} />
		</article>
	)
}

/**
 * Query page by slug from Payload CMS
 */
const queryPageBySlug = cache(
	async ({ slug, }: { slug: string }) => {
		const { isEnabled: draft } = await draftMode()

		const payload = await getPayload({ config: configPromise })

		const result = await payload.find({
			collection: 'pages',
			draft,
			limit: 1,
			depth: 1,
			pagination: false,
			overrideAccess: draft,
			where: {
				and: [
					{
						slug: {
							equals: slug,
						},
					},
				],
			},
		})

		return result.docs?.[0] || null
	},
)
