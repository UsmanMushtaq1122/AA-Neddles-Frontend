const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

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
    const match = document.cookie.match(/(?:^|; )refreshToken=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  setTokens(accessToken, refreshToken) {
    if (typeof window === 'undefined') return;
    if (typeof document !== 'undefined') {
      document.cookie = `refreshToken=${refreshToken || ''}; path=/; max-age=86400; SameSite=Lax; Secure`;
    }
  }

  clearAuth() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('aa-auth');
    if (typeof document !== 'undefined') {
      document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Lax; Secure';
      document.cookie = 'refreshToken=; path=/; max-age=0; SameSite=Lax; Secure';
    }
  }

  async refreshToken() {
    if (this._refreshPromise) return this._refreshPromise;
    this._refreshPromise = this._doRefresh().finally(() => { this._refreshPromise = null; });
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
      if (!res.ok) return false;
      const data = await res.json();
      if (data.success && data.data) {
        this.updateStoredToken(data.data.token);
        this.setTokens(data.data.token, data.data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  updateStoredToken(newToken) {
    if (typeof window === 'undefined') return;
    try {
      const auth = localStorage.getItem('aa-auth');
      if (auth) {
        const parsed = JSON.parse(auth);
        parsed.accessToken = newToken;
        localStorage.setItem('aa-auth', JSON.stringify(parsed));
      }
      if (typeof document !== 'undefined') {
        document.cookie = `accessToken=${newToken}; path=/; max-age=86400; SameSite=Lax; Secure`;
      }
    } catch {}
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

    if (response.status === 401 && token) {
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
