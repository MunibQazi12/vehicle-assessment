import React from "react";

/**
 * Minimal root layout that serves as a passthrough.
 * 
 * This layout exists because Next.js requires a root layout, but we have two
 * separate layout needs:
 * 1. The main site (/(site)) - with full dealer theming, header, footer
 * 2. Payload CMS admin (/(payload)) - with its own complete HTML structure
 * 
 * Each route group has its own layout.tsx that renders the full <html> element.
 * This root layout simply passes children through to allow each group to
 * define its own HTML structure.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
