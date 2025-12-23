/**
 * FormSSR Component (Server Component)
 * Server-side rendered form component - fetches form data server-side
 * Use this in server components for better performance and SEO
 */

import { fetchForm } from "@dealertower/lib/api/forms";
import { FormClient } from "./FormClient";
import { getTenantHostname } from "@dealertower/lib/tenant/server-context";

interface FormSSRProps {
	/** Form UUID to fetch and render */
	formId: string;
	/** Optional className for the wrapper */
	className?: string;
}

/**
 * Server-side rendered form component
 * Fetches form data at build/request time on the server
 * 
 * @example
 * ```tsx
 * // In a server component (no 'use client' directive)
 * export default async function ContactPage() {
 *   return (
 *     <div>
 *       <h1>Contact Us</h1>
 *       <FormSSR formId="7622186d-9727-4be5-b775-91b4ab0aefc5" />
 *     </div>
 *   );
 * }
 * ```
 */
export async function FormSSR({ formId, className = "" }: FormSSRProps) {
	const hostname = await getTenantHostname();

	// Fetch form server-side
	const formResponse = await fetchForm(hostname, formId);

	if (!formResponse.success || !formResponse.data) {
		return (
			<div className={`p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
				<p className="text-red-700">Unable to load form. Please try again later.</p>
			</div>
		);
	}

	// Render with client component for interactivity
	// Form data is pre-loaded from server, no loading state needed
	return (
		<FormClient
			formId={formId}
			initialForm={formResponse.data}
			className={className}
		/>
	);
}
