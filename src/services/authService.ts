/**
 * src/services/authService.ts
 * 
 * Servicio frontend de Autenticación mediante sesión PHP same-origin y CSRF.
 */

import { apiRequest, setCsrfToken, ApiResponse } from './apiClient';

export interface AuthUser {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'VENDEDOR';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSessionResponse {
  user: AuthUser;
  csrfToken: string;
}

export async function fetchCsrfToken(): Promise<string | null> {
  const res = await apiRequest<{ csrfToken: string }>('/auth/csrf');
  if (res.status === 'OK' && res.data?.csrfToken) {
    setCsrfToken(res.data.csrfToken);
    return res.data.csrfToken;
  }
  return null;
}

export async function login(credentials: LoginCredentials): Promise<ApiResponse<AuthSessionResponse>> {
  // Asegurar CSRF token previo antes del login
  await fetchCsrfToken();

  const res = await apiRequest<AuthSessionResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (res.status === 'OK' && res.data?.csrfToken) {
    setCsrfToken(res.data.csrfToken);
  }

  return res;
}

export async function getCurrentUser(): Promise<ApiResponse<AuthSessionResponse>> {
  const res = await apiRequest<AuthSessionResponse>('/auth/me');
  if (res.status === 'OK' && res.data?.csrfToken) {
    setCsrfToken(res.data.csrfToken);
  }
  return res;
}

export async function logout(): Promise<ApiResponse<void>> {
  const res = await apiRequest<void>('/auth/logout', {
    method: 'POST',
  });
  setCsrfToken(null);
  return res;
}
