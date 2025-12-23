/**
 * Vehicle Description Component (Server Component)
 * Pure presentational component with no interactivity
 * Renders as Server Component for optimal performance
 */

import Image from "next/image";

interface SpecificationItem {
	label: string;
	value: string | number | null;
}

interface VehicleDescriptionProps {
	description: string | null;
	keyFeatures: string[] | null;
	specifications?: SpecificationItem[] | null;
}

export function VehicleDescription({
	description,
	keyFeatures,
	specifications,
}: VehicleDescriptionProps) {
	const hasDescription = description && description.trim().length > 0;
	const hasFeatures = keyFeatures && keyFeatures.length > 0;
	const validSpecifications = (specifications || []).filter(
		(spec) =>
			spec.value !== null && spec.value !== undefined && spec.value !== ""
	);
	const hasSpecifications = validSpecifications.length > 0;

	if (!hasDescription && !hasFeatures && !hasSpecifications) {
		return null;
	}
	return (
		<div className='space-y-6'>
			{(hasDescription || hasSpecifications) && (
				<div className='bg-white rounded-4xl shadow-sm border border-gray-200 p-6'>
					{hasDescription && (
						<>
							<h2 className='text-2xl font-bold mb-4 text-gray-900'>
								Description
							</h2>
							<div
								className='space-y-4 text-gray-600 leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-700'
								dangerouslySetInnerHTML={{ __html: description }}
								suppressHydrationWarning
							/>
						</>
					)}
					{hasSpecifications && (
						<>
							{hasDescription && (
								<div className='my-12 border-t border-gray-100' />
							)}
							<h3 className='text-2xl font-bold text-[#101828] text-center mb-12'>
								Complete Specifications
							</h3>
							<div className='rounded-4xl xl:border border-gray-100 overflow-hidden'>
								<dl className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-gray-100'>
									{validSpecifications.map((spec, index) => {
										const isAltBackground = index % 2 === 1;
										const cellBackground = isAltBackground
											? "bg-gray-50"
											: "bg-white";

										return (
											<div
												key={`${spec.label}-${index}`}
												className={`p-2 sm:p-6 ${cellBackground}`}
											>
												<dt className='text-sm xl:font-semibold uppercase xl:tracking-[0.18em] text-gray-500'>
													{spec.label}
												</dt>
												<dd className='mt-2 text-base xl:text-lg xl:font-semibold text-gray-900 leading-snug break-words'>
													{spec.value}
												</dd>
											</div>
										);
									})}
								</dl>
							</div>
						</>
					)}
				</div>
			)}

			{hasFeatures && (
				<div className='bg-white rounded-4xl shadow-sm border border-gray-200 p-6'>
					<h2 className='text-2xl font-bold mb-8 text-[#101828] text-center'>
						Key Features
					</h2>
					<div className='flex flex-wrap gap-3'>
						{keyFeatures.map((feature, index) => (
							<div
								key={index}
								className='flex items-center gap-3 shadow-sm border border-gray-200 rounded-full p-3'
							>
								{/* <div className='w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0' /> */}
								<Image
									src={`${process.env.NEXT_PUBLIC_APP_ASSETS_URL}/assets/icons/features/${feature}.svg`}
									alt={feature}
									width={30}
									height={30}
									className='features-item-icon h-6'
								/>
								<span className='text-gray-600'>{feature}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
