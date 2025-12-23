/**
 * Dealer Tower Forms Type Definitions
 * Generated from API analysis of 53 forms across 28 dealership sites
 * 
 * Forms are dynamic and all data can be changed. New forms can be generated
 * with different field configurations. The constant elements are:
 * - Field type keys (field_type property)
 * - Available field types
 * - Settings structure for each field type
 */

// ============================================================================
// Field Types
// ============================================================================

/**
 * All supported form field types
 */
export type FormFieldType =
	| 'text'       // Single-line text input
	| 'email'      // Email input with validation
	| 'tel'        // Phone number input
	| 'date'       // Date picker
	| 'select'     // Dropdown selection
	| 'textarea'   // Multi-line text input
	| 'submit'     // Submit button
	| 'hidden'     // Hidden field
	| 'paragraph'  // Static text/description
	| 'radio'      // Radio button group
	| 'checkbox'   // Checkbox input
	| 'file';      // File upload

// ============================================================================
// Field Option Interface
// ============================================================================

/**
 * Option for select, radio, and checkbox fields
 */
export interface FormFieldOption {
	label: string;
	value: string;
}

// ============================================================================
// Field Settings
// ============================================================================

/**
 * Common settings for form fields
 * Settings are dynamic and can vary per field
 */
export interface FormFieldSettings {
	/** Grid column span (1-12, typically for Bootstrap/Tailwind grid) */
	display_grid?: string;

	/** Special value indicator (e.g., "kbb_year", "kbb_make", "kbb_model") */
	value?: string;

	/** Auto-populate with vehicle ID */
	vehicle?: boolean;

	/** Auto-populate with dealer ID */
	dealer?: boolean;

	/** Additional custom settings */
	[key: string]: unknown;
}

/**
 * Validation rules for form fields
 * Validation rules are dynamic and can vary per field
 */
export interface FormFieldValidation {
	/** Minimum length for text fields */
	minLength?: number;

	/** Maximum length for text fields */
	maxLength?: number;

	/** Pattern for regex validation */
	pattern?: string;

	/** Custom validation rules */
	[key: string]: unknown;
}

// ============================================================================
// Base Field Interface
// ============================================================================

/**
 * Base interface for all form fields
 * All field types extend this interface
 */
export interface FormFieldBase {
	/** Type of the form field */
	field_type: FormFieldType;

	/** Unique field name (used as form input name) */
	name: string;

	/** Display label for the field */
	label?: string;

	/** Whether the field is required for form submission */
	is_required?: boolean;

	/** Placeholder text for input fields */
	placeholder?: string;

	/** Default value for the field */
	default_value?: string;

	/** Tooltip text to display on hover */
	tooltip?: string;

	/** Whether the field is visible in the form */
	is_visible?: boolean;

	/** Options for select, radio, and checkbox fields */
	options?: FormFieldOption[] | null;

	/** CSS classes to apply to the field */
	classes?: string | null;

	/** Field-specific settings */
	settings?: FormFieldSettings;

	/** Validation rules for the field */
	validation?: FormFieldValidation;
}

// ============================================================================
// Specific Field Type Interfaces
// ============================================================================

export interface FormFieldText extends FormFieldBase {
	field_type: 'text';
}

export interface FormFieldEmail extends FormFieldBase {
	field_type: 'email';
}

export interface FormFieldTel extends FormFieldBase {
	field_type: 'tel';
}

export interface FormFieldDate extends FormFieldBase {
	field_type: 'date';
}

export interface FormFieldSelect extends FormFieldBase {
	field_type: 'select';
	options: FormFieldOption[];
}

export interface FormFieldTextarea extends FormFieldBase {
	field_type: 'textarea';
}

export interface FormFieldSubmit extends FormFieldBase {
	field_type: 'submit';
}

export interface FormFieldHidden extends FormFieldBase {
	field_type: 'hidden';
}

export interface FormFieldParagraph extends FormFieldBase {
	field_type: 'paragraph';
}

export interface FormFieldRadio extends FormFieldBase {
	field_type: 'radio';
	options: FormFieldOption[];
}

export interface FormFieldCheckbox extends FormFieldBase {
	field_type: 'checkbox';
}

export interface FormFieldFile extends FormFieldBase {
	field_type: 'file';
}

// ============================================================================
// Union Type for All Fields
// ============================================================================

/**
 * Union type representing any form field
 */
export type FormField =
	| FormFieldText
	| FormFieldEmail
	| FormFieldTel
	| FormFieldDate
	| FormFieldSelect
	| FormFieldTextarea
	| FormFieldSubmit
	| FormFieldHidden
	| FormFieldParagraph
	| FormFieldRadio
	| FormFieldCheckbox
	| FormFieldFile;

// ============================================================================
// Form Interface
// ============================================================================

/**
 * Dealer Tower form structure
 */
export interface DealerTowerForm {
	/** Unique form identifier (UUID) */
	id: string;

	/** Form title/name */
	title: string;

	/** Form tags (metadata) */
	tags?: Record<string, unknown> | null;

	/** Array of form fields */
	fields: FormField[];
}

// ============================================================================
// API Response Interfaces
// ============================================================================

/**
 * API response when fetching a form
 * Endpoint: GET /public/{dealer_identifier}/v1/form/{form_id}
 */
export interface FormAPIResponse {
	/** Success status */
	success: boolean;

	/** Form data */
	data?: DealerTowerForm;

	/** Error message if success is false */
	error?: string;
}

/**
 * Form list item returned from the forms list API
 * Endpoint: GET /public/{dealer_identifier}/v1/form
 */
export interface FormsListItem {
	/** Form UUID */
	id: string;

	/** Form display label */
	label: string;
}

/**
 * API response when fetching all forms
 * Endpoint: GET /public/{dealer_identifier}/v1/form
 */
export interface FormsListAPIResponse {
	/** Success status */
	success: boolean;

	/** List of available forms */
	data?: FormsListItem[];

	/** Error message if success is false */
	error?: string;
}

/**
 * Form submission data
 */
export interface FormSubmissionData {
	/** Form ID being submitted */
	form_id: string;

	/** Field values (field name -> value) */
	[fieldName: string]: string | string[] | File | undefined;
}

/**
 * API response for form submission
 */
export interface FormSubmissionResponse {
	/** Success status */
	success: boolean;

	/** Success message */
	message?: string;

	/** Error message if success is false */
	error?: string;

	/** Validation errors (field name -> error message) */
	errors?: Record<string, string>;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a field has options
 */
export function fieldHasOptions(
	field: FormField
): field is FormFieldSelect | FormFieldRadio {
	return field.field_type === 'select' || field.field_type === 'radio';
}

/**
 * Type guard to check if a field is a text input type
 */
export function isTextInputField(
	field: FormField
): field is FormFieldText | FormFieldEmail | FormFieldTel | FormFieldTextarea {
	return ['text', 'email', 'tel', 'textarea'].includes(field.field_type);
}

/**
 * Type guard to check if a field accepts file uploads
 */
export function isFileField(field: FormField): field is FormFieldFile {
	return field.field_type === 'file';
}
