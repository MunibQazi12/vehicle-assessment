/**
 * HeaderEditor - Specialized editor for customizing header/title text
 *
 * Features:
 * - Basic text formatting (bold, italic, underline)
 * - Text color selection
 * - Font size control
 * - Heading level selection (h1, h2, h3, h4, h5, h6, paragraph)
 * - Text alignment
 *
 * Designed for editing single-line or short header text with style customization.
 */

'use client'

import React, { useCallback, useRef, useState, useEffect } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import type { JSONFieldClientComponent } from 'payload'
import { CoreEditor } from '../core/CoreEditor'
import { getLabel, getHtmlFieldPath } from '../utils'
import { getDealerColors, type ColorOption } from '../config/colors'

/**
 * HeaderEditor - A streamlined editor for header/title customization
 *
 * Use this when you need users to style headers with:
 * - Bold, italic, underline
 * - Text colors
 * - Font sizes
 * - Heading levels (h1-h6, paragraph)
 * - Text alignment
 *
 * Does NOT include: images, videos, lists, blockquotes, code blocks
 */
const HeaderEditor: JSONFieldClientComponent = ({ field, path }) => {
	const { value, setValue } = useField<object>({ path })
	const dispatchFields = useFormFields(([, dispatch]) => dispatch)

	// State for dealer colors
	const [dealerColors, setDealerColors] = useState<ColorOption[] | undefined>(undefined)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_isLoadingColors, setIsLoadingColors] = useState(true)

	// Derive HTML content field path from the current field path
	const htmlFieldPath = getHtmlFieldPath(path)

	// Refs for debouncing
	const htmlUpdateTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

	// Fetch dealer colors on mount
	useEffect(() => {
		const fetchColors = async () => {
			try {
				const response = await fetch('/api/dealer/colors/')
				if (response.ok) {
					const data = await response.json()
					const colors = getDealerColors(data.mainColors, data.savedColors)
					setDealerColors(colors)
				}
			} catch (error) {
				console.error('[HeaderEditor] Failed to fetch dealer colors:', error)
			} finally {
				setIsLoadingColors(false)
			}
		}

		fetchColors()
	}, [])

	const handleChange = useCallback(
		(json: object, html: string) => {
			setValue(json)

			// Debounce HTML update
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
			preset="header"
			value={value}
			onChange={handleChange}
			label={getLabel(field.label, field.name)}
			required={field.required}
			description={field.admin?.description ? getLabel(field.admin.description, '') : undefined}
			placeholder="Enter header text..."
			minHeight="80px"
			singleRowToolbar
			colors={dealerColors}
		/>
	)
}

export default HeaderEditor
