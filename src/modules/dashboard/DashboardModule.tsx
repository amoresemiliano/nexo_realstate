import React, { useState, useMemo } from 'react';
import {
  UserRole,
  Lot,
  Lead,
  Sale,
  PaymentPlan,
  LegalProcess,
  AlertItem,
  Seller,
  Campaign,
  Quote,
  LotHold,
  Reservation,
  Deposit,
  LotDocument,
  Development,
  Commission,
  AutomationRule,
  AutomationExecution,
  SystemTask
} from '../../types';
import {
  AnalyticsFilter,
  defaultAnalyticsFilter,
  getExecutiveMetrics,
  getCommercialMetrics,
  getCollectionMetrics,
  getLegalMetrics,
  getWorksMetrics,
  getAutomationMetrics,
  getDevelopmentPortfolio,
  getQuickInsights
} from '../../domain/analyticsEngine';

// Components
import { DashboardFilters } from '../../components/analytics/DashboardFilters';
import { ExecutiveDashboardView } from '../../components/analytics/views/ExecutiveDashboardView';
import { CommercialDashboardView } from '../../components/analytics/views/CommercialDashboardView';
import { CollectionsDashboardView } from '../../components/analytics/views/CollectionsDashboardView';
import { LegalDashboardView } from '../../components/analytics/views/LegalDashboardView';
import { WorksDashboardView } from '../../components/analytics/views/WorksDashboardView';
import { ClientDashboardView } from '../../components/analytics/views/ClientDashboardView';
import { ProviderDashboardView } from '../../components/analytics/views/ProviderDashboardView';

import {
  PlusCircle,
  Lock,
  Calculator,
  MapPin,
  Building2,
  Users,
  Wallet,
  Scale,
  HardHat,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ModuleVisibilityConfig } from '../../config/moduleVisibility';

