"use client";

import { useCallback, useEffect, useState } from "react";
import {
	getSavedCarsFromCookies,
	removeCarFromCookies,
	saveCarToCookies,
} from "@dealertower/components/srp/vehicle-card/CardSaveVehicleButton";

const SAVED_CARS_EVENT = "savedCarsUpdated";

export function useVehicleSave(vin?: string | null) {
	const [isSaved, setIsSaved] = useState(false);
	const normalizedVin = vin ?? undefined;

	useEffect(() => {
		if (!normalizedVin) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIsSaved(false);
			return;
		}

		const syncSavedCars = () => {
			const savedCars = getSavedCarsFromCookies();
			setIsSaved(savedCars.includes(normalizedVin));
		};

		syncSavedCars();

		if (typeof window === "undefined") return;

		window.addEventListener(SAVED_CARS_EVENT, syncSavedCars);
		return () => window.removeEventListener(SAVED_CARS_EVENT, syncSavedCars);
	}, [normalizedVin]);

	const toggleSave = useCallback(() => {
		if (!normalizedVin) return;

		setIsSaved((prev) => {
			if (prev) {
				removeCarFromCookies(normalizedVin);
				return false;
			}

			saveCarToCookies(normalizedVin);
			return true;
		});
	}, [normalizedVin]);

	return { isSaved, toggleSave, canSave: Boolean(normalizedVin) };
}
