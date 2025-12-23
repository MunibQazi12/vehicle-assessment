/**
 * Vehicle Details Table Component (Server Component)
 * Pure presentational component with no interactivity
 * Renders as Server Component for optimal performance
 */

import type { LucideIcon } from "lucide-react";
import {
	BadgeDollarSign,
	CarFront,
	Cog,
	DoorClosed,
	Fuel,
	Gauge,
	LifeBuoy,
	Palette,
	Settings2,
	Tag,
} from "lucide-react";
import { VehicleDetailsNumbers } from "./VehicleDetailsNumbers";

interface DetailRow {
	label: string;
	value: string | number | null;
}

interface VehicleDetailsTableProps {
	details: DetailRow[];
	stockNumber?: string | null;
	vinNumber?: string | null;
}

export function VehicleDetailsTable({
	details,
	stockNumber,
	vinNumber,
}: VehicleDetailsTableProps) {
	// Filter out null/undefined values
	const validDetails = details.filter(
		(detail) =>
			detail.value !== null && detail.value !== undefined && detail.value !== ""
	);

	if (validDetails.length === 0) {
		return null;
	}

	const detailIcons: Record<string, LucideIcon> = {
		"Body Type": CarFront,
		Condition: Tag,
		Mileage: Gauge,
		Engine: Cog,
		Transmission: Settings2,
		Drivetrain: LifeBuoy,
		"Fuel Type": Fuel,
		"City MPG": BadgeDollarSign,
		"Highway MPG": BadgeDollarSign,
		"Exterior Color": Palette,
		"Interior Color": Palette,
		Doors: DoorClosed,
	};

	return (
		<div className='bg-white rounded-4xl shadow-sm border border-gray-200 p-6'>
			<div className='flex flex-col gap-3  sm:items-center justify-сenter mb-5'>
				<h2 className='text-2xl font-bold text-gray-900 mb-1'>
					Basic information
				</h2>
				<VehicleDetailsNumbers
					stockNumber={stockNumber}
					vinNumber={vinNumber}
				/>
			</div>
			<div className='grid md:grid-cols-2 gap-x-8'>
				{validDetails.map((detail, index) => {
					const Icon = detailIcons[detail.label];

					return (
						<div
							key={index}
							className={`flex justify-between items-center py-3 ${index >= validDetails.length - 2
									? "border-0"
									: "border-b border-[#D1D5DC]"
								}`}
						>
							<div className='flex items-center gap-4'>
								{Icon && (
									<span className='flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-dealer-primary)]/10 text-[var(--color-dealer-primary)]'>
										<Icon className='h-5 w-5' />
									</span>
								)}
								<span className='text-[#364153]'>{detail.label}</span>
							</div>
							<span className='font-bold text-right text-[#101828]'>
								{detail.value}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
