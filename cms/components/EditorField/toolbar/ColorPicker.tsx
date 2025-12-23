/**
 * Color picker component for text color selection
 */

import React, { useState, useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { ToolbarButton } from './ToolbarButton'
import { getEditorColors, type ColorOption } from '../config/colors'

interface ColorPickerProps {
	editor: Editor
	/**
	 * Custom color palette
	 * If not provided, uses default colors from config
	 */
	colors?: ColorOption[]
	/**
	 * Context string to pass to getEditorColors (e.g., dealer ID)
	 */
	context?: string
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ editor, colors, context }) => {
	// Use custom colors if provided, otherwise get from config
	const colorPalette = colors || getEditorColors(context)
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

	return (
		<div ref={containerRef} style={{ position: 'relative' }}>
			<ToolbarButton onClick={() => setIsOpen(!isOpen)} title="Text color">
				<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeWidth={2}
						d="m6.08 15.98 1.57-4m-1.57 4h-1.1m1.1 0h1.65m-.08-4 2.72-6.93a.11.11 0 0 1 .2 0l2.73 6.93m-5.65 0h5.65m0 0 .62 1.57m5.11 4.45c0 1.1-.85 2-1.91 2s-1.9-.9-1.9-2c0-1.1 1.9-4.13 1.9-4.13s1.91 3.03 1.91 4.13Z"
					/>
				</svg>
			</ToolbarButton>
			{isOpen && (
				<div
					style={{
						position: 'absolute',
						top: '100%',
						left: 0,
						marginTop: '4px',
						width: '192px',
						backgroundColor: '#fff',
						border: '1px solid #e5e7eb',
						borderRadius: '6px',
						boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
						zIndex: 1000,
						padding: '8px',
						maxHeight: '300px',
						overflowY: 'auto',
					}}
				>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(6, 1fr)',
							gap: '4px',
							marginBottom: '12px',
						}}
					>
						{colorPalette.map((color) => (
							<button
								key={color.value}
								type="button"
								title={color.label || color.value}
								onClick={() => {
									editor.chain().focus().setColor(color.value).run()
									setIsOpen(false)
								}}
								style={{
									width: '24px',
									height: '24px',
									borderRadius: '6px',
									border: '1px solid #e5e7eb',
									backgroundColor: color.value,
									cursor: 'pointer',
									transition: 'transform 0.2s',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'scale(1.1)'
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'scale(1)'
								}}
							/>
						))}
					</div>

					{/* Custom Color Picker */}
					<div style={{ marginBottom: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
						<label
							style={{
								display: 'block',
								fontSize: '12px',
								color: '#6b7280',
								marginBottom: '4px',
								fontWeight: '500',
							}}
						>
							Custom Color
						</label>
						<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
							<input
								type="color"
								onChange={(e) => {
									editor.chain().focus().setColor(e.target.value).run()
								}}
								style={{
									width: '40px',
									height: '32px',
									border: '1px solid #e5e7eb',
									borderRadius: '4px',
									cursor: 'pointer',
								}}
							/>
							<input
								type="text"
								placeholder="#000000"
								maxLength={7}
								onChange={(e) => {
									const color = e.target.value
									if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
										editor.chain().focus().setColor(color).run()
									}
								}}
								style={{
									flex: 1,
									fontSize: '13px',
									padding: '6px 8px',
									border: '1px solid #e5e7eb',
									borderRadius: '4px',
									fontFamily: 'monospace',
								}}
							/>
						</div>
					</div>

					<button
						type="button"
						onClick={() => {
							editor.chain().focus().unsetColor().run()
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
						Reset color
					</button>
				</div>
			)}
		</div>
	)
}
