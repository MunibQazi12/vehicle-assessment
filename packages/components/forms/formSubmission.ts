/**
 * Form Submission Logic
 * Handles form submission, validation, and CSRF token management
 */

import type { FormSubmissionResponse } from "@dealertower/types";

interface SubmitFormOptions {
  formData: FormData;
  formId: string;
  csrfToken: string;
  vehicleData?: {
    vehicle_id?: string;
    dealer_ids?: string[];
    vin_number?: string;
    stock_number?: string;
    title?: string;
  };
  onError: (error: string, fieldErrors?: Record<string, string>) => void;
  onSuccess: (response: FormSubmissionResponse) => void;
  onCooldown: (seconds: number) => void;
  onCsrfUpdate: (token: string) => void;
}

/**
 * Submit form data to the API
 */
export async function submitForm(options: SubmitFormOptions): Promise<void> {
  const {
    formData,
    formId,
    csrfToken,
    onError,
    onSuccess,
    onCooldown,
    onCsrfUpdate,
  } = options;

  try {
    // Honeypot check - if filled, it's a bot
    const honeypot = formData.get("website_url");
    if (honeypot && honeypot !== "") {
      // Silently reject bot submission
      onError("Unable to submit form. Please try again.");
      onCooldown(5); // Add cooldown for bot
      return;
    }

    // Remove honeypot field before submission
    formData.delete("website_url");

    // Add CSRF token
    if (csrfToken) {
      formData.append("csrf_token", csrfToken);
    }

    // Add form ID
    formData.append("form_id", formId);

    const response = await fetch("/api/forms/submit/", {
      method: "POST",
      body: formData,
    });

    const result: FormSubmissionResponse = await response.json();

    // If CSRF token invalid (403), fetch new token and retry once
    if (response.status === 403 && result.error?.includes("security token")) {
      
      // Fetch new CSRF token
      const csrfResponse = await fetch("/api/csrf/");
      if (csrfResponse.ok) {
        const csrfData = await csrfResponse.json();
        const newToken = csrfData.token || "";
        onCsrfUpdate(newToken);
        
        // Update form data with new token
        formData.set("csrf_token", newToken);
        
        // Retry submission with new token
        const retryResponse = await fetch("/api/forms/submit/", {
          method: "POST",
          body: formData,
        });
        
        const retryResult: FormSubmissionResponse = await retryResponse.json();
        
        if (retryResult.success) {
          onSuccess(retryResult);
          onCooldown(3);
          return;
        } else {
          console.error("[Form] Retry failed:", retryResult.error);
          // Handle retry failure
          if (retryResult.errors && Object.keys(retryResult.errors).length > 0) {
            onError("Please correct the errors below.", retryResult.errors);
          } else {
            onError(retryResult.error || "Failed to submit form. Please try again.");
          }
          onCooldown(2);
          return;
        }
      } else {
        console.error("[Form] Failed to fetch new CSRF token");
      }
    }

    if (result.success) {
      onSuccess(result);
      onCooldown(3); // 3 second cooldown after successful submission
    } else {
      // Handle field-specific errors
      if (result.errors && Object.keys(result.errors).length > 0) {
        onError("Please correct the errors below.", result.errors);
      } else {
        onError(result.error || "Failed to submit form. Please try again.");
      }
      onCooldown(2); // 2 second cooldown after failed submission
    }
  } catch {
    onError("Unable to submit form. Please check your connection and try again.");
    onCooldown(2); // 2 second cooldown after error
  }
}
