import React from 'react';
import {
  ExecutiveMetrics,
  CommercialMetrics,
  CollectionMetrics,
  LegalMetrics,
  WorksMetrics,
  DevelopmentPortfolioItem,
  QuickInsight,
  AnalyticsFilter
} from '../../../domain/analyticsEngine';
import { KPICard } from '../KPICard';
import { PortfolioCard } from '../PortfolioCard';
import { AgingChart } from '../AgingChart';
import { FunnelChart } from '../FunnelChart';
import { InsightCard } from '../InsightCard';
import {
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  HardHat,
  Users,
  Wallet
} from 'lucide-react';
import { formatUSD } from '../../../domain/rules';

interface ExecutiveDashboardViewProps {
  executiveMetrics: ExecutiveMetrics;
  commercialMetrics: CommercialMetrics;
  collectionMetrics: CollectionMetrics;
  legalMetrics: LegalMetrics;
  worksMetrics: WorksMetrics;
  portfolio: DevelopmentPortfolioItem[];
  insights: QuickInsight[];
  filter: AnalyticsFilter;
  onNavigateModule: (mod: string) => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardViewProps> = ({
  executiveMetrics,
  commercialMetrics,
  collectionMetrics,
  legalMetrics,
  worksMetrics,
  portfolio,
  insights,
  onNavigateModule
}) => {
  return (
    <div className="space-y-4">
      {/* High level KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <KPICard
          title="Lotes Comercializados"
          value={`${executiveMetrics.soldLots + executiveMetrics.reservedLots} / ${executiveMetrics.totalLots}`}
          subtext={`${executiveMetrics.availableLots} disponibles`}
          badgeText="Ocupación"
          badgeVariant="info"
          icon={Building2}
          iconColor="text-brand-600"
          onClick={() => onNavigateModule('lots')}
        />

        <KPICard
          title="Ventas Acumuladas"
          value={formatUSD(executiveMetrics.totalSalesValueUSD)}
          subtext={`Financiado: ${formatUSD(executiveMetrics.financedAmountUSD)}`}
          badgeText="+14% vs anterior"
          badgeVariant="success"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          onClick={() => onNavigateModule('sales')}
        />

        <KPICard
          title="Cobranza Esperada Mes"
          value={formatUSD(executiveMetrics.expectedCollectionMonthUSD)}
          subtext={`Cobrado: ${formatUSD(executiveMetrics.collectedAmountMonthUSD)} (${collectionMetrics.collectionFulfillmentPercent}%)`}
          badgeText={collectionMetrics.collectionFulfillmentPercent >= 85 ? 'Meta Cumplida' : 'En Gestión'}
          badgeVariant={collectionMetrics.collectionFulfillmentPercent >= 85 ? 'success' : 'warning'}
          icon={Wallet}
          iconColor="text-indigo-600"
          onClick={() => onNavigateModule('payments')}
        />

        <KPICard
          title="Mora Total Registrada"
          value={formatUSD(executiveMetrics.totalMoraAmountUSD)}
          subtext={`Tasa de mora: ${executiveMetrics.defaultRatePercent}%`}
          badgeText={`${collectionMetrics.overdueInstallmentsCount} cuotas vencidas`}
          badgeVariant="danger"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          onClick={() => onNavigateModule('payments')}
        />
      </div>

      {/* Secondary KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Escrituras Activas</span>
            <span className="text-sm font-extrabold text-slate-900">{executiveMetrics.activeLegalProcesses} procesos</span>
          </div>
          <FileCheck className="w-4 h-4 text-sky-600" />
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Obras en Ejecución</span>
            <span className="text-sm font-extrabold text-slate-900">{executiveMetrics.activeWorksCount} obras</span>
          </div>
          <HardHat className="w-4 h-4 text-amber-600" />
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Comisiones Devengadas</span>
            <span className="text-sm font-extrabold text-slate-900">{formatUSD(executiveMetrics.devengadasCommissionsUSD)}</span>
          </div>
          <DollarSign className="w-4 h-4 text-emerald-600" />
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">MRR Postventa</span>
            <span className="text-sm font-extrabold text-slate-900">{formatUSD(executiveMetrics.estimatedMRRUSD)} /mes</span>
          </div>
          <Users className="w-4 h-4 text-purple-600" />
        </div>
      </div>

      {/* Quick Insights */}
      <InsightCard insights={insights} onNavigateModule={onNavigateModule} />

      {/* Development Portfolio Overview */}
      <PortfolioCard portfolio={portfolio} onSelectDevelopment={() => onNavigateModule('developments')} />

      {/* Funnel & Aging Dual Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FunnelChart steps={commercialMetrics.funnel} />
        <AgingChart buckets={collectionMetrics.agingBuckets} />
      </div>
    </div>
  );
};
