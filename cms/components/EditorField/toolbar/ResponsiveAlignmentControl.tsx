/**
 * ResponsiveAlignmentControl - Toolbar component for setting responsive text alignment
 * Allows different alignments for mobile, tablet, and desktop breakpoints
 */

import React, { useState, useCallback } from 'react'
import type { Editor } from '@tiptap/react'
import { ToolbarButton } from './ToolbarButton'
import type { ResponsiveAlignment } from '../extensions/text-align'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'
type Alignment = 'left' | 'center' | 'right' | 'justify'

interface ResponsiveAlignmentControlProps {
	editor: Editor
	/** Whether to show breakpoint tabs */
	showBreakpoints?: boolean
}

// Alignment button icons
const AlignmentIcons = {
	left: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h12M3 18h18" />
		</svg>
	),
	center: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M7 12h10M3 18h18" />
		</svg>
	),
	right: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M9 12h12M3 18h18" />
		</svg>
	),
	justify: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
		</svg>
	),
}

// Breakpoint icons
const BreakpointIcons = {
	mobile: (
		<svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
			/>
		</svg>
	),
	tablet: (
		<svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
			/>
		</svg>
	),
	desktop: (
		<svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
			/>
		</svg>
	),
}

export const ResponsiveAlignmentControl: React.FC<ResponsiveAlignmentControlProps> = ({
	editor,
	showBreakpoints = true,
}) => {
	const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>('mobile')
	const [showPanel, setShowPanel] = useState(false)
	const [, forceUpdate] = useState({})
	const [isUpdating, setIsUpdating] = useState(false)

	// Get current alignment from editor - use callback to read fresh data
	const getCurrentAlignment = useCallback(() => {
		// Get attributes from current node (could be paragraph, heading, etc.)
		const { state } = editor
		const { selection } = state
		const $from = selection.$from

		// Try to get attributes from the actual node in the tree
		let attrs = null
		for (let depth = $from.depth; depth >= 0; depth--) {
			const node = $from.node(depth)
			if (node.type.name === 'paragraph' || node.type.name === 'heading') {
				attrs = node.attrs
				break
			}
		}

		const align = attrs?.textAlign

		if (typeof align === 'object') {
			return align as ResponsiveAlignment
		}

		// Legacy: convert simple string alignment to responsive format
		if (typeof align === 'string') {
			return { mobile: align as Alignment } as ResponsiveAlignment
		}

		return {} as ResponsiveAlignment
	}, [editor])

	// Call to get current alignment
	const currentAlignment = getCurrentAlignment()

	// Subscribe to editor updates
	React.useEffect(() => {
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

	// Set alignment for specific breakpoint
	const setAlignment = useCallback(
		(alignment: Alignment) => {
			// Prevent rapid clicks while update is in progress
			if (isUpdating) {
				return
			}

			setIsUpdating(true)

			// Get fresh alignment state from editor directly (not from memoized value)
			const { state } = editor
			const { selection } = state
			const $from = selection.$from

			// Try to get attributes from the actual node type
			let attrs = null
			for (let depth = $from.depth; depth >= 0; depth--) {
				const node = $from.node(depth)
				if (node.type.name === 'paragraph' || node.type.name === 'heading') {
					attrs = node.attrs
					break
				}
			}

			// Extract current alignment
			let freshAlignment: ResponsiveAlignment = {}
			if (attrs?.textAlign) {
				if (typeof attrs.textAlign === 'object') {
					freshAlignment = { ...attrs.textAlign }
				} else if (typeof attrs.textAlign === 'string') {
					freshAlignment = { mobile: attrs.textAlign as Alignment }
				}
			}

			// Update with new alignment for active breakpoint
			const newAlignment: ResponsiveAlignment = { ...freshAlignment }
			newAlignment[activeBreakpoint] = alignment

			// Use custom command for responsive alignment
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if ((editor.commands as any).setResponsiveTextAlign) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(editor.commands as any).setResponsiveTextAlign(newAlignment)
			} else {
				// Fallback to simple alignment if extension doesn't support responsive
				editor.chain().focus().setTextAlign(alignment).run()
			}

			// Force UI update and re-enable clicks after a short delay
			forceUpdate({})

			// Re-enable clicking after transaction completes
			setTimeout(() => {
				setIsUpdating(false)
			}, 50)
		},
		[editor, activeBreakpoint, isUpdating]
	)

	// Check if alignment is active for current breakpoint
	const isAlignmentActive = useCallback(
		(alignment: Alignment) => {
			// Get fresh alignment state to ensure button highlighting is correct
			const freshAlignment = getCurrentAlignment()
			return freshAlignment?.[activeBreakpoint] === alignment
		},
		[getCurrentAlignment, activeBreakpoint]
	)

	// Get display icon based on priority: desktop > tablet > mobile
	const getDisplayIcon = () => {
		// Priority: Show most specific alignment that's set
		const align = currentAlignment?.desktop || currentAlignment?.tablet || currentAlignment?.mobile || 'left'
		return AlignmentIcons[align]
	}

	if (!showBreakpoints) {
		// Simple mode: just show alignment buttons without breakpoints
		return (
			<div style={{ display: 'flex', gap: '2px' }}>
				{(['left', 'center', 'right', 'justify'] as Alignment[]).map((align) => (
					<ToolbarButton
						key={align}
						onClick={() => editor.chain().focus().setTextAlign(align).run()}
						isActive={editor.isActive({ textAlign: align })}
						title={`Align ${align}`}
					>
						{AlignmentIcons[align]}
					</ToolbarButton>
				))}
			</div>
		)
	}

	return (
		<div style={{ position: 'relative' }}>
			<ToolbarButton
				onClick={() => setShowPanel(!showPanel)}
				isActive={showPanel}
				title="Text alignment (responsive)"
			>
				{getDisplayIcon()}
			</ToolbarButton>

			{showPanel && (
				<div
					onMouseDown={(e) => e.preventDefault()}
					onClick={(e) => e.stopPropagation()}
					style={{
						position: 'absolute',
						top: '100%',
						left: 0,
						marginTop: '4px',
						backgroundColor: 'white',
						border: '1px solid #e5e7eb',
						borderRadius: '6px',
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
						padding: '8px',
						zIndex: 1000,
						minWidth: '200px',
					}}
				>
					{/* Breakpoint tabs */}
					<div
						style={{
							display: 'flex',
							gap: '4px',
							marginBottom: '8px',
							borderBottom: '1px solid #e5e7eb',
							paddingBottom: '8px',
						}}
					>
						{(['mobile', 'tablet', 'desktop'] as Breakpoint[]).map((breakpoint) => (
							<button
								key={breakpoint}
								type="button"
								disabled={isUpdating}
								onMouseDown={(e) => e.preventDefault()}
								onClick={(e) => {
									e.stopPropagation()
									setActiveBreakpoint(breakpoint)
								}}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '4px',
									padding: '6px 12px',
									border: 'none',
									borderRadius: '4px',
									backgroundColor: activeBreakpoint === breakpoint ? '#3b82f6' : 'transparent',
									color: activeBreakpoint === breakpoint ? 'white' : '#6b7280',
									fontSize: '12px',
									cursor: isUpdating ? 'not-allowed' : 'pointer',
									fontWeight: activeBreakpoint === breakpoint ? 600 : 400,
									opacity: isUpdating ? 0.5 : 1,
								}}
								title={isUpdating ? 'Updating alignment...' : `${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)} breakpoint`}
							>
								{BreakpointIcons[breakpoint]}
								<span style={{ textTransform: 'capitalize' }}>{breakpoint}</span>
							</button>
						))}
					</div>

					{/* Alignment buttons */}
					<div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
						{(['left', 'center', 'right', 'justify'] as Alignment[]).map((align) => (
							<ToolbarButton
								key={align}
								onClick={() => setAlignment(align)}
								isActive={isAlignmentActive(align)}
								disabled={isUpdating}
								title={isUpdating ? 'Updating alignment...' : `Align ${align}`}
							>
								{AlignmentIcons[align]}
							</ToolbarButton>
						))}
					</div>

					{/* Current alignment summary */}
					<div
						style={{
							marginTop: '8px',
							paddingTop: '8px',
							borderTop: '1px solid #e5e7eb',
							fontSize: '11px',
							color: '#6b7280',
						}}
					>
						<div style={{ marginBottom: '2px' }}>
							<strong>Current:</strong>
						</div>
						{currentAlignment?.mobile && (
							<div>
								📱 Mobile: <strong>{currentAlignment.mobile}</strong>
							</div>
						)}
						{currentAlignment?.tablet && (
							<div>
								📱 Tablet: <strong>{currentAlignment.tablet}</strong>
							</div>
						)}
						{currentAlignment?.desktop && (
							<div>
								🖥️ Desktop: <strong>{currentAlignment.desktop}</strong>
							</div>
						)}
						{!currentAlignment?.mobile && !currentAlignment?.tablet && !currentAlignment?.desktop && (
							<div style={{ fontStyle: 'italic' }}>No alignment set</div>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
