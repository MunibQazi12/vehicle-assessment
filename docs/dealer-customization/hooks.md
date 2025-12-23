# Hooks

Dealer-specific React hooks are stored in the `hooks/` subdirectory. These provide reusable logic for common UI patterns.

## Directory Structure

```text
dealers/{dealer-uuid}/hooks/
  use-mobile.ts            # Mobile detection hook
  use-toast.ts             # Toast notification hook
  ...                      # Other custom hooks
```

## Common Hooks

### use-mobile.ts

Detects if the user is on a mobile device:

```typescript
// dealers/{dealer-uuid}/hooks/use-mobile.ts
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
```

Usage:

```typescript
"use client"

import { useIsMobile } from '@dealers/{dealer-uuid}/hooks/use-mobile';

export default function Navigation() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
```

### use-toast.ts

Toast notification management:

```typescript
// dealers/{dealer-uuid}/hooks/use-toast.ts
import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...props, id };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
    
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}
```

Usage:

```typescript
"use client"

import { useToast } from '@dealers/{dealer-uuid}/hooks/use-toast';

export default function ContactForm() {
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      await submitForm();
      toast({
        title: 'Success!',
        description: 'Your message has been sent.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

## Creating Custom Hooks

### Hook Structure

```typescript
// dealers/{dealer-uuid}/hooks/use-{name}.ts
import { useState, useEffect, useCallback } from 'react';

interface UseCustomHookOptions {
  // Configuration options
}

interface UseCustomHookReturn {
  // Return type
}

export function useCustomHook(
  options: UseCustomHookOptions
): UseCustomHookReturn {
  // State
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Callbacks
  const action = useCallback(() => {
    // Action logic
  }, []);
  
  return { state, action };
}
```

### Best Practices

1. **Prefix with `use`**: Always name hooks with `use` prefix
2. **Return objects**: Return named properties for clarity
3. **Memoize callbacks**: Use `useCallback` for returned functions
4. **Handle cleanup**: Return cleanup functions from effects
5. **Type everything**: Use TypeScript for options and return types

## Example: Scroll Position Hook

```typescript
// dealers/{dealer-uuid}/hooks/use-scroll.ts
import { useState, useEffect } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

export function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return position;
}
```

Usage in a sticky header:

```typescript
"use client"

import { useScrollPosition } from '@dealers/{dealer-uuid}/hooks/use-scroll';

export default function Header() {
  const { y } = useScrollPosition();
  const isScrolled = y > 50;

  return (
    <header className={`
      fixed top-0 transition-shadow
      ${isScrolled ? 'shadow-lg' : ''}
    `}>
      {/* Header content */}
    </header>
  );
}
```

## Example: Local Storage Hook

```typescript
// dealers/{dealer-uuid}/hooks/use-local-storage.ts
import { useState, useCallback, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Set value
  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  // Remove value
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
```

Usage:

```typescript
"use client"

import { useLocalStorage } from '@dealers/{dealer-uuid}/hooks/use-local-storage';

export default function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme ({theme})
    </button>
  );
}
```
