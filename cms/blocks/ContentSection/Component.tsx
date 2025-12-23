import React from 'react'
import type { ContentSectionBlock as ContentSectionBlockType } from '@dtcms/payload-types'
import type { Media } from '@dtcms/payload-types'
import NextImage from 'next/image'
import { generateHTML } from '@tiptap/html'
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
import { ContentWithShowMore } from './ShowMoreToggle'
import { cn } from '@dtcms/utilities/ui'

// TipTap extensions (same as WYSIWYGBlock)
const extensions = [
	StarterKit,
	Underline,
	Link.configure({
		openOnClick: false,
		HTMLAttributes: {
			class: 'text-blue-600 hover:text-blue-800 underline',
		},
	}),
	TextAlign.configure({
		types: ['heading', 'paragraph'],
	}),
	Highlight.configure({ multicolor: true }),
	TextStyle,
	Color,
	Subscript,
	Superscript,
	Image,
	Youtube,
]

// Padding classes
const paddingTopClasses: Record<string, string> = {
	none: '',
	xs: 'pt-2 md:pt-4',
	sm: 'pt-4 md:pt-6 lg:pt-8',
	md: 'pt-8 md:pt-12 lg:pt-16',
	lg: 'pt-12 md:pt-16 lg:pt-24',
	xl: 'pt-16 md:pt-20 lg:pt-28',
	'2xl': 'pt-20 md:pt-24 lg:pt-32',
}

const paddingBottomClasses: Record<string, string> = {
	none: '',
	xs: 'pb-2 md:pb-4',
	sm: 'pb-4 md:pb-6 lg:pb-8',
	md: 'pb-8 md:pb-12 lg:pb-16',
	lg: 'pb-12 md:pb-16 lg:pb-24',
	xl: 'pb-16 md:pb-20 lg:pb-28',
	'2xl': 'pb-20 md:pb-24 lg:pb-32',
}

const maxWidthClasses: Record<string, string> = {
	'5xl': 'max-w-5xl',
	'6xl': 'max-w-6xl',
	'7xl': 'max-w-7xl',
	full: 'max-w-full',
}

const contentWidthClasses: Record<string, string> = {
	xl: 'max-w-xl',
	'2xl': 'max-w-2xl',
	'3xl': 'max-w-3xl',
	'4xl': 'max-w-4xl',
	'7xl': 'max-w-7xl',
}

const horizontalPaddingClasses: Record<string, string> = {
	none: '',
	small: 'px-2 sm:px-4',
	default: 'px-4 sm:px-6',
	large: 'px-6 sm:px-8 lg:px-10',
}

const gapClasses: Record<string, string> = {
	none: 'gap-0',
	sm: 'gap-4 lg:gap-6',
	md: 'gap-6 lg:gap-8',
	lg: 'gap-8 lg:gap-12',
	xl: 'gap-12 lg:gap-16',
}

const imageShadowClasses: Record<string, string> = {
	none: '',
	sm: 'shadow-sm',
	md: 'shadow-md',
	lg: 'shadow-lg',
	xl: 'shadow-xl',
	'2xl': 'shadow-2xl',
}

const imageStyleClasses: Record<string, string> = {
	rounded: 'rounded-lg',
	circle: 'rounded-full',
	square: 'rounded-none',
	none: '',
}

const imageMaxWidthClasses: Record<string, string> = {
	sm: 'max-w-xs sm:max-w-sm',
	md: 'max-w-sm sm:max-w-md',
	lg: 'max-w-md sm:max-w-lg',
	full: 'max-w-full',
}

const buttonStyleClasses: Record<string, string> = {
	primary: 'bg-[#72c6f5] text-white hover:bg-[#151B49] hover:shadow-md',
	secondary: 'bg-gray-600 text-white hover:bg-gray-700',
	outline: 'border-2 border-[#72c6f5] text-[#72c6f5] hover:bg-[#72c6f5] hover:text-white',
	ghost: 'text-[#72c6f5] hover:bg-[#72c6f5]/10',
	link: 'text-[#72c6f5] hover:text-[#151B49] underline',
}

const buttonSizeClasses: Record<string, string> = {
	sm: 'px-4 py-2 text-sm',
	md: 'px-6 py-3',
	lg: 'px-8 py-4 text-lg',
}

const ctaSpacingClasses: Record<string, string> = {
	sm: 'gap-2',
	md: 'gap-4',
	lg: 'gap-6',
}

