/**
 * Debounce hook
 * @template T
 * @param {T} value - input value to debounce
 * @param {number} [delay=300] - delay in ms
 * @returns {T} debounced value
 */
import { useState, useEffect } from 'react';

export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}