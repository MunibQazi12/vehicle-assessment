/**
 * Script Location Provider
 * Client component that determines current page location and provides it to script components
 */
"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext } from "react";
import { ScriptLocation } from "@dealertower/types/api";
import { determineLocation } from "@dealertower/lib/scripts/injector";

interface ScriptLocationContextValue {
  location: ScriptLocation;
}

const ScriptLocationContext = createContext<ScriptLocationContextValue>({
  location: "everywhere",
});

export function useScriptLocation() {
  return useContext(ScriptLocationContext);
}

interface ScriptLocationProviderProps {
  children: React.ReactNode;
}

export function ScriptLocationProvider({ children }: ScriptLocationProviderProps) {
  const pathname = usePathname();
  const location = determineLocation(pathname);

  return (
    <ScriptLocationContext.Provider value={{ location }}>
      {children}
    </ScriptLocationContext.Provider>
  );
}
