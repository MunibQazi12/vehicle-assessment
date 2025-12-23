/**
 * JSON Backup/Restore component for the editor
 * Allows users to copy editor content as JSON and paste/restore from JSON
 */

'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Editor } from '@tiptap/react'

interface JsonBackupProps {
	editor: Editor
}

// Copy icon
const CopyIcon = (
	<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"
		/>
	</svg>
)

// JSON/Code icon
const JsonIcon = (
	<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M17 8l2 2-2 2m-10-4l-2 2 2 2m5-6v10m4-14H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"
		/>
	</svg>
)

// Check icon for success feedback
const CheckIcon = (
	<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
	</svg>
)

// Close icon
const CloseIcon = (
	<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
	</svg>
)

// Paste/Import icon
const ImportIcon = (
	<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"
		/>
	</svg>
)

export const JsonBackup: React.FC<JsonBackupProps> = ({ editor }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [copied, setCopied] = useState(false)
	const [jsonContent, setJsonContent] = useState('')
	const [error, setError] = useState<string | null>(null)
	// For SSR safety - set to true only on client side via state initialization
	const [mounted] = useState(() => typeof window !== 'undefined')
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const modalRef = useRef<HTMLDivElement>(null)

	// Handle opening modal - update JSON content when opening
	const handleOpen = useCallback(() => {
		const json = editor.getJSON()
		setJsonContent(JSON.stringify(json, null, 2))
		setError(null)
		setIsOpen(true)
	}, [editor])

	// Handle copy to clipboard
	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(jsonContent)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch {
			// Fallback for older browsers
			if (textareaRef.current) {
				textareaRef.current.select()
				document.execCommand('copy')
				setCopied(true)
				setTimeout(() => setCopied(false), 2000)
			}
		}
	}, [jsonContent])

	// Handle import/restore from JSON
	const handleImport = useCallback(() => {
		try {
			const parsed = JSON.parse(jsonContent)
			editor.commands.setContent(parsed)
			setError(null)
			setIsOpen(false)
		} catch {
			setError('Invalid JSON format. Please check your content and try again.')
		}
	}, [jsonContent, editor])

	// Handle textarea change
	const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setJsonContent(e.target.value)
		setError(null)
	}, [])

	// Close modal on click outside
	const handleBackdropClick = useCallback((e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			setIsOpen(false)
		}
	}, [])

	// Handle escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				setIsOpen(false)
			}
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [isOpen])

	return (
		<>
			{/* Toolbar button */}
			<button
				type="button"
				onClick={handleOpen}
				title="Backup/Restore JSON"
				style={{
					padding: '6px',
					borderRadius: '4px',
					cursor: 'pointer',
					backgroundColor: isOpen ? '#e5e7eb' : 'transparent',
					color: isOpen ? '#2563eb' : '#4b5563',
					border: 'none',
					transition: 'background-color 0.2s',
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor = '#f3f4f6'
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = isOpen ? '#e5e7eb' : 'transparent'
				}}
			>
				{JsonIcon}
			</button>

			{/* Modal - rendered via portal to document.body to avoid z-index stacking context issues */}
			{mounted && isOpen && createPortal(
				<div
					onClick={handleBackdropClick}
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 99999,
					}}
				>
					<div
						ref={modalRef}
						style={{
							backgroundColor: 'white',
							borderRadius: '8px',
							padding: '24px',
							width: '90%',
							maxWidth: '700px',
							maxHeight: '80vh',
							display: 'flex',
							flexDirection: 'column',
							boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
						}}
					>
						{/* Header */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '16px',
							}}
						>
							<h3
								style={{
									margin: 0,
									fontSize: '18px',
									fontWeight: 600,
									color: '#111827',
								}}
							>
								Backup / Restore Content
							</h3>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								title="Close"
								style={{
									padding: '4px',
									borderRadius: '4px',
									cursor: 'pointer',
									backgroundColor: 'transparent',
									color: '#6b7280',
									border: 'none',
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = '#f3f4f6'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = 'transparent'
								}}
							>
								{CloseIcon}
							</button>
						</div>

						{/* Description */}
						<p
							style={{
								margin: '0 0 16px 0',
								fontSize: '14px',
								color: '#6b7280',
							}}
						>
							Copy the JSON content below for backup. To restore, paste your saved JSON and click Import.
						</p>

						{/* JSON Textarea */}
						<textarea
							ref={textareaRef}
							value={jsonContent}
							onChange={handleTextareaChange}
							spellCheck={false}
							style={{
								flex: 1,
								minHeight: '300px',
								padding: '12px',
								borderRadius: '6px',
								border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
								fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
								fontSize: '13px',
								lineHeight: '1.5',
								resize: 'vertical',
								backgroundColor: '#f9fafb',
								color: '#111827',
							}}
						/>

						{/* Error message */}
						{error && (
							<p
								style={{
									margin: '8px 0 0 0',
									fontSize: '14px',
									color: '#ef4444',
								}}
							>
								{error}
							</p>
						)}

						{/* Actions */}
						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-end',
								gap: '12px',
								marginTop: '16px',
							}}
						>
							<button
								type="button"
								onClick={handleCopy}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: '8px',
									padding: '8px 16px',
									borderRadius: '6px',
									cursor: 'pointer',
									backgroundColor: '#f3f4f6',
									color: copied ? '#059669' : '#374151',
									border: '1px solid #d1d5db',
									fontSize: '14px',
									fontWeight: 500,
									transition: 'all 0.2s',
								}}
								onMouseEnter={(e) => {
									if (!copied) {
										e.currentTarget.style.backgroundColor = '#e5e7eb'
									}
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = '#f3f4f6'
								}}
							>
								{copied ? CheckIcon : CopyIcon}
								{copied ? 'Copied!' : 'Copy JSON'}
							</button>

							<button
								type="button"
								onClick={handleImport}
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									gap: '8px',
									padding: '8px 16px',
									borderRadius: '6px',
									cursor: 'pointer',
									backgroundColor: '#2563eb',
									color: 'white',
									border: 'none',
									fontSize: '14px',
									fontWeight: 500,
									transition: 'all 0.2s',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = '#1d4ed8'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = '#2563eb'
								}}
							>
								{ImportIcon}
								Import JSON
							</button>
						</div>
					</div>
				</div>,
				document.body
			)}
		</>
	)
}

