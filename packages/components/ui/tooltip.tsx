'use client'

import type { ReactNode } from "react";
import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from "@dealertower/lib/utils/cn";

// =============================================================================
// Simple CSS-based Tooltip (lightweight, no JS dependencies)
// =============================================================================

type SimpleTooltipProps = {
	content: ReactNode;
	children: ReactNode;
	className?: string;
	position?: "top" | "bottom";
};

/**
 * Lightweight tooltip that relies on Tailwind utilities instead of a JS lib.
 */
export function SimpleTooltip({
	content,
	children,
	className,
	position = "top",
}: SimpleTooltipProps) {
	const verticalPositionClasses =
		position === "top"
			? "bottom-full mb-2 translate-y-1 group-hover/tooltip:translate-y-0 group-focus-within/tooltip:translate-y-0"
			: "top-full mt-2 -translate-y-1 group-hover/tooltip:translate-y-0 group-focus-within/tooltip:translate-y-0";

	return (
		<div className={cn("group/tooltip relative inline-flex", className)}>
			{children}
			<div
				className={cn(
					"pointer-events-none absolute right-0 z-20 whitespace-nowrap rounded bg-zinc-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
					verticalPositionClasses
				)}
				role='tooltip'
			>
				{content}
			</div>
		</div>
	);
}

// =============================================================================
// Radix UI-based Tooltip (feature-rich, for complex use cases)
// =============================================================================

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
