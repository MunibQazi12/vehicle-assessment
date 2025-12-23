'use client';

import Link from 'next/link';

/**
 * 500 Server Error Page
 * Displayed when a server-side error occurs
 */

interface Error500Props {
  error: Error & { digest?: string };
  reset?: () => void;
  errorCode?: number;
}

export function Error500({ error, reset }: Error500Props) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="max-w-md w-full rounded-lg bg-white p-8 shadow-lg text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            500 - Server Error
          </h1>
          <p className="text-zinc-600 mb-4">
            {error.message || 'Something went wrong on our end. Please try again later.'}
          </p>
          {error.digest && (
            <p className="text-sm text-zinc-400 mb-4">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        
        <div className="flex flex-col gap-3">
          {reset && (
            <button
              onClick={reset}
              className="w-full rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
          <Link
            href="/"
            className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-700 font-medium hover:bg-zinc-50 transition-colors inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
