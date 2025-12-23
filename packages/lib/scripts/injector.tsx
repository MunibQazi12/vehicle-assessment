/**
 * Script Injector Utilities
 * Handles injection of website scripts based on location and placement
 */

import { WebsiteScript, ScriptLocation, ScriptPlace } from "@dealertower/types/api";

/**
 * Filter scripts by placement and location
 * 
 * @param scripts - All website scripts
 * @param place - Where to inject (head, before_body, after_body, body)
 * @param currentLocation - Current page location (everywhere, srp, vdp, srp_vdp, home)
 * @returns Filtered scripts
 */
export function filterScripts(
  scripts: WebsiteScript[],
  place: ScriptPlace,
  currentLocation: ScriptLocation
): WebsiteScript[] {
  return scripts.filter((script) => {
    // Filter by place
    if (script.place !== place) return false;
    
    // Filter by location
    if (script.location === "everywhere") return true;
    
    // Handle srp_vdp location (both SRP and VDP pages)
    if (script.location === "srp_vdp") {
      return currentLocation === "srp" || currentLocation === "vdp" || currentLocation === "srp_vdp";
    }
    
    // Match exact location
    return script.location === currentLocation;
  });
}

/**
 * Determine current page location based on pathname
 * 
 * @param pathname - Current route pathname
 * @returns Location identifier
 */
export function determineLocation(pathname: string): ScriptLocation {
  // Homepage
  if (pathname === "/") return "home";
  
  // SRP pages
  if (pathname.startsWith("/new-vehicles") || pathname.startsWith("/used-vehicles")) {
    // If it's a specific vehicle detail page (would have UUID or VIN pattern)
    // For now, treat all SRP routes as SRP since VDP is not implemented yet
    return "srp";
  }
  
  // VDP pages (when implemented)
  // This would check for vehicle detail page patterns
  // if (pathname.match(/\/vehicle\/[a-z0-9-]+/)) return "vdp";
  
  // Default to everywhere
  return "everywhere";
}

/**
 * Parse and sanitize script content
 * Removes script tags if they wrap the content
 * 
 * @param content - Raw script content from API
 * @returns Sanitized script content
 */
export function sanitizeScriptContent(content: string): string {
  // Remove wrapping <script> tags if present
  let sanitized = content.trim();
  
  // Remove opening script tag
  sanitized = sanitized.replace(/^<script[^>]*>/i, "");
  
  // Remove closing script tag
  sanitized = sanitized.replace(/<\/script>$/i, "");
  
  return sanitized.trim();
}

/**
 * Extract script attributes from content
 * Useful for preserving async, defer, type, etc.
 * 
 * @param content - Raw script content
 * @returns Object with script attributes
 */
export function extractScriptAttributes(content: string): Record<string, string | boolean> {
  const attributes: Record<string, string | boolean> = {};
  
  // Match script tag attributes
  const scriptTagMatch = content.match(/<script([^>]*)>/i);
  if (!scriptTagMatch) return attributes;
  
  const attributesString = scriptTagMatch[1];
  
  // Extract type attribute
  const typeMatch = attributesString.match(/type=["']([^"']+)["']/i);
  if (typeMatch) {
    attributes.type = typeMatch[1];
  }
  
  // Extract src attribute
  const srcMatch = attributesString.match(/src=["']([^"']+)["']/i);
  if (srcMatch) {
    attributes.src = srcMatch[1];
  }
  
  // Check for async
  if (/\basync\b/i.test(attributesString)) {
    attributes.async = true;
  }
  
  // Check for defer
  if (/\bdefer\b/i.test(attributesString)) {
    attributes.defer = true;
  }
  
  return attributes;
}

/**
 * Check if content is an external script (has src attribute)
 * 
 * @param content - Script content
 * @returns True if external script
 */
export function isExternalScript(content: string): boolean {
  return /<script[^>]+src=["'][^"']+["']/i.test(content);
}

/**
 * Check if content is inline script or HTML
 * 
 * @param content - Script content
 * @returns True if inline script or HTML
 */
export function isInlineContent(content: string): boolean {
  // Check if it's a script tag with inline content
  if (content.includes("<script") && !isExternalScript(content)) {
    return true;
  }
  
  // Check if it's other HTML content (meta tags, noscript, etc.)
  return content.trim().startsWith("<") && !content.includes("<script");
}
