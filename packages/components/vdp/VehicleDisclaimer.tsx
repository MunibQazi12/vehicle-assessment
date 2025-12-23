/**
 * Vehicle Disclaimer Component (Server Component)
 * Displays dealer-specific disclaimer text based on vehicle condition
 * Renders HTML content from website information
 * Pure presentational component with no interactivity - renders as Server Component
 */

interface VehicleDisclaimerProps {
	/** HTML content for the disclaimer */
	disclaimerHtml: string | null | undefined;
}

export function VehicleDisclaimer({ disclaimerHtml }: VehicleDisclaimerProps) {
	// Don't render if no disclaimer content
	if (!disclaimerHtml) {
		return null;
	}

	return (
		<section className='bg-gray-50'>
			<div className='container mx-auto px-4 py-8'>
				<h2 className='text-2xl font-bold text-gray-900 mb-4'>Disclaimer</h2>
				<div
					className='prose prose-sm max-w-none text-gray-600 text-xs'
					dangerouslySetInnerHTML={{ __html: disclaimerHtml }}
					suppressHydrationWarning
				/>
			</div>
		</section>
	);
}
