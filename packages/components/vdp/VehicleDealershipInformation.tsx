"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@dealertower/lib/utils/cn";
import { Button } from "@dealertower/components/ui/button";
import { formatWorkHoursSections } from "@dealertower/lib/utils/hours";
import { formatTime } from "@dealertower/lib/utils/time";
import type { VDPVehicle } from "@dealertower/types/api";
import type { DealerInfoWithGroup } from "@dealertower/lib/api/dealer";
import { DealerInfoDisplay } from "./DealerInfoDisplay";

interface VehicleDealershipInformationProps {
	vehicle: VDPVehicle;
	dealerInfo?: DealerInfoWithGroup | null;
}

export function VehicleDealershipInformation({
	vehicle,
	dealerInfo,
}: VehicleDealershipInformationProps) {
	const dealerAddress = useMemo(
		() => vehicle.address?.[0] || dealerInfo?.address,
		[vehicle.address, dealerInfo?.address]
	);
	const dealerCity = useMemo(
		() => vehicle.city?.[0] || dealerInfo?.city,
		[vehicle.city, dealerInfo?.city]
	);
	const dealerState = useMemo(
		() => vehicle.state?.[0] || dealerInfo?.state,
		[vehicle.state, dealerInfo?.state]
	);
	const dealerZip = useMemo(
		() => vehicle.zipcode?.[0] || dealerInfo?.zip_code,
		[vehicle.zipcode, dealerInfo?.zip_code]
	);
	const phoneNumbers = useMemo(
		() => dealerInfo?.phone_numbers?.map((p) => p.value) || [],
		[dealerInfo?.phone_numbers]
	);
	const workHours = useMemo(() => {
		if (!dealerInfo?.work_hours) return [];

		const sections = dealerInfo.work_hours.map((section) => ({
			label: section.label,
			hours: section.value.map((h) => ({
				day: h.label,
				hours: h.is_open
					? `${formatTime(h.from)} - ${formatTime(h.to)}`
					: "Closed",
			})),
		}));

		return formatWorkHoursSections(sections);
	}, [dealerInfo]);

	const [showDealerInfo, setShowDealerInfo] = useState(false);

	const hasDealerDetails = Boolean(
		(dealerAddress && dealerCity && dealerState && dealerZip) ||
		phoneNumbers.length > 0 ||
		workHours.length > 0
	);

	if (!hasDealerDetails) {
		return null;
	}

	return (
		<div className='rounded-3xl border border-gray-200 bg-white shadow-sm'>
			<Button
				type='button'
				variant='ghost'
				onClick={() => setShowDealerInfo((prev) => !prev)}
				className='flex w-full items-center justify-between rounded-3xl px-4 py-3 text-left text-sm font-semibold text-[#0F172A] hover:bg-gray-50'
			>
				<span>Dealership Information</span>
				<ChevronDown
					className={cn(
						"h-5 w-5 text-gray-500 transition-transform duration-200",
						showDealerInfo ? "rotate-180" : ""
					)}
				/>
			</Button>
			{showDealerInfo && (
				<div className='border-t border-gray-100 px-1 pb-2 pt-4 sm:px-4'>
					<DealerInfoDisplay
						address={dealerAddress}
						city={dealerCity}
						state={dealerState}
						zip={dealerZip}
						phoneNumbers={phoneNumbers}
						workHours={workHours}
						onBack={() => setShowDealerInfo(false)}
						showBackButton={false}
					/>
				</div>
			)}
		</div>
	);
}
