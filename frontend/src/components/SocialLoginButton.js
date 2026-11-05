'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

function loadGoogleScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Sign-In is browser-only.'));
  }
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (!window.__aaGoogleScriptPromise) {
    window.__aaGoogleScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.google), { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => reject(new Error('Google Sign-In failed to load.'));
      document.head.appendChild(script);
    });
  }
  return window.__aaGoogleScriptPromise;
}

function GoogleSignInButton({ clientId, label, onSuccess, onError, disabled, loading }) {
  const [ready, setReady] = useState(false);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  useEffect(() => {
    let active = true;
    loadGoogleScript()
      .then((google) => {
        if (!active || !google?.accounts?.id) return;
        if (window.__aaGoogleInitializedClientId !== clientId) {
          google.accounts.id.initialize({
            client_id: clientId,
            ux_mode: 'popup',
            auto_select: false,
            context: 'signin',
            callback: (response) => {
              if (response?.credential) onSuccessRef.current?.(response);
              else onErrorRef.current?.();
            },
          });
          window.__aaGoogleInitializedClientId = clientId;
        }
        setReady(true);
      })
      .catch(() => onErrorRef.current?.());

    return () => {
      active = false;
    };
  }, [clientId]);

  const handleClick = () => {
    if (!ready || loading || disabled) return;
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
        onErrorRef.current?.();
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!ready || loading || disabled}
      className="relative flex w-full items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-3.5 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={label || 'Sign in with Google'}
    >
      <span className="absolute left-4 flex items-center">
        {loading ? (
          <Loader2 size={18} className="animate-spin text-zinc-500" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M22.56 12.25c-.07-.78-.13-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        )}
      </span>
      <span>{label || 'Sign in with Google'}</span>
    </button>
  );
}

export default function SocialLoginButton({ provider, onClick, onSuccess, onError, loading = false, disabled = false, label }) {
  const isGoogle = provider === 'google';
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  const hasGoogleClientId = !!googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID_HERE';

  if (isGoogle && hasGoogleClientId) {
    return <GoogleSignInButton clientId={googleClientId} label={label} onSuccess={onSuccess} onError={onError} disabled={disabled} loading={loading} />;
  }

  const handleClick = () => onClick?.();

  if (isGoogle) {
    return (
      <button type="button" onClick={handleClick} disabled={loading || disabled} className="w-full relative flex items-center justify-center py-3.5 px-4 bg-white border border-zinc-300 hover:border-zinc-400 rounded-lg text-zinc-900 font-semibold text-sm hover:bg-zinc-50 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer" aria-label={label || 'Sign in with Google'}>
        <span>{label || 'Sign in with Google'}</span>
      </button>
    );
  }

  if (provider === 'facebook') {
    return (
      <button type="button" onClick={handleClick} disabled={loading || disabled} className="w-full relative flex items-center justify-center py-2.5 px-4 bg-[#3b5998] hover:bg-[#334d84] text-white rounded-md font-semibold text-sm transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer" aria-label="Sign in with Facebook">
        <span>Sign in with Facebook</span>
      </button>
    );
  }

  return null;
}
