/**
 * Special Card Component
 * Displays a single vehicle special offer in a card format
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@dealertower/lib/utils/cn";
import { Button } from "@dealertower/components/ui/button";
import type { SpecialCardProps } from "@dealertower/types/specials";
import { OfferBadge } from "./OfferBadge";
import { OfferValue } from "./OfferValue";
import { OfferExpiration } from "./OfferExpiration";

export function SpecialCard({
	special,
	primaryColor = "#c8102e",
	priority = false,
	className,
}: SpecialCardProps) {
	const [imageError, setImageError] = useState(false);

	const { condition, year, make, model, trim, imageUrl, imageBlurUrl, offer, shopUrl, reserveUrl, ctaButtons } = special;

	// Build title
	const conditionLabel = condition.charAt(0).toUpperCase() + condition.slice(1);
	const title = `${conditionLabel} ${year} ${model}`;

	// Get value type label
	const valueTypeLabel = offer.valueType === "apr" ? "APR" : "Per Month";

	// Format expiration date
	const expiresAt = offer.expiresAt ? new Date(offer.expiresAt) : undefined;

	return (
		<div
			className={cn(
				"group flex flex-col rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg overflow-hidden",
				className
			)}
		>
			{/* Vehicle Image */}
			<div className="relative aspect-[4/3] w-full bg-zinc-50">
				{imageUrl && !imageError ? (
					<Image
						src={imageUrl}
						alt={`${year} ${make} ${model}${trim ? ` ${trim}` : ""}`}
						fill
						className="object-contain p-4 transition-transform group-hover:scale-105"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
						quality={priority ? 75 : 60}
						priority={priority}
						loading={priority ? "eager" : "lazy"}
						placeholder={imageBlurUrl ? "blur" : "empty"}
						blurDataURL={imageBlurUrl}
						onError={() => setImageError(true)}
					/>
				) : (
					<div className="flex h-full items-center justify-center">
						<span className="text-sm text-zinc-400">No image available</span>
					</div>
				)}
			</div>

			{/* Card Content */}
			<div className="flex flex-1 flex-col p-4">
				{/* Title */}
				<h3 className="text-lg font-bold text-zinc-900">
					{title}
				</h3>

				{/* Trim/Subtitle */}
				{trim && (
					<p className="mt-0.5 text-sm text-zinc-500">{trim}</p>
				)}

				{/* Offer Badge */}
				<div className="mt-4">
					<OfferBadge type={offer.type} valueTypeLabel={valueTypeLabel} />
				</div>

				{/* Offer Value */}
				<div className="mt-2">
					<OfferValue
						value={offer.value}
						valueType={offer.valueType}
						durationMonths={offer.durationMonths}
						dueAtSigning={offer.dueAtSigning}
						primaryColor={primaryColor}
					/>
				</div>

				{/* Expiration */}
				{expiresAt && (
					<div className="mt-3">
						<OfferExpiration
							expiresAt={expiresAt}
							details={offer.details}
						/>
					</div>
				)}

				{/* CTA Buttons */}
				<div className="mt-4 flex flex-col gap-2">
					{/* Custom CTA buttons if provided */}
					{ctaButtons && ctaButtons.length > 0 ? (
						ctaButtons.map((cta, index) => (
							<Button
								key={index}
								asChild
								variant={cta.variant === "primary" ? "default" : cta.variant === "outline" ? "outline" : "secondary"}
								className={cn(
									"w-full",
									cta.variant === "primary" && "text-white"
								)}
								style={cta.variant === "primary" ? { backgroundColor: primaryColor } : undefined}
							>
								<Link href={cta.url}>{cta.label}</Link>
							</Button>
						))
					) : (
						<>
							{/* Default Shop Now button */}
							{shopUrl && (
								<Button
									asChild
									className="w-full text-white"
									style={{ backgroundColor: primaryColor }}
								>
									<Link href={shopUrl}>Shop Now</Link>
								</Button>
							)}

							{/* Default Reserve Now button */}
							{reserveUrl && (
								<Button
									asChild
									variant="outline"
									className="w-full border-2"
									style={{ borderColor: primaryColor, color: primaryColor }}
								>
									<Link href={reserveUrl}>Reserve Now</Link>
								</Button>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
