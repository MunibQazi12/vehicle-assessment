/**
 * Footer Wrapper Component
 * 
 * Loads dealer-specific footer if available, otherwise uses default Footer.
 * When LOAD_STATIC_PAGES is false, uses CMS Footer instead.
 * This is a Server Component that dynamically loads the appropriate footer
 */

import { loadDealerFooter } from '@dealertower/lib/dealers/loader';
import type { DealerInfoWithGroup } from '@dealertower/lib/api/dealer';
import { Footer } from './Footer';
import { getTenantHostname } from '@dealertower/lib/tenant/server-context';
import { shouldLoadStaticPages } from '@dealertower/lib/utils/pageLoader';
import { Footer as CMSFooter } from '@dtcms/Footer/Component';

interface FooterWrapperProps {
	websiteInfo: DealerInfoWithGroup | null;
}

export async function FooterWrapper({ websiteInfo }: FooterWrapperProps) {
	// Get tenant context from centralized resolver
	const hostname = await getTenantHostname();

	// If static pages are disabled, use CMS footer
	if (!shouldLoadStaticPages()) {
		return <CMSFooter />;
	}

	// Try to load dealer-specific footer
	const DealerFooter = await loadDealerFooter(hostname);

	// If dealer has custom footer, render it
	if (DealerFooter) {
		return <DealerFooter />;
	}

	// Otherwise use default footer
	return <Footer websiteInfo={websiteInfo} />;
}
