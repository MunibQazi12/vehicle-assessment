/**
 * Dealer Configuration Exports
 * Central export point for dealer-related modules
 */

export {
  getwebsiteInfo,
  haswebsiteInfo,
  getAllDealerHostnames,
  type websiteInfo,
  type DealerTheme,
  type DealerFeatures,
  type DealerContact,
} from './config';

export {
  generateThemeVariables,
  themeToCSSString,
  themeToStyleObject,
  getContrastTextColor,
  generateThemeStyleTag,
  type ThemeVariables,
} from './theme';

// Dealer loader - all page and component loading functions
export {
  // Core
  getDealerId,
  
  // Registry-based route loading (lazy/optimized)
  getDealerRouteLazy,
  getDealerPageMetadataLazy,
  dealerRouteExistsLazy,
  loadDealerPageComponent,
  loadDealerNotFoundComponent,
  getDealerRoutesLazy,
  hasDealerLazyRegistry,
  getDealerDynamicPage,
  createDynamicComponent,
  
  // Ad-hoc component loading (headers, footers, standalone pages)
  loadDealerPage,
  loadDealerHeader,
  loadDealerFooter,
} from './loader';

// Registry map utilities
export {
  getLazyDealerRegistry,
  getLazyDealerRoute,
  getLazyDealerRoutes,
  hasLazyDealerRegistry,
  getRegisteredDealerIds,
} from './registry-map';

export {
  hasDealerStyles,
  loadDealerStyles,
  loadDealerCSSVariables,
  getDealerStylesPath,
  clearDealerStylesCache,
} from './styles';
