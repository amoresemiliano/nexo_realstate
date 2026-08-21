/**
 * src/services/campaignService.ts
 * 
 * Servicio frontend de consumo de API de Campañas para persistencia real MySQL.
 */

import { apiRequest, ApiResponse } from './apiClient';
import { Campaign } from '../types';

export interface CreateCampaignPayload {
  name: string;
  platform: string;
  status?: string;
  startDate: string;
  endDate?: string;
  budgetUSD?: number;
  objective?: string;
  audience?: string;
}

export async function fetchCampaignsApi(): Promise<ApiResponse<{ campaigns: any[] }>> {
  return apiRequest<{ campaigns: any[] }>('/campaigns');
}

export async function createCampaignApi(payload: CreateCampaignPayload): Promise<ApiResponse<{ campaign: any }>> {
  return apiRequest<{ campaign: any }>('/campaigns', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Mapea la respuesta del backend MySQL a la interfaz Campaign del frontend.
 */
export function mapBackendCampaignToFrontend(raw: any): Campaign {
  return {
    id: String(raw.id),
    name: raw.name || 'Sin Nombre',
    platform: raw.platform || 'Meta Ads',
    budgetUSD: Number(raw.budget_usd) || 0,
    spentUSD: Number(raw.spent_usd) || 0,
    leadsGenerated: Number(raw.leads_generated) || 0,
    conversions: Number(raw.conversions) || 0,
    startDate: raw.start_date || new Date().toISOString().split('T')[0],
    endDate: raw.end_date || '2026-12-31',
    status: (raw.status as any) || 'ACTIVA',
    objective: raw.objective || undefined,
    audience: raw.audience || undefined,
  };
}
