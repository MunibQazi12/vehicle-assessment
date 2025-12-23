/**
 * EditorField - Full-featured WYSIWYG editor for Payload CMS
 *
 * This is the standard editor with all features enabled.
 * For specialized use cases, use the variants:
 * - HeaderEditor: For header/title text with colors and sizing
 * - MinimalEditor: Basic text formatting only
 * - SimpleEditor: Full formatting without media
 *
 * Or use CoreEditor directly with custom configuration.
 */

'use client'

import React, { useCallback, useRef } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import type { JSONFieldClientComponent } from 'payload'
import { CoreEditor } from './core/CoreEditor'
import { getLabel } from './utils'

/**
 * EditorField - The standard full-featured editor
 *
 * Includes all features:
 * - Text formatting (bold, italic, underline, strikethrough, subscript, superscript, highlight, code)
 * - Colors (text and background)
 * - Typography (font sizes, headings)
 * - Alignment
 * - Links
 * - Media (images, YouTube videos)
 * - Lists (bullet and numbered)
 * - Block elements (blockquote, horizontal rule, code blocks)
 * - Undo/redo
 */
const EditorField: JSONFieldClientComponent = ({ field, path }) => {
	const { value, setValue } = useField<object>({ path })
	const dispatchFields = useFormFields(([, dispatch]) => dispatch)

	// Get the HTML content field path (sibling field)
	// Handle patterns like:
	// - content → htmlContent
	// - expandedContent → expandedHtmlContent
	// - layout.0.content → layout.0.htmlContent
	// - layout.0.expandedContent → layout.0.expandedHtmlContent
	const getHtmlFieldPath = (fieldPath: string): string => {
		const parts = fieldPath.split('.')
		const fieldName = parts[parts.length - 1]

		// Convert field name to HTML field name
		// content → htmlContent, expandedContent → expandedHtmlContent
		let htmlFieldName: string
		if (fieldName === 'content') {
			htmlFieldName = 'htmlContent'
		} else if (fieldName.endsWith('Content')) {
			// expandedContent → expandedHtmlContent
			htmlFieldName = fieldName.replace(/Content$/, 'HtmlContent')
		} else {
			// Fallback: append HtmlContent
			htmlFieldName = fieldName + 'HtmlContent'
		}

		parts[parts.length - 1] = htmlFieldName
		return parts.join('.')
	}

	const htmlFieldPath = getHtmlFieldPath(path)

	// Ref for debouncing HTML updates
	const htmlUpdateTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

	const handleChange = useCallback(
		(json: object, html: string) => {
			setValue(json)

			// Debounce HTML update to sibling field
			if (htmlUpdateTimeout.current) {
				clearTimeout(htmlUpdateTimeout.current)
			}
			htmlUpdateTimeout.current = setTimeout(() => {
				dispatchFields({
					type: 'UPDATE',
					path: htmlFieldPath,
					value: html,
				})
			}, 1000)
		},
		[setValue, dispatchFields, htmlFieldPath]
	)

	return (
		<CoreEditor
			preset="standard"
			value={value}
			onChange={handleChange}
			label={getLabel(field.label, field.name)}
			required={field.required}
			description={field.admin?.description ? getLabel(field.admin.description, '') : undefined}
			placeholder="Start writing your content here..."
			minHeight="200px"
		/>
	)
}

export default EditorField

// Re-export core components and types for extensibility
export { CoreEditor } from './core/CoreEditor'
export { ConfigurableToolbar } from './core/ConfigurableToolbar'
export { createExtensions } from './core/extensions'
export type {
	ToolbarFeature,
	ToolbarFeatureGroup,
	EditorPreset,
	EditorConfig,
	CoreEditorProps,
} from './core/types'

// Re-export responsive alignment type
export type { ResponsiveAlignment } from './extensions/text-align'

// Re-export toolbar components for custom toolbars
export { ResponsiveAlignmentControl } from './toolbar/ResponsiveAlignmentControl'

// Re-export pre-built variants
export { HeaderEditor, MinimalEditor, SimpleEditor } from './variants'
