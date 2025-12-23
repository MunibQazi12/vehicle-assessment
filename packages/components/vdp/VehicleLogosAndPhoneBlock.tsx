import { MapPinIcon, PhoneIcon } from "@dealertower/svgs/icons/icons";
import VehicleLogos from "@dealertower/components/srp/vehicle-card/VehicleLogos";
import type { VDPVehicle } from "@dealertower/types/api";

interface VehicleLogosAndPhoneBlockProps {
	salesPhoneNumber: string | null;
	shouldShowHistoryBadges: boolean;
	carfaxReportUrl: string | null;
	carfaxIconUrl: string | null;
	certifiedLogoUrl: string | null;
	normalizedHostname: string;
	vehicle: VDPVehicle;
	directionsUrl: string | null;
	primaryPhoneNumber: string | null;
}

export function VehicleLogosAndPhoneBlock({
	salesPhoneNumber,
	shouldShowHistoryBadges,
	carfaxReportUrl,
	carfaxIconUrl,
	certifiedLogoUrl,
	normalizedHostname,
	vehicle,
	directionsUrl,
	primaryPhoneNumber,
}: VehicleLogosAndPhoneBlockProps) {
	const normalizedPrimaryPhoneNumber = primaryPhoneNumber
		? primaryPhoneNumber.replace(/[^\d+]/g, "")
		: null;
	const hasDealerContactActions = Boolean(directionsUrl || primaryPhoneNumber);

	if (
		!salesPhoneNumber &&
		!shouldShowHistoryBadges &&
		!hasDealerContactActions
	) {
		return null;
	}

	return (
		<section className='rounded-4xl border border-gray-100 bg-white p-6 shadow-sm'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				{hasDealerContactActions && (
					<div className='rounded-3xl text-sm font-semibold text-[#0F172A]'>
						<div className='flex flex-col divide-y divide-gray-200 sm:flex-row sm:divide-y-0 sm:divide-x'>
							{directionsUrl && (
								<a
									href={directionsUrl}
									target='_blank'
									rel='noopener noreferrer'
									className='flex flex-1 items-center justify-center gap-2 px-5 py-3 transition-colors duration-200 hover:bg-white'
								>
									<MapPinIcon className='h-5 w-5 text-[var(--color-dealer-primary)]' />
									Directions
								</a>
							)}
							{primaryPhoneNumber && (
								<a
									href={`tel:${
										normalizedPrimaryPhoneNumber || primaryPhoneNumber
									}`}
									className='flex flex-1 items-center justify-center gap-2 px-5 py-3 transition-colors duration-200 hover:bg-white whitespace-nowrap'
								>
									<PhoneIcon className='h-5 w-5 text-[var(--color-dealer-primary)]' />
									{primaryPhoneNumber}
								</a>
							)}
						</div>
					</div>
				)}

				<div className='flex w-full flex-1 items-center justify-center sm:justify-end'>
					<VehicleLogos
						className='justify-center sm:justify-end'
						carfaxUrl={carfaxReportUrl || undefined}
						carfaxIconUrl={carfaxIconUrl || null}
						certifiedLogo={certifiedLogoUrl || undefined}
						width={60}
						height={28}
						shouldPreloadImage={false}
						vinNumber={vehicle.vin_number}
						year={vehicle.year || undefined}
						make={vehicle.make || undefined}
						condition={vehicle.condition}
						host={normalizedHostname}
					/>
				</div>
			</div>
		</section>
	);
}
