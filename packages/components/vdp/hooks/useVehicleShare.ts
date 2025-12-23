"use client";

import { useCallback, useEffect, useState } from "react";

interface VehicleSharePayload {
	title?: string | null;
	year?: number | null;
	make?: string | null;
	model?: string | null;
}

export function useVehicleShare({
	title,
	year,
	make,
	model,
}: VehicleSharePayload) {
	const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");

	const handleShare = useCallback(async () => {
		if (typeof window === "undefined") return;

		const shareUrl = window.location?.href || "";
		const computedTitle = title || "Check out this vehicle";
		const text = `${year || ""} ${make || ""} ${model || ""}`.trim();

		try {
			if (navigator.share) {
				await navigator.share({
					title: computedTitle,
					text: text || computedTitle,
					url: shareUrl,
				});
				return;
			}

			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(shareUrl);
				setShareStatus("copied");
				return;
			}

			window.prompt?.("Copy and share this link", shareUrl);
			setShareStatus("copied");
		} catch {
			setShareStatus("idle");
		}
	}, [make, model, title, year]);

	useEffect(() => {
		if (shareStatus === "idle") return;

		const timer = window.setTimeout(() => setShareStatus("idle"), 2000);
		return () => window.clearTimeout(timer);
	}, [shareStatus]);

	return { shareStatus, handleShare };
}
