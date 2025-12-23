import Image from 'next/image'

import { fetchLineup } from '@dealertower/lib/api/lineup'
import { getTenantContext } from '@dealertower/lib/tenant/server-context'
import { addBaseIfRelative } from '@dealertower/lib/utils/url'
import { SmartLink } from '@dealertower/components/ui'

import type { ManufacturerLogoGridBlock as ManufacturerLogoGridBlockType } from '@dtcms/payload-types'

type BrandCard = {
	name: string
	image?: string | null
	url?: string | null
}

async function loadLineupBrands(): Promise<BrandCard[]> {
	const { hostname, dealerIdentifier } = await getTenantContext()

	if (!hostname || !dealerIdentifier) {
		return []
	}

	try {
		const lineup = await fetchLineup(hostname)
		const brandSection = lineup.data.sections.find((section) => section.type === 'brands')

		const normalized = brandSection?.items
			.map<BrandCard>((item) => ({
				name: item.label?.trim() || '',
				image: item.image_url ?? null,
				url: item.url ?? null,
			}))
			.filter((item) => item.name.length > 0)

		if (normalized && normalized.length > 0) {
			return normalized
		}
	} catch (error) {
		console.error('[ManufacturerLogoGrid] Failed to load lineup brands', error)
	}

	return []
}

async function loadSecondaryDealerBrands(hostname: string): Promise<BrandCard[]> {
	const baseUrl = `https://${hostname}`

	try {
		const lineup = await fetchLineup(hostname)
		const brandSection = lineup.data.sections.find((section) => section.type === 'brands')

		const normalized = brandSection?.items
			.map<BrandCard>((item) => ({
				name: item.label?.trim() || '',
				image: item.image_url ?? null,
				url: addBaseIfRelative(item.url, baseUrl),
			}))
			.filter((item) => item.name.length > 0)

		return normalized ?? []
	} catch (error) {
		console.error(
			`[ManufacturerLogoGrid] Failed to load brands from secondary dealer: ${hostname}`,
			error,
		)
		return []
	}
}

/**
 * Filter secondary dealer brands to exclude any that already appear in the current dealer brands
 */
function filterSecondaryBrands(secondaryBrands: BrandCard[], currentBrands: BrandCard[]): BrandCard[] {
	const excludedSet = new Set(currentBrands.map((b) => b.name.toLowerCase()))
	return secondaryBrands.filter((item) => !excludedSet.has(item.name.toLowerCase()))
}

function BrandCardItem({ brand }: { brand: BrandCard }) {
	const hasImage = Boolean(brand.image)

	const content = (
		<div className="flex items-center justify-center p-3 sm:p-4 hover:scale-110 transition-all duration-300 cursor-pointer group">
			{hasImage ? (
				<div className="relative h-10 sm:h-12 lg:h-16 w-full">
					<Image
						src={brand.image!}
						alt={`${brand.name} logo`}
						fill
						sizes="(max-width: 640px) 40vw, (max-width: 768px) 18vw, 160px"
						className="object-contain transition-all duration-300"
						loading="lazy"
					/>
				</div>
			) : (
				<span className="font-sans text-sm sm:text-base lg:text-lg text-gray-800">
					{brand.name}
				</span>
			)}
		</div>
	)

	if (brand.url) {
		return (
			<SmartLink href={brand.url} className="block">
				{content}
			</SmartLink>
		)
	}

	return <div className="h-full">{content}</div>
}

export default async function ManufacturerLogoGridBlock({
	columns,
	secondaryDealerHostname,
}: ManufacturerLogoGridBlockType) {
	let brands: BrandCard[] = []

	if (secondaryDealerHostname) {
		// Load both current and secondary dealer brands in parallel
		const [currentBrandsResult, secondaryBrandsResult] = await Promise.allSettled([
			loadLineupBrands(),
			loadSecondaryDealerBrands(secondaryDealerHostname),
		])

		// Extract results with fallback to empty arrays on failure
		const currentBrands = currentBrandsResult.status === 'fulfilled' ? currentBrandsResult.value : []
		const allSecondaryBrands =
			secondaryBrandsResult.status === 'fulfilled' ? secondaryBrandsResult.value : []

		// Filter secondary brands to exclude duplicates from current dealer
		brands = filterSecondaryBrands(allSecondaryBrands, currentBrands)
	} else {
		// No secondary dealer - just show current dealer brands
		brands = await loadLineupBrands()
	}

	if (brands.length === 0) {
		return null
	}

	// Map columns to grid classes
	const gridColumns: Record<string, string> = {
		'2': 'grid-cols-2',
		'3': 'grid-cols-2 md:grid-cols-3',
		'4': 'grid-cols-2 md:grid-cols-4',
		'5': 'grid-cols-2 md:grid-cols-5',
		'6': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
	}

	const gridClass = gridColumns[columns || '5'] || gridColumns['5']

	return (
		<section className="py-4 md:py-6 lg:py-8 bg-white">
			<div className="max-w-7xl mx-auto px-4">
				<div className={`grid ${gridClass} gap-4 sm:gap-6 lg:gap-8`}>
					{brands.map((brand) => (
						<BrandCardItem key={brand.name} brand={brand} />
					))}
				</div>
			</div>
		</section>
	)
}
