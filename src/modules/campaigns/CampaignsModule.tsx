import React, { useState } from 'react';
import { Campaign } from '../../types';
import { mockCampaigns } from '../../data/mockData';
import { formatUSD } from '../../domain/rules';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Target, PlusCircle, Award, TrendingUp, DollarSign, Users, Sparkles } from 'lucide-react';
import { CreateCampaignModal } from '../../components/campaigns/CreateCampaignModal';

interface CampaignsModuleProps {
  campaigns?: Campaign[];
  onCreateCampaign?: (campaign: Campaign) => void;
}

export const CampaignsModule: React.FC<CampaignsModuleProps> = ({
  campaigns = mockCampaigns,
  onCreateCampaign,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVA');
  const totalSpentUSD = campaigns.reduce((acc, c) => acc + (c.spentUSD || 0), 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + (c.leadsGenerated || 0), 0);
  const overallCplUSD = totalLeads > 0 ? Math.round(totalSpentUSD / totalLeads) : 0;

  // Best campaigns highlights
  const lowestCplCampaign = [...campaigns]
    .filter((c) => c.leadsGenerated > 0)
    .sort((a, b) => (a.spentUSD / a.leadsGenerated) - (b.spentUSD / b.leadsGenerated))[0];

  const highestLeadsCampaign = [...campaigns].sort((a, b) => b.leadsGenerated - a.leadsGenerated)[0];

  const handleCreate = (newCamp: Campaign) => {
    if (onCreateCampaign) {
      onCreateCampaign(newCamp);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900">Campañas de Marketing</h2>
            <Badge variant="brand">{activeCampaigns.length} Activas</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Rendimiento de pauta publicitaria y captación de leads</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nueva campaña</span>
        </button>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Campañas Activas</span>
          <span className="text-lg font-black text-slate-900 mt-0.5 block">{activeCampaigns.length}</span>
          <span className="text-[10px] text-slate-500 font-medium">{campaigns.length} registradas</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Leads</span>
          <span className="text-lg font-black text-slate-900 mt-0.5 block">{totalLeads}</span>
          <span className="text-[10px] text-emerald-600 font-bold">Originados en pauta</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Inversión Total</span>
          <span className="text-lg font-black text-slate-900 mt-0.5 block">{formatUSD(totalSpentUSD)}</span>
          <span className="text-[10px] text-slate-500 font-medium">Presupuesto pauta</span>
        </div>

        <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 shadow-xs">
          <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">CPL Promedio</span>
          <span className="text-lg font-black text-amber-800 mt-0.5 block">${overallCplUSD} USD</span>
          <span className="text-[10px] text-amber-600 font-bold">Costo por lead</span>
        </div>
      </div>

      {/* Highlights */}
      {(lowestCplCampaign || highestLeadsCampaign) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {lowestCplCampaign && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Menor CPL</span>
                <span className="text-xs font-black text-slate-900 truncate block">{lowestCplCampaign.name}</span>
                <span className="text-[11px] text-slate-600">
                  CPL: <strong>${Math.round(lowestCplCampaign.spentUSD / lowestCplCampaign.leadsGenerated)} USD</strong> ({lowestCplCampaign.platform})
                </span>
              </div>
            </div>
          )}

          {highestLeadsCampaign && (
            <div className="bg-brand-50 border border-brand-200 p-3 rounded-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-100 text-brand-700 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-brand-700 uppercase block">Mayor Volumen</span>
                <span className="text-xs font-black text-slate-900 truncate block">{highestLeadsCampaign.name}</span>
                <span className="text-[11px] text-slate-600">
                  Leads: <strong>{highestLeadsCampaign.leadsGenerated}</strong> ({highestLeadsCampaign.platform})
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Campaigns List */}
      <div className="space-y-3">
        {campaigns.map((camp) => {
          const costPerLeadUSD = camp.leadsGenerated > 0 ? Math.round(camp.spentUSD / camp.leadsGenerated) : 0;
          return (
            <Card key={camp.id} padding="md" className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-brand-600 font-extrabold uppercase">{camp.platform}</span>
                  <h3 className="text-sm font-black text-slate-900">{camp.name}</h3>
                </div>
                <Badge variant={camp.status === 'ACTIVA' ? 'success' : 'default'}>
                  {camp.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Leads</span>
                  <span className="text-sm font-black text-slate-900">{camp.leadsGenerated}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Inversión</span>
                  <span className="text-sm font-black text-slate-900">{formatUSD(camp.spentUSD)}</span>
                </div>
                <div className="bg-brand-50 p-2 rounded-xl">
                  <span className="text-[10px] text-brand-600 uppercase font-bold block">CPL Prom.</span>
                  <span className="text-sm font-black text-brand-700">${costPerLeadUSD} USD</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                <span>Ventas concretadas: <strong className="text-emerald-600">{camp.conversions} lotes</strong></span>
                <span>Vence: {camp.endDate}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal Nueva Campaña */}
      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateCampaign={handleCreate}
      />
    </div>
  );
};
