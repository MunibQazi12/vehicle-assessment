/**
 * Compact Pricing Template
 * Minimal format showing only final price with optional MSRP strikethrough
 */

"use client";

import type { SRPVehicle } from "@dealertower/types/api";
import { extractPriceData } from "./utils";

interface CompactPricingProps {
  vehicle: SRPVehicle;
}

export function CompactPricing({ vehicle }: CompactPricingProps) {
  const priceData = extractPriceData(vehicle);

  const {
    retail_price_formatted,
    retail_price_label,
    sale_price_formatted,
    sale_price_label,
  } = priceData;

  if (!sale_price_formatted) {
    return (
      <div className="mt-4 border-t border-zinc-200 pt-4">
        <p className="text-lg font-semibold text-zinc-900">Call for Price</p>
      </div>
    );
  }

  const hasDiscount = retail_price_formatted && retail_price_formatted !== sale_price_formatted;

  return (
    <div className="mt-4 border-t border-zinc-200 pt-4">
      {/* MSRP Strikethrough (if discounted) */}
      {hasDiscount && retail_price_label && (
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-xs text-zinc-500 uppercase">{retail_price_label}</span>
          <span className="text-sm text-zinc-500 line-through">{retail_price_formatted}</span>
        </div>
      )}

      {/* Sale Price */}
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-semibold text-zinc-900 uppercase">
          {hasDiscount ? 'Sale Price' : sale_price_label}
        </span>
        <span className="text-2xl font-bold text-zinc-900">{sale_price_formatted}</span>
      </div>
    </div>
  );
}
