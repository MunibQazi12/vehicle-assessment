import Image from "next/image"

// Low-quality base64 placeholder for mobile hero image (reduces render delay)
const mobileBlurDataURL =
	"data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAGAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAT/xAAeEAACAgICAwAAAAAAAAAAAAABAwACERIEEyEjkf/EABQBAQAAAAAAAAAAAAAAAAAAAAH/xAAYEQEAAwEAAAAAAAAAAAAAAAABAAISQf/aAAwDAQACEQMRAD8Aie9PCsxV6dup1OaVHkjMgL1kn0U+REN2ewahP//Z"

// Low-quality base64 placeholder for desktop hero image
const desktopBlurDataURL =
	"data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAADAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAQF/8QAHxAAAgEDBQEAAAAAAAAAAAAAAQIAAxExBSIkMlGR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAWEQADAAAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/AItS41qdHarKCRnN/ZjFEJ6L8iJFYxH/2Q=="

export function HeroImageMobile() {
	return (
		<div className="relative w-full aspect-square overflow-hidden">
			<Image
				src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/tonkin+hero+mobile.webp"
				alt="Fall into Adventure - Tonkin - Scenic Columbia River Gorge with Vista House"
				fill
				priority
				loading="eager"
				fetchPriority="high"
				sizes="100vw"
				quality={55}
				placeholder="blur"
				blurDataURL={mobileBlurDataURL}
				className="object-cover object-top"
			/>
			{/* Removed gradient overlay for clearer background */}
		</div>
	)
}

export function HeroImageDesktop() {
	return (
		<div className="absolute inset-0 z-0">
			<Image
				src="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/tonkin_enjoy_hero_25_desktop.jpg.webp"
				alt="Scenic mountain landscape with forest in autumn colors"
				fill
				priority
				loading="eager"
				fetchPriority="high"
				sizes="100vw"
				quality={75}
				placeholder="blur"
				blurDataURL={desktopBlurDataURL}
				className="object-cover object-top"
			/>
			{/* Removed gradient overlay to match new design without dark overlay */}
		</div>
	)
}
