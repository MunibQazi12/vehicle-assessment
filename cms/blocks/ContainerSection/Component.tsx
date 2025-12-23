import React from 'react'
import { cn } from '@dtcms/utilities/ui'
import type { ContainerSectionBlock as ContainerSectionBlockType } from '@dtcms/payload-types'
import { RenderBlocks } from '@dtcms/blocks/RenderBlocks'

type Props = ContainerSectionBlockType & {
	className?: string
	disableInnerContainer?: boolean
}

// Max width classes mapping
const maxWidthClasses: Record<string, string> = {
	xs: 'max-w-xs',
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	'2xl': 'max-w-2xl',
	'3xl': 'max-w-3xl',
	'4xl': 'max-w-4xl',
	'5xl': 'max-w-5xl',
	'6xl': 'max-w-6xl',
	'7xl': 'max-w-7xl',
	full: 'max-w-full',
	none: '',
}

// Horizontal padding classes mapping
const horizontalPaddingClasses: Record<string, string> = {
	none: '',
	small: 'px-2 sm:px-4',
	default: 'px-4 sm:px-6',
	large: 'px-6 sm:px-8',
	xl: 'px-8 sm:px-10',
}

// Padding top classes mapping (responsive)
const paddingTopClasses: Record<string, string> = {
	none: '',
	xs: 'pt-2 md:pt-4',
	sm: 'pt-4 md:pt-6 lg:pt-8',
	md: 'pt-8 md:pt-12 lg:pt-16',
	lg: 'pt-12 md:pt-16 lg:pt-20',
	xl: 'pt-16 md:pt-20 lg:pt-24',
	'2xl': 'pt-20 md:pt-24 lg:pt-32',
}

// Padding bottom classes mapping (responsive)
const paddingBottomClasses: Record<string, string> = {
	none: '',
	xs: 'pb-2 md:pb-4',
	sm: 'pb-4 md:pb-6 lg:pb-8',
	md: 'pb-8 md:pb-12 lg:pb-16',
	lg: 'pb-12 md:pb-16 lg:pb-20',
	xl: 'pb-16 md:pb-20 lg:pb-24',
	'2xl': 'pb-20 md:pb-24 lg:pb-32',
}

// Mobile-specific padding top classes (applied with max-md: prefix via inline styles)
const mobilePaddingTopValues: Record<string, string> = {
	none: '0',
	xs: '0.5rem',
	sm: '1rem',
	md: '2rem',
	lg: '3rem',
	xl: '4rem',
}

// Mobile-specific padding bottom classes
const mobilePaddingBottomValues: Record<string, string> = {
	none: '0',
	xs: '0.5rem',
	sm: '1rem',
	md: '2rem',
	lg: '3rem',
	xl: '4rem',
}

// Mobile-specific horizontal padding classes
const mobileHorizontalPaddingValues: Record<string, string> = {
	none: '0',
	xs: '0.25rem',
	sm: '0.5rem',
	md: '1rem',
	lg: '1.5rem',
}

// Mobile-specific max width values
const mobileMaxWidthValues: Record<string, string> = {
	full: '100%',
	xs: '320px',
	sm: '384px',
	md: '448px',
	lg: '512px',
}

// Counter for generating stable IDs in server components
let containerIdCounter = 0

