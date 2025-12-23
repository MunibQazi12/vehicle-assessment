/**
 * TextColor TipTap Extension
 * Renders text colors as Tailwind arbitrary classes (text-[#hex])
 */

import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		textColor: {
			/**
			 * Set the text color
			 */
			setColor: (color: string) => ReturnType
			/**
			 * Unset the text color
			 */
			unsetColor: () => ReturnType
		}
	}
}

export const TextColor = Extension.create({
	name: 'textColor',

	addOptions() {
		return {
			types: ['textStyle'],
		}
	},

	addCommands() {
		return {
			setColor:
				(color: string) =>
					({ commands }) => {
						return commands.setMark('textStyle', { color })
					},
			unsetColor:
				() =>
					({ commands }) => {
						return commands.unsetMark('textStyle')
					},
		}
	},

	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					color: {
						default: null,
						parseHTML: element => {
							// Check for Tailwind arbitrary color class
							const classList = element.className?.split(' ') || []
							for (const cls of classList) {
								const match = cls.match(/^text-\[(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})\]$/)
								if (match) {
									return match[1]
								}
							}
							// Fallback: check data attribute or inline style
							return element.getAttribute('data-color') || element.style.color || null
						},
						renderHTML: attributes => {
							if (!attributes.color) {
								return {}
							}
							// Normalize color to hex format for Tailwind
							let color = attributes.color

							// Convert rgb/rgba to hex if needed
							const rgbMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/)
							if (rgbMatch) {
								const r = parseInt(rgbMatch[1], 10)
								const g = parseInt(rgbMatch[2], 10)
								const b = parseInt(rgbMatch[3], 10)
								color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
							}
							// Ensure hex has # prefix
							else if (!color.startsWith('#')) {
								color = `#${color}`
							}

							return {
								class: `text-[${color}] not-prose`,
								'data-color': color,
							}
						},
					},
				},
			},
		]
	},
})
