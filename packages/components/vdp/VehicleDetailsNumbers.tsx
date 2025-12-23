/**
 * Displays VIN and stock numbers with copy-to-clipboard actions.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyField = "stock" | "vin";

interface VehicleDetailsNumbersProps {
	stockNumber?: string | null;
	vinNumber?: string | null;
}

export function VehicleDetailsNumbers({
	stockNumber,
	vinNumber,
}: VehicleDetailsNumbersProps) {
	const [copiedField, setCopiedField] = useState<CopyField | null>(null);
	const resetTimeoutRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (resetTimeoutRef.current) {
				window.clearTimeout(resetTimeoutRef.current);
			}
		};
	}, []);

	const handleCopy = useCallback(
		async (field: CopyField, value?: string | null) => {
			if (!value) {
				return;
			}

			const success = await copyToClipboard(value);
			if (!success) {
				return;
			}

			setCopiedField(field);
			if (resetTimeoutRef.current) {
				window.clearTimeout(resetTimeoutRef.current);
			}
			resetTimeoutRef.current = window.setTimeout(
				() => setCopiedField(null),
				2000
			);
		},
		[]
	);

	const items = [
		{ label: "Stock #", value: stockNumber, field: "stock" as const },
		{ label: "VIN", value: vinNumber, field: "vin" as const },
	].filter((item) => item.value);

	if (items.length === 0) {
		return null;
	}

	return (
		<div className='hidden xl:flex flex-wrap items-center gap-3'>
			{items.map((item) => (
				<button
					key={item.field}
					type='button'
					onClick={() => handleCopy(item.field, item.value)}
					className='group flex items-center gap-3 px-4 py-2 text-left text-[#475467] transition hover:border-[var(--color-dealer-primary)] hover:text-[#101828] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-dealer-primary)]'
					aria-label={`Copy ${item.label} ${item.value}`}
					title={`Copy ${item.label} ${item.value}`}
				>
					<div className='flex flex-col md:flex-row gap-2 leading-tight items-center hover:cursor-pointer'>
						<span className='text-Base font-medium tracking-wide text-[#98A2B3]'>
							{item.label}
						</span>
						<span
							className={`font-semibold ${
								copiedField === item.field
									? "text-[var(--color-dealer-primary)]"
									: "text-[#101828]"
							}`}
						>
							{copiedField === item.field ? "Copied" : item.value}
						</span>
					</div>
					<div className='flex items-center gap-1 hover:cursor-pointer'>
						{copiedField === item.field ? (
							<Check className='h-4 w-4 text-[var(--color-dealer-primary)]' />
						) : (
							<Copy className='h-4 w-4 text-[#98A2B3] transition group-hover:text-[var(--color-dealer-primary)]' />
						)}
					</div>
				</button>
			))}
		</div>
	);
}

async function copyToClipboard(value: string) {
	if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(value);
			return true;
		} catch {
			// Fall back to manual copy
		}
	}

	if (typeof document === "undefined") {
		return false;
	}

	try {
		const textarea = document.createElement("textarea");
		textarea.value = value;
		textarea.style.position = "fixed";
		textarea.style.left = "-9999px";
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();
		document.execCommand("copy");
		document.body.removeChild(textarea);
		return true;
	} catch {
		return false;
	}
}
