/**
 * Vehicle condition, stock, and VIN display with copy to clipboard actions.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SRPVehicle } from "@dealertower/types/api";

type CopyField = "stock" | "vin";

interface VehicleConditionProps {
	vehicle: Pick<SRPVehicle, "condition" | "stock_number" | "vin_number">;
}

export function VehicleCondition({ vehicle }: VehicleConditionProps) {
	const { condition, stock_number, vin_number } = vehicle;
	const normalizedCondition = condition?.toLowerCase();
	const conditionColorMap: Record<string, string> = {
		new: "text-[#0e7443]",
		certified: "text-[#b20b0b]",
		used: "text-[#0851c4]",
	};
	const conditionColorClass =
		normalizedCondition && conditionColorMap[normalizedCondition]
			? conditionColorMap[normalizedCondition]
			: "text-zinc-900";
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
			if (!value) return;

			const success = await copyToClipboard(value);
			if (!success) return;

			setCopiedField(field);
			if (resetTimeoutRef.current) {
				window.clearTimeout(resetTimeoutRef.current);
			}
			resetTimeoutRef.current = window.setTimeout(
				() => setCopiedField(null),
				3000
			);
		},
		[]
	);

	if (!condition && !stock_number && !vin_number) {
		return null;
	}

	return (
		<div className='flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-zinc-500'>
			{condition && (
				<span className={`font-semibold uppercase ${conditionColorClass}`}>
					{condition === "new" ? "NEW" : condition.toUpperCase()}
				</span>
			)}

			{stock_number && (
				<CopyableValue
					field='stock'
					label='Stock'
					displayValue={`#${stock_number}`}
					value={stock_number}
					isCopied={copiedField === "stock"}
					onCopy={handleCopy}
					showLabel={false}
				/>
			)}

			{vin_number && (
				<CopyableValue
					field='vin'
					label='VIN'
					displayValue='VIN'
					value={vin_number}
					isCopied={copiedField === "vin"}
					onCopy={handleCopy}
					showLabel={false}
				/>
			)}
		</div>
	);
}

interface CopyableValueProps {
	field: CopyField;
	label: string;
	displayValue: string;
	value: string;
	isCopied: boolean;
	onCopy: (field: CopyField, value: string) => void;
	showLabel?: boolean;
}

function CopyableValue({
	field,
	label,
	displayValue,
	value,
	isCopied,
	onCopy,
	showLabel = true,
}: CopyableValueProps) {
	return (
		<button
			type='button'
			onClick={() => onCopy(field, value)}
			className='inline-flex cursor-pointer items-center gap-1 rounded border border-transparent px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500 transition hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-zinc-400 min-h-[44px] min-w-[44px]'
			aria-label={`Copy ${label}`}
			title={`Copy ${label} ${value}`}
		>
			{showLabel && <span>{label}</span>}
			<span className='font-semibold text-zinc-900'>
				{isCopied ? "Copied" : displayValue}
			</span>
		</button>
	);
}

async function copyToClipboard(value: string) {
	if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
		try {
			await navigator.clipboard.writeText(value);
			return true;
		} catch {
			// Fall through to manual copy
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
