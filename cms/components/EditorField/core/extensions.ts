/**
 * Extension factory for creating TipTap extensions based on editor configuration
 * Optimizes bundle size by only including necessary extensions
 */

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import type { AnyExtension } from '@tiptap/core'

// Custom extensions
import { FontSize } from '../extensions/font-size'
import { TextColor } from '../extensions/text-color'
import { BackgroundColor } from '../extensions/background-color'
import { TailwindHighlight } from '../extensions/highlight'
import { TailwindLink } from '../extensions/link'
import { TailwindTextAlign } from '../extensions/text-align'
import { Spacing } from '../extensions/spacing'

import type { EditorConfig, ToolbarFeature } from './types'
import { resolveFeatures } from './types'

/**
 * StarterKit configuration based on features
 * Returns false to disable features, or config object to enable with custom settings
 */
function getStarterKitConfig(features: Set<ToolbarFeature>) {
	// Helper to return false as a literal type for disabled features
	const disabled = false as const

	return {
		heading: features.has('formatDropdown')
			? {
				levels: [1, 2, 3, 4, 5, 6] as const,
				HTMLAttributes: { class: '' },
			}
			: disabled,
		paragraph: {
			HTMLAttributes: {
				class: 'mb-4 leading-relaxed',
			},
		},
		bulletList: features.has('bulletList')
			? {
				HTMLAttributes: {
					class: 'list-disc ml-6 mb-4 space-y-1',
				},
			}
			: disabled,
		orderedList: features.has('orderedList')
			? {
				HTMLAttributes: {
					class: 'list-decimal ml-6 mb-4 space-y-1',
				},
			}
			: disabled,
		listItem:
			features.has('bulletList') || features.has('orderedList')
				? {
					HTMLAttributes: {
						class: 'pl-1',
					},
				}
				: disabled,
		blockquote: features.has('blockquote')
			? {
				HTMLAttributes: {
					class: 'border-l-4 border-gray-300 pl-4 my-6 text-gray-600 italic',
				},
			}
			: disabled,
		codeBlock: features.has('codeBlock')
			? {
				HTMLAttributes: {
					class: 'bg-gray-900 text-gray-100 rounded-lg p-4 my-6 overflow-x-auto font-mono text-sm',
				},
			}
			: disabled,
		code: features.has('code')
			? {
				HTMLAttributes: {
					class: 'bg-gray-100 rounded px-1 py-0.5 font-mono text-sm text-gray-800',
				},
			}
			: disabled,
		horizontalRule: features.has('horizontalRule')
			? {
				HTMLAttributes: {
					class: 'border-0 border-t-2 border-gray-200 my-8',
				},
			}
			: disabled,
		bold: features.has('bold')
			? {
				HTMLAttributes: {
					class: 'font-bold',
				},
			}
			: disabled,
		italic: features.has('italic')
			? {
				HTMLAttributes: {
					class: 'italic',
				},
			}
			: disabled,
		strike: features.has('strikethrough')
			? {
				HTMLAttributes: {
					class: 'line-through',
				},
			}
			: disabled,
	}
}

/**
 * Create TipTap extensions based on editor configuration
 */
export function createExtensions(config: EditorConfig = {}): AnyExtension[] {
	const features = resolveFeatures(config)
	const { placeholder = 'Start writing...' } = config

	const extensions: AnyExtension[] = []

	// Always include StarterKit with feature-based configuration
	// Using type assertion because the conditional config is compatible but TS struggles with the union
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	extensions.push(StarterKit.configure(getStarterKitConfig(features) as any))

	// Underline
	if (features.has('underline')) {
		extensions.push(
			Underline.configure({
				HTMLAttributes: {
					class: 'underline',
				},
			})
		)
	}

	// Text alignment (responsive only)
	if (features.has('responsiveAlignment')) {
		extensions.push(
			TailwindTextAlign.configure({
				types: ['heading', 'paragraph'],
				defaultAlignment: 'left',
			})
		)
	}

	// Spacing (block margins)
	if (features.has('spacing')) {
		extensions.push(
			Spacing.configure({
				types: ['heading', 'paragraph'],
			})
		)
	}

	// Text styling (required for colors and font size)
	if (features.has('textColor') || features.has('backgroundColor') || features.has('fontSize')) {
		extensions.push(TextStyle)
		extensions.push(Color)
	}

	// Font size
	if (features.has('fontSize')) {
		extensions.push(FontSize)
	}

	// Text color
	if (features.has('textColor')) {
		extensions.push(TextColor)
	}

	// Background color
	if (features.has('backgroundColor')) {
		extensions.push(BackgroundColor)
	}

	// Highlight
	if (features.has('highlight')) {
		extensions.push(TailwindHighlight.configure({ multicolor: true }))
	}

	// Links
	if (features.has('link') || features.has('unlink')) {
		extensions.push(
			TailwindLink.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: 'https',
			})
		)
	}

	// Subscript
	if (features.has('subscript')) {
		extensions.push(
			Subscript.configure({
				HTMLAttributes: {
					class: 'align-sub text-[0.75em]',
				},
			})
		)
	}

	// Superscript
	if (features.has('superscript')) {
		extensions.push(
			Superscript.configure({
				HTMLAttributes: {
					class: 'align-super text-[0.75em]',
				},
			})
		)
	}

	// Image
	if (features.has('image')) {
		extensions.push(
			Image.configure({
				HTMLAttributes: {
					class: 'max-w-full h-auto rounded-lg mx-auto my-6',
				},
			})
		)
	}

	// YouTube
	if (features.has('youtube')) {
		extensions.push(
			Youtube.configure({
				width: 640,
				height: 480,
				HTMLAttributes: {
					class: 'w-full aspect-video rounded-lg my-6',
				},
			})
		)
	}

	// Placeholder (always included)
	extensions.push(
		Placeholder.configure({
			placeholder,
		})
	)

	return extensions
}
