/**
 * src/services/leadService.ts
 * 
 * Servicio de consumo de API de Leads para persistencia real MySQL.
 */

import { apiRequest, ApiResponse } from './apiClient';
import { Lead } from '../types';

export interface CreateLeadPayload {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  notes?: string;
}

export async function fetchLeadsApi(): Promise<ApiResponse<{ leads: any[] }>> {
  return apiRequest<{ leads: any[] }>('/leads');
}

export async function createLeadApi(payload: CreateLeadPayload): Promise<ApiResponse<{ lead: any }>> {
  return apiRequest<{ lead: any }>('/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Mapea la respuesta individual del backend MySQL a la interfaz Lead del frontend.
 */
export function mapBackendLeadToFrontend(raw: any): Lead {
  const firstName = raw.firstName || 'Lead';
  const lastName = raw.lastName || 'General';
  const fullName = raw.name || `${firstName} ${lastName}`.trim();

  return {
    id: String(raw.id),
    firstName,
    lastName,
    fullName,
    email: raw.email || '',
    phone: raw.phone || '',
    source: (raw.source as any) || 'Carga Manual',
    status: (raw.status as any) || 'NUEVO',
    qualification: 'TIBIO',
    priority: 'MEDIA',
    score: 50,
    developmentInterestIds: ['dev-001'],
    lotInterestIds: [],
    assignedSellerId: raw.assignedUserId ? String(raw.assignedUserId) : 'seller-1',
    assignedAgent: raw.assignedUserName || 'Asesor Comercial',
    budgetUSD: 30000,
    lastActivityAt: raw.updatedAt || new Date().toISOString(),
    createdAt: raw.createdAt || new Date().toISOString().split('T')[0],
    updatedAt: raw.updatedAt || new Date().toISOString().split('T')[0],
    notes: raw.notes || '',
    tags: [raw.source || 'Carga Manual'],
  };
}
