/**
 * Error Page Wrapper Component
 * 
 * Wraps error pages with dealer-specific or default header/footer
 * Supports custom error pages per dealer and per error code
 * 
 * This is a Server Component that wraps error content
 */

import { loadDealerHeader, loadDealerFooter } from '@dealertower/lib/dealers/loader';
import type { DealerInfoWithGroup } from '@dealertower/lib/api/dealer';
import { getTenantHostname } from '@dealertower/lib/tenant/server-context';
import { Header } from './Header';
import { Footer } from './Footer';

interface ErrorPageWrapperProps {
  errorCode?: number;
  error: Error & { digest?: string };
  reset?: () => void;
  websiteInfo?: DealerInfoWithGroup | null;
}

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset?: () => void;
  errorCode?: number;
}

/**
 * Get HTTP status code from error
 * Uses error.digest or tries to parse from error message
 */
function getErrorCode(error: Error): number | undefined {
  // Check if error message contains status code
  const statusMatch = error.message.match(/\b(404|403|401|500|502|503)\b/);
  if (statusMatch) {
    return parseInt(statusMatch[1], 10);
  }
  
  // Check for Next.js notFound() error
  if (error.message.includes('NEXT_NOT_FOUND')) {
    return 404;
  }
  
  return undefined;
}

export async function ErrorPageWrapper({ 
  errorCode, 
  error, 
  reset,
  websiteInfo = null
}: ErrorPageWrapperProps) {
  // Get tenant context from centralized resolver
  const hostname = await getTenantHostname();

  // Determine the error code to use
  const finalErrorCode = errorCode || getErrorCode(error);

  // Try to load dealer-specific components
  const [DealerHeader, DealerFooter] = await Promise.all([
    loadDealerHeader(hostname),
    loadDealerFooter(hostname),
  ]);

  // Otherwise, use default error page based on error code
  const DefaultErrorPage = await loadDefaultErrorPage(finalErrorCode);

  return (
    <div className="flex min-h-screen flex-col">
      {DealerHeader ? <DealerHeader /> : <Header websiteInfo={websiteInfo} />}
      <main className="flex-1">
        <DefaultErrorPage error={error} reset={reset} errorCode={finalErrorCode} />
      </main>
      {DealerFooter ? <DealerFooter /> : <Footer websiteInfo={websiteInfo} />}
    </div>
  );
}

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset?: () => void;
  errorCode?: number;
}

/**
 * Load default error page component based on error code
 */
async function loadDefaultErrorPage(errorCode?: number): Promise<React.ComponentType<ErrorPageProps>> {
  try {
    if (errorCode === 404) {
      const { Error404 } = await import('@dealertower/components/layout/errors/Error404');
      return Error404;
    } else if (errorCode === 500) {
      const { Error500 } = await import('@dealertower/components/layout/errors/Error500');
      return Error500;
    } else if (errorCode === 403) {
      const { Error403 } = await import('@dealertower/components/layout/errors/Error403');
      return Error403;
    }
  } catch (error) {
    console.warn(`[ErrorPageWrapper] Failed to load error page for code ${errorCode}`, error);
  }

  // Fallback to default error page
  const { ErrorDefault } = await import('@dealertower/components/layout/errors/ErrorDefault');
  return ErrorDefault;
}
