/**
 * Head Scripts Component
 * Renders scripts that should be injected in the <head> section
 * Server Component - executes on server, HTML is sent to client
 */

import { WebsiteScript, ScriptLocation } from "@dealertower/types/api";
import { filterScripts } from "@dealertower/lib/scripts/injector";
import { renderScript } from "@dealertower/lib/scripts/renderer";

interface HeadScriptsProps {
  scripts: WebsiteScript[];
  location: ScriptLocation;
}

/**
 * HeadScripts component for server-side script injection
 * These scripts are rendered directly in the HTML without React wrappers
 */
export function HeadScripts({ scripts, location }: HeadScriptsProps) {
  // Check if scripts are enabled via environment variable (0 = disabled, 1 = enabled)
  const scriptsEnabled = process.env.ENABLE_WEBSITE_SCRIPTS !== '0';
  
  if (!scriptsEnabled) {
    return null;
  }
  
  const headScripts = filterScripts(scripts, "head", location);
  
  if (headScripts.length === 0) {
    return null;
  }

  return (
    <>
      {headScripts.map((script, index) => 
        renderScript(script, "head-script", index)
      )}
    </>
  );
}
