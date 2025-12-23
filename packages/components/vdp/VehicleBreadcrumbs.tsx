interface VehicleBreadcrumbItem {
	label: string;
	href: string;
}

interface VehicleBreadcrumbsProps {
	items?: VehicleBreadcrumbItem[];
}

export function VehicleBreadcrumbs({ items }: VehicleBreadcrumbsProps) {
	if (!items || items.length === 0) {
		return null;
	}

	return (
		<nav className='border-b border-gray-200 bg-white hidden md:block'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex items-center gap-2 text-sm text-gray-600'>
					{items.map((item, index) => (
						<div
							key={item.href ?? index}
							className='flex items-center gap-2'
						>
							{index > 0 && (
								<svg
									className='h-4 w-4'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 5l7 7-7 7'
									/>
								</svg>
							)}
							<a
								href={item.href}
								className={`hover:text-gray-900 transition-colors ${
									index === items.length - 1 ? "text-gray-900 font-medium" : ""
								}`}
							>
								{item.label}
							</a>
						</div>
					))}
				</div>
			</div>
		</nav>
	);
}
