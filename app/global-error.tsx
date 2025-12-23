'use client';

import { ErrorDefault } from '@dealertower/components/layout/errors/ErrorDefault';
import { Error404 } from '@dealertower/components/layout/errors/Error404';
import { Error500 } from '@dealertower/components/layout/errors/Error500';
import { Error403 } from '@dealertower/components/layout/errors/Error403';

/**
 * Global Error Boundary (Root Level)
 * Catches errors that occur in the root layout
 * Must include html/body tags since it replaces the entire page
 * Uses default Header and Footer (no dealer customization at this level)
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorCode = getErrorCode(error);
  
  // Select error page based on error code
  let ErrorPage = ErrorDefault;
  if (errorCode === 404) {
    ErrorPage = Error404;
  } else if (errorCode === 500) {
    ErrorPage = Error500;
  } else if (errorCode === 403) {
    ErrorPage = Error403;
  }
  
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col">
          {/* No Header/Footer in global error to avoid TenantProvider dependency */}
          <main className="flex-1">
            <ErrorPage error={error} reset={reset} errorCode={errorCode} />
          </main>
        </div>
      </body>
    </html>
  );
}

function getErrorCode(error: Error): number | undefined {
  const statusMatch = error.message.match(/\b(404|403|401|500|502|503)\b/);
  if (statusMatch) {
    return parseInt(statusMatch[1], 10);
  }
  
  if (error.message.includes('NEXT_NOT_FOUND')) {
    return 404;
  }
  
  return undefined;
}
