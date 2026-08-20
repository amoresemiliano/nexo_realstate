/**
 * src/services/apiClient.ts
 * 
 * Cliente HTTP unificado para el Frontend de Nexo Desarrollos.
 * Soporta credenciales same-origin para sesión PHP y gestión automática de X-CSRF-TOKEN.
 */

export type ApiStatus = 
  | 'OK'                  // 200-299: Solicitud exitosa
  | 'UNAUTHENTICATED'     // 401: Sesión no autenticada
  | 'FORBIDDEN'           // 403: Sin permisos / CSRF inválido
  | 'NOT_FOUND'           // 404: Recurso no encontrado
  | 'SERVER_ERROR'        // 500-599: Error interno backend
  | 'NETWORK_ERROR'       // Error de conexión
  | 'CLIENT_ERROR';       // 400-499 otros errores de cliente

export interface ApiResponse<T = any> {
  status: ApiStatus;
  httpStatus?: number;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface HealthCheckData {
  service: string;
  status: string;
  environment: string;
  database: string;
}

let activeCsrfToken: string | null = null;

export const setCsrfToken = (token: string | null) => {
  activeCsrfToken = token;
};

export const getCsrfToken = (): string | null => {
  return activeCsrfToken;
};

export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return '/api/v1';
  }
  
  const pathname = window.location.pathname;
  let basePath = pathname;
  if (!basePath.endsWith('/')) {
    basePath = basePath.substring(0, basePath.lastIndexOf('/') + 1);
  }
  
  const fullApiPath = `${basePath}api/v1`.replace(/\/+/g, '/');
  return fullApiPath;
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (activeCsrfToken) {
    defaultHeaders['X-CSRF-TOKEN'] = activeCsrfToken;
  }

  try {
    const response = await fetch(url, {
      credentials: 'same-origin',
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const httpStatus = response.status;
    let jsonBody: any = null;

    try {
      jsonBody = await response.json();
    } catch {
      // Ignorar si la respuesta no es JSON válido
    }

    // Actualizar CSRF token si el backend lo devuelve en el payload
    if (jsonBody?.data?.csrfToken) {
      setCsrfToken(jsonBody.data.csrfToken);
    }

    if (response.ok && jsonBody?.success !== false) {
      return {
        status: 'OK',
        httpStatus,
        data: jsonBody?.data ?? jsonBody,
      };
    }

    const errorMessage = jsonBody?.error?.message || `Error de servidor HTTP ${httpStatus}`;
    const errorCode = jsonBody?.error?.code || 'API_ERROR';

    if (httpStatus === 401) {
      return {
        status: 'UNAUTHENTICATED',
        httpStatus,
        error: { code: errorCode || 'UNAUTHORIZED', message: errorMessage },
      };
    }

    if (httpStatus === 403) {
      return {
        status: 'FORBIDDEN',
        httpStatus,
        error: { code: errorCode || 'FORBIDDEN', message: errorMessage },
      };
    }

    if (httpStatus === 404) {
      return {
        status: 'NOT_FOUND',
        httpStatus,
        error: { code: errorCode || 'NOT_FOUND', message: errorMessage },
      };
    }

    if (httpStatus >= 500) {
      return {
        status: 'SERVER_ERROR',
        httpStatus,
        error: { code: errorCode || 'SERVER_ERROR', message: errorMessage },
      };
    }

    return {
      status: 'CLIENT_ERROR',
      httpStatus,
      error: { code: errorCode, message: errorMessage },
    };

  } catch (err) {
    return {
      status: 'NETWORK_ERROR',
      error: {
        code: 'NETWORK_ERROR',
        message: 'No se pudo conectar con el servidor API. Verifique su conexión de red.',
      },
    };
  }
}

export async function checkBackendHealth(): Promise<ApiResponse<HealthCheckData>> {
  return apiRequest<HealthCheckData>('/health');
}
