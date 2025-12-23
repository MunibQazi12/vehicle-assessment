/**
 * Dealer Page Content Wrapper
 * Server component that loads dealer-specific page with streaming support
 */

import { loadDealerPage } from '@dealertower/lib/dealers/loader';

interface DealerPageContentProps {
  hostname: string;
  pageName: string;
}

/**
 * Dealer Page Content wrapper
 * Loads and renders dealer-specific page component
 */
export async function DealerPageContent({ hostname, pageName }: DealerPageContentProps) {
  const DealerPageComponent = await loadDealerPage(hostname, pageName);
  
  if (!DealerPageComponent) {
    return null;
  }

  return <DealerPageComponent />;
}
