import type { Config } from '@dtcms/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']
type Collection = keyof Config['collections']

async function getGlobal(slug: Global, depth = 0) {
	const payload = await getPayload({ config: configPromise })

	const global = await payload.findGlobal({
		slug,
		depth,
	})

	return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0) =>
	unstable_cache(async () => getGlobal(slug, depth), [slug], {
		tags: [`global_${slug}`],
	})

/**
 * Get a collection item (for collections acting as globals)
 */
async function getCollection(slug: Collection, depth = 0) {
	const payload = await getPayload({ config: configPromise })

	const result = await payload.find({
		collection: slug,
		depth,
		limit: 1,
	})

	return result.docs[0] || null
}

/**
 * Returns a unstable_cache function for collections acting as globals
 */
export const getCachedCollection = (slug: Collection, depth = 0) =>
	unstable_cache(async () => getCollection(slug, depth), [slug], {
		tags: [`global_${slug}`],
	})
