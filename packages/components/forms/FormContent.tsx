/**
 * Form Content Component
 * Shared form logic for all form wrappers (modal, slider, inline)
 * Contains form fetching, submission, and rendering logic without UI wrapper
 */

"use client";

import { useState } from "react";
import type {
	DealerTowerForm,
	FormSubmissionResponse,
} from "@dealertower/types";
import { useFormState } from "./useFormState";
import { submitForm } from "./formSubmission";
import { FormField } from "./FormField";
import {
	FormLoadingState,
	FormErrorState,
	FormSuccessState,
	FormErrorBanner,
	FormSubmittingIndicator,
} from "./FormDisplayStates";

interface FormContentProps {
	formId: string;
	isOpen: boolean;
	onSuccess?: (response: FormSubmissionResponse) => void;
	onFormLoad?: (form: DealerTowerForm) => void;
	vehicleData?: {
		vehicle_id?: string;
		dealer_ids?: string[];
		vin?: string;
		stock_number?: string;
		title?: string;
	};
	renderHeader?: (form: DealerTowerForm | null) => React.ReactNode;
	renderActions?: () => React.ReactNode;
}

export function FormContent({
	formId,
	isOpen,
	onSuccess,
	onFormLoad,
	vehicleData,
	renderHeader,
	renderActions,
}: FormContentProps) {
	const [state, actions] = useFormState({ formId, isOpen, onFormLoad });
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Check cooldown
		if (state.cooldownSeconds > 0) {
			actions.setError(
				`Please wait ${state.cooldownSeconds} seconds before submitting again.`
			);
			return;
		}

		setIsSubmitting(true);
		actions.setError(null);
		actions.setFieldErrors({});

		const formData = new FormData(e.currentTarget);

		await submitForm({
			formData,
			formId,
			csrfToken: state.csrfToken,
			vehicleData,
			onError: (error, fieldErrors) => {
				actions.setError(error);
				if (fieldErrors) {
					actions.setFieldErrors(fieldErrors);
				}
			},
			onSuccess: (response) => {
				actions.setSubmitSuccess(true);
				onSuccess?.(response);
			},
			onCooldown: (seconds) => {
				actions.setCooldownSeconds(seconds);
			},
			onCsrfUpdate: (token) => {
				actions.setCsrfToken(token);
			},
		});

		setIsSubmitting(false);
	};

	// Loading state
	if (state.isLoading) {
		return <FormLoadingState renderHeader={renderHeader} />;
	}

	// Error state (no form loaded)
	if (state.error && !state.form) {
		return (
			<FormErrorState
				error={state.error}
				renderHeader={renderHeader}
			/>
		);
	}

	// Success state
	if (state.submitSuccess) {
		return (
			<FormSuccessState
				form={state.form}
				renderHeader={renderHeader}
			/>
		);
	}

	// Form content
	if (!state.form) return null;

	return (
		<>
			{renderHeader?.(state.form)}

			{state.error && <FormErrorBanner error={state.error} />}

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
					value={state.csrfToken}
				/>

				<div className='grid grid-cols-12 gap-3 sm:gap-4'>
					{state.form.fields
						.filter((field) => field.is_visible !== false)
						.map((field) => (
							<FormField
								key={field.name}
								field={field}
								error={state.fieldErrors[field.name]}
								vehicleData={vehicleData}
							/>
						))}

					{/* Add default submit button if form doesn't have one */}
					{!state.form.fields.some(
						(field) => field.field_type === "submit"
					) && (
							<div className='col-span-12 mt-2'>
								<button
									type='submit'
									disabled={isSubmitting || state.cooldownSeconds > 0}
									className='w-full bg-blue-600 text-white py-2.5 px-5 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm sm:text-base'
								>
									{isSubmitting
										? "Submitting..."
										: state.cooldownSeconds > 0
											? `Wait ${state.cooldownSeconds}s`
											: "Submit"}
								</button>
							</div>
						)}
				</div>

				<FormSubmittingIndicator isVisible={isSubmitting} />
			</form>

			{renderActions?.()}
		</>
	);
}
