import React from 'react'
import Link from 'next/link'

import type { StatsBarAlphaBlock as StatsBarAlphaBlockProps } from '@dtcms/payload-types'
import { getTenantContext } from '@dealertower/lib/tenant/server-context'
import { fetchVehicleCounts } from '@dealertower/lib/api/srp'
import type { VehicleCountsResponse } from '@dealertower/types/api'

interface Stat {
	value: string
	label: string
	link?: string
}

function formatStatValue(value?: number | null) {
	if (value === null || value === undefined) return '—'
	return value.toLocaleString()
}

export const StatsBarAlphaBlock = async ({
	backgroundColor,
	stats,
}: StatsBarAlphaBlockProps) => {
	const { hostname } = await getTenantContext()

	let counts: VehicleCountsResponse['data'] | null = null

	try {
		const response = await fetchVehicleCounts(hostname)
		counts = response.data
	} catch (error) {
		console.error('Failed to fetch vehicle counts', error)
	}

	const displayStats: Stat[] =
		stats?.map((stat) => {
			let value = '—'

			if (stat.valueType === 'custom') {
				value = stat.value || '—'
			} else if (stat.valueType === 'new-vehicles') {
				value = formatStatValue(counts?.['new'])
			} else if (stat.valueType === 'used-vehicles') {
				value = formatStatValue(counts?.used)
			}

			return {
				value,
				label: stat.label || '',
				link: stat.link || undefined,
			}
		}) || []

	const bgColor = backgroundColor || '#151B49'

	return (
		<div className="py-6 sm:py-8 lg:py-3 xl:py-4" style={{ backgroundColor: bgColor }}>
			<div className="max-w-7xl mx-auto px-4">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-4 text-center">
					{displayStats.map((stat, index) => (
						<div key={index} className="text-white">
							{stat.link ? (
								<Link href={stat.link} className="block cursor-pointer group">
									<div className="font-sans font-bold mb-2 lg:mb-0.5 group-hover:text-[#72c6f5] transition-colors duration-300 text-xl xl:text-xl sm:text-xl">
										{stat.value}
									</div>
									<div className="font-sans text-sm sm:text-base lg:text-xs xl:text-sm tracking-wide text-gray-300">
										{stat.label}
									</div>
								</Link>
							) : (
								<>
									<div className="font-sans font-bold xl:text-xl mb-2 lg:mb-0.5 text-xl">
										{stat.value}
									</div>
									<div className="font-sans text-sm sm:text-base lg:text-xs xl:text-sm tracking-wide text-gray-300">
										{stat.label}
									</div>
								</>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