export const ContainerSectionBlock: React.FC<Props> = ({
	blocks,
	maxWidth = '3xl',
	horizontalPadding = 'default',
	centerContent = true,
	paddingTop = 'md',
	paddingBottom = 'md',
	backgroundColor = '#ffffff',
	enableGradient = false,
	gradientEndColor = '#f3f4f6',
	gradientDirection = 'to-b',
	// Responsive settings
	hideOnMobile = false,
	hideOnTablet = false,
	hideOnDesktop = false,
	mobileMaxWidth,
	mobilePaddingTop,
	mobilePaddingBottom,
	mobileHorizontalPadding,
	htmlId,
	customClasses,
	innerCustomClasses,
	className,
}) => {
	// Build section styles
	const sectionStyle: React.CSSProperties = {}

	if (enableGradient && backgroundColor && gradientEndColor) {
		// Use CSS custom properties for gradient colors
		sectionStyle.backgroundImage = `linear-gradient(${getGradientAngle(gradientDirection || 'to-b')}, ${backgroundColor}, ${gradientEndColor})`
	} else if (backgroundColor) {
		sectionStyle.backgroundColor = backgroundColor
	}

	// Build responsive visibility classes
	const visibilityClasses = cn(
		hideOnMobile && 'hidden md:block',
		hideOnTablet && 'md:hidden lg:block',
		hideOnDesktop && 'lg:hidden',
		// Handle combinations
		hideOnMobile && hideOnTablet && !hideOnDesktop && 'hidden lg:block',
		hideOnMobile && !hideOnTablet && hideOnDesktop && 'hidden md:block lg:hidden',
		!hideOnMobile && hideOnTablet && hideOnDesktop && 'block md:hidden',
	)

	// Build section classes
	const sectionClasses = cn(
		visibilityClasses,
		paddingTop ? paddingTopClasses[paddingTop] : '',
		paddingBottom ? paddingBottomClasses[paddingBottom] : '',
		customClasses,
		className
	)

	// Build inner container classes
	const innerContainerClasses = cn(
		maxWidth ? maxWidthClasses[maxWidth] : 'max-w-3xl',
		horizontalPadding ? horizontalPaddingClasses[horizontalPadding] : 'px-4 sm:px-6',
		centerContent ? 'mx-auto' : '',
		innerCustomClasses
	)

	// Build CSS variables for mobile overrides
	const cssVars: Record<string, string> = {}
	if (mobilePaddingTop && mobilePaddingTop !== 'default') {
		cssVars['--mobile-pt'] = mobilePaddingTopValues[mobilePaddingTop] || ''
	}
	if (mobilePaddingBottom && mobilePaddingBottom !== 'default') {
		cssVars['--mobile-pb'] = mobilePaddingBottomValues[mobilePaddingBottom] || ''
	}
	if (mobileHorizontalPadding && mobileHorizontalPadding !== 'default') {
		cssVars['--mobile-px'] = mobileHorizontalPaddingValues[mobileHorizontalPadding] || ''
	}
	if (mobileMaxWidth && mobileMaxWidth !== 'default') {
		cssVars['--mobile-max-w'] = mobileMaxWidthValues[mobileMaxWidth] || ''
	}

	// Merge CSS variables with section styles
	const finalSectionStyle = { ...sectionStyle, ...cssVars }

	// Generate inline style tag for mobile overrides
	const hasMobileOverrides = Object.keys(cssVars).length > 0
	const mobileStyleId = htmlId || `container-${++containerIdCounter}`

	return (
		<>
			{hasMobileOverrides && (
				<style dangerouslySetInnerHTML={{
					__html: `
					@media (max-width: 767px) {
						[data-container-id="${mobileStyleId}"] {
							${cssVars['--mobile-pt'] ? `padding-top: ${cssVars['--mobile-pt']} !important;` : ''}
							${cssVars['--mobile-pb'] ? `padding-bottom: ${cssVars['--mobile-pb']} !important;` : ''}
						}
						[data-container-id="${mobileStyleId}"] > div {
							${cssVars['--mobile-px'] ? `padding-left: ${cssVars['--mobile-px']} !important; padding-right: ${cssVars['--mobile-px']} !important;` : ''}
							${cssVars['--mobile-max-w'] ? `max-width: ${cssVars['--mobile-max-w']} !important;` : ''}
						}
					}
				`}} />
			)}
			<section
				id={htmlId || undefined}
				data-container-id={hasMobileOverrides ? mobileStyleId : undefined}
				className={sectionClasses}
				style={finalSectionStyle}
			>
				<div className={innerContainerClasses}>
					{blocks && blocks.length > 0 && <RenderBlocks blocks={blocks} />}
				</div>
			</section>
		</>
	)
}

// Helper function to convert Tailwind gradient direction to CSS angle
function getGradientAngle(direction: string): string {
	const angles: Record<string, string> = {
		'to-b': 'to bottom',
		'to-t': 'to top',
		'to-r': 'to right',
		'to-l': 'to left',
		'to-br': 'to bottom right',
		'to-bl': 'to bottom left',
		'to-tr': 'to top right',
		'to-tl': 'to top left',
	}
	return angles[direction] || 'to bottom'
}

export default ContainerSectionBlock
