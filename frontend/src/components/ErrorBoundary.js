'use client';

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';

function ErrorFallback({ error, resetErrorBoundary, fallbackMessage }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-noor-gold mx-auto mb-4" />
        <h2 className="ty-h3 text-noor-black mb-2">Something went wrong</h2>
        <p className="ty-body text-noor-gray mb-6">
          {fallbackMessage || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center gap-2 px-6 py-3 bg-noor-black text-white ty-button hover:bg-noor-black/90 transition-colors"
        >
          <RefreshCw size={16} />
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}

export default function ErrorBoundary({ children, fallbackMessage, onReset }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorFallback
          error={error}
          resetErrorBoundary={resetErrorBoundary}
          fallbackMessage={fallbackMessage}
        />
      )}
      onReset={onReset || (() => window.location.reload())}
      onError={(error, info) => console.error('ErrorBoundary caught:', error, info)}
    >
      {children}
    </ReactErrorBoundary>
  );
}
