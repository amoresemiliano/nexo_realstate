import React, { useState } from 'react';
import { PaymentPlan } from '../../types';
import { mockPaymentPlans } from '../../data/mockData';
import { formatUSD, formatARS } from '../../domain/rules';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Wallet, AlertCircle, CheckCircle, Calendar, DollarSign, ArrowRight } from 'lucide-react';

interface PaymentsModuleProps {
  paymentPlans: PaymentPlan[];
  onLogPayment: (planId: string, installmentNumber: number) => void;
}

export const PaymentsModule: React.FC<PaymentsModuleProps> = ({
  paymentPlans,
  onLogPayment,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(paymentPlans[0]?.id || '');

  const activePlan = paymentPlans.find(p => p.id === selectedPlanId) || paymentPlans[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Cobranzas & Cuotas</h2>
          <p className="text-xs text-slate-500">Control de planes financiados, mora y recibos</p>
        </div>
        <Wallet className="w-6 h-6 text-brand-600" />
      </div>

      {/* Payment Plan Selector Cards */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Planes de Financiación Activos
        </span>
        <div className="grid grid-cols-1 gap-2">
          {paymentPlans.map(plan => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <Card
                key={plan.id}
                padding="sm"
                onClick={() => setSelectedPlanId(plan.id)}
                className={`border-2 transition-all ${
                  isSelected ? 'border-brand-600 bg-brand-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900">
                      Lote {plan.lotNumber} — {plan.customerName}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Cuota {plan.paidInstallmentsCount} de {plan.totalInstallments} pagadas
                    </span>
                  </div>
                  <Badge variant={plan.status === 'VENCIDO' ? 'danger' : 'success'}>
                    {plan.status === 'VENCIDO' ? '1 Cuota Vencida' : 'Al Día'}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Active Plan Detail & Schedule Table */}
      {activePlan && (
        <div className="space-y-3">
          <Card padding="md" className="space-y-3 bg-slate-900 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-xs font-bold text-brand-400">Ficha de Cobranza</span>
                <h3 className="text-base font-black text-white">{activePlan.customerName}</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Lote {activePlan.lotNumber}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Valor Cuota Base</span>
                <span className="text-sm font-extrabold text-white">{formatUSD(activePlan.monthlyAmountUSD)}</span>
              </div>
              <div className="bg-slate-800 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Anticipo Integrado</span>
                <span className="text-sm font-extrabold text-brand-300">{formatUSD(activePlan.downPaymentUSD)}</span>
              </div>
            </div>
          </Card>

          {/* Schedule list */}
          <Card padding="md" className="space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Detalle de Cuotas
            </span>

            <div className="space-y-2">
              {activePlan.installments.map(inst => (
                <div
                  key={inst.number}
                  className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs bg-white"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Cuota #{inst.number}</span>
                      {inst.status === 'PAGADO' && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Pagado {inst.paidDate}
                        </span>
                      )}
                      {inst.status === 'VENCIDO' && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Vencida ({inst.dueDate})
                        </span>
                      )}
                      {inst.status === 'PENDIENTE' && (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          Vence {inst.dueDate}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {formatUSD(inst.amountUSD)} ({formatARS(inst.amountARS)})
                    </div>
                  </div>

                  {inst.status !== 'PAGADO' ? (
                    <Button
                      variant={inst.status === 'VENCIDO' ? 'danger' : 'primary'}
                      size="sm"
                      onClick={() => onLogPayment(activePlan.id, inst.number)}
                      className="text-[11px]"
                    >
                      Registrar Pago
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Recibo #00{inst.number}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
