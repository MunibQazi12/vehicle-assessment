/**
 * Form Field Component
 * Renders individual form fields with validation and error handling
 */

import type { DealerTowerForm } from "@dealertower/types";

interface FormFieldProps {
	field: DealerTowerForm["fields"][number];
	error?: string;
	vehicleData?: {
		vehicle_id?: string;
		dealer_ids?: string[];
	};
}

// Map display_grid values to Tailwind classes with responsive breakpoints
const getGridColumnClass = (gridSpan: string | undefined): string => {
	const span = gridSpan || "12";
	// Mobile: full width for most fields, desktop: use specified span
	const gridMap: Record<string, string> = {
		"1": "col-span-12 sm:col-span-6 md:col-span-1",
		"2": "col-span-12 sm:col-span-6 md:col-span-2",
		"3": "col-span-12 sm:col-span-6 md:col-span-3",
		"4": "col-span-12 sm:col-span-6 md:col-span-4",
		"5": "col-span-12 sm:col-span-6 md:col-span-5",
		"6": "col-span-12 sm:col-span-6 md:col-span-6",
		"7": "col-span-12 sm:col-span-12 md:col-span-7",
		"8": "col-span-12 sm:col-span-12 md:col-span-8",
		"9": "col-span-12 sm:col-span-12 md:col-span-9",
		"10": "col-span-12 sm:col-span-12 md:col-span-10",
		"11": "col-span-12 sm:col-span-12 md:col-span-11",
		"12": "col-span-12",
	};
	return gridMap[span] || "col-span-12";
};

// Format phone number as 111-111-1111
function formatPhoneNumber(value: string): string {
	const cleaned = value.replace(/\D/g, "");
	const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
	if (!match) return value;
	const parts = [match[1], match[2], match[3]].filter(Boolean);
	return parts.join("-");
}

// Enhanced validation patterns
const getValidationPattern = (
	fieldType: string,
	fieldName: string,
	field: DealerTowerForm["fields"][number]
): string | undefined => {
	// Email with stricter validation
	if (fieldType === "email") {
		return "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
	}

	// Name fields - letters, spaces, hyphens, apostrophes only
	if (fieldName.toLowerCase().includes("name")) {
		return "^[a-zA-Z\\s'-]+$";
	}

	// URL fields
	if (
		fieldName.toLowerCase().includes("url") ||
		fieldName.toLowerCase().includes("website")
	) {
		return "^https?://.*";
	}

	return field.validation?.pattern;
};

