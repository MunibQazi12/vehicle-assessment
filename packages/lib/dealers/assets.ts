/**
 * Dealer Assets Utilities
 * 
 * Helper functions for working with dealer-specific assets.
 */

/**
 * Get the URL for a dealer-specific asset
 * 
 * @param assetPath - Relative path to the asset (e.g., 'logo.png', 'images/hero.jpg')
 * @returns URL path that will be resolved by the assets API route
 * 
 * @example
 * ```tsx
 * <img src={getDealerAssetUrl('logo.png')} alt="Logo" />
 * <link rel="icon" href={getDealerAssetUrl('favicon.ico')} />
 * ```
 */
export function getDealerAssetUrl(assetPath: string): string {
  // Remove leading slash if present
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  return `/assets/${cleanPath}`;
}

/**
 * Common dealer asset paths
 */
export const DEALER_ASSETS = {
  LOGO: 'logo.png',
  LOGO_DARK: 'logo-dark.png',
  FAVICON: 'favicon.ico',
  FAVICON_SVG: 'favicon.svg',
  APPLE_TOUCH_ICON: 'apple-touch-icon.png',
  OG_IMAGE: 'og-image.png',
  ROBOTS_TXT: 'robots.txt',
} as const;

/**
 * Get common dealer asset URLs
 * 
 * @example
 * ```tsx
 * const assets = getDealerAssets();
 * <img src={assets.logo} />
 * <link rel="icon" href={assets.favicon} />
 * ```
 */
export function getDealerAssets() {
  return {
    logo: getDealerAssetUrl(DEALER_ASSETS.LOGO),
    logoDark: getDealerAssetUrl(DEALER_ASSETS.LOGO_DARK),
    favicon: getDealerAssetUrl(DEALER_ASSETS.FAVICON),
    faviconSvg: getDealerAssetUrl(DEALER_ASSETS.FAVICON_SVG),
    appleTouchIcon: getDealerAssetUrl(DEALER_ASSETS.APPLE_TOUCH_ICON),
    ogImage: getDealerAssetUrl(DEALER_ASSETS.OG_IMAGE),
    robotsTxt: getDealerAssetUrl(DEALER_ASSETS.ROBOTS_TXT),
  };
}

/**
 * Generate metadata links for dealer-specific favicons and icons
 * Use in app/layout.tsx or page metadata
 */
export function getDealerIconLinks() {
  return [
    {
      rel: 'icon',
      url: getDealerAssetUrl(DEALER_ASSETS.FAVICON),
    },
    {
      rel: 'icon',
      url: getDealerAssetUrl(DEALER_ASSETS.FAVICON_SVG),
      type: 'image/svg+xml',
    },
    {
      rel: 'apple-touch-icon',
      url: getDealerAssetUrl(DEALER_ASSETS.APPLE_TOUCH_ICON),
    },
  ];
}
