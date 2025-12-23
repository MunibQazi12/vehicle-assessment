/**
 * Dealer Information Display Component
 * Shows dealer address, phone, and work hours
 */

"use client";

import { memo } from "react";
import { ChevronLeftIcon, MapPinIcon, PhoneIcon } from "@dealertower/svgs/icons/icons";
import type { DayRangeHours } from "@dealertower/lib/utils/hours";

interface DealerInfoDisplayProps {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  phoneNumbers?: string[];
  workHours: {
    label: string;
    hours: DayRangeHours[];
  }[];
  onBack?: () => void;
  showBackButton?: boolean;
}

function DealerInfoDisplayComponent({
  address,
  city,
  state,
  zip,
  phoneNumbers,
  workHours,
  onBack,
  showBackButton = true,
}: DealerInfoDisplayProps) {
  return (
    <div className="space-y-6 mb-2">
      {/* Go Back Button */}
      {showBackButton && (
        <button
          onClick={() => onBack?.()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          aria-label="Go back to pricing"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          <span className="font-medium">Go Back</span>
        </button>
      )}

      {/* Dealer Information Content */}
      <div className="space-y-6">
        {/* Address Section */}
        {address && city && state && zip && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Address:</h3>
            <div className="flex gap-3">
              <MapPinIcon className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
              <div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${address}, ${city}, ${state} ${zip}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-blue-600 underline transition-colors"
                >
                  {address}
                </a>
                <p className="text-gray-900">
                  {city}, {state} {zip}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Phone Section */}
        {phoneNumbers && phoneNumbers.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Phone:</h3>
            <div className="flex gap-3">
              <PhoneIcon className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
              <a
                href={`tel:${phoneNumbers[0]}`}
                className="text-gray-900 hover:text-blue-600 underline transition-colors"
              >
                {phoneNumbers[0]}
              </a>
            </div>
          </div>
        )}

        {/* Work Hours */}
        {workHours.length > 0 &&
          workHours.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {section.label}
              </h3>
              <div className="space-y-2 text-gray-900">
                {section.hours.map((hours, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span>{hours.dayRange}</span>
                    <span className="text-right">{hours.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export const DealerInfoDisplay = memo(DealerInfoDisplayComponent);
