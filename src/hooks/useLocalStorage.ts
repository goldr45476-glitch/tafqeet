import { useCallback, useEffect, useState } from 'react';

/**
 * A `useState`-like hook backed by `localStorage`, resilient to environments
 * where storage is unavailable (private browsing, quota exceeded, SSR).
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // ignore write failures
        }
        return resolved;
      });
    },
    [key],
  );

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== key) return;
      try {
        setValue(e.newValue !== null ? (JSON.parse(e.newValue) as T) : initialValue);
      } catch {
        // ignore parse failures
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setStoredValue];
}