const ctaAlignmentClasses: Record<string, string> = {
	left: 'justify-start',
	center: 'justify-center',
	right: 'justify-end',
}

const showMoreButtonStyleClasses: Record<string, string> = {
	link: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
	primary: 'bg-[#72c6f5] text-white px-4 py-2 rounded hover:bg-[#151B49] cursor-pointer',
	secondary: 'bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer',
	outline: 'border-2 border-[#72c6f5] text-[#72c6f5] px-4 py-2 rounded hover:bg-[#72c6f5] hover:text-white cursor-pointer',
}

const mobilePaddingValues: Record<string, string> = {
	none: '0',
	xs: '0.5rem',
	sm: '1rem',
	md: '2rem',
	lg: '3rem',
}

export const ContentSectionBlock: React.FC<ContentSectionBlockType> = ({
	content,
	htmlContent,
	contentAlignment = 'left',
	contentVerticalAlign = 'center',
	enableShowMore,
	expandedContent,
	expandedHtmlContent,
	showMoreButtonText,
	showLessButtonText,
	showMoreButtonStyle = 'link',
	image,
	imagePosition = 'right',
	imagePriority,
	imageStyle = 'rounded',
	imageShadow = 'lg',
	imageMaxWidth = 'md',
	mobileImagePosition = 'top',
	layout = 'split',
	contentWidth = '3xl',
	splitRatio = '50-50',
	gapSize = 'lg',
	paddingTop = 'lg',
	paddingBottom = 'lg',
	maxWidth = '7xl',
	horizontalPadding = 'default',
	backgroundColor,
	isGradient,
	gradientEndColor,
	gradientDirection,
	backgroundOverlay = 'none',
	ctas,
	ctaAlignment = 'left',
	ctaSpacing = 'md',
	hideOnMobile,
	hideOnTablet,
	hideOnDesktop,
	mobileTextAlign,
	mobilePaddingTop,
	mobilePaddingBottom,
	htmlId,
	customClasses,
	contentCustomClasses,
	animationStyle = 'none',
}) => {
	// Extract image URL if image is provided
	const imageMedia = image as Media | undefined
	const imageSrc = imageMedia?.url

	// Generate HTML from content JSON
	let renderedContent = ''
	if (htmlContent) {
		renderedContent = htmlContent
	} else if (content && typeof content === 'object') {
		try {
			renderedContent = generateHTML(content as Parameters<typeof generateHTML>[0], extensions)
		} catch (error) {
			console.error('Error generating HTML from content:', error)
			renderedContent = '<p>Error rendering content</p>'
		}
	}

	// Generate HTML from expanded content JSON
	let renderedExpandedContent = ''
	if (enableShowMore) {
		if (expandedHtmlContent) {
			renderedExpandedContent = expandedHtmlContent
		} else if (expandedContent && typeof expandedContent === 'object') {
			try {
				renderedExpandedContent = generateHTML(expandedContent as Parameters<typeof generateHTML>[0], extensions)
			} catch (error) {
				console.error('Error generating HTML from expanded content:', error)
				renderedExpandedContent = '<p>Error rendering expanded content</p>'
			}
		}
	}

	// Check if expanded content has meaningful text
	const hasExpandedContent = renderedExpandedContent &&
		renderedExpandedContent.replace(/<[^>]*>/g, '').trim().length > 0

	// Build CTAs array
	const ctaElements = ctas?.map((cta) => {
		const ctaLink = cta.link
		let ctaUrl: string | undefined
		let ctaLabel: string | undefined

		if (ctaLink) {
			ctaLabel = ctaLink.label
			if (ctaLink.type === 'custom') {
				ctaUrl = ctaLink.url ?? undefined
			} else if (ctaLink.type === 'reference' && ctaLink.reference?.value) {
				const refValue = typeof ctaLink.reference.value === 'object'
					? ctaLink.reference.value
					: ctaLink.reference.value

				if (typeof refValue === 'object' && 'slug' in refValue) {
					ctaUrl = `/${refValue.slug}`
				}
			}
		}

		return {
			text: ctaLabel,
			url: ctaUrl,
			position: cta.position || 'content',
			style: cta.style || 'primary',
			size: cta.size || 'md',
		}
	}) ?? []

	// Map Tailwind gradient directions to CSS linear-gradient syntax
	const gradientDirectionMap: Record<string, string> = {
		'to-b': 'to bottom',
		'to-t': 'to top',
		'to-r': 'to right',
		'to-l': 'to left',
		'to-br': 'to bottom right',
		'to-bl': 'to bottom left',
		'to-tr': 'to top right',
		'to-tl': 'to top left',
	}

	// Build background style
	const cssDirection = gradientDirectionMap[gradientDirection || 'to-b'] || 'to bottom'
	const backgroundStyle: React.CSSProperties = isGradient && gradientEndColor
		? { backgroundImage: `linear-gradient(${cssDirection}, ${backgroundColor || '#ffffff'}, ${gradientEndColor})` }
		: { backgroundColor: backgroundColor || '#ffffff' }

	// Build responsive visibility classes
	const visibilityClasses = cn(
		hideOnMobile && 'hidden md:block',
		hideOnTablet && 'md:hidden lg:block',
		hideOnDesktop && 'lg:hidden',
		hideOnMobile && hideOnTablet && !hideOnDesktop && 'hidden lg:block',
		hideOnMobile && !hideOnTablet && hideOnDesktop && 'hidden md:block lg:hidden',
		!hideOnMobile && hideOnTablet && hideOnDesktop && 'block md:hidden',
	)

	// Text alignment classes
	const textAlignClasses: Record<string, string> = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right',
	}

	// Mobile text alignment
	const mobileTextAlignClass = mobileTextAlign && mobileTextAlign !== 'default'
		? `${textAlignClasses[mobileTextAlign]} md:${textAlignClasses[contentAlignment || 'left']}`
		: textAlignClasses[contentAlignment || 'left']

	// Vertical alignment classes
	const verticalAlignClasses: Record<string, string> = {
		start: 'items-start',
		center: 'items-center',
		end: 'items-end',
	}

	// Split ratio classes
	const splitRatioClasses: Record<string, { content: string; image: string }> = {
		'50-50': { content: 'lg:col-span-6', image: 'lg:col-span-6' },
		'60-40': { content: 'lg:col-span-7', image: 'lg:col-span-5' },
		'40-60': { content: 'lg:col-span-5', image: 'lg:col-span-7' },
		'70-30': { content: 'lg:col-span-8', image: 'lg:col-span-4' },
		'30-70': { content: 'lg:col-span-4', image: 'lg:col-span-8' },
	}

	// Animation classes
	const animationClasses: Record<string, string> = {
		none: '',
		fadeIn: 'animate-fadeIn',
		slideUp: 'animate-slideUp',
		slideLeft: 'animate-slideLeft',
		slideRight: 'animate-slideRight',
	}

	// Build section classes
	const sectionClasses = cn(
		visibilityClasses,
		paddingTop ? paddingTopClasses[paddingTop] : '',
		paddingBottom ? paddingBottomClasses[paddingBottom] : '',
		animationStyle ? animationClasses[animationStyle] : '',
		customClasses,
	)

	// Mobile image order
	const mobileImageOrder = mobileImagePosition === 'top' ? 'order-1' : mobileImagePosition === 'bottom' ? 'order-2' : 'hidden md:block'
	const mobileContentOrder = mobileImagePosition === 'top' ? 'order-2' : 'order-1'

	// Generate unique ID for mobile overrides - use htmlId or fallback to index-based ID
	const sectionId = htmlId || `content-section`
	const hasMobileOverrides = (mobilePaddingTop && mobilePaddingTop !== 'default') || (mobilePaddingBottom && mobilePaddingBottom !== 'default')

	// Render CTAs
	const renderCtas = (position: 'content' | 'image') => {
		const filteredCtas = ctaElements.filter(cta => cta.position === position)
		if (filteredCtas.length === 0) return null

		return (
			<div className={cn('flex flex-wrap mt-6', ctaSpacingClasses[ctaSpacing || 'md'], ctaAlignmentClasses[ctaAlignment || 'left'])}>
				{filteredCtas.map((cta, index) => (
					<a
						key={index}
						href={cta.url}
						className={cn(
							'inline-block font-sans font-semibold transition-all duration-200',
							buttonStyleClasses[cta.style],
							buttonSizeClasses[cta.size],
						)}
					>
						{cta.text}
					</a>
				))}
			</div>
		)
	}

	// Render content area
	const renderContent = () => (
		<div className={cn(mobileTextAlignClass, 'lg:text-left', contentCustomClasses)}>
			{enableShowMore && hasExpandedContent ? (
				<ContentWithShowMore
					content={renderedContent}
					expandedContent={renderedExpandedContent}
					showMoreText={showMoreButtonText || 'Show More'}
					showLessText={showLessButtonText || 'Show Less'}
					buttonClassName={showMoreButtonStyleClasses[showMoreButtonStyle || 'link']}
				/>
			) : (
				renderedContent && (
					<div
						className="prose prose-lg max-w-none text-gray-700"
						dangerouslySetInnerHTML={{ __html: renderedContent }}
					/>
				)
			)}
			{renderCtas('content')}
		</div>
	)

	// Render image area
	const renderImage = () => {
		if (!imageSrc) return null

		return (
			<div className="relative flex flex-col items-center lg:items-start">
				<div className={cn(
					'relative w-full overflow-hidden transition-shadow duration-300 hover:shadow-3xl',
					imageMaxWidthClasses[imageMaxWidth || 'md'],
					imageStyleClasses[imageStyle || 'rounded'],
					imageShadowClasses[imageShadow || 'lg'],
				)}>
					<NextImage
						src={imageSrc}
						alt={imageMedia?.alt ?? 'Content section image'}
						width={imageMedia?.width ?? 800}
						height={imageMedia?.height ?? 600}
						className={cn('w-full h-auto', imageStyleClasses[imageStyle || 'rounded'])}
						priority={imagePriority ?? undefined}
						sizes="(max-width: 768px) 100vw, 50vw"
					/>
				</div>
				{renderCtas('image')}
			</div>
		)
	}

	// Render based on layout
	const renderLayout = () => {
		const ratioClasses = splitRatioClasses[splitRatio || '50-50']

		switch (layout) {
			case 'full':
				return (
					<div className={cn('mx-auto', contentWidthClasses[contentWidth || '3xl'])}>
						{renderContent()}
					</div>
				)

			case 'centered':
				return (
					<div className={cn('mx-auto text-center', contentWidthClasses[contentWidth || '3xl'])}>
						{renderContent()}
					</div>
				)

			case 'background':
				return (
					<div className="relative">
						{imageSrc && (
							<div className="absolute inset-0 z-0">
								<NextImage
									src={imageSrc}
									alt={imageMedia?.alt ?? 'Background image'}
									fill
									className="object-cover"
									priority={imagePriority ?? undefined}
								/>
								{backgroundOverlay && backgroundOverlay !== 'none' && (
									<div className={cn(
										'absolute inset-0',
										backgroundOverlay === 'light' && 'bg-black/10',
										backgroundOverlay === 'medium' && 'bg-black/30',
										backgroundOverlay === 'dark' && 'bg-black/50',
										backgroundOverlay === 'heavy' && 'bg-black/70',
									)} />
								)}
							</div>
						)}
						<div className={cn('relative z-10 mx-auto', contentWidthClasses[contentWidth || '3xl'])}>
							{renderContent()}
						</div>
					</div>
				)

			case 'split':
			default:
				return (
					<div className={cn(
						'grid grid-cols-1 lg:grid-cols-12',
						gapClasses[gapSize || 'lg'],
						verticalAlignClasses[contentVerticalAlign || 'center'],
					)}>
						{/* Content Side */}
						<div className={cn(
							'col-span-1',
							ratioClasses.content,
							mobileContentOrder,
							imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2',
						)}>
							{renderContent()}
						</div>

						{/* Image Side */}
						{imageSrc && (
							<div className={cn(
								'col-span-1',
								ratioClasses.image,
								mobileImageOrder,
								imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1',
							)}>
								{renderImage()}
							</div>
						)}
					</div>
				)
		}
	}

	return (
		<>
			{hasMobileOverrides && (
				<style dangerouslySetInnerHTML={{
					__html: `
					@media (max-width: 767px) {
						[data-section-id="${sectionId}"] {
							${mobilePaddingTop && mobilePaddingTop !== 'default' ? `padding-top: ${mobilePaddingValues[mobilePaddingTop]} !important;` : ''}
							${mobilePaddingBottom && mobilePaddingBottom !== 'default' ? `padding-bottom: ${mobilePaddingValues[mobilePaddingBottom]} !important;` : ''}
						}
					}
				`}} />
			)}
			<section
				id={htmlId || undefined}
				data-section-id={hasMobileOverrides ? sectionId : undefined}
				className={sectionClasses}
				style={backgroundStyle}
			>
				<div className={cn(
					'mx-auto',
					maxWidthClasses[maxWidth || '7xl'],
					horizontalPaddingClasses[horizontalPadding || 'default'],
				)}>
					{renderLayout()}
				</div>
			</section>
		</>
	)
}
