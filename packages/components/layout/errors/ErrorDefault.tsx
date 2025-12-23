'use client';

import Link from 'next/link';

/**
 * Default Error Page
 * Generic fallback error page with retry functionality
 */

interface ErrorDefaultProps {
  error: Error & { digest?: string };
  reset?: () => void;
  errorCode?: number;
}

export function ErrorDefault({ error, reset, errorCode }: ErrorDefaultProps) {
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            {errorCode ? `Error ${errorCode}` : 'Something Went Wrong'}
          </h1>
          <p className="text-zinc-600 mb-4">
            {error.message || 'An unexpected error occurred. Please try again.'}
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
