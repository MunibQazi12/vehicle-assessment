/**
 * Configurable toolbar component that renders buttons based on enabled features
 * Reduces duplication by using a feature-based rendering approach
 */

'use client'

import React, { useCallback } from 'react'
import type { Editor } from '@tiptap/react'
import { ToolbarButton, ToolbarDivider } from '../toolbar/ToolbarButton'
import { FontSizeDropdown } from '../toolbar/FontSizeDropdown'
import { ColorPicker } from '../toolbar/ColorPicker'
import { FormatDropdown } from '../toolbar/FormatDropdown'
import { ResponsiveAlignmentControl } from '../toolbar/ResponsiveAlignmentControl'
import { SpacingControl } from '../toolbar/SpacingControl'
import { JsonBackup } from '../toolbar/JsonBackup'
import type { ToolbarFeature, ToolbarProps } from './types'

// SVG Icons as components for cleaner code
const Icons = {
	bold: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M8 5h4.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0-7H6m2 7h6.5a3.5 3.5 0 1 1 0 7H8m0-7v7m0 0H6"
			/>
		</svg>
	),
	italic: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.87 19 6.14-14M6 19h6.33m-.66-14H18" />
		</svg>
	),
	underline: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeWidth={2} d="M6 19h12M8 5v9a4 4 0 0 0 8 0V5M6 5h4m4 0h4" />
		</svg>
	),
	strikethrough: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M7 6.2V5h12v1.2M7 19h6m.2-14-1.68 6.52M9.6 19l1.03-4M5 5l6.52 6.52M19 19l-7.48-7.48"
			/>
		</svg>
	),
	subscript: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M20 20h-4v-.5c1.1-1.03 3.75-2.5 3.75-3.5v-1c0-.55-.45-1-1-1H17c-.55 0-1 .45-1 1M4 4l9.12 11.39m0-11.39L4 15.39"
			/>
		</svg>
	),
	superscript: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M20 10h-4v-.5C17.1 8.47 19.75 7 19.75 6V5c0-.55-.45-1-1-1H17c-.55 0-1 .45-1 1M4 7.3l9.12 11.39m0-11.39L4 18.7"
			/>
		</svg>
	),
	highlight: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeWidth={2}
				d="M9 20H5.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H18m-6-1 1.42 1.9a.08.08 0 0 0 .16 0L15 19m-7-6 3.9-9.77a.1.1 0 0 1 .19 0L16 13m-8 0H7m1 0h1.5m6.5 0h-1.5m1.5 0h1m-7-3h4"
			/>
		</svg>
	),
	code: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14" />
		</svg>
	),
	link: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M13.21 9.79a3.39 3.39 0 0 0-4.8 0l-3.42 3.43a3.39 3.39 0 0 0 4.8 4.79l.32-.3m-.32-4.49a3.39 3.39 0 0 0 4.8 0l3.42-3.43a3.39 3.39 0 0 0-4.79-4.8l-1.03.96"
			/>
		</svg>
	),
	unlink: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeWidth={2}
				d="M13.2 9.79a3.4 3.4 0 0 0-4.8 0L5 13.2A3.4 3.4 0 0 0 9.8 18l.3-.3m-.3-4.5a3.4 3.4 0 0 0 4.8 0L18 9.8A3.4 3.4 0 0 0 13.2 5l-1 1m7.4 14-1.8-1.8m0 0L16 16.4m1.8 1.8 1.8-1.8m-1.8 1.8L16 20"
			/>
		</svg>
	),
	image: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.29 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
			/>
		</svg>
	),
	youtube: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
			/>
		</svg>
	),
	bulletList: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeWidth={2} d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
		</svg>
	),
	orderedList: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M12 6h8m-8 6h8m-8 6h8M4 16a2 2 0 1 1 3.32 1.5L4 20h5M4 5l2-1v6m-2 0h4"
			/>
		</svg>
	),
	blockquote: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M10 11V8a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1Zm0 0v2a4 4 0 0 1-4 4H5m14-6V8a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1Zm0 0v2a4 4 0 0 1-4 4h-1"
			/>
		</svg>
	),
	horizontalRule: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeWidth={2} d="M5 12h14" />
		</svg>
	),
	codeBlock: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 8-4 4 4 4m8 0 4-4-4-4" />
		</svg>
	),
	undo: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4" />
		</svg>
	),
	redo: (
		<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 9H8a5 5 0 0 0 0 10h9m4-10-4-4m4 4-4 4" />
		</svg>
	),
}

