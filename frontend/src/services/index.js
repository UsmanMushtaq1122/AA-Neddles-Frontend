const configuredApiBase = process.env.NEXT_PUBLIC_API_URL?.trim();
const defaultApiBase = process.env.NODE_ENV === 'production'
  ? 'https://api.aaneedles.com/api/v1'
  : 'http://localhost:5000/api/v1';
const API_BASE = (configuredApiBase || defaultApiBase)
  .replace(/\/+$/, '');

if (API_BASE) {
  let parsedApiBase;
  try {
    parsedApiBase = new URL(API_BASE);
  } catch {
    throw new Error('NEXT_PUBLIC_API_URL must be an absolute URL ending in /api/v1.');
  }

  if (!['http:', 'https:'].includes(parsedApiBase.protocol)
    || !parsedApiBase.pathname.endsWith('/api/v1')
    || parsedApiBase.username
    || parsedApiBase.password) {
    throw new Error('NEXT_PUBLIC_API_URL must be an absolute HTTP(S) URL ending in /api/v1.');
  }

  if (process.env.NODE_ENV === 'production' && parsedApiBase.protocol !== 'https:') {
    throw new Error('NEXT_PUBLIC_API_URL must use HTTPS in production.');
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this._refreshPromise = null;
  }

  getAccessToken() {
    if (typeof window === 'undefined') return null;
    try {
      const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
      if (match && match[1]) return decodeURIComponent(match[1]);
    } catch {}
    try {
      const auth = localStorage.getItem('aa-auth');
      if (auth) {
        const parsed = JSON.parse(auth);
        return parsed.accessToken || null;
      }
    } catch {}
    return null;
  }

  getRefreshToken() {
    if (typeof window === 'undefined') return null;
    try {
      const match = document.cookie.match(/(?:^|; )refreshToken=([^;]*)/);
      if (match && match[1]) return decodeURIComponent(match[1]);
    } catch {}
    try {
      const auth = localStorage.getItem('aa-auth');
      if (auth) {
        const parsed = JSON.parse(auth);
        if (parsed.refreshToken) return parsed.refreshToken;
      }
    } catch {}
    try {
      const rf = localStorage.getItem('aa-refresh-token');
      if (rf) return rf;
    } catch {}
    return null;
  }

  setTokens(accessToken, refreshToken) {
    if (typeof window === 'undefined') return;
    try {
      const secure = window.location.protocol === 'https:' ? '; Secure' : '';
      if (accessToken) {
        document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax${secure}`;
      }
      if (refreshToken) {
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=2592000; SameSite=Lax${secure}`;
        localStorage.setItem('aa-refresh-token', refreshToken);
      }
      const auth = localStorage.getItem('aa-auth');
      if (auth) {
        const parsed = JSON.parse(auth);
        if (accessToken) parsed.accessToken = accessToken;
        if (refreshToken) parsed.refreshToken = refreshToken;
        localStorage.setItem('aa-auth', JSON.stringify(parsed));
      }
    } catch {}
  }

  clearAuth() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('aa-auth');
      localStorage.removeItem('aa-refresh-token');
      const secure = window.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `accessToken=; path=/; max-age=0; SameSite=Lax${secure}`;
      document.cookie = `refreshToken=; path=/; max-age=0; SameSite=Lax${secure}`;
      window.dispatchEvent(new CustomEvent('aa-auth-expired'));
    } catch {}
  }

  async refreshToken() {
    if (this._refreshPromise) return this._refreshPromise;
    this._refreshPromise = this._doRefresh().finally(() => {
      this._refreshPromise = null;
    });
    return this._refreshPromise;
  }

  async _doRefresh() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${this.baseUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 400) {
          this.clearAuth();
        }
        return false;
      }
      const data = await res.json();
      if (data.success && data.data) {
        const newToken = data.data.token || data.data.accessToken;
        const newRefreshToken = data.data.refreshToken || refreshToken;
        this.setTokens(newToken, newRefreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  updateStoredToken(newToken, newRefreshToken) {
    this.setTokens(newToken, newRefreshToken);
  }

  async request(endpoint, options = {}) {
    const { method = 'GET', body, headers = {}, formData } = options;
    const token = this.getAccessToken();

    const fetchHeaders = { ...headers };
    if (!formData) {
      fetchHeaders['Content-Type'] = 'application/json';
    }
    if (token) {
      fetchHeaders['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: fetchHeaders,
      body: formData || (body ? JSON.stringify(body) : undefined),
    });

    if (response.status === 401 && (token || this.getRefreshToken())) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        const newToken = this.getAccessToken();
        if (newToken) {
          fetchHeaders['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: fetchHeaders,
            body: formData || (body ? JSON.stringify(body) : undefined),
          });
        }
      }
    }

    if (response.status === 304) {
      response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: fetchHeaders,
        body: formData || (body ? JSON.stringify(body) : undefined),
        cache: 'no-store',
      });
    }

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        responseData.message || responseData.error || 'Request failed',
        response.status,
        responseData
      );
    }

    return responseData;
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  upload(endpoint, formData) {
    return this.request(endpoint, { method: 'POST', formData });
  }

  uploadPut(endpoint, formData) {
    return this.request(endpoint, { method: 'PUT', formData });
  }
}

export const api = new ApiClient(API_BASE);
export const API_BASE_URL = API_BASE;
export { ApiError };
