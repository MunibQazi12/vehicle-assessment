/**
 * ServingSection - Server Component
 * Static content section wrapper.
 * No client-side interactivity required.
 */

import ContentSection from "./ContentSection"

export default function ServingSection() {
	return (
		<ContentSection
			title="Serving Car Shoppers In The Pacific NW"
			subtitle="SINCE 1960"
			highlight="true"
			description="At Tonkin our purpose is to provide our customers with the finest automotive car buying and service experience. We provide multiple locations around Portland with experienced staff and sales teams. We know that customers have high expectations, and as car dealers we enjoy the challenge of meeting and exceeding those standards each and every time. We want to earn your business and provide you the best possible automotive experience you have ever had!"
			ctaText="SHOP NOW"
			ctaLink="/new-vehicles/"
			imageSrc="https://cdn.dealertower.com/website-media/content/73d6c4fc-8ffb-471e-88c4-5e8eeddc1c63/family3.webp"
			imageAlt="Happy family sitting in car trunk - Tonkin customer satisfaction"
			imageWidth={750}
			imageHeight={750}
			imagePriority={false}
			imagePosition="right"
			backgroundColor="white"
		/>
	)
}
