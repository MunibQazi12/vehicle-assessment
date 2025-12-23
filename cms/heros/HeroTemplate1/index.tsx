import React from 'react'
import { HeroImageMobile, HeroImageDesktop } from './HeroImage'
import { HeroCTAsMobile, HeroCTAsDesktop } from './HeroCTAs'
import type { Page } from '@dtcms/payload-types'

/**
 * HeroTemplate1Hero - Server Component for optimal LCP performance
 *
 * The hero images are rendered as Server Components to eliminate render delay.
 * Only the interactive CTAs and modal are client components.
 * This architecture reduces LCP element render delay from ~1800ms to near 0.
 */
export const HeroTemplate1Hero: React.FC<Page['hero']> = (props) => {
	const {
		backgroundImage,
		mobileBackgroundImage,
		heroAlphaText,
		enableBodyStyleSearch,
		enablePriceSearch,
		enableLocationSearch,
	} = props || {}

	return (
		<>
			{/* Mobile Hero */}
			<section className="md:hidden">
				<HeroImageMobile media={mobileBackgroundImage} />
				<HeroCTAsMobile
					heroText={heroAlphaText}
					enableBodyStyleSearch={enableBodyStyleSearch}
					enablePriceSearch={enablePriceSearch}
					enableLocationSearch={enableLocationSearch}
				/>
			</section>

			{/* Desktop Hero */}
			<section className="hidden md:flex relative md:h-[500px] lg:h-[650px] flex-col justify-end items-center overflow-hidden pb-12 lg:pb-16">
				<HeroImageDesktop media={backgroundImage} />
				<HeroCTAsDesktop
					heroText={heroAlphaText}
					enableBodyStyleSearch={enableBodyStyleSearch}
					enablePriceSearch={enablePriceSearch}
					enableLocationSearch={enableLocationSearch}
				/>
			</section>
		</>
	)
}
