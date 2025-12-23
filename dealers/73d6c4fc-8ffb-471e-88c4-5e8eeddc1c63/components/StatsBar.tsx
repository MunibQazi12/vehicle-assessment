import Link from "next/link"
import { fetchVehicleCounts } from "@dealertower/lib/api/srp"
import { getTenantContext } from "@dealertower/lib/tenant/server-context"
import type { VehicleCountsResponse } from "@dealertower/types/api"

interface Stat {
	value: string
	label: string
	link?: string
}

const REVIEWS_VALUE = "+30,000"

function formatStatValue(value?: number | null) {
	if (value === null || value === undefined) return "—"
	return value.toLocaleString()
}

export default async function StatsBar() {
	const { hostname } = await getTenantContext()
	let counts: VehicleCountsResponse["data"] | null = null

	try {
		const response = await fetchVehicleCounts(hostname)
		counts = response.data
	} catch (error) {
		console.error("Failed to fetch vehicle counts", error)
	}

	const stats: Stat[] = [
		{ value: formatStatValue(counts?.["new"]), label: "NEW VEHICLES", link: "/new-vehicles/" },
		{ value: formatStatValue(counts?.used), label: "USED VEHICLES", link: "/used-vehicles/" },
		{ value: REVIEWS_VALUE, label: "POSITIVE ONLINE REVIEWS" },
	]

	return (
		<div className="bg-[#151B49] lg:min-h-[100px] lg:flex lg:items-center">
			<div className="max-w-7xl mx-auto px-4 w-full">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 text-center">
					{stats.map((stat, index) => (
						<div key={index} className="text-white">
							{stat.link ? (
								<Link href={stat.link} className="flex items-center justify-center gap-2 cursor-pointer group">
									<div className="font-sans font-bold group-hover:text-[#72c6f5] transition-colors duration-300 text-xl">
										{stat.value}
									</div>
									<div className="font-sans text-xl tracking-wide text-gray-300">
										{stat.label}
									</div>
								</Link>
							) : (
								<div className="flex items-center justify-center gap-2">
									<div className="font-sans font-bold text-xl">
										{stat.value}
									</div>
									<div className="font-sans text-xl tracking-wide text-gray-300">
										{stat.label}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
