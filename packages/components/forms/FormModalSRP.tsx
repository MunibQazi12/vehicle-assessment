/**
 * Form Modal SRP Component
 * Displays a form as a right-side slider modal with full height (for SRP pages)
 */

"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { FormSubmissionResponse } from "@dealertower/types";
import { FormContent } from "./FormContent";
import { getSecureVehicleImageUrl } from "@dealertower/lib/utils/image";

// Helper to safely get document.body on client
function usePortalContainer() {
	return useSyncExternalStore(
		() => () => { },
		() => document.body,
		() => null
	);
}

interface FormModalSRPProps {
	formId: string;
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: (response: FormSubmissionResponse) => void;
	onFormLoad?: () => void;
	isLoading?: boolean;
	vehicleData?: {
		vehicle_id?: string;
		dealer_ids?: string[];
		vin_number?: string;
		stock_number?: string;
		title?: string;
		subtitle?: string;
		photo?: string;
		price?: number;
		retail_price?: number;
		sale_price?: number;
	};
}

export function FormModalSRP({
	formId,
	isOpen,
	onClose,
	onSuccess,
	onFormLoad,
	isLoading = false,
	vehicleData,
}: FormModalSRPProps) {
	const [formTitle, setFormTitle] = useState<string>("Contact Us");
	const [mounted, setMounted] = useState(false);
	const portalContainer = usePortalContainer();

	// Smooth mount animation - only run when open
	useEffect(() => {
		if (!isOpen) return;

		// Small delay to ensure smooth transition on mount
		const timer = setTimeout(() => setMounted(true), 10);

		return () => {
			clearTimeout(timer);
			setMounted(false);
			setFormTitle("Contact Us");
		};
	}, [isOpen]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (!isOpen) return;

		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	// Close on Escape key - only when open
	useEffect(() => {
		if (!isOpen) return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	// Early return after all hooks
	if (!isOpen || !portalContainer) return null;

	const modalContent = (
		<div className="fixed inset-0 z-50 overflow-hidden">
			{/* Backdrop - lighter white overlay */}
			<div
				className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${mounted ? "opacity-100" : "opacity-0"
					}`}
				onClick={onClose}
			/>

			{/* Slider panel from right */}
			<div className="fixed inset-y-0 right-0 flex max-w-full">
				<div
					className={`
            relative w-screen max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl
            transform transition-all duration-300 ease-out
            ${mounted ? "translate-x-0" : "translate-x-full"}
          `}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="h-full flex flex-col bg-white shadow-2xl">
						{/* Header with close button */}
						<div className="sticky top-0 z-10 bg-gray-900 px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between shrink-0">
							<h2 className="text-base sm:text-lg font-semibold text-white truncate pr-4">
								{formTitle}
							</h2>
							<button
								onClick={onClose}
								className="p-1.5 -mr-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
								aria-label="Close"
							>
								<svg
									className="h-5 w-5 sm:h-6 sm:w-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						{/* Vehicle Information Card */}
						{vehicleData && (
							<div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 shrink-0">
								<div className="flex gap-3 sm:gap-4 items-center">
									{/* Vehicle Photo */}
									{vehicleData.photo && (function () {
										const securePhotoUrl = getSecureVehicleImageUrl(vehicleData.photo);
										return securePhotoUrl ? (
											<div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-200">
												<Image
													src={securePhotoUrl}
													alt={vehicleData.title || "Vehicle"}
													width={96}
													height={96}
													className="w-full h-full object-cover"
												/>
											</div>
										) : null;
									})()}

									{/* Vehicle Details */}
									<div className="flex-1 min-w-0 flex flex-col justify-center">
										{/* Title */}
										{vehicleData.title && (
											<h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 sm:truncate">
												{vehicleData.title}
											</h3>
										)}

										{/* Subtitle */}
										{vehicleData.subtitle && (
											<p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
												{vehicleData.subtitle}
											</p>
										)}
									</div>

									{/* Pricing - Right side */}
									<div className="shrink-0 text-right">
										{/* Final Price */}
										{vehicleData.price && (
											<div className="text-base sm:text-lg font-bold text-gray-900">
												${vehicleData.price.toLocaleString()}
											</div>
										)}

										{/* MSRP or Sale Price with strikethrough */}
										{vehicleData.retail_price && vehicleData.retail_price > (vehicleData.price || 0) && (
											<div className="text-xs sm:text-sm text-gray-500 line-through mt-0.5">
												${vehicleData.retail_price.toLocaleString()}
											</div>
										)}
										{!vehicleData.retail_price && vehicleData.sale_price && vehicleData.sale_price > (vehicleData.price || 0) && (
											<div className="text-xs sm:text-sm text-gray-500 line-through mt-0.5">
												${vehicleData.sale_price.toLocaleString()}
											</div>
										)}
									</div>
								</div>
							</div>
						)}

						{/* Form content - scrollable */}
						<div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 relative">
							{/* Loading overlay within modal */}
							{isLoading && (
								<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/95 backdrop-blur-sm">
									<div className="text-center">
										<div className="inline-block h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
										<p className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-700">Loading form...</p>
									</div>
								</div>
							)}

							<FormContent
								formId={formId}
								isOpen={isOpen}
								onFormLoad={(form) => {
									setFormTitle(form.title || "Contact Us");
									onFormLoad?.(); // Notify parent that form is loaded
								}}
								onSuccess={(response) => {
									onSuccess?.(response);
									// Auto-close after 3 seconds
									setTimeout(() => {
										onClose();
									}, 3000);
								}}
								vehicleData={vehicleData}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	return createPortal(modalContent, portalContainer);
}
