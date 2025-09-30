"use client";
import React from 'react';

export default function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
