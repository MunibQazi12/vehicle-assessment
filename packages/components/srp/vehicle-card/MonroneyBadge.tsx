import { useEffect, useRef } from "react";

interface MonroneyLabels {
	init?: () => void;
}

declare global {
	interface Window {
		MonroneyLabels?: MonroneyLabels;
	}
}

type MonroneyProps = {
	vin: string;
	year: string;
	make: string;
	vendorId: string;
};

function MonroneyBadge({ vin, year, make, vendorId }: MonroneyProps) {
	const badgeRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;

		if (window.MonroneyLabels && badgeRef.current) {
			window.MonroneyLabels.init?.();
		}
	}, [vin, year, make]);

	return (
		<span
			className='monroney-labels'
			data-year={year}
			data-make={make}
			data-vin={vin}
			data-vendor-id={vendorId}
		></span>
	);
}

export default MonroneyBadge;
