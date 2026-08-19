import React from 'react';
import { CommercialMetrics, AnalyticsFilter } from '../../../domain/analyticsEngine';
import { KPICard } from '../KPICard';
import { FunnelChart } from '../FunnelChart';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import {
  Users,
  Target,
  Clock,
  Award,
  ArrowRight,
  DollarSign,
  BookmarkCheck,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { formatUSD } from '../../../domain/rules';
import { Lead, LotHold, Reservation, Deposit, Campaign } from '../../../types';

interface CommercialDashboardViewProps {
  metrics: CommercialMetrics;
  filter: AnalyticsFilter;
  leads?: Lead[];
  holds?: LotHold[];
  reservations?: Reservation[];
  deposits?: Deposit[];
  campaigns?: Campaign[];
  onNavigateModule: (mod: string) => void;
}

export const CommercialDashboardView: React.FC<CommercialDashboardViewProps> = ({
  metrics,
  leads = [],
  holds = [],
  reservations = [],
  deposits = [],
  campaigns = [],
  onNavigateModule,
}) => {
  // Calculations for consolidated Commercial KPI Tarjetas
  const newLeadsCount = leads.filter((l) => l.status === 'NUEVO').length;
  const inFollowUpCount = leads.filter((l) => l.status === 'SEGUIMIENTO' || l.status === 'CONTACTADO').length;
  const qualifiedCount = leads.filter((l) => l.status === 'CALIFICADO').length;

  const activeHoldsCount = holds.filter((h) => h.status === 'ACTIVO').length;
  const activeReservationsCount = reservations.filter((r) => r.status === 'CONFIRMADA' || r.status === 'SENA_VALIDADA').length;
  const registeredDepositsCount = deposits.filter((d) => d.status === 'VALIDADA' || d.status === 'EN_VALIDACION').length;

  const activeCampaignsList = campaigns.filter((c) => c.status === 'ACTIVA');
  const totalCampaignSpentUSD = campaigns.reduce((acc, c) => acc + (c.spentUSD || 0), 0);
  const totalCampaignLeads = campaigns.reduce((acc, c) => acc + (c.leadsGenerated || 0), 0);
  const avgCplUSD = totalCampaignLeads > 0 ? Math.round(totalCampaignSpentUSD / totalCampaignLeads) : 0;

  // Best campaign highlights
  const lowestCplCampaign = [...campaigns]
    .filter((c) => c.leadsGenerated > 0)
    .sort((a, b) => a.spentUSD / a.leadsGenerated - b.spentUSD / b.leadsGenerated)[0];
  const highestVolumeCampaign = [...campaigns].sort((a, b) => b.leadsGenerated - a.leadsGenerated)[0];

  // Attention items for "Qué requiere atención"
  const uncontactedLeads = leads.filter((l) => l.status === 'NUEVO' || l.status === 'PENDIENTE_PRIMER_CONTACTO');
  const expiringHolds = holds.filter((h) => h.status === 'ACTIVO');
  const pendingDeposits = deposits.filter((d) => d.status === 'EN_VALIDACION');

  return (
    <div className="space-y-4">
      {/* 1. SECCIÓN PRINCIPAL: CONSOLIDATED COMMERCIAL KPIS */}
      <div className="space-y-2">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1">Resumen Ejecutivo CRM</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Card Leads */}
          <div
            onClick={() => onNavigateModule('leads')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-300 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-600" /> Leads Totales
              </span>
              <Badge variant="info">{metrics.totalLeads} Registrados</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{metrics.totalLeads}</span>
              <span className="text-xs font-bold text-emerald-600">{metrics.overallConversionRatePercent}% Conv.</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] text-center pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-1 rounded-lg">
                <span className="text-slate-400 block font-bold">Nuevos</span>
                <span className="font-extrabold text-brand-700">{newLeadsCount}</span>
              </div>
              <div className="bg-slate-50 p-1 rounded-lg">
                <span className="text-slate-400 block font-bold">Seguim.</span>
                <span className="font-extrabold text-slate-800">{inFollowUpCount}</span>
              </div>
              <div className="bg-slate-50 p-1 rounded-lg">
                <span className="text-slate-400 block font-bold">Calific.</span>
                <span className="font-extrabold text-emerald-700">{qualifiedCount}</span>
              </div>
            </div>
          </div>

          {/* Card Campañas */}
          <div
            onClick={() => onNavigateModule('campaigns')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-300 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-brand-600" /> Pauta & MKT
              </span>
              <Badge variant="brand">{activeCampaignsList.length} Activas</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{totalCampaignLeads} <span className="text-xs font-semibold text-slate-500">Leads</span></span>
              <span className="text-xs font-bold text-amber-700">${avgCplUSD} CPL</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-center pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-1 rounded-lg">
                <span className="text-slate-400 block font-bold">Inversión</span>
                <span className="font-extrabold text-slate-800">{formatUSD(totalCampaignSpentUSD)}</span>
              </div>
              <div className="bg-amber-500/10 p-1 rounded-lg">
                <span className="text-amber-700 block font-bold">CPL Promedio</span>
                <span className="font-extrabold text-amber-800">${avgCplUSD} USD</span>
              </div>
            </div>
          </div>

          {/* Card Reservas / Señas */}
          <div
            onClick={() => onNavigateModule('reservations')}
            className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-300 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-emerald-600" /> Reservas & Señas
              </span>
              <Badge variant="success">{activeReservationsCount} Confirmadas</Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{activeHoldsCount + activeReservationsCount}</span>
              <span className="text-xs font-bold text-emerald-600">{registeredDepositsCount} Señas</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] text-center pt-2 border-t border-slate-100">
              <div className="bg-amber-50 p-1 rounded-lg">
                <span className="text-amber-700 block font-bold">Bloqueos</span>
                <span className="font-extrabold text-amber-800">{activeHoldsCount}</span>
              </div>
              <div className="bg-emerald-50 p-1 rounded-lg">
                <span className="text-emerald-700 block font-bold">Reservas</span>
                <span className="font-extrabold text-emerald-800">{activeReservationsCount}</span>
              </div>
              <div className="bg-slate-50 p-1 rounded-lg">
                <span className="text-slate-400 block font-bold">Señas Valid.</span>
                <span className="font-extrabold text-slate-800">{registeredDepositsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECCIÓN FUNNEL / PIPELINE */}
      <FunnelChart steps={metrics.funnel} />

      {/* 3. SECCIÓN ATENCIÓN REQUERIDA ("Qué requiere atención") */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>Acciones Requeridas en el CRM</span>
          </div>
          <span className="text-[10px] bg-amber-500/10 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
            Atención Inmediata
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div
            onClick={() => onNavigateModule('leads')}
            className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-rose-50 transition-colors"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-rose-700 uppercase block">Leads Sin Contactar</span>
              <span className="text-base font-black text-rose-900">{uncontactedLeads.length} prospectos</span>
              <span className="text-[10px] text-rose-600 block">SLA Objetivo: &lt;2hs</span>
            </div>
            <ArrowRight className="w-4 h-4 text-rose-400" />
          </div>

          <div
            onClick={() => onNavigateModule('reservations')}
            className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-amber-50 transition-colors"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase block">Bloqueos 48hs Activos</span>
              <span className="text-base font-black text-amber-900">{expiringHolds.length} lotes</span>
              <span className="text-[10px] text-amber-600 block">Próximos a vencer</span>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </div>

          <div
            onClick={() => onNavigateModule('reservations')}
            className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-emerald-50 transition-colors"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase block">Señas Pendientes</span>
              <span className="text-base font-black text-emerald-900">{pendingDeposits.length} señas</span>
              <span className="text-[10px] text-emerald-600 block">Requieren comprobación</span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </Card>

      {/* 4. SECCIÓN DESTACADOS Y RESUMEN DE CAMPAÑAS */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Rendimiento de Campañas de Marketing
          </span>
          <button
            onClick={() => onNavigateModule('campaigns')}
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Todas las Campañas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Highlights */}
        {(lowestCplCampaign || highestVolumeCampaign) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-1">
            {lowestCplCampaign && (
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] font-extrabold text-emerald-700 uppercase block">Mejor CPL</span>
                  <span className="text-xs font-bold text-slate-900 truncate block">{lowestCplCampaign.name}</span>
                  <span className="text-[10px] text-slate-600">
                    CPL: <strong>${Math.round(lowestCplCampaign.spentUSD / lowestCplCampaign.leadsGenerated)} USD</strong>
                  </span>
                </div>
              </div>
            )}

            {highestVolumeCampaign && (
              <div className="bg-brand-50 border border-brand-200 p-2.5 rounded-xl flex items-center gap-2.5">
                <Users className="w-4 h-4 text-brand-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[9px] font-extrabold text-brand-700 uppercase block">Mayor Volumen</span>
                  <span className="text-xs font-bold text-slate-900 truncate block">{highestVolumeCampaign.name}</span>
                  <span className="text-[10px] text-slate-600">
                    Leads: <strong>{highestVolumeCampaign.leadsGenerated}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {campaigns.slice(0, 3).map((c) => {
            const costPerLeadUSD = c.leadsGenerated > 0 ? Math.round(c.spentUSD / c.leadsGenerated) : 0;
            return (
              <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{c.name}</h4>
                    <span className="text-[10px] text-slate-500">{c.platform} • Inversión: {formatUSD(c.spentUSD)}</span>
                  </div>
                  <Badge variant="brand">{c.leadsGenerated} Leads</Badge>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[11px] bg-white p-2 rounded-lg border border-slate-150 text-center">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block">CPL</span>
                    <span className="font-extrabold text-slate-800">${costPerLeadUSD} USD</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block">Ventas/Conv.</span>
                    <span className="font-extrabold text-emerald-700">{c.conversions}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 5. VENDEDORES PERFORMANCE TABLE */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Award className="w-4 h-4 text-brand-600" />
            <span>Rendimiento de Asesores Comerciales</span>
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
                <th className="py-2 px-2 text-center">Reservas</th>
                <th className="py-2 px-2 text-center">Conversión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.sellerPerformance.map((s) => (
                <tr key={s.sellerId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 pr-2 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-[10px] font-extrabold flex items-center justify-center shrink-0">
                      {s.avatar}
                    </span>
                    <span className="truncate">{s.sellerName}</span>
                  </td>
                  <td className="py-2.5 px-2 text-center font-medium text-slate-700">{s.assignedLeads}</td>
                  <td className="py-2.5 px-2 text-center font-medium text-slate-700">{s.visitsCount}</td>
                  <td className="py-2.5 px-2 text-center font-bold text-amber-700">{s.reservationsCount}</td>
                  <td className="py-2.5 px-2 text-center">
                    <Badge variant={s.conversionRatePercent >= 18 ? 'success' : 'neutral'}>
                      {s.conversionRatePercent}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
