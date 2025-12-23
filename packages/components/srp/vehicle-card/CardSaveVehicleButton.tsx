"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { Heart } from "lucide-react";

type Props = {
	vin: string;
	primaryColor?: string;
};

const SAVED_CARS_COOKIE = "savedCars";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const SAVED_CARS_EVENT = "savedCarsUpdated";

const sanitizeVinList = (cars: string[]) => {
	const unique = new Set(
		cars.filter((car) => typeof car === "string" && car.trim().length > 0)
	);

	return Array.from(unique);
};

const broadcastSavedCarsUpdate = (cars: string[]) => {
	if (typeof window === "undefined") return;

	window.dispatchEvent(
		new CustomEvent(SAVED_CARS_EVENT, {
			detail: cars,
		})
	);
};

const writeSavedCarsCookie = (cars: string[]) => {
	if (typeof document === "undefined") return;

	const sanitized = sanitizeVinList(cars);
	const value = encodeURIComponent(JSON.stringify(sanitized));

	document.cookie = `${SAVED_CARS_COOKIE}=${value};path=/;max-age=${COOKIE_MAX_AGE_SECONDS};SameSite=Lax`;
	broadcastSavedCarsUpdate(sanitized);
};

export const getSavedCarsFromCookies = (): string[] => {
	if (typeof document === "undefined") return [];

	const cookie = document.cookie
		.split(";")
		.map((entry) => entry.trim())
		.find((entry) => entry.startsWith(`${SAVED_CARS_COOKIE}=`));

	if (!cookie) return [];

	const value = cookie.split("=")[1];

	try {
		const parsed = JSON.parse(decodeURIComponent(value));
		return Array.isArray(parsed) ? sanitizeVinList(parsed) : [];
	} catch {
		return [];
	}
};

export const saveCarToCookies = (
	vin: string,
	baseCars?: string[]
): string[] => {
	if (!vin) return getSavedCarsFromCookies();

	const current = Array.isArray(baseCars)
		? [...baseCars]
		: getSavedCarsFromCookies();

	if (current.includes(vin)) {
		return current;
	}

	const next = [...current, vin];
	writeSavedCarsCookie(next);
	return next;
};

export const removeCarFromCookies = (
	vin: string,
	baseCars?: string[]
): string[] => {
	const current = Array.isArray(baseCars)
		? [...baseCars]
		: getSavedCarsFromCookies();

	const next = current.filter((savedVin) => savedVin !== vin);
	writeSavedCarsCookie(next);
	return next;
};

function CardSaveVehicleButton({ vin, primaryColor }: Props) {
	const [savedCars, setSavedCars] = useState<string[]>([]);
	const dealerPrimaryColor = primaryColor ?? "var(--color-dealer-primary)";

	useEffect(() => {
		const syncSavedCars = () => setSavedCars(getSavedCarsFromCookies());

		syncSavedCars();

		if (typeof window === "undefined") return;

		window.addEventListener(SAVED_CARS_EVENT, syncSavedCars);
		return () => window.removeEventListener(SAVED_CARS_EVENT, syncSavedCars);
	}, []);

	const handleClick = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			e.preventDefault();

			setSavedCars((prev) =>
				prev.includes(vin)
					? removeCarFromCookies(vin, prev)
					: saveCarToCookies(vin, prev)
			);
		},
		[vin]
	);

	const isSaved = savedCars.includes(vin);

	return (
		<div
			className='card-save-vehicle-button relative z-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-[rgba(255,255,255,0.3)]'
			onClick={handleClick}
		>
			{isSaved ? (
				<Heart
					className='card-save-vehicle-button__icon card-save-vehicle-button__icon--filled'
					style={{ color: dealerPrimaryColor }}
					fill='currentColor'
					stroke='currentColor'
				/>
			) : (
				<Heart className='card-save-vehicle-button__icon card-save-vehicle-button__icon--outline text-black' />
			)}
		</div>
	);
}

export default CardSaveVehicleButton;
