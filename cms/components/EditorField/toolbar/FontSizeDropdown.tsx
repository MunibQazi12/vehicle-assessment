/**
 * Font size dropdown selector for the editor toolbar
 */

import React, { useState, useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { fontSizeOptions } from '../config/font-sizes'

export const FontSizeDropdown: React.FC<{ editor: Editor }> = ({ editor }) => {
	const [isOpen, setIsOpen] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	const currentFontSize = editor.getAttributes('textStyle').fontSize
	const currentLabel = fontSizeOptions.find((size) => size.value === currentFontSize)?.label || 'Normal'

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
					minWidth: '120px',
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor = '#f9fafb'
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = '#fff'
				}}
			>
				<svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h12M8 8v12m8-12v12M6 20h12" />
				</svg>
				<span style={{ flex: 1, textAlign: 'left' }}>{currentLabel}</span>
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
						width: '180px',
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
						{fontSizeOptions.map((size) => (
							<li key={size.value}>
								<button
									type="button"
									onClick={() => {
										editor.chain().focus().setFontSize(size.value).run()
										setIsOpen(false)
									}}
									style={{
										width: '100%',
										textAlign: 'left',
										padding: '8px 12px',
										fontSize: '14px',
										backgroundColor: currentFontSize === size.value ? '#f3f4f6' : 'transparent',
										border: 'none',
										borderRadius: '4px',
										cursor: 'pointer',
										fontWeight: currentFontSize === size.value ? '500' : 'normal',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = '#f3f4f6'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor =
											currentFontSize === size.value ? '#f3f4f6' : 'transparent'
									}}
								>
									<span>{size.label}</span>
									<span style={{ fontSize: '11px', color: '#9ca3af' }}>{size.preview}</span>
								</button>
							</li>
						))}
					</ul>
					<div style={{ borderTop: '1px solid #e5e7eb', padding: '8px' }}>
						<button
							type="button"
							onClick={() => {
								editor.chain().focus().unsetFontSize().run()
								setIsOpen(false)
							}}
							style={{
								width: '100%',
								fontSize: '14px',
								color: '#4b5563',
								backgroundColor: '#f3f4f6',
								border: 'none',
								borderRadius: '4px',
								padding: '6px 12px',
								cursor: 'pointer',
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = '#e5e7eb'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = '#f3f4f6'
							}}
						>
							Reset
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
