/**
 * MinimalEditor - Ultra-simple editor with just basic text formatting
 *
 * Features:
 * - Bold, italic, underline, strikethrough
 *
 * Use for simple text that needs minimal formatting without any complexity.
 */

'use client'

import React, { useCallback, useRef } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import type { JSONFieldClientComponent } from 'payload'
import { CoreEditor } from '../core/CoreEditor'
import { getLabel } from '../utils'

/**
 * MinimalEditor - The simplest possible rich text editor
 *
 * Only provides:
 * - Bold
 * - Italic
 * - Underline
 * - Strikethrough
 *
 * Perfect for short text fields that just need basic emphasis options.
 */
const MinimalEditor: JSONFieldClientComponent = ({ field, path }) => {
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
			preset="minimal"
			value={value}
			onChange={handleChange}
			label={getLabel(field.label, field.name)}
			required={field.required}
			description={field.admin?.description ? getLabel(field.admin.description, '') : undefined}
			placeholder="Enter text..."
			minHeight="60px"
			singleRowToolbar
		/>
	)
}

export default MinimalEditor
