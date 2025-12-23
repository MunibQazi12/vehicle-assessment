/**
 * Split Pricing Template
 * Two-column layout with MSRP on left, Sale Price on right
 */

"use client";

import type { SRPVehicle } from "@dealertower/types/api";
import { extractPriceData, calculateTotalSavings } from "./utils";

interface SplitPricingProps {
  vehicle: SRPVehicle;
}

export function SplitPricing({ vehicle }: SplitPricingProps) {
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

  const totalSavings = calculateTotalSavings(vehicle);
  const hasDiscount = totalSavings > 0;

  return (
    <div className="mt-4 border-t border-zinc-200 pt-4">
      <div className="grid grid-cols-2 gap-4">
        {/* MSRP Column */}
        {hasDiscount && retail_price_formatted && (
          <div className="text-center">
            <div className="text-xs text-zinc-500 uppercase mb-1">{retail_price_label}</div>
            <div className="text-lg text-zinc-500 line-through">{retail_price_formatted}</div>
            <div className="text-xs text-red-600 font-semibold mt-1">
              -{totalSavings.toLocaleString("en-US")} OFF
            </div>
          </div>
        )}

        {/* Sale Price Column */}
        <div className={`text-center ${!hasDiscount ? 'col-span-2' : ''}`}>
          <div className="text-xs text-zinc-900 uppercase font-semibold mb-1">
            {hasDiscount ? 'Sale Price' : sale_price_label}
          </div>
          <div className="text-2xl text-zinc-900 font-bold">{sale_price_formatted}</div>
        </div>
      </div>
    </div>
  );
}
