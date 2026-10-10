import { useState, useEffect, useCallback } from 'react';

/**
 * Custom React hook for robust LocalStorage persistence.
 * Handles SSR safety, JSON parsing errors, QuotaExceededError,
 * and synchronisation across components.
 *
 * Notice: LocalStorage is strictly client-local and unencrypted.
 * It is suitable for personal preferences and local drafts,
 * but does not sync across separate devices.
 *
 * @param {string} key - Storage key
 * @param {any} initialValue - Fallback value if key does not exist or fails
 * @returns {[any, Function, Function]} [value, setValue, removeValue]
 */
export function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return initialValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = useCallback(
    (value) => {
      if (typeof window === 'undefined') {
        return;
      }

      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        // Dispatch custom event for same-tab updates across hook instances
        window.dispatchEvent(new CustomEvent('local-storage-change', { detail: { key, value: valueToStore } }));
      } catch (error) {
        console.error(`[useLocalStorage] Error setting key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new CustomEvent('local-storage-change', { detail: { key, value: initialValue } }));
    } catch (error) {
      console.error(`[useLocalStorage] Error removing key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Synchronize state if another hook or storage event updates this key
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setStoredValue(readValue());
      }
    };

    const handleCustomChange = (e) => {
      if (e.detail?.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-change', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-change', handleCustomChange);
    };
  }, [key, readValue]);

  return [storedValue, setValue, removeValue];
}
