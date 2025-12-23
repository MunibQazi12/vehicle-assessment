/**
 * Mobile Filters Drawer Component
 * Provides a slide-in drawer for filters on small screens
 */

"use client";

import { useEffect, useRef, useState } from "react";
import type { AvailableFilter, SortingOption } from "@dealertower/types/api";
import { FiltersWrapper } from "./FiltersWrapper";

interface MobileFiltersDrawerProps {
  availableFilters: AvailableFilter[];
  availableSorting: SortingOption[];
}

export function MobileFiltersDrawer({
  availableFilters,
  availableSorting,
}: MobileFiltersDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const openDrawer = () => {
    setIsOpen(true);
    requestAnimationFrame(() => setIsAnimating(true));
  };

  const closeDrawer = () => {
    setIsAnimating(false);
    closeTimeoutRef.current = setTimeout(() => setIsOpen(false), 320);
  };

  if (!availableFilters.length) {
    return null;
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={openDrawer}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-dealer-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-dealer-primary/40"
      >
        <svg
          className="h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h10M4 18h7"
          />
        </svg>
        Filters
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={closeDrawer}
          />

          <div
            className={`relative ml-auto flex h-full w-full max-w-[360px] transform transition-transform duration-300 ${
              isAnimating ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-full w-full flex-col bg-white shadow-2xl">
              <div className="flex items-center justify-end border-b px-5 py-4">
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close filters"
                  className="rounded-md p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                <FiltersWrapper
                  initialAvailableFilters={availableFilters}
                  availableSorting={availableSorting}
                />
              </div>

              <div className="border-t bg-white p-4">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="w-full rounded-lg bg-dealer-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Show results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
