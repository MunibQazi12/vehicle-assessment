import React from 'react'
import { cn } from '@dtcms/utilities/ui'
import type { ContentBlock as ContentBlockType } from '@dtcms/payload-types'
import { generateHTML } from '@tiptap/html'
import { getEditorExtensions } from '@dtcms/components/EditorField/extensions'
type Props = ContentBlockType & {
	className?: string
	disableInnerContainer?: boolean
}

export const WYSIWYGBlock: React.FC<Props> = (props) => {
	const { content, htmlContent, className, disableInnerContainer } = props

	// Generate HTML from TipTap JSON content
	let renderedHtml = ''

	if (htmlContent) {
		// Use pre-generated HTML if available
		renderedHtml = htmlContent
	} else if (content && typeof content === 'object') {
		// Generate HTML from JSON content
		try {
			renderedHtml = generateHTML(content as Parameters<typeof generateHTML>[0], getEditorExtensions())
		} catch (error) {
			console.error('Error generating HTML from WYSIWYG content:', error)
			renderedHtml = '<p>Error rendering content</p>'
		}
	}

	if (!renderedHtml) {
		return null
	}

	return (
		<div className={cn('wysiwyg-block my-8', className)}>
			<div className={cn({ container: !disableInnerContainer })}>
				<div
					className="wysiwyg-content"
					dangerouslySetInnerHTML={{ __html: renderedHtml }}
				/>
			</div>
		</div>
	)
}

export default WYSIWYGBlock
