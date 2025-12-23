import React from 'react'

import { HTMLContent } from './Component.client'

export type HTMLBlockProps = {
	htmlContent: string
	enableScripts?: boolean
	useContainer?: boolean
	blockType: 'htmlBlock'
}

type Props = HTMLBlockProps & {
	className?: string
	disableInnerContainer?: boolean
}

export const HTMLBlock: React.FC<Props> = ({
	className,
	htmlContent,
	enableScripts = false,
	useContainer = true,
	disableInnerContainer,
}) => {
	// Support both useContainer from CMS and disableInnerContainer from props
	const shouldUseContainer = disableInnerContainer !== undefined ? !disableInnerContainer : useContainer

	return (
		<div className={[className, 'not-prose', 'my-8'].filter(Boolean).join(' ')}>
			{shouldUseContainer ? (
				<div className="container py-4 md:py-6 lg:py-8">
					<HTMLContent htmlContent={htmlContent} enableScripts={enableScripts} />
				</div>
			) : (
				<HTMLContent htmlContent={htmlContent} enableScripts={enableScripts} />
			)}
		</div>
	)
}
