'use client'

import React, { useState } from 'react'
import type { ReviewsSectionBlock as ReviewsSectionBlockProps } from '@dtcms/payload-types'

// Border radius map for Tailwind classes
const borderRadiusMap: Record<string, string> = {
	none: 'rounded-none',
	sm: 'rounded-sm',
	md: 'rounded-md',
	lg: 'rounded-lg',
	xl: 'rounded-xl',
	'2xl': 'rounded-2xl',
	'3xl': 'rounded-3xl',
}

// Padding size map
const paddingMap: Record<string, string> = {
	small: 'py-8 md:py-10 lg:py-12',
	medium: 'py-10 md:py-14 lg:py-20',
	large: 'py-12 md:py-16 lg:py-24',
}

// Grid columns map
const gridColumnsMap: Record<string, string> = {
	'1': 'lg:grid-cols-1',
	'2': 'lg:grid-cols-2',
	'3': 'lg:grid-cols-3',
}

export const ReviewsSectionBlock: React.FC<ReviewsSectionBlockProps> = ({
	sectionTitle,
	showAverageRating,
	averageRating,
	ratingLabel,
	styleSettings,
	cardSettings,
	layoutSettings,
	reviews,
	paginationSettings,
}) => {
	const [currentPage, setCurrentPage] = useState(0)

	// Extract style settings with defaults
	const backgroundColor = styleSettings?.backgroundColor || '#151B49'
	const accentColor = styleSettings?.accentColor || '#72c6f5'
	const titleColor = styleSettings?.titleColor || '#ffffff'
	const ratingLabelColor = styleSettings?.ratingLabelColor || '#ffffff'
	const showDecorativeElements = styleSettings?.showDecorativeElements ?? true

	// Extract card settings with defaults
	const cardBackgroundColor = cardSettings?.cardBackgroundColor || '#ffffff'
	const cardTextColor = cardSettings?.cardTextColor || '#374151'
	const authorNameColor = cardSettings?.authorNameColor || '#151B49'
	const cardBorderRadius = cardSettings?.cardBorderRadius || '2xl'

	// Extract layout settings with defaults
	const reviewsPerPage = layoutSettings?.reviewsPerPage || 2
	const gridColumns = layoutSettings?.gridColumns || '2'
	const paddingSize = layoutSettings?.paddingSize || 'large'

	// Extract pagination settings with defaults
	const showPagination = paginationSettings?.showPagination ?? true
	const activeDotColor = paginationSettings?.activeDotColor || accentColor
	const inactiveDotColor = paginationSettings?.inactiveDotColor || 'rgba(255, 255, 255, 0.3)'

	// Calculate pagination
	const allReviews = reviews || []
	const totalPages = Math.ceil(allReviews.length / reviewsPerPage)
	const startIndex = currentPage * reviewsPerPage
	const visibleReviews = allReviews.slice(startIndex, startIndex + reviewsPerPage)

	// Get CSS classes
	const borderRadiusClass = borderRadiusMap[cardBorderRadius] || 'rounded-2xl'
	const paddingClass = paddingMap[paddingSize] || 'py-12 md:py-16 lg:py-24'
	const gridColumnsClass = gridColumnsMap[gridColumns] || 'lg:grid-cols-2'

	return (
		<section
			className={`${paddingClass} relative overflow-hidden`}
			style={{ backgroundColor }}
		>
			{/* Decorative background elements */}
			{showDecorativeElements && (
				<div className="absolute inset-0 opacity-5">
					<div
						className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
						style={{ backgroundColor: accentColor }}
					/>
					<div
						className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl"
						style={{ backgroundColor: accentColor }}
					/>
				</div>
			)}

			<div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
				{/* Section Header */}
				<div className="text-center mb-8 lg:mb-12">
					{sectionTitle && (
						<h2
							className="font-sans font-bold text-2xl sm:text-3xl lg:text-4xl mb-3 lg:mb-4"
							style={{ color: titleColor }}
						>
							{sectionTitle}
						</h2>
					)}
					{showAverageRating && averageRating && (
						<div className="flex items-center justify-center gap-2">
							<span
								className="font-sans font-bold text-xl sm:text-2xl lg:text-3xl"
								style={{ color: accentColor }}
							>
								{averageRating}
							</span>
							{ratingLabel && (
								<span
									className="font-sans text-base sm:text-lg"
									style={{ color: ratingLabelColor }}
								>
									{ratingLabel}
								</span>
							)}
						</div>
					)}
				</div>

				{/* Reviews Grid */}
				<div
					className={`grid grid-cols-1 ${gridColumnsClass} gap-6 lg:gap-8 max-w-5xl mx-auto mb-6 lg:mb-8`}
				>
					{visibleReviews.map((review, index) => (
						<div
							key={review.id || index}
							className={`${borderRadiusClass} p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-[400px] sm:h-[380px]`}
							style={{ backgroundColor: cardBackgroundColor }}
						>
							{/* Star Rating */}
							<div className="flex gap-1 mb-4">
								{[...Array(review.rating || 5)].map((_, i) => (
									<svg
										key={i}
										className="w-5 h-5"
										fill={accentColor}
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
							</div>

							{/* Review Text */}
							<p
								className="font-sans text-sm sm:text-base leading-relaxed mb-6 flex-1 overflow-y-auto"
								style={{ color: cardTextColor }}
							>
								{review.text}
							</p>

							{/* Author */}
							<div className="flex items-center gap-3">
								<div
									className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
									style={{
										background: `linear-gradient(to bottom right, ${accentColor}, ${adjustBrightness(accentColor, -20)})`,
									}}
								>
									<span className="text-white font-sans font-semibold">
										{review.author?.charAt(0) || '?'}
									</span>
								</div>
								<span
									className="font-sans font-semibold"
									style={{ color: authorNameColor }}
								>
									{review.author}
								</span>
							</div>
						</div>
					))}
				</div>

				{/* Pagination Dots */}
				{showPagination && totalPages > 1 && (
					<div className="flex items-center justify-center gap-2 h-4">
						{[...Array(totalPages)].map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentPage(index)}
								className={`rounded-full transition-all duration-300 cursor-pointer ${currentPage === index
									? 'w-3 h-3'
									: 'w-2 h-2 hover:opacity-80'
									}`}
								style={{
									backgroundColor:
										currentPage === index ? activeDotColor : inactiveDotColor,
								}}
								aria-label={`Go to page ${index + 1}`}
							/>
						))}
					</div>
				)}
			</div>
		</section>
	)
}

/**
 * Adjusts brightness of a hex color
 * @param hex - Hex color string (e.g., '#72c6f5')
 * @param percent - Percentage to adjust (-100 to 100)
 */
function adjustBrightness(hex: string, percent: number): string {
	// Remove # if present
	const cleanHex = hex.replace('#', '')

	// Parse RGB values
	const r = parseInt(cleanHex.substring(0, 2), 16)
	const g = parseInt(cleanHex.substring(2, 4), 16)
	const b = parseInt(cleanHex.substring(4, 6), 16)

	// Adjust each channel
	const adjustChannel = (channel: number) => {
		const adjusted = Math.round(channel + (channel * percent) / 100)
		return Math.min(255, Math.max(0, adjusted))
	}

	const newR = adjustChannel(r)
	const newG = adjustChannel(g)
	const newB = adjustChannel(b)

	// Convert back to hex
	const toHex = (n: number) => n.toString(16).padStart(2, '0')
	return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`
}

export default ReviewsSectionBlock
