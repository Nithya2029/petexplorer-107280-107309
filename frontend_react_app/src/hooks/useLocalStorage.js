import { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useLocalStorage - custom hook template for state synced with localStorage
 * @param {string} key
 * @param {*} initialValue
 * @returns [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {}
  };

  return [storedValue, setValue];
}
