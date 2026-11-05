import { NextResponse } from 'next/server';

const defaultApiBase = process.env.NODE_ENV === 'production'
  ? 'https://api.aaneedles.com/api/v1'
  : 'http://localhost:5000/api/v1';

function safeRedirect(value) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}

export async function POST(request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const credential = formData.get('credential');
  const redirectUrl = safeRedirect(formData.get('state'));

  if (typeof credential !== 'string' || !credential) {
    return NextResponse.redirect(new URL('/login?google_error=invalid', request.url));
  }

  try {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || defaultApiBase).replace(/\/+$/, '');
    const response = await fetch(`${apiBase}/auth/social`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'google', credential }),
      cache: 'no-store',
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.success || !result.data?.token) {
      return NextResponse.redirect(new URL('/login?google_error=failed', request.url));
    }

    const destination = new URL('/login', request.url);
    destination.searchParams.set('google', 'success');
    destination.searchParams.set('redirect', redirectUrl);
    const redirectResponse = NextResponse.redirect(destination);
    redirectResponse.cookies.set('accessToken', result.data.token, {
      maxAge: 86400,
      path: '/',
      sameSite: 'lax',
      secure: requestUrl.protocol === 'https:',
    });
    redirectResponse.cookies.set('refreshToken', result.data.refreshToken, {
      maxAge: 2592000,
      path: '/',
      sameSite: 'lax',
      secure: requestUrl.protocol === 'https:',
    });
    return redirectResponse;
  } catch {
    return NextResponse.redirect(new URL('/login?google_error=unavailable', request.url));
  }
}
