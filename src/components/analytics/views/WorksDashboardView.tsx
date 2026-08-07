import React from 'react';
import { WorksMetrics, AnalyticsFilter } from '../../../domain/analyticsEngine';
import { KPICard } from '../KPICard';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { HardHat, AlertTriangle, CheckCircle2, Clock, Star, ArrowRight } from 'lucide-react';
import { formatUSD } from '../../../domain/rules';

interface WorksDashboardViewProps {
  metrics: WorksMetrics;
  filter: AnalyticsFilter;
  onNavigateModule: (mod: string) => void;
}

export const WorksDashboardView: React.FC<WorksDashboardViewProps> = ({
  metrics,
  onNavigateModule
}) => {
  return (
    <div className="space-y-4">
      {/* Works Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <KPICard
          title="Obras Activas"
          value={metrics.activeWorksCount}
          subtext={`${metrics.worksToStartCount} por iniciar`}
          badgeText="En Ejecución"
          badgeVariant="info"
          icon={HardHat}
          iconColor="text-brand-600"
          onClick={() => onNavigateModule('works')}
        />

        <KPICard
          title="Obras Finalizadas"
          value={metrics.completedWorksCount}
          subtext={`${metrics.activeWarrantiesCount} garantías vigentes`}
          badgeText="Entregadas"
          badgeVariant="success"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          onClick={() => onNavigateModule('works')}
        />

        <KPICard
          title="Obras Demoradas"
          value={metrics.delayedWorksCount}
          subtext={`${metrics.openIncidentsCount} incidencias abiertas`}
          badgeText="Atención"
          badgeVariant="danger"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          onClick={() => onNavigateModule('works')}
        />

        <KPICard
          title="Solicitudes Pendientes"
          value={metrics.openRequestsCount}
          subtext={`${metrics.pendingQuotesCount} cotizaciones esperando`}
          badgeText="Gestión"
          badgeVariant="warning"
          icon={Clock}
          iconColor="text-amber-600"
        />
      </div>

      {/* Provider Scorecards Section */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Desempeño & Evaluación de Proveedores</span>
          </div>
          <button
            onClick={() => onNavigateModule('works')}
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            <span>Ver Obras</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {metrics.providerPerformances.map(p => (
            <div key={p.providerId} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900">{p.name}</h4>
                  <span className="text-[10px] text-slate-500 block truncate">{p.category}</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold text-xs border border-amber-200">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                  <span>{p.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-150">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Cumplimiento</span>
                  <span className="font-extrabold text-emerald-700">{p.compliancePercent}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Incidencias</span>
                  <span className="font-extrabold text-rose-600">{p.incidentsCount}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Monto Contratado</span>
                  <span className="font-extrabold text-slate-900">{formatUSD(p.contractedValueUSD)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Respuesta</span>
                  <span className="font-extrabold text-slate-800">{p.avgResponseDays} días</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                <span>{p.completedJobs} / {p.assignedJobs} trabajos completados</span>
                <Badge variant={p.compliancePercent >= 90 ? 'success' : 'warning'}>
                  {p.compliancePercent >= 90 ? 'Excelente' : 'Aceptable'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
