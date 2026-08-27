'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function GoogleAuthProvider({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
    return <>{children}</>;
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
}
