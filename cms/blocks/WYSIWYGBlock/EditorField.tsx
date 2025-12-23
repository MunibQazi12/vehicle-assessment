'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import type { JSONFieldClientComponent } from 'payload'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import { Extension } from '@tiptap/core'
import './editor.scss'

// Custom FontSize extension
const FontSize = Extension.create({
	name: 'fontSize',
	addOptions() {
		return {
			types: ['textStyle'],
		}
	},
	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					fontSize: {
						default: null,
						parseHTML: element => element.style.fontSize || null,
						renderHTML: attributes => {
							if (!attributes.fontSize) {
								return {}
							}
							return {
								style: `font-size: ${attributes.fontSize}`,
							}
						},
					},
				},
			},
		]
	},
	addCommands() {
		return {
			setFontSize: fontSize => ({ chain }) => {
				return chain().setMark('textStyle', { fontSize }).run()
			},
			unsetFontSize: () => ({ chain }) => {
				return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
			},
		}
	},
})

// Helper to extract label string from Payload's StaticLabel type
const getLabel = (
	label: string | Record<string, string> | undefined | false,
	fallback: string,
): string => {
	if (!label) return fallback
	if (typeof label === 'string') return label
	return Object.values(label)[0] || fallback
}

// Toolbar Button Component
const ToolbarButton: React.FC<{
	onClick: () => void
	isActive?: boolean
	disabled?: boolean
	title: string
	children: React.ReactNode
}> = ({ onClick, isActive, disabled, title, children }) => (
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

// Divider Component
const ToolbarDivider: React.FC = () => (
	<div style={{ width: '1px', height: '24px', backgroundColor: '#d1d5db', margin: '0 4px' }} />
)

// Format Dropdown Component
const FormatDropdown: React.FC<{ editor: Editor }> = ({ editor }) => {
	const [isOpen, setIsOpen] = useState(false)

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
		<div style={{ position: 'relative' }}>
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
				<div style={{
					position: 'absolute',
					top: '100%',
					left: '0',
					marginTop: '4px',
					width: '192px',
					backgroundColor: '#fff',
					border: '1px solid #e5e7eb',
					borderRadius: '6px',
					boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
					zIndex: 50,
				}}>
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

// Font Size Dropdown
const FontSizeDropdown: React.FC<{ editor: Editor }> = ({ editor }) => {
	const [isOpen, setIsOpen] = useState(false)
	const fontSizes = [
		{ label: 'Small', value: '10px' },
		{ label: 'Normal', value: '14px' },
		{ label: 'Medium', value: '18px' },
		{ label: 'Large', value: '24px' },
		{ label: 'Extra Large', value: '48px' },
		{ label: 'Huge', value: '96px' },
	]

	const currentFontSize = editor.getAttributes('textStyle').fontSize
	const currentLabel = fontSizes.find(size => size.value === currentFontSize)?.label || 'Normal'

	return (
		<div style={{ position: 'relative' }}>
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
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 4h12M8 8v12m8-12v12M6 20h12"
					/>
				</svg>
				<span style={{ flex: 1, textAlign: 'left' }}>{currentLabel}</span>
				<svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>
			{isOpen && (
				<div style={{
					position: 'absolute',
					top: '100%',
					left: '0',
					marginTop: '4px',
					width: '160px',
					backgroundColor: '#fff',
					border: '1px solid #e5e7eb',
					borderRadius: '6px',
					boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
					zIndex: 50,
				}}>
					<ul style={{ padding: '8px', margin: 0, listStyle: 'none' }}>
						{fontSizes.map((size) => (
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
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = '#f3f4f6'
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = currentFontSize === size.value ? '#f3f4f6' : 'transparent'
									}}
								>
									{size.label}
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

// Color Picker Dropdown
const ColorPicker: React.FC<{ editor: Editor }> = ({ editor }) => {
	const [isOpen, setIsOpen] = useState(false)
	const colors = [
		'#1A56DB',
		'#0E9F6E',
		'#FACA15',
		'#F05252',
		'#FF8A4C',
		'#0694A2',
		'#B4C6FC',
		'#8DA2FB',
		'#5145CD',
		'#771D1D',
		'#FCD9BD',
		'#99154B',
		'#7E3AF2',
		'#CABFFD',
		'#D61F69',
		'#F8B4D9',
		'#F6C196',
		'#A4CAFE',
		'#B43403',
		'#FCE96A',
		'#1E429F',
		'#768FFD',
		'#BCF0DA',
		'#EBF5FF',
		'#16BDCA',
		'#E74694',
		'#83B0ED',
		'#03543F',
		'#111928',
		'#4B5563',
		'#6B7280',
		'#D1D5DB',
		'#F3F4F6',
		'#F9FAFB',
	]

	return (
		<div style={{ position: 'relative' }}>
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
				<div style={{
					position: 'absolute',
					top: '100%',
					left: 0,
					marginTop: '4px',
					width: '192px',
					backgroundColor: '#fff',
					border: '1px solid #e5e7eb',
					borderRadius: '6px',
					boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
					zIndex: 50,
					padding: '8px',
				}}>
					<div style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(6, 1fr)',
						gap: '4px',
						marginBottom: '12px',
					}}>
						{colors.map((color) => (
							<button
								key={color}
								type="button"
								onClick={() => {
									editor.chain().focus().setColor(color).run()
									setIsOpen(false)
								}}
								style={{
									width: '24px',
									height: '24px',
									borderRadius: '6px',
									border: '1px solid #e5e7eb',
									backgroundColor: color,
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

// Main Editor Toolbar
const EditorToolbar: React.FC<{ editor: Editor }> = ({ editor }) => {
	const addLink = useCallback(() => {
		const previousUrl = editor.getAttributes('link').href
		const url = window.prompt('Enter URL:', previousUrl)
		if (url === null) return
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run()
			return
		}
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
	}, [editor])

	const addImage = useCallback(() => {
		const url = window.prompt('Enter image URL:')
		if (url) {
			editor.chain().focus().setImage({ src: url }).run()
		}
	}, [editor])

	const addYouTube = useCallback(() => {
		const url = window.prompt('Enter YouTube URL:')
		if (url) {
			editor.commands.setYoutubeVideo({ src: url, width: 640, height: 480 })
		}
	}, [editor])

	return (
		<div
			style={{
				borderBottom: '1px solid #e5e7eb',
				padding: '8px',
			}}
		>
			{/* First Row - Text Formatting */}
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					gap: '4px',
					marginBottom: '8px',
				}}
			>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					isActive={editor.isActive('bold')}
					title="Bold"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					isActive={editor.isActive('italic')}
					title="Italic"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="m8.87 19 6.14-14M6 19h6.33m-.66-14H18"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					isActive={editor.isActive('underline')}
					title="Underline"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeWidth={2}
							d="M6 19h12M8 5v9a4 4 0 0 0 8 0V5M6 5h4m4 0h4"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleStrike().run()}
					isActive={editor.isActive('strike')}
					title="Strikethrough"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M7 6.2V5h12v1.2M7 19h6m.2-14-1.68 6.52M9.6 19l1.03-4M5 5l6.52 6.52M19 19l-7.48-7.48"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleSubscript().run()}
					isActive={editor.isActive('subscript')}
					title="Subscript"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M20 20h-4v-.5c1.1-1.03 3.75-2.5 3.75-3.5v-1c0-.55-.45-1-1-1H17c-.55 0-1 .45-1 1M4 4l9.12 11.39m0-11.39L4 15.39"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleSuperscript().run()}
					isActive={editor.isActive('superscript')}
					title="Superscript"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M20 10h-4v-.5C17.1 8.47 19.75 7 19.75 6V5c0-.55-.45-1-1-1H17c-.55 0-1 .45-1 1M4 7.3l9.12 11.39m0-11.39L4 18.7"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleHighlight().run()}
					isActive={editor.isActive('highlight')}
					title="Highlight"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeWidth={2}
							d="M9 20H5.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H18m-6-1 1.42 1.9a.08.08 0 0 0 .16 0L15 19m-7-6 3.9-9.77a.1.1 0 0 1 .19 0L16 13m-8 0H7m1 0h1.5m6.5 0h-1.5m1.5 0h1m-7-3h4"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleCode().run()}
					isActive={editor.isActive('code')}
					title="Code"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarDivider />

				<ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Add link">
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13.21 9.79a3.39 3.39 0 0 0-4.8 0l-3.42 3.43a3.39 3.39 0 0 0 4.8 4.79l.32-.3m-.32-4.49a3.39 3.39 0 0 0 4.8 0l3.42-3.43a3.39 3.39 0 0 0-4.79-4.8l-1.03.96"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().unsetLink().run()}
					disabled={!editor.isActive('link')}
					title="Remove link"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeWidth={2}
							d="M13.2 9.79a3.4 3.4 0 0 0-4.8 0L5 13.2A3.4 3.4 0 0 0 9.8 18l.3-.3m-.3-4.5a3.4 3.4 0 0 0 4.8 0L18 9.8A3.4 3.4 0 0 0 13.2 5l-1 1m7.4 14-1.8-1.8m0 0L16 16.4m1.8 1.8 1.8-1.8m-1.8 1.8L16 20"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarDivider />

				<FontSizeDropdown editor={editor} />

				<ToolbarDivider />

				<ColorPicker editor={editor} />

				<ToolbarDivider />

				{/* Alignment */}
				<ToolbarButton
					onClick={() => editor.chain().focus().setTextAlign('left').run()}
					isActive={editor.isActive({ textAlign: 'left' })}
					title="Align left"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 6h8m-8 4h12M6 14h8m-8 4h12"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().setTextAlign('center').run()}
					isActive={editor.isActive({ textAlign: 'center' })}
					title="Align center"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 6h8M6 10h12M8 14h8M6 18h12"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().setTextAlign('right').run()}
					isActive={editor.isActive({ textAlign: 'right' })}
					title="Align right"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M18 6h-8m8 4H6m12 4h-8m8 4H6"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().setTextAlign('justify').run()}
					isActive={editor.isActive({ textAlign: 'justify' })}
					title="Justify"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M18 6H6m12 4H6m12 4H6m12 4H6"
						/>
					</svg>
				</ToolbarButton>
			</div>

			{/* Second Row - Block Elements */}
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					gap: '4px',
				}}
			>
				<FormatDropdown editor={editor} />

				<ToolbarDivider />

				<ToolbarButton onClick={addImage} title="Add image">
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.29 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton onClick={addYouTube} title="Add video">
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					isActive={editor.isActive('bulletList')}
					title="Bullet list"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeWidth={2}
							d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					isActive={editor.isActive('orderedList')}
					title="Ordered list"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 6h8m-8 6h8m-8 6h8M4 16a2 2 0 1 1 3.32 1.5L4 20h5M4 5l2-1v6m-2 0h4"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					isActive={editor.isActive('blockquote')}
					title="Blockquote"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 11V8a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1Zm0 0v2a4 4 0 0 1-4 4H5m14-6V8a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1Zm0 0v2a4 4 0 0 1-4 4h-1"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().setHorizontalRule().run()}
					title="Horizontal rule"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeWidth={2} d="M5 12h14" />
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					isActive={editor.isActive('codeBlock')}
					title="Code block"
				>
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="m8 8-4 4 4 4m8 0 4-4-4-4"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarDivider />

				<ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
					<svg style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 9H8a5 5 0 0 0 0 10h9m4-10-4-4m4 4-4 4"
						/>
					</svg>
				</ToolbarButton>
			</div>
		</div>
	)
}

const EditorField: JSONFieldClientComponent = ({ field, path }) => {
	const { value, setValue } = useField<object>({ path })
	const dispatchFields = useFormFields(([, dispatch]) => dispatch)

	// Get the HTML content field path (sibling field)
	const htmlFieldPath = path.replace(/\.content$/, '.htmlContent').replace(/^content$/, 'htmlContent')

	// Refs to store timeout IDs
	const jsonUpdateTimeout = useRef<NodeJS.Timeout | undefined>(undefined)
	const htmlUpdateTimeout = useRef<NodeJS.Timeout | undefined>(undefined)

	// Debounced updates to prevent re-renders during typing
	const updateContent = useCallback(
		(json: object, html: string) => {
			// Clear existing timeouts
			if (jsonUpdateTimeout.current) clearTimeout(jsonUpdateTimeout.current)
			if (htmlUpdateTimeout.current) clearTimeout(htmlUpdateTimeout.current)

			// Debounce both JSON and HTML updates (2 seconds after user stops typing)
			jsonUpdateTimeout.current = setTimeout(() => {
				setValue(json)
			}, 1000)

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

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3, 4, 5, 6],
				},
			}),
			Underline,
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: 'https',
			}),
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
			Highlight.configure({ multicolor: true }),
			TextStyle,
			FontSize,
			Color,
			Subscript,
			Superscript,
			Image.configure({
				HTMLAttributes: {
					class: 'max-w-full h-auto rounded-lg',
				},
			}),
			Youtube.configure({
				width: 640,
				height: 480,
				HTMLAttributes: {
					class: 'w-full aspect-video rounded-lg',
				},
			}),
			Placeholder.configure({
				placeholder: 'Start writing your content here...',
			}),
		],
		content: value || '<p></p>',
		editorProps: {
			attributes: {
				class:
					'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[200px] px-4 py-3',
			},
		},
		onUpdate: ({ editor }) => {
			const json = editor.getJSON()
			const html = editor.getHTML()

			// Update both fields with debouncing to prevent re-renders during typing
			updateContent(json, html)
		},
	})

	// Update editor content when value changes externally (but not during active editing)
	const isTyping = useRef(false)

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
			if (jsonUpdateTimeout.current) clearTimeout(jsonUpdateTimeout.current)
			if (htmlUpdateTimeout.current) clearTimeout(htmlUpdateTimeout.current)
		}
	}, [editor])

	if (!editor) {
		return (
			<div className="field-type json">
				<label className="field-label">
					{getLabel(field.label, field.name)}
					{field.required && <span className="required">*</span>}
				</label>
				<div
					style={{
						animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
						backgroundColor: '#e5e7eb',
						borderRadius: '8px',
						height: '16rem',
					}}
				/>
			</div>
		)
	}

	return (
		<div className="field-type json wysiwyg-editor-field">
			<label className="field-label">
				{getLabel(field.label, field.name)}
				{field.required && <span className="required">*</span>}
			</label>
			<div
				style={{
					border: '1px solid #d1d5db',
					borderRadius: '8px',
					backgroundColor: 'white',
					overflow: 'hidden',
				}}
			>
				<EditorToolbar editor={editor} />
				<div
					style={{
						padding: '16px',
						minHeight: '200px',
					}}
				>
					<EditorContent editor={editor} />
				</div>
			</div>
			{field.admin?.description && (
				<div
					style={{
						fontSize: '0.875rem',
						color: '#6b7280',
						marginTop: '8px',
					}}
				>
					{getLabel(field.admin.description, '')}
				</div>
			)}
		</div>
	)
}

export default EditorField

