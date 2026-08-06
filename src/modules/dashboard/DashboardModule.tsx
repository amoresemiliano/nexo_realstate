import React from 'react';
import {
  Users,
  MapPin,
  BookmarkCheck,
  AlertTriangle,
  TrendingUp,
  PlusCircle,
  Calculator,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { mockDevelopment, mockLots, mockLeads, mockHolds, mockAlerts, mockSales } from '../../data/mockData';
import { formatUSD } from '../../domain/rules';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardModuleProps {
  onNavigate: (moduleId: string) => void;
  onOpenNewLead: () => void;
  onOpenHoldModal: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  onNavigate,
  onOpenNewLead,
  onOpenHoldModal,
}) => {
  const availableLotsCount = mockLots.filter(l => l.status === 'DISPONIBLE').length;
  const activeHoldsCount = mockHolds.filter(h => h.status === 'ACTIVO').length;
  const totalLeadsCount = mockLeads.length;
  const pendingAlertsCount = mockAlerts.length;

  // Chart data: Monthly Lead Generation & Sales Conversion
  const chartData = [
    { month: 'Mayo', leads: 32, ventas: 3 },
    { month: 'Junio', leads: 48, ventas: 5 },
    { month: 'Julio', leads: 64, ventas: 7 },
    { month: 'Agosto', leads: 42, ventas: 4 },
  ];

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-slate-950 text-white p-4 rounded-2xl shadow-md border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="brand" className="bg-brand-500/20 text-brand-300 border-brand-500/30">
            Resumen General MVP
          </Badge>
          <span className="text-[11px] text-slate-400 font-mono">Actualizado hoy</span>
        </div>
        <h2 className="text-xl font-black tracking-tight">{mockDevelopment.name}</h2>
        <p className="text-xs text-slate-300 mt-1">{mockDevelopment.description}</p>
        
        {/* Stages mini summary */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-xs">
          {mockDevelopment.stages.map(stg => (
            <div key={stg.id} className="bg-slate-800/60 p-2 rounded-xl">
              <span className="font-bold text-slate-200 block truncate">{stg.name}</span>
              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                <span>{stg.availableLots} disp.</span>
                <span className="text-brand-300 font-bold">{stg.completionPercentage}% Obra</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High Severity Alert Banner */}
      {pendingAlertsCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-xs font-bold text-amber-900">
              {pendingAlertsCount} Alertas Operativas Requieren Atención
            </h3>
            <p className="text-[11px] text-amber-700 mt-0.5">
              {mockAlerts[0].title}: {mockAlerts[0].description}
            </p>
            <button
              onClick={() => onNavigate('reservations')}
              className="mt-2 text-xs font-bold text-amber-800 underline flex items-center gap-1 hover:text-amber-950"
            >
              <span>Resolver en módulo de Señas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Action Bar (Mobile First) */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-1">Acciones Rápidas</span>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="primary"
            onClick={onOpenNewLead}
            className="h-12 text-xs flex items-center justify-start gap-2.5 px-3"
          >
            <PlusCircle className="w-4 h-4 shrink-0 text-brand-200" />
            <div className="text-left">
              <span className="block font-bold leading-tight">Nuevo Lead</span>
              <span className="text-[10px] text-brand-200 font-normal">Capturar oportunidad</span>
            </div>
          </Button>

          <Button
            variant="secondary"
            onClick={onOpenHoldModal}
            className="h-12 text-xs flex items-center justify-start gap-2.5 px-3"
          >
            <Lock className="w-4 h-4 shrink-0 text-amber-400" />
            <div className="text-left">
              <span className="block font-bold leading-tight">Bloquear Lote</span>
              <span className="text-[10px] text-slate-300 font-normal">Reserva de 48hs</span>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => onNavigate('quotes')}
            className="h-12 text-xs flex items-center justify-start gap-2.5 px-3"
          >
            <Calculator className="w-4 h-4 shrink-0 text-slate-600" />
            <div className="text-left">
              <span className="block font-bold text-slate-900 leading-tight">Simular Cotización</span>
              <span className="text-[10px] text-slate-500 font-normal">Anticipo + Cuotas</span>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => onNavigate('lots')}
            className="h-12 text-xs flex items-center justify-start gap-2.5 px-3"
          >
            <MapPin className="w-4 h-4 shrink-0 text-emerald-600" />
            <div className="text-left">
              <span className="block font-bold text-slate-900 leading-tight">Ver Masterplan</span>
              <span className="text-[10px] text-slate-500 font-normal">Estado de 50 lotes</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile KPI Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <Card padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Lotes Disponibles</span>
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{availableLotsCount}</div>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block">
            de 52 totales
          </span>
        </Card>

        <Card padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Leads Activos</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalLeadsCount}</div>
          <span className="text-[10px] text-brand-600 font-bold bg-brand-50 px-1.5 py-0.5 rounded-md inline-block">
            +18% este mes
          </span>
        </Card>

        <Card padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Bloqueos Temporales</span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeHoldsCount}</div>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md inline-block">
            Vencen en &lt;48hs
          </span>
        </Card>

        <Card padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Cuotas Vencidas</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">1</div>
          <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded-md inline-block">
            Lote B-4 ($933 USD)
          </span>
        </Card>
      </div>

      {/* Mini Trend Chart */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <span>Captación & Conversión Mensual</span>
          </div>
          <span className="text-[10px] text-slate-400">Leads vs Ventas</span>
        </div>

        <div className="h-36 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                formatter={(val, name) => [val, name === 'leads' ? 'Leads' : 'Ventas']}
              />
              <Bar dataKey="leads" fill="#0270c1" radius={[4, 4, 0, 0]} name="leads" />
              <Bar dataKey="ventas" fill="#10b981" radius={[4, 4, 0, 0]} name="ventas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Lead Pipeline Activity */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Últimos Leads Ingresados</span>
          <button
            onClick={() => onNavigate('leads')}
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-0.5"
          >
            <span>Ver CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {mockLeads.slice(0, 3).map(lead => (
            <div
              key={lead.id}
              onClick={() => onNavigate('leads')}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div>
                <div className="text-xs font-extrabold text-slate-900">{lead.fullName}</div>
                <div className="text-[11px] text-slate-500 font-medium">{lead.channel} • Presupuesto: {formatUSD(lead.budgetUSD)}</div>
              </div>
              <Badge variant="brand">{lead.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
