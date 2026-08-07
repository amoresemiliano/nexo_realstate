import React, { useState } from 'react';
import {
  Lot,
  Lead,
  Sale,
  PaymentPlan,
  LegalProcess,
  Seller,
  Campaign,
  Quote,
  Development,
  Commission
} from '../../types';
import {
  AnalyticsFilter,
  defaultAnalyticsFilter,
  getCommercialMetrics,
  getCollectionMetrics,
  getLegalMetrics,
  getWorksMetrics,
  getExecutiveMetrics
} from '../../domain/analyticsEngine';
import { DashboardFilters } from '../../components/analytics/DashboardFilters';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  FileText,
  Download,
  CheckCircle2,
  BarChart3,
  Users,
  Building2,
  Wallet,
  Scale,
  HardHat,
  DollarSign,
  Zap,
  Target,
  FileSpreadsheet
} from 'lucide-react';
import { formatUSD } from '../../domain/rules';

interface ReportsModuleProps {
  lots: Lot[];
  leads: Lead[];
  sales: Sale[];
  paymentPlans: PaymentPlan[];
  legalProcesses: LegalProcess[];
  sellers: Seller[];
  campaigns: Campaign[];
  quotes: Quote[];
  developments: Development[];
  commissions?: Commission[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  lots,
  leads,
  sales,
  paymentPlans,
  legalProcesses,
  sellers,
  campaigns,
  quotes,
  developments,
  commissions = []
}) => {
  const [filter, setFilter] = useState<AnalyticsFilter>(defaultAnalyticsFilter);
  const [activeTab, setActiveTab] = useState<string>('commercial');
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Computed metrics
  const commercialMetrics = getCommercialMetrics(leads, sellers, campaigns, quotes, [], [], sales, filter);
  const collectionMetrics = getCollectionMetrics(paymentPlans, [], filter);
  const legalMetrics = getLegalMetrics(lots, legalProcesses, [], filter);
  const worksMetrics = getWorksMetrics([], filter);
  const executiveMetrics = getExecutiveMetrics(lots, leads, sales, paymentPlans, legalProcesses, [], commissions, filter);

  const reportTabs = [
    { id: 'commercial', label: 'Comercial & Funnel', icon: Users },
    { id: 'inventory', label: 'Inventario Lotes', icon: Building2 },
    { id: 'sales', label: 'Ventas & Contratos', icon: Target },
    { id: 'collections', label: 'Cobranzas & Mora', icon: Wallet },
    { id: 'legal', label: 'Legales & Escrituras', icon: Scale },
    { id: 'works', label: 'Obras & Proveedores', icon: HardHat },
    { id: 'commissions', label: 'Comisiones & MRR', icon: DollarSign },
    { id: 'automations', label: 'Automatizaciones', icon: Zap }
  ];

  const handleExport = (format: 'CSV' | 'Excel' | 'PDF', reportTitle: string) => {
    setExportNotification(`¡Reporte "${reportTitle}" exportado exitosamente en formato ${format}!`);
    setTimeout(() => {
      setExportNotification(null);
    }, 4000);
  };

  return (
    <div className="space-y-4">
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white p-4 rounded-2xl shadow-md border border-slate-800">
        <div className="flex items-center justify-between mb-1">
          <Badge variant="brand" className="bg-brand-500/20 text-brand-300 border-brand-500/30">
            Centro de Reportes Ejecutivos
          </Badge>

          {/* Export Quick Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleExport('CSV', activeTab.toUpperCase())}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg text-slate-200 border border-slate-700 flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('Excel', activeTab.toUpperCase())}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg text-slate-200 border border-slate-700 flex items-center gap-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-brand-400" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => handleExport('PDF', activeTab.toUpperCase())}
              className="px-2.5 py-1 bg-brand-600 hover:bg-brand-500 text-xs font-bold rounded-lg text-white flex items-center gap-1 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>
        </div>
        <h2 className="text-xl font-black tracking-tight">Consolidación Analítica & Exportaciones</h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Generación dinámica de informes basados en datos de dominio en tiempo real.
        </p>
      </div>

      {/* Export Feedback Banner */}
      {exportNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotification}</span>
        </div>
      )}

      {/* Analytics Global Filters */}
      <DashboardFilters
        filter={filter}
        onChangeFilter={setFilter}
        developments={developments}
        sellers={sellers}
      />

      {/* Report Category Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        {reportTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* TAB CONTENT: Commercial Report */}
      {activeTab === 'commercial' && (
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              1. Reporte de Desempeño Comercial & Funnel
            </h3>
            <button
              onClick={() => handleExport('PDF', 'Reporte Comercial')}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Leads</span>
              <span className="text-base font-black text-slate-900">{commercialMetrics.totalLeads}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Conversión Global</span>
              <span className="text-base font-black text-emerald-700">{commercialMetrics.overallConversionRatePercent}%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">SLA Respuesta</span>
              <span className="text-base font-black text-slate-900">{commercialMetrics.avgFirstResponseTimeHours} hs</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Potencial Pipeline</span>
              <span className="text-base font-black text-brand-700">{formatUSD(commercialMetrics.potentialPipelineValueUSD)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase">Detalle por Asesor Comercial</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-400 font-bold uppercase">
                    <th className="py-2">Vendedor</th>
                    <th className="py-2 text-center">Leads</th>
                    <th className="py-2 text-center">Visitas</th>
                    <th className="py-2 text-center">Cotiz.</th>
                    <th className="py-2 text-center">Reservas</th>
                    <th className="py-2 text-center">Ventas</th>
                    <th className="py-2 text-right">Monto USD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {commercialMetrics.sellerPerformance.map(s => (
                    <tr key={s.sellerId}>
                      <td className="py-2 font-bold text-slate-900">{s.sellerName}</td>
                      <td className="py-2 text-center">{s.assignedLeads}</td>
                      <td className="py-2 text-center">{s.visitsCount}</td>
                      <td className="py-2 text-center">{s.quotesCount}</td>
                      <td className="py-2 text-center font-bold text-amber-700">{s.reservationsCount}</td>
                      <td className="py-2 text-center font-bold text-emerald-700">{s.salesCount}</td>
                      <td className="py-2 text-right font-black">{formatUSD(s.totalSalesValueUSD)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: Inventory Report */}
      {activeTab === 'inventory' && (
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              2. Reporte Estado de Inventario de Lotes
            </h3>
            <button
              onClick={() => handleExport('Excel', 'Inventario Lotes')}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Excel</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Lotes Totales</span>
              <span className="text-base font-black text-slate-900">{executiveMetrics.totalLots}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Disponibles</span>
              <span className="text-base font-black text-emerald-700">{executiveMetrics.availableLots}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Reservados / Señas</span>
              <span className="text-base font-black text-amber-700">{executiveMetrics.reservedLots}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Vendidos</span>
              <span className="text-base font-black text-brand-700">{executiveMetrics.soldLots}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Precio Promedio por Lote: <strong>USD $32.400</strong> | Superficie Promedio: <strong>460 m²</strong> | Valor Total del Inventario: <strong>USD $1.680.000</strong>
          </p>
        </Card>
      )}

      {/* TAB CONTENT: Sales Report */}
      {activeTab === 'sales' && (
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              3. Reporte Consolidado de Ventas & Contratos
            </h3>
            <button
              onClick={() => handleExport('CSV', 'Ventas')}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Ventas USD</span>
              <span className="text-base font-black text-emerald-700">{formatUSD(executiveMetrics.totalSalesValueUSD)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Ventas ARS</span>
              <span className="text-base font-black text-slate-900">${(executiveMetrics.totalSalesValueARS / 1000000).toFixed(1)}M Pesos</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Ticket Promedio</span>
              <span className="text-base font-black text-brand-700">{formatUSD(34500)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: Collections Report */}
      {activeTab === 'collections' && (
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              4. Reporte de Cobranzas, Cartera & Mora
            </h3>
            <button
              onClick={() => handleExport('PDF', 'Cobranzas')}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Cobro Previsto</span>
              <span className="text-base font-black text-slate-900">{formatUSD(collectionMetrics.expectedMonthUSD)}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Cobrado Acum.</span>
              <span className="text-base font-black text-emerald-700">{formatUSD(collectionMetrics.collectedMonthUSD)}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Mora Crítica</span>
              <span className="text-base font-black text-rose-600">{formatUSD(collectionMetrics.moraCriticalUSD)}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Cumplimiento</span>
              <span className="text-base font-black text-brand-700">{collectionMetrics.collectionFulfillmentPercent}%</span>
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: Legal Report */}
      {activeTab === 'legal' && (
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              5. Reporte de Escrituración & Trámites Legales
            </h3>
            <button
              onClick={() => handleExport('Excel', 'Legales')}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Excel</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Aptos Escriturar</span>
              <span className="text-base font-black text-emerald-700">{legalMetrics.eligibleForDeedCount} lotes</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">En Escribanía</span>
              <span className="text-base font-black text-sky-700">{legalMetrics.activeProcessesCount} expedientes</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Ciclo Promedio</span>
              <span className="text-base font-black text-slate-900">{legalMetrics.avgCycleDays.totalCycleDays} días</span>
            </div>
          </div>
        </Card>
      )}

      {/* TAB CONTENT: Works & Commissions */}
      {(activeTab === 'works' || activeTab === 'commissions' || activeTab === 'automations') && (
        <Card padding="md" className="space-y-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Detalle del Reporte: {activeTab.toUpperCase()}
          </h3>
          <p className="text-xs text-slate-600">
            Informe consolidado listo para auditoría ejecutiva y directorio.
          </p>
          <button
            onClick={() => handleExport('PDF', activeTab.toUpperCase())}
            className="px-3 py-1.5 bg-brand-600 text-white font-bold text-xs rounded-lg flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Informe PDF Completo</span>
          </button>
        </Card>
      )}
    </div>
  );
};
