/**
 * Form State Management Hook
 * Manages form data, loading, errors, and submission state
 * Uses client-side FIFO cache to avoid redundant form fetches
 */

import { useState, useEffect, useRef } from "react";
import type { DealerTowerForm } from "@dealertower/types";
import { getFormCache } from "@dealertower/lib/cache/client-form-cache";

interface UseFormStateProps {
  formId: string;
  isOpen: boolean;
  onFormLoad?: (form: DealerTowerForm) => void;
}

interface FormState {
  form: DealerTowerForm | null;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  csrfToken: string;
  submitSuccess: boolean;
  cooldownSeconds: number;
}

interface FormStateActions {
  setForm: (form: DealerTowerForm | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFieldErrors: (errors: Record<string, string>) => void;
  setCsrfToken: (token: string) => void;
  setSubmitSuccess: (success: boolean) => void;
  setCooldownSeconds: (seconds: number) => void;
}

export function useFormState({ formId, isOpen, onFormLoad }: UseFormStateProps): [FormState, FormStateActions] {
  const [form, setForm] = useState<DealerTowerForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  
  // Single ref to track the current fetch operation
  const fetchAbortControllerRef = useRef<AbortController | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  // Submission cooldown timer
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(cooldownSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  // Fetch form data when opened
  useEffect(() => {
    // Don't fetch if modal is closed or no formId
    if (!isOpen || !formId) {
      return;
    }

    // Get the form cache instance
    const cache = getFormCache();

    // Check if form is in cache first
    const cachedEntry = cache.get(formId);
    
    // If there's already an ongoing fetch, don't start another
    // This prevents duplicate fetches in React Strict Mode
    if (isFetchingRef.current) {
      return;
    }

    // Mark that we're starting a fetch
    isFetchingRef.current = true;

    // Create new abort controller for this fetch
    const abortController = new AbortController();
    fetchAbortControllerRef.current = abortController;

    const fetchFormData = async () => {
      setError(null);
      const hasCachedForm = Boolean(cachedEntry);

      if (hasCachedForm && cachedEntry?.form) {
        setForm(cachedEntry.form);
        if (onFormLoad) {
          onFormLoad(cachedEntry.form);
        }
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      try {
        // Always fetch fresh CSRF token for security (even if form is cached)
        if (typeof window !== 'undefined') {
          const csrfResponse = await fetch("/api/csrf/", { signal: abortController.signal });
          if (csrfResponse.ok) {
            const csrfData = await csrfResponse.json();
            setCsrfToken(csrfData.token || "");
          }
        }

        // Use cached form data if available, otherwise fetch from API
        if (hasCachedForm && cachedEntry?.form) {
          return;
        }

        // Fetch form data from API
        const formResponse = await fetch(`/api/forms/${formId}/`, { signal: abortController.signal });

        // Process form data
        if (!formResponse.ok) {
          throw new Error("Failed to load form");
        }

        const data = await formResponse.json();

        if (data.success && data.data) {
          const formData = data.data;
          setForm(formData);
          
          // Cache the loaded form (using getFormCache() to get instance)
          const formCache = getFormCache();
          formCache.set(formId, formData);
          
          if (onFormLoad) {
            onFormLoad(formData);
          }
        } else {
          setError(data.error || "Form not found");
        }
      } catch (err) {
        // Ignore abort errors - don't clear flag yet
        if (err instanceof Error && err.name === 'AbortError') {
          // Don't clear isFetchingRef - cleanup will handle it
          setIsLoading(false);
          return;
        }
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        // Only clear flags if we didn't abort
        if (!abortController.signal.aborted) {
          setIsLoading(false);
          isFetchingRef.current = false;
        }
      }
    };

    fetchFormData();

    // Cleanup: abort fetch on unmount or when dependencies change
    return () => {
      // Abort the fetch
      abortController.abort();
      // Clear refs if this is the current controller
      if (fetchAbortControllerRef.current === abortController) {
        fetchAbortControllerRef.current = null;
        // Clear fetching flag when we abort
        isFetchingRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, formId]);

  const state: FormState = {
    form,
    isLoading,
    error,
    fieldErrors,
    csrfToken,
    submitSuccess,
    cooldownSeconds,
  };

  const actions: FormStateActions = {
    setForm,
    setIsLoading,
    setError,
    setFieldErrors,
    setCsrfToken,
    setSubmitSuccess,
    setCooldownSeconds,
  };

  return [state, actions];
}
