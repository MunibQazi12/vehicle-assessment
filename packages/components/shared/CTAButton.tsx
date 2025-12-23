/**
 * CTA Button Component
 * Renders vehicle CTA buttons with various configurations (form, link, custom HTML)
 */

"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { CTAButton } from "@dealertower/types/api";
import { useIsMobile } from "@dealertower/lib/hooks/useMobile";

// Lazy load form modals - only load when needed
const FormModalSRP = dynamic(
  () => import("@dealertower/components/forms/FormModalSRP").then((mod) => ({ default: mod.FormModalSRP })),
  { ssr: false }
);

interface CTAButtonProps {
  cta: CTAButton;
  /** Vehicle condition for filtering CTAs */
  condition?: string;
  /** Current page location: 'srp' or 'vdp' (for pages, use Form component instead) */
  location: "srp" | "vdp";
  /** Custom className to override or extend default styling */
  className?: string;
  /** Vehicle data to pre-fill form fields and display in modal */
  vehicleData?: {
    vehicle_id?: string;
    dealer_ids?: string[];
    vin_number?: string;
    stock_number?: string;
    title?: string;
    subtitle?: string;
    photo?: string;
    price?: number;
    retail_price?: number;
    sale_price?: number;
  };
  /** Callback when form should be opened inline (VDP only) */
  onOpenForm?: (formId: string) => void;
	/** Optional icon to display before the label */
	icon?: React.ReactNode;
}

/**
 * Check if CTA should be displayed based on device type
 */
const useDeviceVisibility = (device: CTAButton["device"]): boolean => {
	// Shared mobile detection hook (returns boolean; false by default during SSR)
	const isMobile = useIsMobile();

  // Derive visibility from device type and detected mobile state
  if (device === "both") return true;
  return device === "mobile" ? isMobile : !isMobile;
};

/**
 * Check if CTA should be displayed based on vehicle condition
 */
const shouldShowForCondition = (
  cta: CTAButton,
  condition?: string
): boolean => {
  // Empty conditions array = show for all
  if (!cta.cta_conditions || cta.cta_conditions.length === 0) {
    return true;
  }

  // Match vehicle condition against CTA conditions
  return condition
    ? cta.cta_conditions.includes(condition as "new" | "used" | "certified")
    : false;
};

/**
 * Check if CTA should be displayed based on page location
 */
const shouldShowForLocation = (
  cta: CTAButton,
  location: "srp" | "vdp"
): boolean => {
  return cta.cta_location === "both" || cta.cta_location === location;
};

/**
 * Generate inline styles from btn_styles configuration
 */
const generateInlineStyles = (
  styles: CTAButton["btn_styles"]
): React.CSSProperties => {
  if (!styles) return {};

  return {
    color: styles.text_color,
    backgroundColor: styles.bg,
    // Hover styles handled via CSS custom properties
    ["--hover-color" as string]: styles.text_hover_color,
    ["--hover-bg" as string]: styles.bg_hover,
  };
};

/**
 * Build attributes object from btn_attributes array or object
 */
const buildAttributes = (
  attributes: CTAButton["btn_attributes"]
): Record<string, string> => {
  if (!attributes) return {};
  
  // Handle if API returns empty object instead of array
  if (!Array.isArray(attributes)) {
    return attributes as Record<string, string>;
  }
  
  if (attributes.length === 0) return {};

  return attributes.reduce(
    (acc, attr) => ({
      ...acc,
      [attr.name]: attr.value,
    }),
    {}
  );
};

/**
 * Build CSS class string from btn_classes array
 */
const buildClassNames = (
  classes: CTAButton["btn_classes"],
  baseClassName?: string
): string => {
  const classArray = [baseClassName].filter(Boolean);

  if (classes && classes.length > 0) {
    classes.forEach((cls) => {
      if (cls.value) classArray.push(cls.value);
    });
  }

  return classArray.join(" ");
};

export function CTAButton({
  cta,
  condition,
  location,
  className,
  vehicleData,
  onOpenForm,
	icon,
}: CTAButtonProps) {
  // All hooks must be called before any conditional returns
  const isDeviceVisible = useDeviceVisibility(cta.device);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);

  const handleClick = useCallback(() => {
    if (cta.cta_type === "form") {
      // For VDP with onOpenForm callback, use inline form in parent
      if (location === "vdp" && onOpenForm) {
        onOpenForm(cta.btn_content);
        return;
      }
      // Otherwise use modal form
      setIsLoadingForm(true);
      setIsFormOpen(true);
    } else if (cta.cta_type === "link") {
      // Link handled by anchor element
      return;
    } else if (cta.cta_type === "html") {
      // Custom HTML with inline handlers - click handled in HTML content
      return;
    }
  }, [cta.cta_type, cta.btn_content, location, onOpenForm]);

  const handleFormLoad = useCallback(() => {
    setIsLoadingForm(false);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setIsLoadingForm(false);
  }, []);

  // Visibility checks (after all hooks)
  if (!isDeviceVisible) return null;
  if (!shouldShowForCondition(cta, condition)) return null;
  if (!shouldShowForLocation(cta, location)) return null;

  // Common props for all button types
  const inlineStyles = generateInlineStyles(cta.btn_styles);
  const attributes = buildAttributes(cta.btn_attributes);
  const classNames = buildClassNames(cta.btn_classes, className);

  // Render based on CTA type
  if (cta.cta_type === "html") {
    // Custom HTML content (e.g., ActivEngage chat/text buttons)
    return (
      <div
        className={classNames || "cta-html-wrapper"}
        dangerouslySetInnerHTML={{ __html: cta.btn_content }}
        suppressHydrationWarning
        {...attributes}
      />
    );
  }

  if (cta.cta_type === "link") {
    // Direct link navigation
    return (
      <a
        href={cta.btn_content}
        target={cta.open_newtab ? "_blank" : "_self"}
        rel={cta.open_newtab ? "noopener noreferrer" : undefined}
        className={
          classNames ||
					"cta-link-btn w-full rounded-lg py-2 font-medium text-center block cursor-pointer transition-colors duration-400 hover:opacity-90 flex items-center justify-center py-3"
        }
        style={inlineStyles}
        {...attributes}
      >
				<span className="inline-flex items-center justify-center gap-2">
					{icon && icon}
					<p className="leading-[21px]">{cta.cta_label}</p>
				</span>
      </a>
    );
  }

  // Form type - button that opens modal
  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoadingForm}
        className={
          classNames ||
					"cta-form-btn w-full rounded-lg py-2 font-medium cursor-pointer transition-colors duration-400 hover:opacity-90 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center py-3"
        }
        style={inlineStyles}
        {...attributes}
      >
        {isLoadingForm ? (
          <span className="inline-flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </span>
        ) : (
					<span className="inline-flex items-center justify-center gap-2">
						{icon && icon}
						<p className="leading-[21px]">{cta.cta_label}</p>
					</span>
        )}
      </button>

      {/* Form modal - SRP uses modal, VDP uses inline form via parent callback */}
      {location === "srp" && (
        <FormModalSRP
          formId={cta.btn_content}
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onFormLoad={handleFormLoad}
          isLoading={isLoadingForm}
          vehicleData={vehicleData}
					onSuccess={() => { }}
        />
      )}
    </>
  );
}
