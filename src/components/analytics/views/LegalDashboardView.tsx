import React from 'react';
import { LegalMetrics, AnalyticsFilter } from '../../../domain/analyticsEngine';
import { KPICard } from '../KPICard';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Scale, FileCheck, Clock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface LegalDashboardViewProps {
  metrics: LegalMetrics;
  filter: AnalyticsFilter;
  onNavigateModule: (mod: string) => void;
}

export const LegalDashboardView: React.FC<LegalDashboardViewProps> = ({
  metrics,
  onNavigateModule
}) => {
  return (
    <div className="space-y-4">
      {/* Legal Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <KPICard
          title="Aptos para Escriturar"
          value={metrics.eligibleForDeedCount}
          subtext="Lotes con venta 100% saldada"
          badgeText="Aprobados"
          badgeVariant="success"
          icon={FileCheck}
          iconColor="text-emerald-600"
          onClick={() => onNavigateModule('legal')}
        />

        <KPICard
          title="Expedientes Activos"
          value={metrics.activeProcessesCount}
          subtext={`${metrics.incompleteDocsCount} con doc. pendiente`}
          badgeText="En Escribanía"
          badgeVariant="info"
          icon={Scale}
          iconColor="text-sky-600"
          onClick={() => onNavigateModule('legal')}
        />

        <KPICard
          title="Firmas Próximas"
          value={metrics.upcomingSigningsCount}
          subtext={`${metrics.observedCasesCount} casos observados`}
          badgeText="Agenda 14 días"
          badgeVariant="warning"
          icon={Clock}
          iconColor="text-amber-600"
        />

        <KPICard
          title="Demorados / Mora Legal"
          value={metrics.delayedCasesCount}
          subtext={`${metrics.moraEscalatedCount} intimación enviada`}
          badgeText="Revision"
          badgeVariant="danger"
          icon={AlertTriangle}
          iconColor="text-rose-600"
        />
      </div>

      {/* Cycle Time Averages Card */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Tiempo Promedio de Ciclo Escriturario</span>
          </div>
          <span className="text-xs font-black text-brand-700">{metrics.avgCycleDays.totalCycleDays} Días Totales</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">1. Inicio → Doc. Completa</span>
            <span className="text-sm font-black text-slate-900">{metrics.avgCycleDays.initToCompleteDoc} días</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Recolección de planos y DNI</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">2. Doc. → Firma Escritura</span>
            <span className="text-sm font-black text-slate-900">{metrics.avgCycleDays.docToSigning} días</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Estudio de títulos y certificados</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">3. Firma → Inscripción</span>
            <span className="text-sm font-black text-slate-900">{metrics.avgCycleDays.signingToRegistration} días</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Registro de la Propiedad Inmueble</span>
          </div>
        </div>
      </Card>

      {/* Process Status Breakdown */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Etapas de Expedientes en Curso
          </span>
          <button
            onClick={() => onNavigateModule('legal')}
            className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            <span>Ir a Módulo Legales</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {metrics.processByStatus.map(st => (
            <div key={st.status} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-500 block truncate">{st.label}</span>
              <div className="text-lg font-black text-slate-900">{st.count}</div>
              <Badge variant="neutral">Casos activos</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
