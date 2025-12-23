import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
	pages: '',
}

type Props = {
	collection: keyof typeof collectionPrefixMap
	slug: string
	req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
	// Allow empty strings, e.g. for the homepage
	if (slug === undefined || slug === null) {
		return null
	}

	// Encode each slug segment separately to preserve forward slashes
	const encodedSlug = slug.split('/').map(encodeURIComponent).join('/')

	// Build the path without tenantId prefix
	const collectionPrefix = collectionPrefixMap[collection] || ''

	// Ensure we don't create double slashes for homepage or root paths
	let fullPath: string
	if (encodedSlug === '/' || encodedSlug === '') {
		fullPath = '/'
	} else if (encodedSlug.startsWith('/')) {
		fullPath = collectionPrefix ? `${collectionPrefix}${encodedSlug}` : encodedSlug
	} else {
		fullPath = collectionPrefix ? `${collectionPrefix}/${encodedSlug}` : `/${encodedSlug}`
	}

	const encodedParams = new URLSearchParams({
		slug: encodedSlug,
		collection,
		path: fullPath,
		previewSecret: process.env.PREVIEW_SECRET || '',
	})

	const previewPath = '/next/preview'
	const url = `${previewPath}?${encodedParams.toString()}`

	return url
}
