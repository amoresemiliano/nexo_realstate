/**
 * src/services/apiClient.ts
 * 
 * Cliente HTTP unificado para el Frontend de Nexo Desarrollos.
 * Cumple con los principios SOLID (Single Responsibility, Dependency Inversion)
 * y resuelve rutas same-origin relativas de forma determinística bajo /sistemas/nexo_realstate/dev/
 */

export type ApiStatus = 
  | 'OK'                  // 200-299: API disponible y solicitud exitosa
  | 'UNAUTHENTICATED'     // 401: Sesión no autenticada (no bloquea la aplicación)
  | 'FORBIDDEN'           // 403: Sin permisos suficientes
  | 'NOT_FOUND'           // 404: Recurso o ruta no encontrada
  | 'SERVER_ERROR'        // 500-599: Error interno del backend
  | 'NETWORK_ERROR'       // Error de conexión / red no disponible
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

/**
 * Resuelve determinísticamente la URL base de la API para evitar llamadas a la raíz del dominio.
 * Si el navegador está en https://www.vegendigital.com/sistemas/nexo_realstate/dev/
 * la URL resultante para la API será /sistemas/nexo_realstate/dev/api/v1
 */
export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return '/api/v1';
  }
  
  const pathname = window.location.pathname;
  let basePath = pathname;
  if (!basePath.endsWith('/')) {
    basePath = basePath.substring(0, basePath.lastIndexOf('/') + 1);
  }
  
  // Garantizar que /api/v1 se concatene de forma relativa al webroot del entorno dev
  const fullApiPath = `${basePath}api/v1`.replace(/\/+/g, '/');
  return fullApiPath;
};

/**
 * Realiza peticiones HTTP controladas categorizando el tipo de respuesta/error.
 */
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

  try {
    const response = await fetch(url, {
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
      // La respuesta no fue JSON válido
    }

    if (response.ok) {
      return {
        status: 'OK',
        httpStatus,
        data: jsonBody?.data ?? jsonBody,
      };
    }

    // Clasificación determinística de estados HTTP
    if (httpStatus === 401) {
      return {
        status: 'UNAUTHENTICATED',
        httpStatus,
        error: jsonBody?.error ?? { code: 'UNAUTHORIZED', message: 'Sesión no autenticada.' },
      };
    }

    if (httpStatus === 403) {
      return {
        status: 'FORBIDDEN',
        httpStatus,
        error: jsonBody?.error ?? { code: 'FORBIDDEN', message: 'Acceso no autorizado.' },
      };
    }

    if (httpStatus === 404) {
      return {
        status: 'NOT_FOUND',
        httpStatus,
        error: jsonBody?.error ?? { code: 'NOT_FOUND', message: 'Recurso no encontrado.' },
      };
    }

    if (httpStatus >= 500) {
      return {
        status: 'SERVER_ERROR',
        httpStatus,
        error: jsonBody?.error ?? { code: 'SERVER_ERROR', message: 'Error interno del servidor.' },
      };
    }

    return {
      status: 'CLIENT_ERROR',
      httpStatus,
      error: jsonBody?.error ?? { code: 'CLIENT_ERROR', message: `Error HTTP ${httpStatus}` },
    };

  } catch (err) {
    // Error de red u offline (fetch falló)
    return {
      status: 'NETWORK_ERROR',
      error: {
        code: 'NETWORK_ERROR',
        message: 'No se pudo conectar con el servidor API. Verifique su conexión de red.',
      },
    };
  }
}

/**
 * Consulta el estado de salud del backend (/api/v1/health).
 */
export async function checkBackendHealth(): Promise<ApiResponse<HealthCheckData>> {
  return apiRequest<HealthCheckData>('/health');
}
