/**
 * Offer Expiration Component
 * Displays the expiration date and details link for special offers
 */

"use client";

import { useState, useCallback } from "react";
import { cn } from "@dealertower/lib/utils/cn";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@dealertower/components/ui/dialog";

interface OfferExpirationProps {
	/** Expiration date */
	expiresAt: Date;
	/** Detailed terms and conditions */
	details?: string;
	/** Custom class name */
	className?: string;
}

/**
 * Format date for display (e.g., "01/05/2026")
 */
function formatExpirationDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});
}

export function OfferExpiration({
	expiresAt,
	details,
	className,
}: OfferExpirationProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleOpenDetails = useCallback(() => {
		if (details) {
			setIsOpen(true);
		}
	}, [details]);

	return (
		<div className={cn("flex items-center gap-2 text-sm text-zinc-500", className)}>
			<span>Expires {formatExpirationDate(expiresAt)}</span>

			{details && (
				<>
					<span className="text-zinc-300">|</span>
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<button
								type="button"
								className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-700 transition-colors"
								onClick={handleOpenDetails}
							>
								<InfoIcon className="h-4 w-4" />
								<span>Details</span>
							</button>
						</DialogTrigger>
						<DialogContent className="max-w-lg">
							<DialogHeader>
								<DialogTitle>Offer Details</DialogTitle>
							</DialogHeader>
							<div className="mt-4 text-sm text-zinc-600 whitespace-pre-wrap">
								{details}
							</div>
						</DialogContent>
					</Dialog>
				</>
			)}
		</div>
	);
}

/**
 * Info Icon Component
 */
function InfoIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className={className}
		>
			<path
				fillRule="evenodd"
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
				clipRule="evenodd"
			/>
		</svg>
	);
}
