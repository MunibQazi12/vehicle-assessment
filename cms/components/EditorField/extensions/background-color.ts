/**
 * BackgroundColor TipTap Extension
 * Renders background colors as Tailwind arbitrary classes (bg-[#hex])
 */

import { Extension } from '@tiptap/core'

export const BackgroundColor = Extension.create({
	name: 'backgroundColor',

	addOptions() {
		return {
			types: ['textStyle'],
		}
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					backgroundColor: {
						default: null,
						parseHTML: element => {
							// Check for Tailwind arbitrary bg class
							const classList = element.className?.split(' ') || []
							for (const cls of classList) {
								const match = cls.match(/^bg-\[(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})\]$/)
								if (match) {
									return match[1]
								}
							}
							return element.getAttribute('data-bg-color') || null
						},
						renderHTML: attributes => {
							if (!attributes.backgroundColor) {
								return {}
							}
							const color = attributes.backgroundColor.startsWith('#')
								? attributes.backgroundColor
								: `#${attributes.backgroundColor}`
							return {
								class: `bg-[${color}]`,
								'data-bg-color': color,
							}
						},
					},
				},
			},
		]
	},
})
