import RichText from '@dtcms/components/RichText'

import type { RibbonBannerBlock as RibbonBannerBlockType } from '@dtcms/payload-types'

export default function RibbonBannerBlock({
	text,
	gradientFrom,
	gradientTo,
	showArrow,
}: RibbonBannerBlockType) {
	// Default colors if not provided
	const fromColor = gradientFrom || '#72c6f5'
	const toColor = gradientTo || '#5ab5e4'

	return (
		<section className="py-4 md:py-6 lg:py-8 bg-white">
			<div className="max-w-7xl mx-auto px-4">
				<div className="relative">
					<div
						className="py-4 sm:py-5 px-4 sm:px-6 lg:px-8 shadow-lg rounded-xl"
						style={{
							background: `linear-gradient(to right, ${fromColor}, ${toColor})`,
						}}
					>
						<div className="max-w-5xl mx-auto text-center">
							<div className="font-sans text-white text-sm sm:text-base lg:text-lg font-medium [&_p]:inline [&_a]:font-bold [&_a]:hover:underline [&_a]:cursor-pointer">
								{text && <RichText data={text} enableGutter={false} enableProse={false} />}
							</div>
						</div>
					</div>
					{/* Connecting visual element */}
					{showArrow && (
						<div
							className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[16px]"
							style={{ borderTopColor: toColor }}
						></div>
					)}
				</div>
			</div>
		</section>
	)
}
