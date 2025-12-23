/**
 * Dealer Information Card
 * Displays dealership hours plus location and contact details
 */

import type {
	DealerWorkHours,
} from "@dealertower/lib/api/dealer";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DealerPhoneNumber } from "@dealertower/lib/api/dealer";
import { formatTime } from "@dealertower/lib/utils/time";
import Image from "next/image";

const DAY_ORDER = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

interface DealerInformationCardProps {
	workHoursSection?: DealerWorkHours | null;
}

interface FormattedHour {
	day: string;
	hours: string;
	isClosed: boolean;
}

function formatHours(section?: DealerWorkHours | null): FormattedHour[] {
	if (!section?.value?.length) {
		return [];
	}

	const entries = new Map<string, FormattedHour>();

	section.value.forEach((entry) => {
		if (!entry.label) {
			return;
		}

		const normalizedDay =
			entry.label.charAt(0).toUpperCase() + entry.label.slice(1).toLowerCase();

		const formattedHours =
			entry.is_open && entry.from && entry.to
				? `${formatTime(entry.from)} - ${formatTime(entry.to)}`
				: "Closed";

		entries.set(normalizedDay, {
			day: normalizedDay,
			hours: formattedHours,
			isClosed: !entry.is_open,
		});
	});

	return DAY_ORDER.map((day) => {
		const entry = entries.get(day);
		if (entry) {
			return entry;
		}

		return {
			day,
			hours: "Call for hours",
			isClosed: false,
		};
	});
}

export function DealerInformationCard({
	workHoursSection,
}: DealerInformationCardProps) {
	const hours = formatHours(workHoursSection);

	if (hours.length === 0) {
		return null;
	}

	return (
		<div className='bg-white rounded-4xl shadow-sm border border-gray-200 p-6 space-y-8'>
			{hours.length > 0 && (
				<div>
					<h2 className='text-2xl font-bold text-center text-gray-900 mb-6'>
						Dealership Hours
					</h2>
					<div>
						{hours.map((entry, index) => (
							<div
								key={entry.day}
								className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 last:border-b-0 ${index % 2 === 1 ? "bg-gray-50" : ""
									}`}
							>
								<span className='text-gray-600'>{entry.day}</span>
								<span
									className={`font-semibold ${entry.isClosed ? "text-gray-400" : "text-gray-900"
										}`}
								>
									{entry.hours}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			<div className='space-y-4 pt-10 border-t border-gray-100 flex flex-col gap-5'>
				<h3 className='text-xl font-semibold text-center text-gray-900'>
					Dealership Information
				</h3>
				<div className='relative w-full h-64 rounded-3xl overflow-hidden'>
					<Image
						src={
							"https://cdn.dealertower.com/website-media/content/a05cf51e-f76d-4f96-92ad-7d6778447344/map-twn.webp"
						}
						alt={"map"}
						fill
						className='object-cover'
						sizes='(max-width: 768px) 100vw, 400px'
					/>
				</div>
			</div>
		</div>
	);
}
