import React from 'react';
import { ServiceSubscription, Provider } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Repeat, Calendar, DollarSign, TrendingUp, CheckCircle2, UserCheck, Route } from 'lucide-react';

interface RecurringServicesTabProps {
  subscriptions: ServiceSubscription[];
  providers: Provider[];
  onToggleSubscriptionStatus?: (subId: string) => void;
}

export const RecurringServicesTab: React.FC<RecurringServicesTabProps> = ({
  subscriptions,
  providers,
  onToggleSubscriptionStatus,
}) => {
  // Calculate MRR
  const totalMRR = subscriptions
    .filter(s => s.status === 'ACTIVO')
    .reduce((sum, s) => {
      if (s.frequency === 'SEMANAL') return sum + s.price * 4;
      if (s.frequency === 'QUINCENAL') return sum + s.price * 2;
      if (s.frequency === 'TRIMESTRAL') return sum + Math.round(s.price / 3);
      return sum + s.price;
    }, 0);

  const totalMonthlyMargin = subscriptions
    .filter(s => s.status === 'ACTIVO')
    .reduce((sum, s) => {
      const margin = s.marginAmount || s.price - (s.providerCost || 0);
      if (s.frequency === 'SEMANAL') return sum + margin * 4;
      if (s.frequency === 'QUINCENAL') return sum + margin * 2;
      if (s.frequency === 'TRIMESTRAL') return sum + Math.round(margin / 3);
      return sum + margin;
    }, 0);

  return (
    <div className="space-y-4">
      {/* MRR Executive Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card padding="md" className="bg-gradient-to-br from-purple-50 to-pink-50/50 border-purple-200">
          <div className="flex items-center justify-between text-purple-700 text-xs font-bold mb-1">
            <span>MRR Estimado (Abonos)</span>
            <Repeat className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">${totalMRR.toLocaleString()} USD/mes</div>
          <p className="text-[10px] text-purple-800 font-medium">Facturación recurrente mensual simulada</p>
        </Card>

        <Card padding="md" className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-200">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold mb-1">
            <span>Margen Recurrente Neto</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">${totalMonthlyMargin.toLocaleString()} USD/mes</div>
          <p className="text-[10px] text-emerald-800 font-medium">Margen neto de intermediación recurrente</p>
        </Card>

        <Card padding="md" className="bg-slate-900 text-white flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Servicios Recurrentes</span>
            <Badge variant="brand">{subscriptions.filter(s => s.status === 'ACTIVO').length} Activos</Badge>
          </div>
          <div className="text-xs text-slate-300">
            Abonos de jardinería, mantenimiento de piscinas y calibración de riego.
          </div>
        </Card>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Repeat className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-black text-slate-900">Abonos Recurrentes de Lotes</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subscriptions.map(sub => (
            <Card key={sub.id} padding="md" className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-700 uppercase">
                    Lote {sub.lotNumber || sub.lotId} — {sub.customerName}
                  </span>
                  <h4 className="text-sm font-black text-slate-900">{sub.title}</h4>
                </div>
                <Badge variant={sub.status === 'ACTIVO' ? 'success' : 'neutral'}>
                  {sub.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-xl text-xs border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block">Frecuencia:</span>
                  <strong className="text-slate-800">{sub.frequency}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Próxima Visita:</span>
                  <strong className="text-slate-900 font-bold">{sub.nextVisitDate || '2026-08-18'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Precio Cliente:</span>
                  <strong className="text-slate-900">${sub.price} USD/cuota</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Margen Neto Nexo:</span>
                  <strong className="text-emerald-600 font-black">${sub.marginAmount || 25} USD</strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-500">
                <span>Proveedor: <strong>{sub.providerName}</strong></span>
                {onToggleSubscriptionStatus && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleSubscriptionStatus(sub.id)}
                    className="text-xs text-purple-700 py-0.5"
                  >
                    {sub.status === 'ACTIVO' ? 'Pausar' : 'Activar'}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Simulated Maintenance Route View */}
      <Card padding="md" className="space-y-3 bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-brand-600" />
            <h4 className="text-xs font-black uppercase text-slate-800">Ruta Semanal de Mantenimiento</h4>
          </div>
          <Badge variant="neutral" className="text-[10px]">Luján — Altos del Horizonte</Badge>
        </div>

        <div className="space-y-2 text-xs">
          {subscriptions.map((sub, idx) => (
            <div key={sub.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <div>
                  <span className="font-bold text-slate-900">Lote {sub.lotNumber || sub.lotId}</span>
                  <span className="text-slate-500 text-[10px] ml-2">{sub.title}</span>
                </div>
              </div>

              <Badge variant="success" className="text-[10px]">
                Visita Agendada: {sub.nextVisitDate}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
