/**
 * SpacingControl - Toolbar component for setting block margins
 * Allows setting margin-top, margin-bottom, margin-left, margin-right
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import type { SpacingAttrs, SpacingValue } from '../extensions/spacing'

interface SpacingControlProps {
	editor: Editor
}

const spacingOptions: { value: SpacingValue; label: string }[] = [
	{ value: '0', label: '0' },
	{ value: '1', label: '0.25rem' },
	{ value: '2', label: '0.5rem' },
	{ value: '3', label: '0.75rem' },
	{ value: '4', label: '1rem' },
	{ value: '5', label: '1.25rem' },
	{ value: '6', label: '1.5rem' },
	{ value: '8', label: '2rem' },
	{ value: '10', label: '2.5rem' },
	{ value: '12', label: '3rem' },
	{ value: '16', label: '4rem' },
	{ value: '20', label: '5rem' },
	{ value: '24', label: '6rem' },
]

type MarginDirection = 'marginTop' | 'marginBottom' | 'marginLeft' | 'marginRight'

const marginLabels: Record<MarginDirection, string> = {
	marginTop: 'Top',
	marginBottom: 'Bottom',
	marginLeft: 'Left',
	marginRight: 'Right',
}

const marginIcons: Record<MarginDirection, React.ReactNode> = {
	marginTop: (
		<svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
		</svg>
	),
	marginBottom: (
		<svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
		</svg>
	),
	marginLeft: (
		<svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
		</svg>
	),
	marginRight: (
		<svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
		</svg>
	),
}

export const SpacingControl: React.FC<SpacingControlProps> = ({ editor }) => {
	const [showPanel, setShowPanel] = useState(false)
	const [, forceUpdate] = useState({})
	const panelRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)

	// Get current spacing from editor
	const currentSpacing = useMemo(() => {
		const { state } = editor
		const { selection } = state
		const node = state.doc.nodeAt(selection.from)

		let attrs = node?.type.name ? editor.getAttributes(node.type.name) : {}

		if (!attrs.spacing) {
			attrs = editor.getAttributes('paragraph')
			if (!attrs.spacing) {
				attrs = editor.getAttributes('heading')
			}
		}

		return (attrs.spacing || {}) as SpacingAttrs
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editor, editor.state.selection.$from.pos, editor.state.doc])

	// Subscribe to editor updates
	useEffect(() => {
		const handleUpdate = () => {
			forceUpdate({})
		}

		editor.on('selectionUpdate', handleUpdate)
		editor.on('transaction', handleUpdate)

		return () => {
			editor.off('selectionUpdate', handleUpdate)
			editor.off('transaction', handleUpdate)
		}
	}, [editor])

	// Close panel when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				panelRef.current &&
				!panelRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setShowPanel(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const setMargin = useCallback(
		(direction: MarginDirection, value: SpacingValue | undefined) => {
			// Create a partial update object with only the changed property
			// When value is undefined, we explicitly pass undefined to signal deletion
			const spacingUpdate: Partial<SpacingAttrs> = {
				[direction]: value,
			}

			// Use chain pattern like ResponsiveAlignmentControl does
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const chain = editor.chain().focus() as any
			if (chain.setSpacing) {
				chain.setSpacing(spacingUpdate).run()
			}
		},
		[editor]
	)

	const hasSpacing = Object.keys(currentSpacing).length > 0

	return (
		<div style={{ position: 'relative', display: 'inline-block' }}>
			<button
				ref={buttonRef}
				onClick={() => setShowPanel(!showPanel)}
				title="Spacing"
				style={{
					padding: '6px 8px',
					border: '1px solid #e5e7eb',
					borderRadius: '4px',
					backgroundColor: hasSpacing ? '#e5e7eb' : 'transparent',
					cursor: 'pointer',
					display: 'flex',
					alignItems: 'center',
					gap: '4px',
					fontSize: '13px',
					color: '#374151',
				}}
			>
				<svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
					/>
				</svg>
				<span>Spacing</span>
				<svg style={{ width: '12px', height: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{showPanel && (
				<div
					ref={panelRef}
					style={{
						position: 'absolute',
						top: '100%',
						left: '0',
						marginTop: '4px',
						backgroundColor: 'white',
						border: '1px solid #e5e7eb',
						borderRadius: '8px',
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
						padding: '12px',
						zIndex: 50,
						minWidth: '240px',
					}}
				>
					<div style={{ marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: '#374151' }}>Block Margins</div>

					{(['marginTop', 'marginBottom', 'marginLeft', 'marginRight'] as MarginDirection[]).map(direction => (
						<div
							key={direction}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
								marginBottom: '8px',
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '4px',
									width: '70px',
									fontSize: '12px',
									color: '#6b7280',
								}}
							>
								{marginIcons[direction]}
								<span>{marginLabels[direction]}</span>
							</div>
							<select
								value={currentSpacing[direction] || ''}
								onChange={e => {
									const val = e.target.value
									setMargin(direction, val ? (val as SpacingValue) : undefined)
								}}
								style={{
									flex: 1,
									padding: '4px 8px',
									border: '1px solid #e5e7eb',
									borderRadius: '4px',
									fontSize: '12px',
									backgroundColor: 'white',
									cursor: 'pointer',
								}}
							>
								<option value="">Default</option>
								{spacingOptions.map(opt => (
									<option key={opt.value} value={opt.value}>
										{opt.value} ({opt.label})
									</option>
								))}
							</select>
						</div>
					))}

					<button
						onClick={() => {
							// Use chain pattern like ResponsiveAlignmentControl does
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const chain = editor.chain().focus() as any
							if (chain.resetSpacing) {
								chain.resetSpacing().run()
							}
						}}
						style={{
							width: '100%',
							padding: '6px',
							marginTop: '8px',
							border: '1px solid #e5e7eb',
							borderRadius: '4px',
							backgroundColor: '#f9fafb',
							cursor: 'pointer',
							fontSize: '12px',
							color: '#6b7280',
						}}
					>
						Reset to Default
					</button>
				</div>
			)}
		</div>
	)
}
