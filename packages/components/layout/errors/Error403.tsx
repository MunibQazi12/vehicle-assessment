'use client';

import Link from 'next/link';

/**
 * 403 Forbidden Error Page
 * Displayed when access to a resource is forbidden
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface _Error403Props {
  error?: Error & { digest?: string };
  reset?: () => void;
  errorCode?: number;
}

export function Error403() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="max-w-md w-full rounded-lg bg-white p-8 shadow-lg text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <svg
              className="h-8 w-8 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">
            403 - Access Forbidden
          </h1>
          <p className="text-zinc-600 mb-4">
            You don&apos;t have permission to access this page or resource.
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
