/**
 * FormClient Component (Client Component)
 * Handles form interactivity and submission
 * Receives SSR-fetched form data from Form component
 */

"use client";

import { useState, useEffect } from "react";
import type { DealerTowerForm } from "@dealertower/types";
import { submitForm } from "./formSubmission";
import { FormField } from "./FormField";
import {
	FormSuccessState,
	FormErrorBanner,
	FormSubmittingIndicator,
} from "./FormDisplayStates";

interface FormClientProps {
	formId: string;
	initialForm: DealerTowerForm;
	className?: string;
	vehicleData?: {
		vehicle_id?: string;
		dealer_ids?: string[];
		vin_number?: string;
		stock_number?: string;
		title?: string;
	};
}

export function FormClient({
	formId,
	initialForm,
	className = "",
	vehicleData,
}: FormClientProps) {
	const [form] = useState<DealerTowerForm>(initialForm);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [csrfToken, setCsrfToken] = useState<string>("");
	const [cooldownSeconds, setCooldownSeconds] = useState(0);

	// Fetch CSRF token on mount
	useEffect(() => {
		const fetchCsrf = async () => {
			try {
				const response = await fetch("/api/csrf/");
				if (response.ok) {
					const data = await response.json();
					setCsrfToken(data.token || "");
				}
			} catch (err) {
				console.error("Failed to fetch CSRF token:", err);
			}
		};
		fetchCsrf();
	}, []);

	// Cooldown timer
	useEffect(() => {
		if (cooldownSeconds > 0) {
			const timer = setTimeout(() => {
				setCooldownSeconds(cooldownSeconds - 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [cooldownSeconds]);

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Check cooldown
		if (cooldownSeconds > 0) {
			setError(
				`Please wait ${cooldownSeconds} seconds before submitting again.`
			);
			return;
		}

		setIsSubmitting(true);
		setError(null);
		setFieldErrors({});

		const formData = new FormData(e.currentTarget);

		await submitForm({
			formData,
			formId,
			csrfToken,
			vehicleData,
			onError: (error, fieldErrors) => {
				setError(error);
				if (fieldErrors) {
					setFieldErrors(fieldErrors);
				}
			},
			onSuccess: () => {
				setSubmitSuccess(true);
			},
			onCooldown: (seconds) => {
				setCooldownSeconds(seconds);
			},
			onCsrfUpdate: (token) => {
				setCsrfToken(token);
			},
		});

		setIsSubmitting(false);
	};

	// Success state
	if (submitSuccess) {
		return (
			<div className={className}>
				<div className='mb-4 sm:mb-6'>
					<h2 className='text-xl sm:text-2xl font-bold text-gray-900'>
						{form.title || "Contact Form"}
					</h2>
				</div>
				<FormSuccessState form={form} />
			</div>
		);
	}

	return (
		<div className={className}>
			{/* Form header */}
			<div className='mb-4 sm:mb-6'>
				<h2 className='text-xl sm:text-2xl font-bold text-gray-900'>
					{form.title || "Contact Form"}
				</h2>
				{vehicleData?.title && (
					<p className='mt-1.5 sm:mt-2 text-sm text-gray-600'>
						Regarding: <span className='font-medium text-gray-800'>{vehicleData.title}</span>
					</p>
				)}
			</div>

			{error && <FormErrorBanner error={error} />}

			<form onSubmit={handleSubmit}>
				{/* Honeypot field - hidden from users, catches bots */}
				<input
					type='text'
					name='website_url'
					tabIndex={-1}
					autoComplete='off'
					style={{
						position: "absolute",
						left: "-9999px",
						width: "1px",
						height: "1px",
						opacity: 0,
					}}
					aria-hidden='true'
				/>

				{/* CSRF Token */}
				<input
					type='hidden'
					name='csrf_token'
					value={csrfToken}
				/>

				<div className='grid grid-cols-12 gap-3 sm:gap-4'>
					{form.fields
						.filter((field) => field.is_visible !== false)
						.map((field) => (
							<FormField
								key={field.name}
								field={field}
								error={fieldErrors[field.name]}
								vehicleData={vehicleData}
							/>
						))}

					{/* Add default submit button if form doesn't have one */}
					{!form.fields.some((field) => field.field_type === "submit") && (
						<div className='col-span-12 mt-2'>
							<button
								type='submit'
								disabled={isSubmitting || cooldownSeconds > 0}
								className='w-full bg-blue-600 text-white py-2.5 px-5 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base'
							>
								{isSubmitting
									? "Submitting..."
									: cooldownSeconds > 0
										? `Wait ${cooldownSeconds}s`
										: "Submit"}
							</button>
						</div>
					)}
				</div>

				<FormSubmittingIndicator isVisible={isSubmitting} />
			</form>
		</div>
	);
}
