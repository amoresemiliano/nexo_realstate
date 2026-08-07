import React from 'react';
import { CommercialMetrics, AnalyticsFilter } from '../../../domain/analyticsEngine';
import { KPICard } from '../KPICard';
import { FunnelChart } from '../FunnelChart';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Users, Target, Clock, Award, ArrowRight, DollarSign } from 'lucide-react';
import { formatUSD } from '../../../domain/rules';

interface CommercialDashboardViewProps {
  metrics: CommercialMetrics;
  filter: AnalyticsFilter;
  onNavigateModule: (mod: string) => void;
}

export const CommercialDashboardView: React.FC<CommercialDashboardViewProps> = ({
  metrics,
  onNavigateModule
}) => {
  return (
    <div className="space-y-4">
      {/* Commercial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <KPICard
          title="Leads Ingresados"
          value={metrics.totalLeads}
          subtext={`${metrics.newLeads} nuevos sin asignar`}
          badgeText="Pipeline Active"
          badgeVariant="info"
          icon={Users}
          iconColor="text-brand-600"
          onClick={() => onNavigateModule('leads')}
        />

        <KPICard
          title="Conversión a Venta"
          value={`${metrics.overallConversionRatePercent}%`}
          subtext={`${metrics.totalSales} ventas cerradas`}
          badgeText="Global CRM"
          badgeVariant="success"
          icon={Target}
          iconColor="text-emerald-600"
          onClick={() => onNavigateModule('sales')}
        />

        <KPICard
          title="Tiempo 1° Respuesta"
          value={`${metrics.avgFirstResponseTimeHours} hs`}
          subtext={`${metrics.stagnantLeadsCount} leads estancados >24hs`}
          badgeText="SLA Objetivo: <2hs"
          badgeVariant={metrics.avgFirstResponseTimeHours <= 2 ? 'success' : 'warning'}
          icon={Clock}
          iconColor="text-amber-600"
        />

        <KPICard
          title="Pipeline Potencial"
          value={formatUSD(metrics.potentialPipelineValueUSD)}
          subtext={`${metrics.activeOpportunities} en cotización/visita`}
          badgeText="Valor Estimado"
          badgeVariant="neutral"
          icon={DollarSign}
          iconColor="text-indigo-600"
          onClick={() => onNavigateModule('quotes')}
        />
      </div>

      {/* Sales Funnel Chart */}
      <FunnelChart steps={metrics.funnel} />

      {/* Seller Performance Neutral Table */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Award className="w-4 h-4 text-brand-600" />
            <span>Rendimiento por Asesor Comercial</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">{metrics.sellerPerformance.length} Vendedores</span>
        </div>

        <div className="overflow-x-auto -mx-3 px-3">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2 pr-2">Asesor</th>
                <th className="py-2 px-2 text-center">Leads</th>
                <th className="py-2 px-2 text-center">Visitas</th>
                <th className="py-2 px-2 text-center">Cotiz.</th>
                <th className="py-2 px-2 text-center">Reservas</th>
                <th className="py-2 px-2 text-center">Ventas</th>
                <th className="py-2 px-2 text-center">Conversión</th>
                <th className="py-2 pl-2 text-right">Monto Vendido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.sellerPerformance.map(s => (
                <tr key={s.sellerId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 pr-2 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-[10px] font-extrabold flex items-center justify-center shrink-0">
                      {s.avatar}
                    </span>
                    <span className="truncate">{s.sellerName}</span>
                  </td>
                  <td className="py-2.5 px-2 text-center font-medium text-slate-700">{s.assignedLeads}</td>
                  <td className="py-2.5 px-2 text-center font-medium text-slate-700">{s.visitsCount}</td>
                  <td className="py-2.5 px-2 text-center font-medium text-slate-700">{s.quotesCount}</td>
                  <td className="py-2.5 px-2 text-center font-bold text-amber-700">{s.reservationsCount}</td>
                  <td className="py-2.5 px-2 text-center font-bold text-emerald-700">{s.salesCount}</td>
                  <td className="py-2.5 px-2 text-center">
                    <Badge variant={s.conversionRatePercent >= 18 ? 'success' : 'neutral'}>
                      {s.conversionRatePercent}%
                    </Badge>
                  </td>
                  <td className="py-2.5 pl-2 text-right font-extrabold text-slate-900">
                    {formatUSD(s.totalSalesValueUSD)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Campaign Performance Table */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Rendimiento de Campañas de Marketing
          </span>
          <button
            onClick={() => onNavigateModule('campaigns')}
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            <span>Ver Campañas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {metrics.campaignPerformance.map(c => (
            <div key={c.campaignId} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{c.name}</h4>
                  <span className="text-[10px] text-slate-500">{c.channel} • Inversión: {formatUSD(c.spendUSD)}</span>
                </div>
                <Badge variant="brand">{c.leadsCount} Leads</Badge>
              </div>

              <div className="grid grid-cols-3 gap-1 text-[11px] bg-white p-2 rounded-lg border border-slate-150">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">CPL</span>
                  <span className="font-extrabold text-slate-800">{formatUSD(c.cplUSD)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">Costo/Reserva</span>
                  <span className="font-extrabold text-amber-700">{formatUSD(c.costPerReservationUSD)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block">Costo/Venta</span>
                  <span className="font-extrabold text-emerald-700">{formatUSD(c.costPerSaleUSD)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
