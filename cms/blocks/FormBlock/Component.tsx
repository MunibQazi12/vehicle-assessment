import React from 'react'
import { FormSSR } from '@dealertower/components/forms'

export type FormBlockProps = {
	formId: string
	useContainer?: boolean
	blockType: 'formBlock'
}

type Props = FormBlockProps & {
	className?: string
	disableInnerContainer?: boolean
}

export const FormBlock: React.FC<Props> = ({
	className,
	formId,
	useContainer = false,
	disableInnerContainer,
}) => {
	if (!formId) {
		return null
	}

	// Support both useContainer from CMS and disableInnerContainer from props
	const shouldUseContainer = disableInnerContainer !== undefined ? !disableInnerContainer : useContainer

	return (
		<div className={[className, 'my-8'].filter(Boolean).join(' ')}>
			{shouldUseContainer ? (
				<div className="container py-4 md:py-6 lg:py-8">
					<FormSSR formId={formId} />
				</div>
			) : (
				<FormSSR formId={formId} />
			)}
		</div>
	)
}
