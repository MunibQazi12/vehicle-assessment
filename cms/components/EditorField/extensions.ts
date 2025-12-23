import { Extension } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'

// Font size value to Tailwind class mapping
export const fontSizeTailwindMap: Record<string, string> = {
	'xs': 'text-xs',
	'sm': 'text-sm',
	'base': 'text-base',
	'lg': 'text-lg',
	'xl': 'text-xl',
	'2xl': 'text-2xl',
	'3xl': 'text-3xl',
	'4xl': 'text-4xl',
	'5xl': 'text-5xl',
	'6xl': 'text-6xl',
	'7xl': 'text-7xl',
	'8xl': 'text-8xl',
	'9xl': 'text-9xl',
}

// Font size options for dropdown (value is Tailwind size key)
export const fontSizeOptions = [
	{ label: 'Extra Small', value: 'xs', preview: '0.75rem' },
	{ label: 'Small', value: 'sm', preview: '0.875rem' },
	{ label: 'Normal', value: 'base', preview: '1rem' },
	{ label: 'Large', value: 'lg', preview: '1.125rem' },
	{ label: 'Extra Large', value: 'xl', preview: '1.25rem' },
	{ label: '2XL', value: '2xl', preview: '1.5rem' },
	{ label: '3XL', value: '3xl', preview: '1.875rem' },
	{ label: '4XL', value: '4xl', preview: '2.25rem' },
	{ label: '5XL', value: '5xl', preview: '3rem' },
	{ label: '6XL', value: '6xl', preview: '3.75rem' },
]

// Custom FontSize extension - renders as Tailwind class
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

// Custom TextColor extension - renders as Tailwind arbitrary class
export const TextColor = Extension.create({
	name: 'textColor',
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
							// Ensure color is a valid hex
							const color = attributes.color.startsWith('#') ? attributes.color : `#${attributes.color}`
							return {
								class: `text-[${color}]`,
								'data-color': color,
							}
						},
					},
				},
			},
		]
	},
})

// Custom Background Color extension - renders as Tailwind arbitrary class
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

// Custom Highlight extension with Tailwind classes
const TailwindHighlight = Highlight.extend({
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

// Custom Link extension with Tailwind classes
const TailwindLink = Link.extend({
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

// Custom TextAlign extension with Tailwind classes
const TailwindTextAlign = TextAlign.extend({
	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					textAlign: {
						default: this.options.defaultAlignment,
						parseHTML: element => {
							// Check for Tailwind text alignment classes
							if (element.classList.contains('text-left')) return 'left'
							if (element.classList.contains('text-center')) return 'center'
							if (element.classList.contains('text-right')) return 'right'
							if (element.classList.contains('text-justify')) return 'justify'
							return element.style.textAlign || this.options.defaultAlignment
						},
						renderHTML: attributes => {
							if (!attributes.textAlign || attributes.textAlign === this.options.defaultAlignment) {
								return {}
							}
							return {
								class: `text-${attributes.textAlign}`,
							}
						},
					},
				},
			},
		]
	},
})

// Editor extensions configuration
export const getEditorExtensions = () => [
	StarterKit.configure({
		heading: {
			levels: [1, 2, 3, 4, 5, 6],
			HTMLAttributes: {
				class: '',
			},
		},
		paragraph: {
			HTMLAttributes: {
				class: 'mb-4 leading-relaxed',
			},
		},
		bulletList: {
			HTMLAttributes: {
				class: 'list-disc ml-6 mb-4 space-y-1',
			},
		},
		orderedList: {
			HTMLAttributes: {
				class: 'list-decimal ml-6 mb-4 space-y-1',
			},
		},
		listItem: {
			HTMLAttributes: {
				class: 'pl-1',
			},
		},
		blockquote: {
			HTMLAttributes: {
				class: 'border-l-4 border-gray-300 pl-4 my-6 text-gray-600 italic',
			},
		},
		codeBlock: {
			HTMLAttributes: {
				class: 'bg-gray-900 text-gray-100 rounded-lg p-4 my-6 overflow-x-auto font-mono text-sm',
			},
		},
		code: {
			HTMLAttributes: {
				class: 'bg-gray-100 rounded px-1 py-0.5 font-mono text-sm text-gray-800',
			},
		},
		horizontalRule: {
			HTMLAttributes: {
				class: 'border-0 border-t-2 border-gray-200 my-8',
			},
		},
		bold: {
			HTMLAttributes: {
				class: 'font-bold',
			},
		},
		italic: {
			HTMLAttributes: {
				class: 'italic',
			},
		},
		strike: {
			HTMLAttributes: {
				class: 'line-through',
			},
		},
	}),
	Underline.configure({
		HTMLAttributes: {
			class: 'underline',
		},
	}),
	TailwindLink.configure({
		openOnClick: false,
		autolink: true,
		defaultProtocol: 'https',
	}),
	TailwindTextAlign.configure({
		types: ['heading', 'paragraph'],
		defaultAlignment: 'left',
	}),
	TailwindHighlight.configure({ multicolor: true }),
	TextStyle,
	FontSize,
	Color,
	BackgroundColor,
	Subscript.configure({
		HTMLAttributes: {
			class: 'align-sub text-[0.75em]',
		},
	}),
	Superscript.configure({
		HTMLAttributes: {
			class: 'align-super text-[0.75em]',
		},
	}),
	Image.configure({
		HTMLAttributes: {
			class: 'max-w-full h-auto rounded-lg mx-auto my-6',
		},
	}),
	Youtube.configure({
		width: 640,
		height: 480,
		HTMLAttributes: {
			class: 'w-full aspect-video rounded-lg my-6',
		},
	}),
	Placeholder.configure({
		placeholder: 'Start writing your content here...',
	}),
]
