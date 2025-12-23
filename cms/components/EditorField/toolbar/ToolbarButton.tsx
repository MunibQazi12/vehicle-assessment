/**
 * Toolbar button component for the editor toolbar
 */

import React from 'react'

interface ToolbarButtonProps {
	onClick: () => void
	isActive?: boolean
	disabled?: boolean
	title: string
	children: React.ReactNode
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
	onClick,
	isActive,
	disabled,
	title,
	children,
}) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		title={title}
		style={{
			padding: '6px',
			borderRadius: '4px',
			cursor: disabled ? 'not-allowed' : 'pointer',
			backgroundColor: isActive ? '#e5e7eb' : 'transparent',
			color: isActive ? '#2563eb' : '#4b5563',
			border: 'none',
			opacity: disabled ? 0.5 : 1,
			transition: 'background-color 0.2s',
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
		onMouseEnter={(e) => {
			if (!disabled) {
				e.currentTarget.style.backgroundColor = isActive ? '#e5e7eb' : '#f3f4f6'
			}
		}}
		onMouseLeave={(e) => {
			e.currentTarget.style.backgroundColor = isActive ? '#e5e7eb' : 'transparent'
		}}
	>
		{children}
	</button>
)

export const ToolbarDivider: React.FC = () => (
	<div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 4px' }} />
)
