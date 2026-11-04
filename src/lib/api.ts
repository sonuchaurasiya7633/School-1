// src/lib/api.ts
// Robust authenticated fetch helper for all Admin and User dashboard requests

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Check LocalStorage
  try {
    const token = localStorage.getItem('sps_token');
    if (token) return token;
  } catch (e) {
    // LocalStorage blocked
  }

  // 2. Check Cookie
  try {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  } catch (e) {
    // Cookie inaccessible
  }

  return null;
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (token && !headers.has('x-auth-token')) {
    headers.set('x-auth-token', token);
  }
  if (!headers.has('Cache-Control')) {
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  return fetch(url, {
    cache: 'no-store',
    ...options,
    headers,
    credentials: options.credentials || 'include',
  });
}
