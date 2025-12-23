/**
 * TailwindHighlight TipTap Extension
 * Extends the base Highlight extension to render with Tailwind classes
 */

import Highlight from '@tiptap/extension-highlight'

export const TailwindHighlight = Highlight.extend({
	addOptions() {
		return {
			multicolor: true,
			HTMLAttributes: {},
		}
	},

	renderHTML({ HTMLAttributes }) {
		const color = HTMLAttributes['data-color'] || '#fef08a' // Default yellow highlight
		return [
			'mark',
			{
				class: `bg-[${color}] rounded-sm px-0.5`,
				'data-color': color,
			},
			0,
		]
	},
})
