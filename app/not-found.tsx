'use client';

import { useTenantSafe } from '@dealertower/lib/tenant/context';
import { useState, useEffect } from 'react';
import { Error404 } from '@dealertower/components/layout/errors/Error404';

/**
 * Custom 404 Not Found Page
 * Displayed when a route doesn't exist
 * Wrapped with Header and Footer for consistent layout
 * Supports dealer-specific 404 pages
 */

interface Error404ComponentProps {
  errorCode?: number;
}

export default function NotFound() {
  const tenant = useTenantSafe();
  const websiteInfo = tenant?.websiteInfo || null;
  const [Custom404Page, setCustom404Page] = useState<React.ComponentType<Error404ComponentProps> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load404Page() {
      setCustom404Page(null);
      setLoading(false);
      return;
    }

    load404Page();
  }, [websiteInfo]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </main>
    );
  }

  const NotFoundComponent = Custom404Page || Error404;

  return (
    <main className="flex-1">
      <NotFoundComponent />
    </main>
  );
}
