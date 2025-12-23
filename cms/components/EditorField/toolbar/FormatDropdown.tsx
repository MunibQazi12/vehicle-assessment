/**
 * Format dropdown selector for headings and paragraph
 */

import React, { useState, useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/react'

export const FormatDropdown: React.FC<{ editor: Editor }> = ({ editor }) => {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	// Close dropdown when clicking outside
	useEffect(() => {
		if (!isOpen) return

		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen])

	const formats = [
		{ label: 'Paragraph', action: () => editor.chain().focus().setParagraph().run() },
		{
			label: 'Heading 1',
			action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
		},
		{
			label: 'Heading 2',
			action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
		},
		{
			label: 'Heading 3',
			action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
		},
		{
			label: 'Heading 4',
			action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
		},
		{
			label: 'Heading 5',
			action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
		},
		{
			label: 'Heading 6',
			action: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
		},
	]

	return (
		<div ref={containerRef} style={{ position: 'relative' }}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '4px',
					padding: '6px 12px',
					fontSize: '14px',
					fontWeight: '500',
					backgroundColor: '#fff',
					border: '1px solid #d1d5db',
					borderRadius: '4px',
					cursor: 'pointer',
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor = '#f9fafb'
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = '#fff'
				}}
			>
				Format
				<svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>
			{isOpen && (
				<div
					style={{
						position: 'absolute',
						top: '100%',
						left: '0',
						marginTop: '4px',
						width: '192px',
						backgroundColor: '#fff',
						border: '1px solid #e5e7eb',
						borderRadius: '6px',
						boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
						zIndex: 1000,
						maxHeight: '300px',
						overflowY: 'auto',
					}}
				>
					<ul style={{ padding: '8px', margin: 0, listStyle: 'none' }}>
						{formats.map((format) => (
							<li key={format.label}>
								<button
									type="button"
									onClick={() => {
										format.action()
										setIsOpen(false)
									}}
									style={{
										width: '100%',
										textAlign: 'left',
										padding: '8px 12px',
										fontSize: '14px',
										backgroundColor: 'transparent',
										border: 'none',
										borderRadius: '4px',
										cursor: 'pointer',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = '#f3f4f6'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = 'transparent'
									}}
								>
									{format.label}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
