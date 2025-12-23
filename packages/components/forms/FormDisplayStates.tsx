/**
 * Form Display States
 * Loading, error, and success state components for forms
 */

import type { DealerTowerForm } from "@dealertower/types";

interface FormLoadingStateProps {
	renderHeader?: (form: DealerTowerForm | null) => React.ReactNode;
}

export function FormLoadingState({ renderHeader }: FormLoadingStateProps) {
	return (
		<>
			{renderHeader?.(null)}
			<div className="flex items-center justify-center py-8 sm:py-12">
				<div className="text-center">
					<div className="inline-block h-10 w-10 animate-spin rounded-full border-3 border-gray-200 border-t-blue-600"></div>
					<p className="mt-3 text-sm font-medium text-gray-500">Loading form...</p>
				</div>
			</div>
		</>
	);
}

interface FormErrorStateProps {
	error: string;
	renderHeader?: (form: DealerTowerForm | null) => React.ReactNode;
}

export function FormErrorState({ error, renderHeader }: FormErrorStateProps) {
	return (
		<>
			{renderHeader?.(null)}
			<div className="p-4 sm:p-5 bg-red-50 border border-red-200 rounded-xl">
				<div className="flex items-start gap-3">
					<svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
						<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
					</svg>
					<p className="text-red-700 text-sm sm:text-base font-medium">{error}</p>
				</div>
			</div>
		</>
	);
}

interface FormSuccessStateProps {
	form: DealerTowerForm | null;
	renderHeader?: (form: DealerTowerForm | null) => React.ReactNode;
}

export function FormSuccessState({ form, renderHeader }: FormSuccessStateProps) {
	return (
		<>
			{renderHeader?.(form)}
			<div className="p-5 sm:p-6 bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
				<div className="flex items-start gap-4">
					<div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
						<svg
							className="h-5 w-5 sm:h-6 sm:w-6 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2.5}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="text-lg sm:text-xl font-semibold text-green-800">Thank You!</h3>
						<p className="mt-1 text-green-700 text-sm sm:text-base">
							Your form has been submitted successfully. We&apos;ll be in touch soon.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

interface FormErrorBannerProps {
	error: string;
}

export function FormErrorBanner({ error }: FormErrorBannerProps) {
	return (
		<div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
			<div className="flex items-start gap-3">
				<svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
					<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
				</svg>
				<p className="text-red-700 text-sm sm:text-base font-medium">{error}</p>
			</div>
		</div>
	);
}

interface FormSubmittingIndicatorProps {
	isVisible: boolean;
}

export function FormSubmittingIndicator({ isVisible }: FormSubmittingIndicatorProps) {
	if (!isVisible) return null;

	return (
		<div className="mt-4 sm:mt-5 text-center py-2">
			<div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full">
				<div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
				<p className="text-sm font-medium text-gray-600">Submitting your form...</p>
			</div>
		</div>
	);
}
