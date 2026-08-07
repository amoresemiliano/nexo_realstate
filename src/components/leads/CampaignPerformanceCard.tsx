import React from 'react';
import { Campaign, Lead } from '../../types';
import { formatUSD } from '../../domain/rules';
import { Megaphone, TrendingUp, Users, DollarSign, Target, Award } from 'lucide-react';

interface CampaignPerformanceCardProps {
  campaigns: Campaign[];
  leads: Lead[];
}

export const CampaignPerformanceCard: React.FC<CampaignPerformanceCardProps> = ({
  campaigns,
  leads
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-700 border border-brand-200">
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Rendimiento de Campañas & Atribución
            </h3>
            <p className="text-[11px] text-slate-500">Métricas de captación de la preventa comercial</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {campaigns.map(camp => {
          const campLeads = leads.filter(l => l.campaignId === camp.id);
          const qualifiedLeads = campLeads.filter(l => ['CALIFICADO', 'VISITA_AGENDADA', 'LOTE_IDENTIFICATED', 'NEGOCIACION', 'RESERVA_CONFIRMADA'].includes(l.status));
          const convertedLeads = campLeads.filter(l => ['RESERVA_CONFIRMADA', 'INTENCION_RESERVA', 'SENA_PENDIENTE'].includes(l.status));

          const costPerLead = campLeads.length > 0 ? camp.spentUSD / campLeads.length : 0;

          return (
            <div key={camp.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-1">
                <span className="font-extrabold text-slate-900 line-clamp-1">{camp.name}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-800 font-extrabold text-[9px] shrink-0">
                  {camp.platform}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 text-center py-1 bg-white rounded-xl border border-slate-200 text-[10px]">
                <div>
                  <div className="text-slate-400 font-bold">Leads</div>
                  <div className="font-extrabold text-slate-900 text-xs">{campLeads.length || camp.leadsGenerated}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-bold">CPL Est.</div>
                  <div className="font-extrabold text-slate-900 text-xs">{formatUSD(costPerLead)}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-bold">Inversión</div>
                  <div className="font-extrabold text-slate-900 text-xs">{formatUSD(camp.spentUSD)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
