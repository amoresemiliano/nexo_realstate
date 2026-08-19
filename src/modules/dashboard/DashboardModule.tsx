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
import { clsx } from 'clsx';
import { ModuleVisibilityConfig, ModuleKey } from '../../config/moduleVisibility';

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
  onOpenHoldModal,
  moduleVisibility
}) => {
  const [filter, setFilter] = useState<AnalyticsFilter>(defaultAnalyticsFilter);
  const [viewOverride, setViewOverride] = useState<string | null>(null);

  const isModuleEnabled = (key: ModuleKey): boolean => {
    if (!moduleVisibility) return true;
    return moduleVisibility[key] !== false;
  };

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

  // All available role tabs with their corresponding module keys
  const allRoleTabs = [
    { id: 'GERENCIA', label: 'Ejecutivo', icon: Building2, moduleKey: 'dashboard' as ModuleKey },
    { id: 'VENDEDOR', label: 'Comercial', icon: Users, moduleKey: 'leads' as ModuleKey },
    { id: 'TESORERIA', label: 'Cobranzas', icon: Wallet, moduleKey: 'payments' as ModuleKey },
    { id: 'LEGAL', label: 'Legales', icon: Scale, moduleKey: 'legal' as ModuleKey },
    { id: 'OBRAS', label: 'Obras', icon: HardHat, moduleKey: 'works' as ModuleKey },
    { id: 'CLIENTE', label: 'Mi Lote', icon: ShieldCheck, moduleKey: 'lots' as ModuleKey },
  ];

  // Filter roleTabs based on moduleVisibility
  const roleTabs = allRoleTabs.filter((tab) => {
    if (tab.id === 'VENDEDOR') {
      return isModuleEnabled('leads') || isModuleEnabled('campaigns') || isModuleEnabled('quotes') || isModuleEnabled('reservations');
    }
    if (tab.id === 'TESORERIA') {
      return isModuleEnabled('payments') || isModuleEnabled('sales');
    }
    return isModuleEnabled(tab.moduleKey);
  });

  // Determine active view mode based on role or override
  const rawActiveRoleView = viewOverride || userRole;

  // Verify if active role view perspective is allowed
  const isTabAllowed = (tabId: string) => roleTabs.some((t) => t.id === tabId);

  let activeRoleView = rawActiveRoleView;
  if (
    activeRoleView === 'LEGAL' && !isTabAllowed('LEGAL') ||
    activeRoleView === 'OBRAS' && !isTabAllowed('OBRAS') ||
    activeRoleView === 'TESORERIA' && !isTabAllowed('TESORERIA') ||
    activeRoleView === 'VENDEDOR' && !isTabAllowed('VENDEDOR') ||
    activeRoleView === 'CLIENTE' && !isTabAllowed('CLIENTE') ||
    !isTabAllowed(activeRoleView)
  ) {
    if ((rawActiveRoleView === 'ADMIN' || rawActiveRoleView === 'GERENTE_COMERCIAL') && isTabAllowed('GERENCIA')) {
      activeRoleView = 'GERENCIA';
    } else if (rawActiveRoleView === 'COMERCIAL' && isTabAllowed('VENDEDOR')) {
      activeRoleView = 'VENDEDOR';
    } else if (rawActiveRoleView === 'ADMINISTRACION' && isTabAllowed('TESORERIA')) {
      activeRoleView = 'TESORERIA';
    } else {
      activeRoleView = roleTabs[0]?.id || 'GERENCIA';
    }
  }

  // Build quick actions list filtered by moduleVisibility
  const allQuickActions = [
    {
      id: 'lead',
      moduleKey: 'leads' as ModuleKey,
      variant: 'primary' as const,
      onClick: onOpenNewLead,
      icon: PlusCircle,
      iconClass: 'text-brand-200',
      title: 'Nuevo Lead',
      subtitle: 'CRM Comercial',
      titleClass: '',
      subClass: 'text-brand-200',
    },
    {
      id: 'hold',
      moduleKey: 'reservations' as ModuleKey,
      variant: 'secondary' as const,
      onClick: onOpenHoldModal,
      icon: Lock,
      iconClass: 'text-amber-400',
      title: 'Bloquear Lote',
      subtitle: 'Reserva 48hs',
      titleClass: '',
      subClass: 'text-slate-300',
    },
    {
      id: 'quote',
      moduleKey: 'quotes' as ModuleKey,
      variant: 'outline' as const,
      onClick: () => onNavigate('quotes'),
      icon: Calculator,
      iconClass: 'text-slate-600',
      title: 'Cotizador',
      subtitle: 'Planes cuotas',
      titleClass: 'text-slate-900',
      subClass: 'text-slate-500',
    },
    {
      id: 'report',
      moduleKey: 'reports' as ModuleKey,
      variant: 'outline' as const,
      onClick: () => onNavigate('reports'),
      icon: BarChart3,
      iconClass: 'text-emerald-600',
      title: 'Reportes',
      subtitle: 'Exportar CSV/PDF',
      titleClass: 'text-slate-900',
      subClass: 'text-slate-500',
    },
  ];

  const quickActions = allQuickActions.filter((action) => isModuleEnabled(action.moduleKey));

  return (
    <div className="space-y-4">
      {/* Role View Perspective Selector Tabs */}
      {roleTabs.length > 0 && (
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
      )}

      {/* Quick Actions Bar */}
      {quickActions.length > 0 && (
        <div
          className={clsx(
            'grid gap-2',
            quickActions.length === 1 && 'grid-cols-1',
            quickActions.length === 2 && 'grid-cols-2',
            quickActions.length === 3 && 'grid-cols-1 sm:grid-cols-3',
            quickActions.length >= 4 && 'grid-cols-2 sm:grid-cols-4'
          )}
        >
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              onClick={action.onClick}
              className="h-11 text-xs flex items-center justify-start gap-2 px-3"
            >
              <action.icon className={`w-4 h-4 shrink-0 ${action.iconClass}`} />
              <div className="text-left truncate">
                <span className={`block font-bold leading-tight truncate ${action.titleClass}`}>
                  {action.title}
                </span>
                <span className={`text-[10px] font-normal ${action.subClass}`}>
                  {action.subtitle}
                </span>
              </div>
            </Button>
          ))}
        </div>
      )}

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

      {(activeRoleView === 'VENDEDOR' || activeRoleView === 'COMERCIAL' || activeRoleView === 'SUPERVISOR' || activeRoleView === 'GERENCIA' || activeRoleView === 'ADMIN') && (
        <CommercialDashboardView
          metrics={commercialMetrics}
          filter={filter}
          leads={leads}
          holds={holds}
          reservations={reservations}
          deposits={deposits}
          campaigns={campaigns}
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