interface DashboardModuleProps {
  userRole: UserRole;
  onSelectRole?: (role: UserRole) => void;
  lots: Lot[];
  leads: Lead[];
  sales: Sale[];
  paymentPlans: PaymentPlan[];
  legalProcesses: LegalProcess[];
  alerts: AlertItem[];
  sellers: Seller[];
  campaigns: Campaign[];
  quotes: Quote[];
  holds: LotHold[];
  reservations: Reservation[];
  deposits: Deposit[];
  documents: LotDocument[];
  developments: Development[];
  commissions?: Commission[];
  autoRules?: AutomationRule[];
  autoExecutions?: AutomationExecution[];
  autoTasks?: SystemTask[];
  onNavigate: (moduleId: string) => void;
  onOpenNewLead: () => void;
  onOpenHoldModal: () => void;
  moduleVisibility?: ModuleVisibilityConfig;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  userRole,
  onSelectRole,
  lots,
  leads,
  sales,
  paymentPlans,
  legalProcesses,
  alerts,
  sellers,
  campaigns,
  quotes,
  holds,
  reservations,
  deposits,
  documents,
  developments,
  commissions = [],
  autoRules = [],
  autoExecutions = [],
  autoTasks = [],
  onNavigate,
  onOpenNewLead,
  onOpenHoldModal
}) => {
  const [filter, setFilter] = useState<AnalyticsFilter>(defaultAnalyticsFilter);
  const [viewOverride, setViewOverride] = useState<string | null>(null);

  // Compute metrics dynamically via analyticsEngine
  const executiveMetrics = useMemo(
    () => getExecutiveMetrics(lots, leads, sales, paymentPlans, legalProcesses, alerts, commissions, filter),
    [lots, leads, sales, paymentPlans, legalProcesses, alerts, commissions, filter]
  );

  const commercialMetrics = useMemo(
    () => getCommercialMetrics(leads, sellers, campaigns, quotes, holds, reservations, sales, filter),
    [leads, sellers, campaigns, quotes, holds, reservations, sales, filter]
  );

  const collectionMetrics = useMemo(
    () => getCollectionMetrics(paymentPlans, deposits, filter),
    [paymentPlans, deposits, filter]
  );

  const legalMetrics = useMemo(
    () => getLegalMetrics(lots, legalProcesses, documents, filter),
    [lots, legalProcesses, documents, filter]
  );

  const worksMetrics = useMemo(
    () => getWorksMetrics([], filter),
    [filter]
  );

  const automationMetrics = useMemo(
    () => getAutomationMetrics(autoRules, autoExecutions, autoTasks, alerts),
    [autoRules, autoExecutions, autoTasks, alerts]
  );

  const portfolio = useMemo(
    () => getDevelopmentPortfolio(developments, lots, sales),
    [developments, lots, sales]
  );

  const insights = useMemo(
    () => getQuickInsights(leads, lots, legalProcesses, alerts),
    [leads, lots, legalProcesses, alerts]
  );

  // Determine active view mode based on role or override
  const activeRoleView = viewOverride || userRole;

  // Tabs for switching dashboard view perspective
  const roleTabs = [
    { id: 'GERENCIA', label: 'Ejecutivo', icon: Building2 },
    { id: 'VENDEDOR', label: 'Comercial', icon: Users },
    { id: 'TESORERIA', label: 'Cobranzas', icon: Wallet },
    { id: 'LEGAL', label: 'Legales', icon: Scale },
    { id: 'OBRAS', label: 'Obras', icon: HardHat },
    { id: 'CLIENTE', label: 'Mi Lote', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-4">
      {/* Role View Perspective Selector Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 shrink-0 text-xs font-bold text-slate-500 pl-1 pr-2">
          <BarChart3 className="w-4 h-4 text-brand-600" />
          <span className="hidden sm:inline">Perspectiva:</span>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {roleTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeRoleView === tab.id || (tab.id === 'GERENCIA' && (activeRoleView === 'ADMIN' || activeRoleView === 'GERENTE_COMERCIAL')) || (tab.id === 'VENDEDOR' && activeRoleView === 'COMERCIAL') || (tab.id === 'TESORERIA' && activeRoleView === 'ADMINISTRACION');

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setViewOverride(tab.id);
                  if (onSelectRole) onSelectRole(tab.id as UserRole);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button
          variant="primary"
          onClick={onOpenNewLead}
          className="h-11 text-xs flex items-center justify-start gap-2 px-3"
        >
          <PlusCircle className="w-4 h-4 shrink-0 text-brand-200" />
          <div className="text-left truncate">
            <span className="block font-bold leading-tight truncate">Nuevo Lead</span>
            <span className="text-[10px] text-brand-200 font-normal">CRM Comercial</span>
          </div>
        </Button>

        <Button
          variant="secondary"
          onClick={onOpenHoldModal}
          className="h-11 text-xs flex items-center justify-start gap-2 px-3"
        >
          <Lock className="w-4 h-4 shrink-0 text-amber-400" />
          <div className="text-left truncate">
            <span className="block font-bold leading-tight truncate">Bloquear Lote</span>
            <span className="text-[10px] text-slate-300 font-normal">Reserva 48hs</span>
          </div>
        </Button>

        <Button
          variant="outline"
          onClick={() => onNavigate('quotes')}
          className="h-11 text-xs flex items-center justify-start gap-2 px-3"
        >
          <Calculator className="w-4 h-4 shrink-0 text-slate-600" />
          <div className="text-left truncate">
            <span className="block font-bold text-slate-900 leading-tight truncate">Cotizador</span>
            <span className="text-[10px] text-slate-500 font-normal">Planes cuotas</span>
          </div>
        </Button>

        <Button
          variant="outline"
          onClick={() => onNavigate('reports')}
          className="h-11 text-xs flex items-center justify-start gap-2 px-3"
        >
          <BarChart3 className="w-4 h-4 shrink-0 text-emerald-600" />
          <div className="text-left truncate">
            <span className="block font-bold text-slate-900 leading-tight truncate">Reportes</span>
            <span className="text-[10px] text-slate-500 font-normal">Exportar CSV/PDF</span>
          </div>
        </Button>
      </div>

      {/* Global Analytics Filters */}
      <DashboardFilters
        filter={filter}
        onChangeFilter={setFilter}
        developments={developments}
        sellers={sellers}
      />

      {/* Dynamic Dashboard Body based on Role / Perspective */}
      {(activeRoleView === 'GERENCIA' || activeRoleView === 'ADMIN' || activeRoleView === 'GERENTE_COMERCIAL') && (
        <ExecutiveDashboardView
          executiveMetrics={executiveMetrics}
          commercialMetrics={commercialMetrics}
          collectionMetrics={collectionMetrics}
          legalMetrics={legalMetrics}
          worksMetrics={worksMetrics}
          portfolio={portfolio}
          insights={insights}
          filter={filter}
          onNavigateModule={onNavigate}
        />
      )}

      {(activeRoleView === 'VENDEDOR' || activeRoleView === 'COMERCIAL' || activeRoleView === 'SUPERVISOR') && (
        <CommercialDashboardView
          metrics={commercialMetrics}
          filter={filter}
          onNavigateModule={onNavigate}
        />
      )}

      {(activeRoleView === 'TESORERIA' || activeRoleView === 'ADMINISTRACION') && (
        <CollectionsDashboardView
          metrics={collectionMetrics}
          filter={filter}
          onNavigateModule={onNavigate}
        />
      )}

      {activeRoleView === 'LEGAL' && (
        <LegalDashboardView
          metrics={legalMetrics}
          filter={filter}
          onNavigateModule={onNavigate}
        />
      )}

      {activeRoleView === 'OBRAS' && (
        <WorksDashboardView
          metrics={worksMetrics}
          filter={filter}
          onNavigateModule={onNavigate}
        />
      )}

      {activeRoleView === 'CLIENTE' && (
        <ClientDashboardView onNavigateModule={onNavigate} />
      )}

      {activeRoleView === 'PROVEEDOR' && (
        <ProviderDashboardView onNavigateModule={onNavigate} />
      )}
    </div>
  );
};
