/**
 * Card Pricing Template
 * Badge-style format with prominent discount badge and centered layout
 */

"use client";

import type { SRPVehicle } from "@dealertower/types/api";
import { extractPriceData, calculateTotalSavings } from "./utils";

interface CardPricingProps {
  vehicle: SRPVehicle;
}

export function CardPricing({ vehicle }: CardPricingProps) {
  const priceData = extractPriceData(vehicle);

  const {
    retail_price_formatted,
    sale_price_formatted,
    sale_price_label,
  } = priceData;

  if (!sale_price_formatted) {
    return (
      <div className="mt-4 border-t border-zinc-200 pt-4 text-center">
        <p className="text-lg font-semibold text-zinc-900">Call for Price</p>
      </div>
    );
  }

  const totalSavings = calculateTotalSavings(vehicle);
  const hasDiscount = totalSavings > 0;

  return (
    <div className="mt-4 border-t border-zinc-200 pt-4">
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="mb-3 inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
          SAVE ${totalSavings.toLocaleString("en-US")}
        </div>
      )}

      {/* Pricing Grid */}
      <div className="flex justify-between items-end">
        <div>
          {/* MSRP */}
          {hasDiscount && retail_price_formatted && (
            <div className="mb-1">
              <div className="text-xs text-zinc-500 uppercase">MSRP</div>
              <div className="text-sm text-zinc-500 line-through">{retail_price_formatted}</div>
            </div>
          )}

          {/* Sale Price Label */}
          <div className="text-sm font-semibold text-zinc-900 uppercase">
            {hasDiscount ? 'Sale Price' : sale_price_label}
          </div>
        </div>

        {/* Price */}
        <div className="text-3xl font-bold text-zinc-900">{sale_price_formatted}</div>
      </div>
    </div>
  );
}
