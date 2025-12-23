import React from 'react'
import { ImageMedia } from '@dtcms/components/Media/ImageMedia'
import type { Page, Media } from '@dtcms/payload-types'

/**
 * HeroTemplate2 - Server Component
 * 
 * A versatile page hero section with customizable:
 * - Title and optional subtitle
 * - Background image with configurable overlay
 * - Height variants (small, medium, large)
 * - Text alignment options
 * - Gradient overlay customization
 * 
 * Based on dealer PageHero component pattern for internal pages.
 */
export const HeroTemplate2Hero: React.FC<Page['hero']> = (props) => {
	const {
		title,
		subtitle,
		backgroundImage,
		mobileBackgroundImage,
		height: heightProp,
		textAlignment,
		overlayOpacity: overlayOpacityProp,
		gradientFrom: gradientFromProp,
		gradientTo: gradientToProp,
	} = props || {}

	// Height variants
	const heightClasses: Record<string, string> = {
		small: 'h-[200px] sm:h-[250px] lg:h-[300px]',
		medium: 'h-[250px] sm:h-[300px] lg:h-[350px] xl:h-[400px]',
		large: 'h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px]',
	}

	// Text alignment variants
	const alignmentClasses: Record<string, string> = {
		left: 'items-start text-left',
		center: 'items-center text-center',
		right: 'items-end text-right',
	}

	const height = heightProp || 'medium'
	const alignment = textAlignment || 'center'
	const overlayOpacity = overlayOpacityProp ?? 40
	const gradientFrom = gradientFromProp || '#151B49'
	const gradientTo = gradientToProp || '#1a2055'

	// Calculate opacity class (Tailwind opacity values)
	const opacityValue = Math.round(overlayOpacity / 10) * 10
	const opacityClass = `opacity-${opacityValue}`

	// Use mobile background image on small screens, fall back to desktop
	const mobileImage = mobileBackgroundImage || backgroundImage
	const desktopImage = backgroundImage

	return (
		<section
			className={`relative ${heightClasses[height]} pt-20`}
			style={{
				background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
			}}
		>
			{/* Mobile Background Image */}
			{mobileImage && typeof mobileImage === 'object' && (
				<div className={`absolute inset-0 ${opacityClass} md:hidden`}>
					<ImageMedia
						resource={mobileImage as Media}
						fill
						priority
						loading="eager"
						imgClassName="object-cover object-center"
					/>
				</div>
			)}

			{/* Desktop Background Image */}
			{desktopImage && typeof desktopImage === 'object' && (
				<div className={`absolute inset-0 ${opacityClass} hidden md:block`}>
					<ImageMedia
						resource={desktopImage as Media}
						fill
						priority
						loading="eager"
						imgClassName="object-cover object-center"
					/>
				</div>
			)}

			{/* Content */}
			<div
				className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center ${alignmentClasses[alignment]}`}
			>
				{title && (
					<h1 className="font-sans font-bold text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-2 sm:mb-3 lg:mb-4">
						{title}
					</h1>
				)}
				{subtitle && (
					<p className="font-sans text-white/90 text-sm sm:text-base lg:text-lg max-w-2xl">
						{subtitle}
					</p>
				)}
			</div>
		</section>
	)
}
