'use client';

import ErrorBoundary from '@/components/ErrorBoundary';

export default function ClientErrorBoundary({ children }) {
  return (
    <ErrorBoundary fallbackMessage="Something went wrong on this page. Please try again.">
      {children}
    </ErrorBoundary>
  );
}
