/**
 * TailwindLink TipTap Extension
 * Extends the base Link extension to render with Tailwind classes
 */

import Link from '@tiptap/extension-link'

export const TailwindLink = Link.extend({
	renderHTML({ HTMLAttributes }) {
		return [
			'a',
			{
				...HTMLAttributes,
				class: 'text-blue-600 underline hover:text-blue-800 transition-colors',
			},
			0,
		]
	},
})
