/**
 * PageHero - Server Component
 * Static hero section for internal pages.
 * No client-side interactivity required.
 */

import Image from "next/image"

interface PageHeroProps {
	title: string
	backgroundImage: string
	backgroundImageMobile?: string
	subtitle?: string
}

export default function PageHero({ title, backgroundImage, backgroundImageMobile, subtitle }: PageHeroProps) {
	return (
		<section className="relative h-[250px] sm:h-[300px] lg:h-[350px] xl:h-[400px] bg-gradient-to-r from-[#151B49] to-[#1a2055] pt-20">
			{/* Desktop background image */}
			<Image
				src={backgroundImage}
				alt=""
				fill
				priority
				fetchPriority="high"
				sizes="100vw"
				className={`object-cover object-center opacity-40 ${backgroundImageMobile ? "hidden sm:block" : ""}`}
			/>
			{/* Mobile background image (if provided) */}
			{backgroundImageMobile && (
				<Image
					src={backgroundImageMobile}
					alt=""
					fill
					priority
					fetchPriority="high"
					sizes="100vw"
					className="object-cover object-center opacity-40 block sm:hidden"
				/>
			)}
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center">
				<h1 className="font-sans font-bold text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-2 sm:mb-3 lg:mb-4">
					{title}
				</h1>
				{subtitle && <p className="font-sans text-white/90 text-sm sm:text-base lg:text-lg max-w-2xl">{subtitle}</p>}
			</div>
		</section>
	)
}
