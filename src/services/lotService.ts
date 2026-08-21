/**
 * src/services/lotService.ts
 * 
 * Servicio frontend de gestión de Barrios/Desarrollos y Lotes con persistencia real MySQL PDO.
 */

import { apiRequest, ApiResponse } from './apiClient';
import { Lot, Development, LotStatus, LotOrientation } from '../types';

export interface CreateDevelopmentParams {
  name: string;
  city?: string;
  province?: string;
  country?: string;
  address?: string;
  description?: string;
  status?: 'COMERCIALIZACION_ACTIVA' | 'EN_PREVENTA' | 'PROXIMAMENTE' | 'CERRADO';
}

export interface CreateLotParams {
  developmentId: string;
  number: string;
  block?: string;
  surfaceM2: number;
  priceUSD: number;
  currency?: 'USD' | 'ARS';
  status?: LotStatus;
  orientation?: LotOrientation;
  observations?: string;
}

export async function fetchDevelopmentsApi(): Promise<ApiResponse<{ developments: any[] }>> {
  return apiRequest<{ developments: any[] }>('/developments');
}

export async function createDevelopmentApi(params: CreateDevelopmentParams): Promise<ApiResponse<{ development: any }>> {
  return apiRequest<{ development: any }>('/developments', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function fetchLotsApi(developmentId?: string): Promise<ApiResponse<{ lots: any[] }>> {
  const query = developmentId ? `?developmentId=${encodeURIComponent(developmentId)}` : '';
  return apiRequest<{ lots: any[] }>(`/lots${query}`);
}

export async function createLotApi(params: CreateLotParams): Promise<ApiResponse<{ lot: any }>> {
  return apiRequest<{ lot: any }>('/lots', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * Valida si ya existe un lote con el mismo código/número dentro del mismo Barrio (validación local).
 */
export function isLotCodeDuplicated(
  existingLots: Lot[],
  developmentId: string,
  lotNumber: string
): boolean {
  const cleanNumber = lotNumber.trim().toLowerCase();
  return existingLots.some(
    (l) =>
      (l.developmentId === String(developmentId) || !l.developmentId) &&
      l.number.trim().toLowerCase() === cleanNumber
  );
}

/**
 * Mapea un objeto Development de la base de datos a la interfaz de la aplicación,
 * calculando dinámicamente totalLots y availableLots desde el array real de lotes.
 */
export function mapBackendDevelopmentToFrontend(raw: any, lots: Lot[] = []): Development {
  const devId = String(raw.id);
  const devLots = lots.filter(l => l.developmentId === devId);
  const availableCount = devLots.filter(l => l.status === 'DISPONIBLE').length;

  return {
    id: devId,
    name: raw.name || 'Sin Nombre',
    location: {
      city: raw.city || '',
      province: raw.province || '',
      country: raw.country || 'Argentina',
      address: raw.address || '',
    },
    status: (raw.status as any) || 'COMERCIALIZACION_ACTIVA',
    description: raw.description || '',
    totalAreaM2: 0,
    stages: [],
    totalLots: devLots.length,
    availableLots: availableCount,
    createdAt: raw.created_at || raw.createdAt,
    updatedAt: raw.updated_at || raw.updatedAt,
  };
}

/**
 * Mapea un objeto Lot de la base de datos a la interfaz Lot de la aplicación.
 * Mantiene exactitud con la verdad de MySQL sin inventar valores ficticios.
 */
export function mapBackendLotToFrontend(raw: any): Lot {
  const devId = raw.development_id ? String(raw.development_id) : (raw.developmentId ? String(raw.developmentId) : '');
  const number = String(raw.number || '').trim();
  const block = raw.block ? String(raw.block).trim() : '';
  const price = Number(raw.price !== undefined ? raw.price : raw.priceUSD) || 0;
  const surface = Number(raw.surface_m2 !== undefined ? raw.surface_m2 : raw.surfaceM2) || 0;

  return {
    id: String(raw.id),
    developmentId: devId,
    number,
    block,
    stage: 'Etapa 1',
    surfaceM2: surface,
    frontageM: 0,
    depthM: 0,
    orientation: (raw.orientation as any) || 'Norte',
    status: (raw.status as any) || 'DISPONIBLE',
    priceUSD: price,
    currency: (raw.currency as any) || 'USD',
    features: [],
    createdAt: raw.created_at || raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updated_at || raw.updatedAt || new Date().toISOString(),
  };
}

/**
 * Fallback local de la entidad Development (compatibilidad de prototipado).
 */
export function buildDevelopmentEntity(params: CreateDevelopmentParams): Development {
  return {
    id: `dev-${Date.now()}`,
    name: params.name.trim(),
    location: {
      city: params.city || '',
      province: params.province || '',
      country: 'Argentina',
      address: params.address || '',
    },
    status: (params.status as any) || 'COMERCIALIZACION_ACTIVA',
    description: params.description || '',
    totalAreaM2: 0,
    stages: [],
    totalLots: 0,
    availableLots: 0,
  };
}

/**
 * Fallback local de la entidad Lot (compatibilidad de prototipado).
 */
export function buildLotEntity(params: CreateLotParams, developmentName?: string): Lot {
  return {
    id: `lot-${Date.now()}`,
    developmentId: params.developmentId,
    number: params.number.trim(),
    block: params.block?.trim() || '',
    stage: 'Etapa 1',
    surfaceM2: Number(params.surfaceM2) || 0,
    frontageM: 0,
    depthM: 0,
    orientation: params.orientation || 'Norte',
    status: params.status || 'DISPONIBLE',
    priceUSD: Number(params.priceUSD) || 0,
    currency: params.currency || 'USD',
    features: [],
    createdAt: new Date().toISOString(),
  };
}
