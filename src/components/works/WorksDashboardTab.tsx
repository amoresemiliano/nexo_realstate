import React from 'react';
import {
  PostSaleOpportunity,
  WorkOrder,
  ServiceSubscription,
  Commission,
  Lot,
  Provider
} from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Sparkles,
  TrendingUp,
  HardHat,
  DollarSign,
  Repeat,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  CheckCircle2,
  Building2
} from 'lucide-react';

interface WorksDashboardTabProps {
  opportunities: PostSaleOpportunity[];
  workOrders: WorkOrder[];
  subscriptions: ServiceSubscription[];
  commissions: Commission[];
  providers: Provider[];
  lots: Lot[];
  onConvertToRequest: (op: PostSaleOpportunity) => void;
  onRunAutoDetection: () => void;
  onOpenMainDemo: () => void;
  onOpenRecurringDemo: () => void;
  onSelectSubTab: (tab: string) => void;
}

export const WorksDashboardTab: React.FC<WorksDashboardTabProps> = ({
  opportunities,
  workOrders,
  subscriptions,
  commissions,
  providers,
  lots,
  onConvertToRequest,
  onRunAutoDetection,
  onOpenMainDemo,
  onOpenRecurringDemo,
  onSelectSubTab,
}) => {
  // Metrics calculations
  const totalPotentialValue = opportunities
    .filter(o => o.status !== 'PERDIDA' && o.status !== 'CONVERTIDA')
    .reduce((sum, o) => sum + (o.estimatedValue || 0), 0);

  const activeOrdersCount = workOrders.filter(
    w => w.status === 'EN_EJECUCION' || w.status === 'PREPARACION' || w.status === 'DEMORADA'
  ).length;

  const totalCommissionsEarned = commissions
    .filter(c => c.status === 'DEVENGADA' || c.status === 'PAGADA')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const totalMRR = subscriptions
    .filter(s => s.status === 'ACTIVO')
    .reduce((sum, s) => {
      // Normalize to monthly MRR
      if (s.frequency === 'SEMANAL') return sum + s.price * 4;
      if (s.frequency === 'QUINCENAL') return sum + s.price * 2;
      if (s.frequency === 'TRIMESTRAL') return sum + Math.round(s.price / 3);
      return sum + s.price;
    }, 0);

  const activeSubscriptionsCount = subscriptions.filter(s => s.status === 'ACTIVO').length;

  const expiredDocProviders = providers.filter(p => p.documentationStatus === 'VENCIDA');

  return (
    <div className="space-y-5">
      {/* Executive Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card padding="sm" className="bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold mb-1">
            <span>Oportunidades</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-slate-900">${totalPotentialValue.toLocaleString()} USD</div>
          <span className="text-[10px] text-amber-800 font-medium">
            {opportunities.filter(o => o.status === 'DETECTADA' || o.status === 'SUGERIDA').length} nuevas detectadas
          </span>
        </Card>

        <Card padding="sm" className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-200">
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold mb-1">
            <span>Obras Activas</span>
            <HardHat className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-slate-900">{activeOrdersCount} en ejecución</div>
          <span className="text-[10px] text-blue-800 font-medium">
            {workOrders.filter(w => w.status === 'DEMORADA').length} con observaciones
          </span>
        </Card>

        <Card padding="sm" className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-200">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold mb-1">
            <span>Comisión Postventa</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-slate-900">${totalCommissionsEarned.toLocaleString()} USD</div>
          <span className="text-[10px] text-emerald-800 font-medium">Devengadas e ingresadas</span>
        </Card>

        <Card padding="sm" className="bg-gradient-to-br from-purple-50 to-pink-50/50 border-purple-200">
          <div className="flex items-center justify-between text-purple-700 text-xs font-bold mb-1">
            <span>MRR Recurrente</span>
            <Repeat className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-black text-slate-900">${totalMRR.toLocaleString()} USD/mes</div>
          <span className="text-[10px] text-purple-800 font-medium">{activeSubscriptionsCount} abonos activos</span>
        </Card>
      </div>

      {/* Guided Walkthrough Demo Callouts */}
      <Card padding="md" className="bg-slate-900 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-black">
              7
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Demostración Interactiva Fase 7</h3>
              <p className="text-xs text-slate-400">Trazabilidad completa: Oportunidad → Obra → Comisión → Abono</p>
            </div>
          </div>
          <Badge variant="brand">Interactive Demo</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenMainDemo}
            className="justify-center text-xs py-2 bg-amber-600 hover:bg-amber-700"
          >
            <Play className="w-3.5 h-3.5" /> Caso Principal: Cerco Perimetral Lote A-4
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenRecurringDemo}
            className="justify-center text-xs py-2 border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            <Repeat className="w-3.5 h-3.5" /> Caso Recurrente: Piscina & Abono Semanal
          </Button>
        </div>
      </Card>

      {/* Warnings & Alerts */}
      {expiredDocProviders.length > 0 && (
        <Card padding="sm" className="bg-rose-50 border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="text-xs font-medium text-rose-900">
              Hay <strong>{expiredDocProviders.length} proveedor(es)</strong> con documentación/seguros vencidos (ART/CUIT).
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectSubTab('providers')}
            className="text-xs text-rose-700 hover:bg-rose-100 font-bold"
          >
            Auditar Proveedores
          </Button>
        </Card>
      )}

      {/* Recommended Opportunities List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-black text-slate-900">Oportunidades Postventa Recomendadas</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRunAutoDetection}
              className="text-xs text-amber-700 hover:bg-amber-50"
            >
              Motor Detección
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectSubTab('opportunities')}
              className="text-xs"
            >
              Ver Todas ({opportunities.length})
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {opportunities.slice(0, 4).map(op => (
            <Card key={op.id} padding="md" className="space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                    Lote {op.lotNumber || op.lotId} — {op.customerName}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{op.title}</h4>
                </div>
                <Badge variant={op.status === 'DETECTADA' ? 'warning' : 'brand'}>
                  {op.status}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{op.description}</p>

              <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 flex items-start gap-1.5 border border-slate-100">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Origen:</strong> {op.triggerReason || 'Detección automática por estado de lote'}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-xs font-black text-slate-900">
                  Est: ${op.estimatedValue?.toLocaleString()} {op.currency || 'USD'}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onConvertToRequest(op)}
                  className="text-xs py-1.5"
                >
                  Convertir a Solicitud <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Work Orders Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardHat className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-black text-slate-900">Obras en Ejecución</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectSubTab('orders')}
            className="text-xs text-blue-700"
          >
            Gestionar Obras ({workOrders.length})
          </Button>
        </div>

        <div className="space-y-2">
          {workOrders.map(work => (
            <Card key={work.id} padding="md" className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Lote {work.lotNumber || work.lotId} • {work.customerName}
                  </span>
                  <h4 className="text-sm font-black text-slate-900">{work.title}</h4>
                </div>
                <Badge
                  variant={
                    work.status === 'FINALIZADA'
                      ? 'success'
                      : work.status === 'DEMORADA'
                      ? 'danger'
                      : 'brand'
                  }
                >
                  {work.status}
                </Badge>
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Avance de Obra:</span>
                  <span className="text-brand-600">{work.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      work.progress === 100
                        ? 'bg-emerald-500'
                        : work.status === 'DEMORADA'
                        ? 'bg-amber-500'
                        : 'bg-brand-600'
                    }`}
                    style={{ width: `${work.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Proveedor: <strong>{work.providerName}</strong></span>
                <span>Precio Cliente: <strong className="text-slate-900">${work.contractedAmount.toLocaleString()} USD</strong></span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
