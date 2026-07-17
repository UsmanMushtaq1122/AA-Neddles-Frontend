'use client';

import { useCallback } from 'react';

export function useToast() {
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(
      new CustomEvent('aa-neddles-toast', { detail: { message, type, duration } })
    );
  }, []);

  return { addToast };
}
