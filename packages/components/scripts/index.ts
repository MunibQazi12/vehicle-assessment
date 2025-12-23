/**
 * Scripts Module Exports
 * Centralized exports for script injection components and utilities
 */

// Components
export { HeadScripts } from "./HeadScripts";
export { BodyScripts, GenericBodyScripts } from "./BodyScripts";
export { SRPScriptsWrapper, VDPScriptsWrapper, HomeScriptsWrapper } from "./ScriptsWrapper";
export { ScriptLocationProvider, useScriptLocation } from "./ScriptLocationProvider";

// Utilities (re-export from lib)
export {
  filterScripts,
  determineLocation,
  sanitizeScriptContent,
  extractScriptAttributes,
  isExternalScript,
  isInlineContent,
} from "@dealertower/lib/scripts/injector";

// Types (re-export from types)
export type {
  WebsiteScript,
  ScriptPlace,
  ScriptLocation,
} from "@dealertower/types/api";
