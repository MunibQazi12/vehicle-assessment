/**
 * SmartLink Component
 * Universal link component that intelligently handles internal and external URLs
 */

import Link from "next/link";
import { isExternalUrl } from "@dealertower/lib/utils";

interface SmartLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
  target?: string;
  rel?: string;
}

/**
 * Renders appropriate link based on URL type
 * External URLs open in new tab by default, internal URLs use Next.js Link
 */
export default function SmartLink({ 
  href, 
  className, 
  children, 
  external,
  target,
  rel
}: SmartLinkProps) {
  const isExternal = external ?? isExternalUrl(href);
  
  if (isExternal) {
    return (
      <a 
        href={href} 
        className={className} 
        target={target ?? "_blank"} 
        rel={rel ?? "noopener noreferrer"}
      >
        {children}
      </a>
    );
  }
  
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
