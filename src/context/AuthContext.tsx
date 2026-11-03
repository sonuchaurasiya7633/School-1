'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types';
import { authFetch } from '@/lib/api';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message?: string; user?: IUser }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

// Auto-enhance window.fetch in the browser to always attach authentication for internal APIs
if (typeof window !== 'undefined' && !(window as any).__sps_fetch_enhanced) {
  (window as any).__sps_fetch_enhanced = true;
  const originalFetch = window.fetch;
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    try {
      const urlString =
        typeof input === 'string'
          ? input
          : input instanceof URL
          ? input.toString()
          : (input as Request).url;

      // Only attach auth headers for relative internal api calls
      if (urlString.startsWith('/api/') && !urlString.startsWith('/api/auth/login')) {
        const token =
          localStorage.getItem('sps_token') ||
          (document.cookie.match(/(?:^|;\s*)token=([^;]+)/)?.[1]
            ? decodeURIComponent(document.cookie.match(/(?:^|;\s*)token=([^;]+)/)![1])
            : null);

        if (token) {
          init = init ? { ...init } : {};
          const headers = new Headers(init.headers || {});
          if (!headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          if (!headers.has('x-auth-token')) {
            headers.set('x-auth-token', token);
          }
          init.headers = headers;
          if (!init.credentials) {
            init.credentials = 'include';
          }
        }
      }
    } catch (e) {
      // Fallback cleanly to original fetch
    }
    return originalFetch.call(this, input, init);
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const res = await authFetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          if (data.token && typeof window !== 'undefined') {
            try {
              localStorage.setItem('sps_token', data.token);
              document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
            } catch (e) {}
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        if (data.token && typeof window !== 'undefined') {
          try {
            localStorage.setItem('sps_token', data.token);
            document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
          } catch (e) {}
        }
        // Role based redirect
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (data.user.role === 'teacher') {
          router.push('/teacher/dashboard');
        } else if (data.user.role === 'student') {
          router.push('/student/dashboard');
        }
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Login failed.' };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error occurred.' };
    }
  };

  const logout = async () => {
    try {
      await authFetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    } finally {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('sps_token');
          document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
        } catch (e) {}
      }
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
