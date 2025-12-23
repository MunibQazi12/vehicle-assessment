/**
 * SimpleEditor - Standard text editing without media features
 *
 * Features:
 * - Full text formatting (bold, italic, underline, strikethrough)
 * - Text and background colors
 * - Font sizes and heading formats
 * - Text alignment
 * - Links
 * - Lists (bullet and numbered)
 * - Undo/redo
 *
 * Does NOT include: images, videos, code blocks, blockquotes
 */

'use client'

import React, { useCallback, useRef } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import type { JSONFieldClientComponent } from 'payload'
import { CoreEditor } from '../core/CoreEditor'
import { getLabel } from '../utils'

/**
 * SimpleEditor - Full-featured text editor without media
 *
 * Great for content that needs rich formatting but no embedded media.
 */
const SimpleEditor: JSONFieldClientComponent = ({ field, path }) => {
	const { value, setValue } = useField<object>({ path })
	const dispatchFields = useFormFields(([, dispatch]) => dispatch)

	const htmlFieldPath = path.replace(/\.content$/, '.htmlContent').replace(/^content$/, 'htmlContent')
	const htmlUpdateTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

	const handleChange = useCallback(
		(json: object, html: string) => {
			setValue(json)

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
			preset="simple"
			value={value}
			onChange={handleChange}
			label={getLabel(field.label, field.name)}
			required={field.required}
			description={field.admin?.description ? getLabel(field.admin.description, '') : undefined}
			placeholder="Start writing your content..."
			minHeight="150px"
		/>
	)
}

export default SimpleEditor
