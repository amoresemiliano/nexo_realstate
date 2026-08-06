import React from 'react';
import { mockCampaigns } from '../../data/mockData';
import { formatUSD } from '../../domain/rules';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Target, TrendingUp, DollarSign, Users } from 'lucide-react';

export const CampaignsModule: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Campañas de Marketing</h2>
          <p className="text-xs text-slate-500">Rendimiento de pauta publicitaria y captación de leads</p>
        </div>
        <Target className="w-6 h-6 text-brand-600" />
      </div>

      <div className="space-y-3">
        {mockCampaigns.map(camp => {
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
    </div>
  );
};
