/**
 * Header Wrapper Component
 * 
 * Loads dealer-specific header if available, otherwise uses default Header.
 * When LOAD_STATIC_PAGES is false, uses CMS Header instead.
 * Server-side loading prevents header flash on initial page load
 */

import { loadDealerHeader } from '@dealertower/lib/dealers/loader';
import type { DealerInfoWithGroup } from '@dealertower/lib/api/dealer';
import { Header } from './Header';
import { getTenantHostname } from '@dealertower/lib/tenant/server-context';
import { shouldLoadStaticPages } from '@dealertower/lib/utils/pageLoader';
import { Header as CMSHeader } from '@dtcms/Header/Component';

interface HeaderWrapperProps {
	websiteInfo: DealerInfoWithGroup | null;
}

export async function HeaderWrapper({ websiteInfo }: HeaderWrapperProps) {
	const hostname = await getTenantHostname();

	// If static pages are disabled, use CMS header
	if (!shouldLoadStaticPages()) {
		return <CMSHeader />;
	}

	// Try to load dealer-specific header server-side
	const DealerHeader = await loadDealerHeader(hostname);

	if (DealerHeader) {
		return <DealerHeader />;
	}

	return <Header websiteInfo={websiteInfo} />;
}