/**
 * Button configuration type
 */
interface ButtonConfig {
	feature: ToolbarFeature
	icon: React.ReactNode
	title: string
	onClick: (editor: Editor) => void
	isActive?: (editor: Editor) => boolean
	isDisabled?: (editor: Editor) => boolean
}

/**
 * Get button configurations for the toolbar
 */
function getButtonConfigs(editor: Editor, addLink: () => void, addImage: () => void, addYouTube: () => void): ButtonConfig[] {
	return [
		// Text formatting
		{
			feature: 'bold',
			icon: Icons.bold,
			title: 'Bold',
			onClick: (e) => e.chain().focus().toggleBold().run(),
			isActive: (e) => e.isActive('bold'),
		},
		{
			feature: 'italic',
			icon: Icons.italic,
			title: 'Italic',
			onClick: (e) => e.chain().focus().toggleItalic().run(),
			isActive: (e) => e.isActive('italic'),
		},
		{
			feature: 'underline',
			icon: Icons.underline,
			title: 'Underline',
			onClick: (e) => e.chain().focus().toggleUnderline().run(),
			isActive: (e) => e.isActive('underline'),
		},
		{
			feature: 'strikethrough',
			icon: Icons.strikethrough,
			title: 'Strikethrough',
			onClick: (e) => e.chain().focus().toggleStrike().run(),
			isActive: (e) => e.isActive('strike'),
		},
		{
			feature: 'subscript',
			icon: Icons.subscript,
			title: 'Subscript',
			onClick: (e) => e.chain().focus().toggleSubscript().run(),
			isActive: (e) => e.isActive('subscript'),
		},
		{
			feature: 'superscript',
			icon: Icons.superscript,
			title: 'Superscript',
			onClick: (e) => e.chain().focus().toggleSuperscript().run(),
			isActive: (e) => e.isActive('superscript'),
		},
		{
			feature: 'highlight',
			icon: Icons.highlight,
			title: 'Highlight',
			onClick: (e) => e.chain().focus().toggleHighlight().run(),
			isActive: (e) => e.isActive('highlight'),
		},
		{
			feature: 'code',
			icon: Icons.code,
			title: 'Code',
			onClick: (e) => e.chain().focus().toggleCode().run(),
			isActive: (e) => e.isActive('code'),
		},
		// Links
		{
			feature: 'link',
			icon: Icons.link,
			title: 'Add link',
			onClick: () => addLink(),
			isActive: (e) => e.isActive('link'),
		},
		{
			feature: 'unlink',
			icon: Icons.unlink,
			title: 'Remove link',
			onClick: (e) => e.chain().focus().unsetLink().run(),
			isDisabled: (e) => !e.isActive('link'),
		},

		// Media
		{
			feature: 'image',
			icon: Icons.image,
			title: 'Add image',
			onClick: () => addImage(),
		},
		{
			feature: 'youtube',
			icon: Icons.youtube,
			title: 'Add video',
			onClick: () => addYouTube(),
		},
		// Lists
		{
			feature: 'bulletList',
			icon: Icons.bulletList,
			title: 'Bullet list',
			onClick: (e) => e.chain().focus().toggleBulletList().run(),
			isActive: (e) => e.isActive('bulletList'),
		},
		{
			feature: 'orderedList',
			icon: Icons.orderedList,
			title: 'Ordered list',
			onClick: (e) => e.chain().focus().toggleOrderedList().run(),
			isActive: (e) => e.isActive('orderedList'),
		},
		// Block elements
		{
			feature: 'blockquote',
			icon: Icons.blockquote,
			title: 'Blockquote',
			onClick: (e) => e.chain().focus().toggleBlockquote().run(),
			isActive: (e) => e.isActive('blockquote'),
		},
		{
			feature: 'horizontalRule',
			icon: Icons.horizontalRule,
			title: 'Horizontal rule',
			onClick: (e) => e.chain().focus().setHorizontalRule().run(),
		},
		{
			feature: 'codeBlock',
			icon: Icons.codeBlock,
			title: 'Code block',
			onClick: (e) => e.chain().focus().toggleCodeBlock().run(),
			isActive: (e) => e.isActive('codeBlock'),
		},
		// History
		{
			feature: 'undo',
			icon: Icons.undo,
			title: 'Undo',
			onClick: (e) => e.chain().focus().undo().run(),
		},
		{
			feature: 'redo',
			icon: Icons.redo,
			title: 'Redo',
			onClick: (e) => e.chain().focus().redo().run(),
		},
	]
}

