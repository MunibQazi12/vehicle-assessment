'use client'

import { useState } from 'react'

export interface ContentWithShowMoreProps {
	content: string
	expandedContent?: string
	showMoreText?: string
	showLessText?: string
	buttonClassName?: string
}

export function ContentWithShowMore({
	content,
	expandedContent,
	showMoreText = 'Show More',
	showLessText = 'Show Less',
	buttonClassName,
}: ContentWithShowMoreProps) {
	const [showMore, setShowMore] = useState(false)

	return (
		<div>
			{content && (
				<div
					className="prose prose-lg max-w-none text-gray-700 mb-6"
					dangerouslySetInnerHTML={{ __html: content }}
				/>
			)}

			{expandedContent && (
				<>
					{/* Grid-based height transition for smooth open/close */}
					<div
						className="grid transition-[grid-template-rows] duration-500 ease-in-out"
						style={{ gridTemplateRows: showMore ? '1fr' : '0fr' }}
					>
						<div className="overflow-hidden">
							<div
								className={`prose prose-lg max-w-none text-gray-700 mb-6 pt-6 transition-opacity duration-500 ease-in-out ${showMore ? 'opacity-100' : 'opacity-0'}`}
								dangerouslySetInnerHTML={{ __html: expandedContent }}
							/>
						</div>
					</div>

					<button
						onClick={() => setShowMore(!showMore)}
						className={buttonClassName || "cursor-pointer inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-700 font-sans text-sm font-semibold rounded-full hover:bg-[#151B49] hover:text-white transition-all duration-300 mb-6"}
					>
						{showMore ? showLessText : showMoreText}
						<svg
							className={`w-4 h-4 transition-transform duration-300 ${showMore ? 'rotate-180' : ''}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</button>
				</>
			)}
		</div>
	)
}

export default ContentWithShowMore
