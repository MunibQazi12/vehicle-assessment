'use client';

import Link from 'next/link';

/**
 * Vehicle Not Found Page
 * Displayed when a vehicle with the given slug cannot be found
 * This provides a more specific message than the generic 404 page
 */
export default function VehicleNotFound() {
  return (
    <main className="flex-1">
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16">
        <div className="max-w-md w-full rounded-lg bg-white p-8 shadow-lg text-center">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Vehicle Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The vehicle you&apos;re looking for is no longer available. It may have been sold or the listing has expired.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link
              href="/new-vehicles"
              className="w-full rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition-colors inline-block"
            >
              Browse New Vehicles
            </Link>
            <Link
              href="/used-vehicles"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors inline-block"
            >
              Browse Used Vehicles
            </Link>
            <Link
              href="/"
              className="w-full text-gray-600 hover:text-gray-900 transition-colors py-2"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