/**
 * Feature group definitions for toolbar layout
 */
const featureGroups: { features: ToolbarFeature[]; dividerAfter?: boolean }[] = [
	// Text formatting group
	{ features: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'highlight', 'code'], dividerAfter: true },
	// Links group
	{ features: ['link', 'unlink'], dividerAfter: true },
	// Typography (special handling for dropdowns)
	{ features: ['fontSize'], dividerAfter: false },
	// Colors (special handling)
	{ features: ['textColor'], dividerAfter: true },
	// Alignment group (responsive alignment only)
	{ features: ['responsiveAlignment'], dividerAfter: false },
	// Spacing group
	{ features: ['spacing'], dividerAfter: true },
	// Format dropdown (special handling)
	{ features: ['formatDropdown'], dividerAfter: true },
	// Media group
	{ features: ['image', 'youtube'], dividerAfter: false },
	// Lists group
	{ features: ['bulletList', 'orderedList'], dividerAfter: false },
	// Block elements group
	{ features: ['blockquote', 'horizontalRule', 'codeBlock'], dividerAfter: true },
	// History group
	{ features: ['undo', 'redo'], dividerAfter: false },
]

/**
 * ConfigurableToolbar - Renders toolbar buttons based on enabled features
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ConfigurableToolbar: React.FC<ToolbarProps> = ({ editor, features, singleRow: _singleRow = false, colors }) => {
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

	const buttonConfigs = getButtonConfigs(editor, addLink, addImage, addYouTube)
	const buttonMap = new Map(buttonConfigs.map((config) => [config.feature, config]))

	const renderFeatureGroup = (group: (typeof featureGroups)[0], index: number) => {
		const visibleFeatures = group.features.filter((f) => features.has(f))
		if (visibleFeatures.length === 0) return null

		const elements: React.ReactNode[] = []

		for (const feature of visibleFeatures) {
			// Special handling for dropdowns and pickers
			if (feature === 'fontSize') {
				elements.push(<FontSizeDropdown key="fontSize" editor={editor} />)
				continue
			}
			if (feature === 'textColor') {
				elements.push(<ColorPicker key="textColor" editor={editor} colors={colors} />)
				continue
			}
			if (feature === 'formatDropdown') {
				elements.push(<FormatDropdown key="formatDropdown" editor={editor} />)
				continue
			}
			if (feature === 'responsiveAlignment') {
				elements.push(<ResponsiveAlignmentControl key="responsiveAlignment" editor={editor} showBreakpoints={true} />)
				continue
			}
			if (feature === 'spacing') {
				elements.push(<SpacingControl key="spacing" editor={editor} />)
				continue
			}

			// Regular button
			const config = buttonMap.get(feature)
			if (config) {
				elements.push(
					<ToolbarButton
						key={feature}
						onClick={() => config.onClick(editor)}
						isActive={config.isActive?.(editor)}
						disabled={config.isDisabled?.(editor)}
						title={config.title}
					>
						{config.icon}
					</ToolbarButton>
				)
			}
		}

		// Add divider after group if needed and there are more visible groups after
		const hasMoreVisibleGroups = featureGroups.slice(index + 1).some((g) => g.features.some((f) => features.has(f)))

		if (group.dividerAfter && hasMoreVisibleGroups && elements.length > 0) {
			elements.push(<ToolbarDivider key={`divider-${index}`} />)
		}

		return elements
	}

	return (
		<div style={{ borderBottom: '1px solid #e5e7eb', padding: '8px' }}>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					gap: '4px',
				}}
			>
				{featureGroups.map((group, index) => renderFeatureGroup(group, index))}
				{/* JSON Backup/Restore button - always shown */}
				<ToolbarDivider />
				<JsonBackup editor={editor} />
			</div>
		</div>
	)
}

export default ConfigurableToolbar
