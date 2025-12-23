/**
 * TipTap Editor Extensions Configuration
 * Combines all custom extensions with base TipTap extensions
 */

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'

// Custom Tailwind-compatible extensions
import { FontSize } from './font-size'
import { TextColor } from './text-color'
import { BackgroundColor } from './background-color'
import { TailwindHighlight } from './highlight'
import { TailwindLink } from './link'
import { TailwindTextAlign } from './text-align'
import { Spacing } from './spacing'

/**
 * Get the full array of TipTap extensions configured for Tailwind output
 * @returns Array of configured TipTap extensions
 */
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
	Spacing.configure({
		types: ['heading', 'paragraph'],
	}),
	TailwindHighlight.configure({ multicolor: true }),
	TextStyle,
	FontSize,
	TextColor,
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

// Re-export individual extensions for direct access
export { FontSize } from './font-size'
export { TextColor } from './text-color'
export { BackgroundColor } from './background-color'
export { TailwindHighlight } from './highlight'
export { TailwindLink } from './link'
export { TailwindTextAlign } from './text-align'
export { Spacing } from './spacing'
export type { SpacingAttrs, SpacingValue } from './spacing'
