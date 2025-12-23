/**
 * CoreEditor - Base editor component that can be configured for different use cases
 * This is the foundation for all specialized editor variants
 */

'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { ConfigurableToolbar } from './ConfigurableToolbar'
import { createExtensions } from './extensions'
import { resolveFeatures } from './types'
import type { CoreEditorProps } from './types'
import { convertStylesToTailwind, mergeClasses } from '../utils'
import '../editor.scss'

/**
 * CoreEditor - A configurable rich text editor built on TipTap
 *
 * @example
 * // Minimal editor with just basic formatting
 * <CoreEditor
 *   preset="minimal"
 *   value={content}
 *   onChange={(json, html) => setContent(json)}
 * />
 *
 * @example
 * // Header editor with colors and sizing
 * <CoreEditor
 *   preset="header"
 *   value={content}
 *   onChange={(json, html) => setContent(json)}
 *   placeholder="Enter heading text..."
 *   minHeight="80px"
 * />
 *
 * @example
 * // Custom feature set
 * <CoreEditor
 *   preset="custom"
 *   features={['bold', 'italic', 'textColor', 'alignment']}
 *   value={content}
 *   onChange={(json, html) => setContent(json)}
 * />
 */
export const CoreEditor: React.FC<CoreEditorProps> = ({
	value,
	onChange,
	label,
	required,
	description,
	preset = 'standard',
	features: customFeatures,
	placeholder = 'Start writing...',
	minHeight = '200px',
	singleRowToolbar = false,
	className,
	debounceMs = 1000,
	colors,
}) => {
	// Resolve features from preset or custom config
	const config = { preset, features: customFeatures, placeholder, minHeight }
	const enabledFeatures = resolveFeatures(config)

	// Refs for debouncing
	const updateTimeout = useRef<NodeJS.Timeout | undefined>(undefined)
	const isTyping = useRef(false)

	// Debounced content update
	const handleContentUpdate = useCallback(
		(json: object, html: string) => {
			if (updateTimeout.current) {
				clearTimeout(updateTimeout.current)
			}

			updateTimeout.current = setTimeout(() => {
				onChange(json, html)
			}, debounceMs)
		},
		[onChange, debounceMs]
	)

	// Create editor with dynamic extensions based on features
	const editor = useEditor({
		immediatelyRender: false,
		extensions: createExtensions(config),
		content: value || '<p></p>',
		editorProps: {
			attributes: {
				class: `prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none px-4 py-3`,
				style: `min-height: ${minHeight}`,
			},
		},
		onUpdate: ({ editor }) => {
			const json = editor.getJSON()
			let html = editor.getHTML()

			// Convert inline styles to Tailwind classes
			html = convertStylesToTailwind(html)
			html = mergeClasses(html)

			handleContentUpdate(json, html)
		},
	})

	// Update editor content when value changes externally (not during active editing)
	useEffect(() => {
		if (!editor || isTyping.current) return

		if (value && JSON.stringify(editor.getJSON()) !== JSON.stringify(value)) {
			editor.commands.setContent(value)
		}
	}, [editor, value])

	// Track typing state
	useEffect(() => {
		if (!editor) return

		const handleFocus = () => {
			isTyping.current = true
		}
		const handleBlur = () => {
			isTyping.current = false
		}

		editor.on('focus', handleFocus)
		editor.on('blur', handleBlur)

		return () => {
			editor.off('focus', handleFocus)
			editor.off('blur', handleBlur)
			if (updateTimeout.current) {
				clearTimeout(updateTimeout.current)
			}
		}
	}, [editor])

	// Loading state
	if (!editor) {
		return (
			<div className={`field-type json ${className || ''}`}>
				{label && (
					<label className="field-label">
						{label}
						{required && <span className="required">*</span>}
					</label>
				)}
				<div
					style={{
						animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
						backgroundColor: '#e5e7eb',
						borderRadius: '8px',
						height: minHeight,
					}}
				/>
			</div>
		)
	}

	return (
		<div className={`field-type json wysiwyg-editor-field ${className || ''}`}>
			{label && (
				<label className="field-label">
					{label}
					{required && <span className="required">*</span>}
				</label>
			)}
			<div
				style={{
					border: '1px solid #d1d5db',
					borderRadius: '8px',
					backgroundColor: 'white',
				}}
			>
				<ConfigurableToolbar editor={editor} features={enabledFeatures} singleRow={singleRowToolbar} colors={colors} />
				<div style={{ padding: '16px', minHeight }}>
					<EditorContent editor={editor} />
				</div>
			</div>
			{description && <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '8px' }}>{description}</div>}
		</div>
	)
}

export default CoreEditor
