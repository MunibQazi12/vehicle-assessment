import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
	trailingSlash: true,
	reactStrictMode: process.env.NODE_ENV !== 'production',
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
	},
	// Disable x-powered-by header for security and smaller response
	poweredByHeader: false,
	// Turbopack configuration for Next.js 16
	turbopack: {
		// Enable debug IDs for better debugging in development
		debugIds: process.env.NODE_ENV === 'development',
		// Resolve aliases to prevent Node.js polyfills in browser bundles
		resolveAlias: {
			// Prevent server-only Node.js modules from being bundled in client code
			fs: { browser: './empty.js' },
			path: { browser: './empty.js' },
			os: { browser: './empty.js' },
			crypto: { browser: './empty.js' },
			stream: { browser: './empty.js' },
			http: { browser: './empty.js' },
			https: { browser: './empty.js' },
			zlib: { browser: './empty.js' },
			util: { browser: './empty.js' },
			buffer: { browser: './empty.js' },
			process: { browser: './empty.js' },
		},
		// Custom extensions resolution order (including default extensions)
		resolveExtensions: [
			'.tsx',
			'.ts',
			'.jsx',
			'.js',
			'.mjs',
			'.json',
		],
		// Loader rules for custom file types (add as needed)
		rules: {
			// Handle .md files from node_modules (e.g., @esbuild/win32-x64/README.md)
			// These are included in some packages but should be treated as empty modules
			'*.md': {
				loaders: ['raw-loader'],
				as: '*.js',
			},
			// Example: SVG as React components (uncomment and install @svgr/webpack if needed)
			// '*.svg': {
			//   loaders: ['@svgr/webpack'],
			//   as: '*.js',
			// },
		},
	},
	// Exclude packages that are not compatible with Turbopack bundling
	// These packages have test files, dynamic requires, or native bindings
	// that Turbopack cannot process properly
	serverExternalPackages: [
		// Pino and its dependencies have test files included in node_modules
		'pino',
		'thread-stream',
		'pino-pretty',
		// Drizzle kit has dynamic requires for native bindings
		'drizzle-kit',
		'@libsql/client',
		'@libsql/linux-x64-gnu',
		'@libsql/linux-arm64-gnu',
		'@libsql/win32-x64-msvc',
		'@libsql/darwin-arm64',
		'@libsql/darwin-x64',
		// esbuild native packages
		'@esbuild/win32-x64',
		'@esbuild/linux-x64',
		'@esbuild/darwin-arm64',
		'@esbuild/darwin-x64',
	],
	experimental: {
		// Note: fallbackNodePolyfills is not supported in Turbopack
		// Turbopack does not polyfill Node.js modules by default, which is the desired behavior
		// Use turbopack.resolveAlias to explicitly handle any problematic imports
		optimizePackageImports: [
			// Icon library - tree shake to only include used icons
			'lucide-react',
			// Radix UI primitives - only include components actually used
			'@radix-ui/react-accordion',
			'@radix-ui/react-alert-dialog',
			'@radix-ui/react-checkbox',
			'@radix-ui/react-collapsible',
			'@radix-ui/react-dialog',
			'@radix-ui/react-dropdown-menu',
			'@radix-ui/react-label',
			'@radix-ui/react-popover',
			'@radix-ui/react-scroll-area',
			'@radix-ui/react-select',
			'@radix-ui/react-separator',
			'@radix-ui/react-slider',
			'@radix-ui/react-slot',
			'@radix-ui/react-switch',
			'@radix-ui/react-tabs',
			'@radix-ui/react-toast',
			'@radix-ui/react-toggle',
			'@radix-ui/react-tooltip',
			// Form libraries
			'react-hook-form',
			'@hookform/resolvers',
			// Utility libraries
			'class-variance-authority',
			'clsx',
			'tailwind-merge',
			// Toast and theme libraries
			'sonner',
			'next-themes',
			// Command menu library
			'cmdk',
		],
	},
	// Security headers
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
							"style-src 'self' 'unsafe-inline'",
							"img-src 'self' data: https: http:",
							"font-src 'self' data:",
							"connect-src 'self' https://api.dealertower.com",
							"frame-src *",
							"frame-ancestors *",
							"base-uri 'self'",
							"form-action 'self'",
						].join('; '),
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=()',
					},
				],
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: '**',
			},
			{
				protocol: 'https',
				hostname: '**',
			},
		],
		// Image optimization settings for better mobile performance
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 60,
		// Device sizes matching common mobile/tablet/desktop viewports
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		// Image sizes matching actual rendered sizes (100vw, 50vw, 33vw, 25vw at breakpoints)
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		// Quality settings for image optimization (100 for Payload CMS uploads)
		qualities: [55, 75, 100],
		// Disable optimization in development to avoid localhost private IP errors
		unoptimized: process.env.NODE_ENV === 'development',
	}
};

export default bundleAnalyzer(nextConfig);
