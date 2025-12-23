/**
 * Main editor toolbar component
 * Contains all toolbar buttons, dropdowns, and formatting controls
 */

import React, { useCallback } from 'react'
import type { Editor } from '@tiptap/react'
import { ToolbarButton, ToolbarDivider } from './ToolbarButton'
import { FormatDropdown } from './FormatDropdown'
import { FontSizeDropdown } from './FontSizeDropdown'
import { ColorPicker } from './ColorPicker'
import { SpacingControl } from './SpacingControl'

export const EditorToolbar: React.FC<{ editor: Editor }> = ({ editor }) => {
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
		<div style={{ borderBottom: '1px solid #e5e7eb', padding: '8px' }}>
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
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.87 19 6.14-14M6 19h6.33m-.66-14H18" />
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					isActive={editor.isActive('underline')}
					title="Underline"
				>
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeWidth={2} d="M6 19h12M8 5v9a4 4 0 0 0 8 0V5M6 5h4m4 0h4" />
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleStrike().run()}
					isActive={editor.isActive('strike')}
					title="Strikethrough"
				>
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeWidth={2}
							d="M9 20H5.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H18m-6-1 1.42 1.9a.08.08 0 0 0 .16 0L15 19m-7-6 3.9-9.77a.1.1 0 0 1 .19 0L16 13m-8 0H7m1 0h1.5m6.5 0h-1.5m1.5 0h1m-7-3h4"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Code">
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14" />
					</svg>
				</ToolbarButton>

				<ToolbarDivider />

				<ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Add link">
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6h8m-8 4h12M6 14h8m-8 4h12" />
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().setTextAlign('center').run()}
					isActive={editor.isActive({ textAlign: 'center' })}
					title="Align center"
				>
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8M6 10h12M8 14h8M6 18h12" />
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().setTextAlign('right').run()}
					isActive={editor.isActive({ textAlign: 'right' })}
					title="Align right"
				>
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6h-8m8 4H6m12 4h-8m8 4H6" />
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().setTextAlign('justify').run()}
					isActive={editor.isActive({ textAlign: 'justify' })}
					title="Justify"
				>
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6H6m12 4H6m12 4H6m12 4H6" />
					</svg>
				</ToolbarButton>

				<ToolbarDivider />
				<SpacingControl editor={editor} />
			</div>

			{/* Second Row - Block Elements */}
			<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px' }}>
				<FormatDropdown editor={editor} />
				<ToolbarDivider />

				<ToolbarButton onClick={addImage} title="Add image">
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.29 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton onClick={addYouTube} title="Add video">
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeWidth={2} d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					isActive={editor.isActive('orderedList')}
					title="Ordered list"
				>
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 11V8a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1Zm0 0v2a4 4 0 0 1-4 4H5m14-6V8a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1Zm0 0v2a4 4 0 0 1-4 4h-1"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeWidth={2} d="M5 12h14" />
					</svg>
				</ToolbarButton>

				<ToolbarButton
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					isActive={editor.isActive('codeBlock')}
					title="Code block"
				>
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 8-4 4 4 4m8 0 4-4-4-4" />
					</svg>
				</ToolbarButton>

				<ToolbarDivider />

				<ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 9h13a5 5 0 0 1 0 10H7M3 9l4-4M3 9l4 4"
						/>
					</svg>
				</ToolbarButton>

				<ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
					<svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
