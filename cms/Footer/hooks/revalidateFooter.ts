import type { GlobalAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

/**
 * Revalidate footer cache after changes
 */
export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
	if (!context.disableRevalidate) {
		payload.logger.info('Revalidating footer')
		revalidateTag('global_footer', '/')
	}

	return doc
}
