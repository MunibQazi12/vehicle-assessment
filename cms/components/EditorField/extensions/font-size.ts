/**
 * FontSize TipTap Extension
 * Renders font sizes as Tailwind classes (text-xs, text-sm, etc.)
 */

import { Extension } from '@tiptap/core'
import { fontSizeTailwindMap } from '../config/font-sizes'

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		fontSize: {
			/**
			 * Set the font size
			 */
			setFontSize: (fontSize: string) => ReturnType
			/**
			 * Unset the font size
			 */
			unsetFontSize: () => ReturnType
		}
	}
}

export const FontSize = Extension.create({
	name: 'fontSize',

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
					fontSize: {
						default: null,
						parseHTML: element => {
							// Check for Tailwind class first
							const classList = element.className?.split(' ') || []
							for (const cls of classList) {
								if (cls.startsWith('text-') && !cls.startsWith('text-[#')) {
									const sizeKey = cls.replace('text-', '')
									if (fontSizeTailwindMap[sizeKey]) {
										return sizeKey
									}
								}
							}
							// Fallback: check data attribute
							return element.getAttribute('data-font-size') || null
						},
						renderHTML: attributes => {
							if (!attributes.fontSize) {
								return {}
							}
							const tailwindClass = fontSizeTailwindMap[attributes.fontSize]
							if (tailwindClass) {
								return {
									class: tailwindClass,
									'data-font-size': attributes.fontSize,
								}
							}
							return {}
						},
					},
				},
			},
		]
	},

	addCommands() {
		return {
			setFontSize:
				(fontSize: string) =>
					({ chain }) => {
						return chain().setMark('textStyle', { fontSize }).run()
					},
			unsetFontSize:
				() =>
					({ chain }) => {
						return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
					},
		}
	},
})
