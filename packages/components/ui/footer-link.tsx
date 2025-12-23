/**
 * FooterLink Component
 * Reusable link component that handles both internal and external URLs
 */

import Link from "next/link";
import { isExternalUrl } from "@dealertower/lib/utils";

interface FooterLinkProps {
  url: string;
  className: string;
  children: React.ReactNode;
  external?: boolean;
}

/**
 * Renders a link that opens external URLs in new tab, internal URLs with Next.js Link
 */
export default function FooterLink({ 
  url, 
  className, 
  children, 
  external 
}: FooterLinkProps) {
  const isExternal = external ?? isExternalUrl(url);
  
  if (isExternal) {
    return (
      <a href={url} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  
  return (
    <Link href={url} className={className}>
      {children}
    </Link>
  );
}
