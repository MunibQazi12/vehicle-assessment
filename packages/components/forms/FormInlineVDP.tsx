/**
 * Form Inline VDP Component
 * Renders available forms inside a tabbed experience with a default form active
 */

"use client";

import { useMemo, useState, Activity } from "react";
import type { FormSubmissionResponse, CTABtnStyles } from "@dealertower/types";
import { FormContent } from "./FormContent";
import { cn } from "@dealertower/lib/utils/cn";
import type { CSSProperties } from "react";

interface InlineVDPFormConfig {
	formId: string;
	label?: string;
	description?: string;
	defaultTitle?: string;
	styles?: CTABtnStyles | null;
}

interface FormInlineVDPProps {
	forms: InlineVDPFormConfig[];
	defaultOpenFormId?: string;
	onSuccess?: (response: FormSubmissionResponse) => void;
	onFormLoad?: () => void;
	vehicleData?: {
		vehicle_id?: string;
		dealer_ids?: string[];
		vin_number?: string;
		stock_number?: string;
		title?: string;
	};
	showHeaderTitle?: boolean;
	showHeaderSubtitle?: boolean;
}

const buildTriggerStyles = (
	styles?: CTABtnStyles | null
): CSSProperties | undefined => {
	if (!styles) return undefined;

	return {
		["--cta-inline-text" as string]: styles.text_color,
		["--cta-inline-bg" as string]: styles.bg,
		["--cta-inline-hover-text" as string]: styles.text_hover_color,
		["--cta-inline-hover-bg" as string]: styles.bg_hover,
		// Legacy hover variables for CTA button consistency
		["--hover-color" as string]: styles.text_hover_color,
		["--hover-bg" as string]: styles.bg_hover,
	};
};

const resolveDefaultFormId = (
	forms: InlineVDPFormConfig[],
	preferredId?: string
): string | null => {
	if (!forms.length) return null;
	if (preferredId && forms.some((form) => form.formId === preferredId)) {
		return preferredId;
	}
	return forms[0]?.formId ?? null;
};

export function FormInlineVDP({
	forms,
	defaultOpenFormId,
	onSuccess,
	onFormLoad,
	vehicleData,
	showHeaderTitle = true,
	showHeaderSubtitle = true,
}: FormInlineVDPProps) {
	const computedDefaultFormId = useMemo(() => {
		if (!forms.length) return null;
		return resolveDefaultFormId(forms, defaultOpenFormId);
	}, [forms, defaultOpenFormId]);

	const [selectedFormId, setSelectedFormId] = useState<string | null>(
		() => computedDefaultFormId
	);
	const activeFormId = useMemo(() => {
		if (selectedFormId && forms.some((form) => form.formId === selectedFormId)) {
			return selectedFormId;
		}
		return computedDefaultFormId;
	}, [computedDefaultFormId, forms, selectedFormId]);
	const [renderedFormIds, setRenderedFormIds] = useState<
		Record<string, boolean>
	>(() => (computedDefaultFormId ? { [computedDefaultFormId]: true } : {}));
	const [loadedFormIds, setLoadedFormIds] = useState<Record<string, boolean>>(
		{}
	);

	if (!forms.length) return null;

	const isActiveFormLoaded = activeFormId
		? Boolean(loadedFormIds[activeFormId])
		: false;

	return (
		<div className='rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-3 sm:p-4 md:p-6 shadow-sm'>
			<div className='flex flex-wrap gap-1.5 sm:gap-2 rounded-xl sm:rounded-full bg-gray-100 shadow-sm p-1 sm:p-1.5'>
				{forms.map((formConfig) => {
					const isActive = formConfig.formId === activeFormId;
					const formLabel =
						formConfig.label || formConfig.defaultTitle || "Contact Us";
					const triggerStyles = buildTriggerStyles(formConfig.styles);
					const hasCustomStyles = Boolean(formConfig.styles);

					return (
						<button
							type='button'
							key={formConfig.formId}
							onClick={() => {
								setSelectedFormId(formConfig.formId);
								setRenderedFormIds((prev) => {
									if (prev[formConfig.formId]) return prev;
									return {
										...prev,
										[formConfig.formId]: true,
									};
								});
							}}
							className={cn(
								"flex-1 min-w-[calc(50%-4px)] sm:min-w-0 rounded-lg sm:rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
								isActive
									? hasCustomStyles
										? "bg-white text-gray-900 shadow-sm"
										: "bg-white text-gray-900 shadow-sm"
									: hasCustomStyles
										? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
										: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
							)}
							style={triggerStyles}
							aria-pressed={isActive}
						>
							{formLabel}
						</button>
					);
				})}
			</div>

			<div className='relative mt-3 sm:mt-4 min-h-[280px] sm:min-h-80'>
				{forms.map((formConfig) => {
					const isActive = formConfig.formId === activeFormId;
					const shouldRender = Boolean(
						isActive || renderedFormIds[formConfig.formId]
					);

					if (!shouldRender) {
						return null;
					}

					return (
						<div
							key={formConfig.formId}
							className={cn(
								"transition-opacity duration-200",
								isActive ? "relative opacity-100" : "absolute inset-0 opacity-0"
							)}
							aria-hidden={!isActive}
						>
							<Activity mode={isActive ? "visible" : "hidden"}>
								<FormContent
									formId={formConfig.formId}
									isOpen={shouldRender}
									onFormLoad={() => {
										setLoadedFormIds((prev) => {
											if (prev[formConfig.formId]) {
												return prev;
											}
											return {
												...prev,
												[formConfig.formId]: true,
											};
										});
										onFormLoad?.();
									}}
									onSuccess={(response) => {
										onSuccess?.(response);
									}}
									vehicleData={vehicleData}
									renderHeader={(form) => {
										const fallbackTitle =
											formConfig.defaultTitle ||
											formConfig.label ||
											"Contact Us";
										const headerTitle =
											form?.title || fallbackTitle || "Contact Us";
										const shouldRenderTitle = Boolean(
											showHeaderTitle && headerTitle
										);
										const shouldRenderSubtitle = Boolean(
											showHeaderSubtitle && vehicleData?.title
										);

										if (!shouldRenderTitle && !shouldRenderSubtitle) {
											return null;
										}

										return (
											<div className='mb-3 sm:mb-4'>
												{shouldRenderTitle && (
													<h2 className='text-base sm:text-lg font-bold text-gray-900'>
														{headerTitle}
													</h2>
												)}
												{shouldRenderSubtitle && vehicleData?.title && (
													<p className='mt-1 text-xs sm:text-sm text-gray-600'>
														Regarding:{" "}
														<span className='font-medium text-gray-800'>
															{vehicleData.title}
														</span>
													</p>
												)}
											</div>
										);
									}}
								/>
							</Activity>
						</div>
					);
				})}

				{!isActiveFormLoaded && (
					<div className='absolute inset-0 z-10 flex items-center justify-center rounded-xl sm:rounded-2xl bg-white'>
						<div className='h-8 w-8 animate-spin rounded-full border-3 border-gray-200 border-t-gray-700' />
					</div>
				)}
			</div>
		</div>
	);
}
