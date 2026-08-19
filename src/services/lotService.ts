/**
 * src/services/lotService.ts
 * 
 * Servicio frontend de gestión de Barrios/Desarrollos y Lotes.
 * Cumple con SOLID (Single Responsibility, Dependency Inversion)
 * permitiendo sustituir fácilmente el estado mock por repositorios API en el futuro.
 */

import { Lot, Development, LotStatus } from '../types';

export interface CreateDevelopmentParams {
  name: string;
  city?: string;
  province?: string;
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
  orientation?: 'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Esquina';
  observations?: string;
}

/**
 * Valida si ya existe un lote con el mismo código/número dentro del mismo Barrio.
 */
export function isLotCodeDuplicated(
  existingLots: Lot[],
  developmentId: string,
  lotNumber: string
): boolean {
  const cleanNumber = lotNumber.trim().toLowerCase();
  return existingLots.some(
    (l) =>
      (l.developmentId === developmentId || !l.developmentId) &&
      l.number.trim().toLowerCase() === cleanNumber
  );
}

/**
 * Fabrica una entidad Development mock para el estado frontend.
 */
export function buildDevelopmentEntity(params: CreateDevelopmentParams): Development {
  return {
    id: `dev-${Date.now()}`,
    name: params.name.trim(),
    location: {
      city: params.city || 'Pilar',
      province: params.province || 'Buenos Aires',
      country: 'Argentina',
      address: params.address || '',
    },
    status: (params.status as any) || 'COMERCIALIZACION_ACTIVA',
    description: params.description || '',
    totalAreaM2: 50000,
    stages: [
      {
        id: `stage-${Date.now()}`,
        name: 'Etapa 1',
        totalLots: 20,
        availableLots: 20,
        completionPercentage: 100,
        estimatedDeliveryDate: '2026-12-31',
      },
    ],
    totalLots: 20,
    availableLots: 20,
  };
}

/**
 * Fabrica una entidad Lot mock para el estado frontend.
 */
export function buildLotEntity(params: CreateLotParams, developmentName?: string): Lot {
  return {
    id: `lot-${Date.now()}`,
    developmentId: params.developmentId,
    number: params.number.trim(),
    block: params.block?.trim() || 'A',
    stage: 'Etapa 1',
    surfaceM2: Number(params.surfaceM2) || 500,
    frontageM: 15,
    depthM: 35,
    orientation: params.orientation || 'Norte',
    status: params.status || 'DISPONIBLE',
    priceUSD: Number(params.priceUSD) || 35000,
    currency: params.currency || 'USD',
    features: ['Agua Corriente', 'Luz Eléctrica', 'Seguridad 24hs'],
    createdAt: new Date().toISOString(),
  };
}