function renderInput(
	field: DealerTowerForm["fields"][number],
	baseClasses: string,
	defaultValue?: string
) {
	switch (field.field_type) {
		case "text":
		case "date":
			return (
				<input
					type={field.field_type}
					id={field.name}
					name={field.name}
					placeholder={field.placeholder}
					defaultValue={defaultValue ?? field.default_value}
					required={field.is_required}
					minLength={field.validation?.minLength}
					maxLength={field.validation?.maxLength}
					pattern={getValidationPattern(field.field_type, field.name, field)}
					className={baseClasses}
					aria-required={field.is_required}
				/>
			);

		case "email":
			return (
				<input
					type='email'
					id={field.name}
					name={field.name}
					placeholder={field.placeholder}
					defaultValue={defaultValue ?? field.default_value}
					required={field.is_required}
					pattern={getValidationPattern("email", field.name, field)}
					className={baseClasses}
					aria-required={field.is_required}
				/>
			);

		case "tel":
			return (
				<input
					type='tel'
					id={field.name}
					name={field.name}
					placeholder={field.placeholder}
					defaultValue={defaultValue ?? field.default_value}
					required={field.is_required}
					maxLength={12}
					pattern={field.validation?.pattern || "\\d{3}-\\d{3}-\\d{4}"}
					className={baseClasses}
					aria-required={field.is_required}
					onChange={(e) => {
						e.target.value = formatPhoneNumber(e.target.value);
					}}
				/>
			);

		case "textarea":
			return (
				<textarea
					id={field.name}
					name={field.name}
					placeholder={field.placeholder}
					defaultValue={defaultValue ?? field.default_value}
					required={field.is_required}
					minLength={field.validation?.minLength}
					maxLength={field.validation?.maxLength}
					rows={4}
					className={baseClasses}
					aria-required={field.is_required}
				/>
			);

		case "select":
			return (
				<select
					id={field.name}
					name={field.name}
					defaultValue={defaultValue ?? field.default_value}
					required={field.is_required}
					className={baseClasses}
				>
					<option value=''>Select an option</option>
					{field.options?.map((option: { value: string; label: string }) => (
						<option
							key={option.value}
							value={option.value}
						>
							{option.label}
						</option>
					))}
				</select>
			);

		case "radio":
			return (
				<div className='space-y-3'>
					{field.options?.map((option: { value: string; label: string }) => (
						<label
							key={option.value}
							className='flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group'
						>
							<input
								type='radio'
								name={field.name}
								value={option.value}
								defaultChecked={
									(defaultValue ?? field.default_value) === option.value
								}
								required={field.is_required}
								className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2'
							/>
							<span className='text-sm font-medium text-gray-700 group-hover:text-gray-900'>{option.label}</span>
						</label>
					))}
				</div>
			);

		case "checkbox":
			return (
				<label className='flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group'>
					<input
						type='checkbox'
						id={field.name}
						name={field.name}
						value='true'
						defaultChecked={(defaultValue ?? field.default_value) === "true"}
						required={field.is_required}
						className='mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
					/>
					<span className='text-sm font-medium text-gray-700 group-hover:text-gray-900 leading-tight'>{field.label}</span>
				</label>
			);

		case "file":
			return (
				<input
					type='file'
					id={field.name}
					name={field.name}
					required={field.is_required}
					className={baseClasses}
				/>
			);

		default:
			return null;
	}
}

export function FormField({ field, error, vehicleData }: FormFieldProps) {
	const colSpanClass = getGridColumnClass(field.settings?.display_grid);
	const baseInputClasses = error
		? "w-full px-4 py-3 text-base border-2 border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50 transition-all duration-200 placeholder:text-red-300"
		: "w-full px-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white hover:border-gray-300 transition-all duration-200 placeholder:text-gray-400";
	const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";

	// Determine default value based on settings
	let defaultValue = field.default_value;
	if (field.settings?.vehicle && vehicleData?.vehicle_id) {
		defaultValue = vehicleData.vehicle_id;
	} else if (field.settings?.dealer && vehicleData?.dealer_ids?.[0]) {
		defaultValue = vehicleData.dealer_ids[0];
	}

	if (field.field_type === "hidden") {
		return (
			<input
				type='hidden'
				name={field.name}
				defaultValue={defaultValue}
			/>
		);
	}

	if (field.field_type === "paragraph") {
		return (
			<div className={colSpanClass}>
				<p className='text-gray-700'>{field.label}</p>
			</div>
		);
	}

	if (field.field_type === "submit") {
		return (
			<div className={`${colSpanClass} mt-2`}>
				<button
					type='submit'
					className='w-full bg-blue-600 text-white py-2.5 px-5 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 font-medium cursor-pointer text-sm sm:text-base'
				>
					{field.label || "Submit"}
				</button>
			</div>
		);
	}

	return (
		<div className={colSpanClass}>
			{field.label && (
				<label
					htmlFor={field.name}
					className={labelClasses}
				>
					{field.label}
					{field.is_required && <span className='text-red-500 ml-1'>*</span>}
				</label>
			)}

			{renderInput(field, baseInputClasses, defaultValue)}

			{error && (
				<p
					className='mt-2 text-sm text-red-600 flex items-center gap-1.5'
					role='alert'
				>
					<svg className='w-4 h-4 shrink-0' fill='currentColor' viewBox='0 0 20 20'>
						<path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
					</svg>
					{error}
				</p>
			)}
		</div>
	);
}
