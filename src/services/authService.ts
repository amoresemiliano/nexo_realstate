/**
 * src/services/authService.ts
 * 
 * Servicio de autenticación con integración progresiva para Nexo Desarrollos.
 * Permite manejar la sesión sin bloquear la interfaz navegable del MVP en entorno DEV.
 */

import { apiRequest, ApiResponse, ApiStatus } from './apiClient';
import { UserRole } from '../types';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthSessionState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  status: ApiStatus;
  isLoading: boolean;
  errorMessage: string | null;
}

/**
 * Consulta el estado actual de la sesión con el backend.
 * Si el servidor responde 401 (UNAUTHENTICATED) o la API no está lista,
 * no bloquea la UI del MVP.
 */
export async function checkCurrentSession(): Promise<AuthSessionState> {
  const response: ApiResponse<AuthUser> = await apiRequest('/auth/me');

  if (response.status === 'OK' && response.data) {
    return {
      isAuthenticated: true,
      user: response.data,
      status: 'OK',
      isLoading: false,
      errorMessage: null,
    };
  }

  if (response.status === 'UNAUTHENTICATED') {
    return {
      isAuthenticated: false,
      user: null,
      status: 'UNAUTHENTICATED',
      isLoading: false,
      errorMessage: null,
    };
  }

  // Error de red o servidor no disponible: se reporta el estado sin tirar pantalla blanca
  return {
    isAuthenticated: false,
    user: null,
    status: response.status,
    isLoading: false,
    errorMessage: response.error?.message || 'Servicio de autenticación no disponible.',
  };
}

/**
 * Realiza el intento de inicio de sesión contra el backend (/api/v1/auth/login).
 */
export async function loginWithCredentials(
  email: string,
  pass: string
): Promise<ApiResponse<{ user: AuthUser; token?: string }>> {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password: pass }),
  });
}

/**
 * Cierra la sesión activa (/api/v1/auth/logout).
 */
export async function logoutSession(): Promise<ApiResponse> {
  return apiRequest('/auth/logout', {
    method: 'POST',
  });
}
