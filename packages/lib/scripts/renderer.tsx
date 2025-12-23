/**
 * Script Renderer Utility
 * Shared logic for rendering scripts consistently across head and body
 */

import React from "react";
import { WebsiteScript } from "@dealertower/types/api";
import { sanitizeScriptContent, extractScriptAttributes, isExternalScript } from "./injector";

/**
 * Renders a single script with consistent logic for external, inline, and HTML content
 * @param script - The script to render
 * @param keyPrefix - Unique prefix for React key
 * @param index - Index for unique key generation
 * @returns React element for the script
 */
export function renderScript(script: WebsiteScript, keyPrefix: string, index: number): React.ReactElement {
  const key = `${keyPrefix}-${script.name}-${index}`;
  
  // For external scripts
  if (isExternalScript(script.content)) {
    const attrs = extractScriptAttributes(script.content);
    return (
      <script
        key={key}
        src={attrs.src as string}
        type={(attrs.type as string) || "text/javascript"}
        async={attrs.async === true}
        defer={attrs.defer === true}
      />
    );
  }
  
  // For inline scripts - inject as is
  const sanitizedContent = sanitizeScriptContent(script.content);
  
  // If content contains HTML tags (meta, link, noscript, iframe, comments)
  if (
    script.content.trim().startsWith("<meta") || 
    script.content.trim().startsWith("<link") ||
    script.content.includes("<noscript") || 
    script.content.includes("<iframe") ||
    script.content.includes("<!--")
  ) {
    return (
      <div
        key={key}
        dangerouslySetInnerHTML={{ __html: script.content }}
        suppressHydrationWarning
      />
    );
  }
  
  // For pure script content
  return (
    <script
      key={key}
      type="text/javascript"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      suppressHydrationWarning
    />
  );
}
