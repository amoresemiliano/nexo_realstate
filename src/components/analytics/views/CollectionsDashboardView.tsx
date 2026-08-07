import React from 'react';
import { CollectionMetrics, AnalyticsFilter } from '../../../domain/analyticsEngine';
import { KPICard } from '../KPICard';
import { AgingChart } from '../AgingChart';
import { Card } from '../../ui/Card';
import { Wallet, AlertTriangle, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { formatUSD } from '../../../domain/rules';

interface CollectionsDashboardViewProps {
  metrics: CollectionMetrics;
  filter: AnalyticsFilter;
  onNavigateModule: (mod: string) => void;
}

export const CollectionsDashboardView: React.FC<CollectionsDashboardViewProps> = ({
  metrics,
  onNavigateModule
}) => {
  return (
    <div className="space-y-4">
      {/* Top Treasury KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <KPICard
          title="Cobro Previsto Hoy"
          value={formatUSD(metrics.expectedTodayUSD)}
          subtext="Vencimientos del día"
          badgeText="Hoy"
          badgeVariant="info"
          icon={Calendar}
          iconColor="text-brand-600"
          onClick={() => onNavigateModule('payments')}
        />

        <KPICard
          title="Cobro Previsto Mes"
          value={formatUSD(metrics.expectedMonthUSD)}
          subtext={`Cobrado: ${formatUSD(metrics.collectedMonthUSD)}`}
          badgeText={`${metrics.collectionFulfillmentPercent}% Cumplido`}
          badgeVariant={metrics.collectionFulfillmentPercent >= 80 ? 'success' : 'warning'}
          icon={Wallet}
          iconColor="text-emerald-600"
          onClick={() => onNavigateModule('payments')}
        />

        <KPICard
          title="Mora Crítica (+30d)"
          value={formatUSD(metrics.moraCriticalUSD)}
          subtext={`${metrics.overdueInstallmentsCount} cuotas impagas`}
          badgeText="Acción Requerida"
          badgeVariant="danger"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          onClick={() => onNavigateModule('payments')}
        />

        <KPICard
          title="Sin Conciliar"
          value={formatUSD(metrics.unconciliatedPaymentsUSD)}
          subtext={`${metrics.paymentPromisesCount} promesas registradas`}
          badgeText="Bancario"
          badgeVariant="neutral"
          icon={Clock}
          iconColor="text-amber-600"
        />
      </div>

      {/* Portfolio Aging Chart */}
      <AgingChart buckets={metrics.agingBuckets} />

      {/* Projections Table */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Proyección y Pronóstico de Cobranza</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Próximos 90 Días</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {metrics.projections.map(proj => (
            <div key={proj.period} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-black text-slate-900 block">{proj.label}</span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Esperado:</span>
                  <strong className="text-slate-900">{formatUSD(proj.expectedUSD)}</strong>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Vencido estimado:</span>
                  <strong>{formatUSD(proj.overdueUSD)}</strong>
                </div>
                <div className="flex justify-between text-emerald-700 pt-1 border-t border-slate-200 font-extrabold">
                  <span>Proyección Cobro:</span>
                  <span>{formatUSD(proj.collectedUSD)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
