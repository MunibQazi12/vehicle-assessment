import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { getServerSideURL } from '@dtcms/utilities/getURL'
import type { Page } from '@dtcms/payload-types'


const generateTitle: GenerateTitle<Page> = ({ doc }) => {
	return doc?.title ? `${doc.title} | Dealer Tower` : 'Dealer Tower'
}

const generateURL: GenerateURL<Page> = ({ doc }) => {
	const url = getServerSideURL()

	return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
	// S3 Storage for MinIO - handles file uploads
	s3Storage({
		collections: {
			media: true,
		},
		bucket: process.env.S3_BUCKET || '',
		config: {
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
				secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
			},
			region: process.env.S3_REGION || 'us-east-1',
			endpoint: process.env.S3_ENDPOINT,
			forcePathStyle: true, // Required for MinIO
		},
	}),
	nestedDocsPlugin({
		collections: ['pages'],
		generateLabel: (_, doc) => doc.title as string,
		generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
		parentFieldSlug: 'parent',
		breadcrumbsFieldSlug: 'breadcrumbs',
	}),
	seoPlugin({
		generateTitle,
		generateURL,
	}),
]
