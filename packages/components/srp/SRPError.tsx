'use client';

import { ErrorDefault } from '@dealertower/components/layout/errors/ErrorDefault';
import { Error404 } from '@dealertower/components/layout/errors/Error404';
import { Error500 } from '@dealertower/components/layout/errors/Error500';
import { Error403 } from '@dealertower/components/layout/errors/Error403';

/**
 * SRP-specific Error Boundary
 * Uses default error components (dealer-specific error pages not supported in client error boundaries)
 */

export default function SRPError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorCode = getErrorCode(error);

  if (errorCode === 404) {
    return <Error404 />;
  } else if (errorCode === 500) {
    return <Error500 error={error} reset={reset} />;
  } else if (errorCode === 403) {
    return <Error403 />;
  }

  return <ErrorDefault error={error} reset={reset} errorCode={errorCode} />;
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
