'use client';

import Link from 'next/link';

/**
 * 404 Not Found Error Page
 * Displayed when a page or resource cannot be found
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface _Error404Props {
  error?: Error & { digest?: string };
  reset?: () => void;
  errorCode?: number;
}

export function Error404() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-zinc-50 px-4 py-16">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            404 - Page Not Found
          </h1>
          <p className="text-zinc-600 mb-4">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition-colors inline-block"
          >
            Go to Home
          </Link>
          <Link
            href="/new-vehicles"
            className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-700 font-medium hover:bg-zinc-50 transition-colors inline-block"
          >
            Browse Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
