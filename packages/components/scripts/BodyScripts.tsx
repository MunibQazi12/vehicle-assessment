/**
 * Body Scripts Component
 * Renders scripts that should be injected in the body (before_body, after_body, body)
 * Server Component - executes on server, HTML is sent to client
 */

import { WebsiteScript, ScriptLocation, ScriptPlace } from "@dealertower/types/api";
import { filterScripts } from "@dealertower/lib/scripts/injector";
import { renderScript } from "@dealertower/lib/scripts/renderer";

interface BodyScriptsProps {
  scripts: WebsiteScript[];
  location: ScriptLocation;
  position: "before" | "after";
}

/**
 * BodyScripts component for server-side script injection in body
 * Position determines where in body to render (start or end)
 */
export function BodyScripts({ scripts, location, position }: BodyScriptsProps) {
  // Check if scripts are enabled via environment variable (0 = disabled, 1 = enabled)
  const scriptsEnabled = process.env.ENABLE_WEBSITE_SCRIPTS !== '0';
  
  if (!scriptsEnabled) {
    return null;
  }
  
  const place: ScriptPlace = position === "before" ? "before_body" : "after_body";
  const bodyScripts = filterScripts(scripts, place, location);
  
  if (bodyScripts.length === 0) {
    return null;
  }

  return (
    <>
      {bodyScripts.map((script, index) => 
        renderScript(script, `body-script-${position}`, index)
      )}
    </>
  );
}

/**
 * Generic body scripts component that handles the "body" placement
 * This is for scripts that don't specify before or after
 */
interface GenericBodyScriptsProps {
  scripts: WebsiteScript[];
  location: ScriptLocation;
}

export function GenericBodyScripts({ scripts, location }: GenericBodyScriptsProps) {
  // Check if scripts are enabled via environment variable (0 = disabled, 1 = enabled)
  const scriptsEnabled = process.env.ENABLE_WEBSITE_SCRIPTS !== '0';
  
  if (!scriptsEnabled) {
    return null;
  }
  
  const bodyScripts = filterScripts(scripts, "body", location);
  
  if (bodyScripts.length === 0) {
    return null;
  }

  return (
    <>
      {bodyScripts.map((script, index) => 
        renderScript(script, "body-generic-script", index)
      )}
    </>
  );
}
