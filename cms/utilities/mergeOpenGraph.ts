import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const getDefaultOpenGraph = (siteName: string = 'Dealer Tower'): Metadata['openGraph'] => ({
	type: 'website',
	description: 'An open-source website built with Payload and Next.js.',
	images: [
		{
			url: `${getServerSideURL()}/website-template-OG.webp`,
		},
	],
	siteName,
	title: siteName,
})

export const mergeOpenGraph = (og?: Metadata['openGraph'], siteName?: string): Metadata['openGraph'] => {
	const defaultOpenGraph = getDefaultOpenGraph(siteName)
	return {
		...defaultOpenGraph,
		...og,
		images: og?.images ? og.images : defaultOpenGraph?.images,
	}
}
