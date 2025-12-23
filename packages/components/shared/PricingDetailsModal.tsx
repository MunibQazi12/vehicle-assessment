"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@dealertower/components/ui/dialog";
import { Sheet, SheetContent } from "@dealertower/components/ui/sheet";
import { cn } from "@dealertower/lib/utils/cn";

export interface PricingSummaryValue {
	label: string;
	value: string;
}

export interface PricingDetailRow {
	id?: string | number;
	title: string;
	value: string;
	icon?: ReactNode;
}

interface PricingDetailsModalProps {
	salePrice: PricingSummaryValue;
	comparePrice?: PricingSummaryValue & { strike?: boolean };
	details: PricingDetailRow[];
	title?: string;
	description?: string;
	variant?: "center" | "side";
	renderTrigger?: (props: {
		open: () => void;
		close: () => void;
		isOpen: boolean;
	}) => React.ReactNode;
	renderDetail?: (
		detail: PricingDetailRow,
		index: number,
		close: () => void
	) => ReactNode;
}

/**
 * Pricing details modal with CSS-driven animations.
 * Animations are applied via utility classes (no inline <style>).
 */
export function PricingDetailsModal({
	salePrice,
	comparePrice,
	details,
	title = "Pricing Details",
	description = "Review every discount and adjustment applied to this vehicle.",
	variant = "center",
	renderTrigger,
	renderDetail,
}: PricingDetailsModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const isSideVariant = variant === "side";

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const trigger = useMemo(() => {
		return renderTrigger ? (
			renderTrigger({ open, close, isOpen })
		) : (
			<button
				type='button'
				onClick={open}
				className='flex w-full items-center justify-center rounded-2xl border border-transparent bg-white px-4 py-3 text-sm font-medium text-[#0F172A] transition-colors hover:border-gray-200'
			>
				View Pricing Details
			</button>
		);
	}, [renderTrigger, open, close, isOpen]);

	const centerContentClasses = cn(
		"max-w-lg flex flex-col gap-6",
		"dt-modal-center"
	);

	const sideContentClasses = cn(
		"flex h-full max-w-full flex-col gap-6 border-l border-gray-100 px-6 py-8 sm:w-[420px] sm:max-w-[420px]",
		"dt-modal-side"
	);

	const modalBody = (
		<>
			<DialogHeader className='text-left'>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>

			<div className='rounded-3xl border border-gray-100 bg-[#F8FAFC] p-5'>
				<div className='flex flex-wrap items-start justify-between gap-4'>
					<div>
						<p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
							{salePrice.label}
						</p>
						<p className='text-3xl font-bold text-[#101828]'>
							{salePrice.value}
						</p>
					</div>

					{comparePrice?.value && (
						<div className='text-right'>
							<p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>
								{comparePrice.label}
							</p>
							<p
								className={cn(
									"text-base font-semibold text-gray-400",
									comparePrice.strike ? "line-through" : ""
								)}
							>
								{comparePrice.value}
							</p>
						</div>
					)}
				</div>
			</div>

			<div className='space-y-3'>
				{details.map((detail, index) =>
					renderDetail ? (
						<div key={detail.id ?? detail.title}>
							{renderDetail(detail, index, close)}
						</div>
					) : (
						<div
							key={detail.id ?? `${detail.title}-${index}`}
							className='flex items-center justify-between rounded-2xl bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A]'
						>
							<span className='inline-flex items-center gap-2 font-medium'>
								{detail.icon}
								{detail.title}
							</span>
							<span className='text-right font-semibold text-[#0F172A]'>
								{detail.value}
							</span>
						</div>
					)
				)}
			</div>
		</>
	);

	return isSideVariant ? (
		<Sheet
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			{trigger}
			<SheetContent
				side='right'
				className={sideContentClasses}
			>
				{modalBody}
			</SheetContent>
		</Sheet>
	) : (
		<Dialog
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			{trigger}
			<DialogContent className={centerContentClasses}>
				{modalBody}
			</DialogContent>
		</Dialog>
	);
}
