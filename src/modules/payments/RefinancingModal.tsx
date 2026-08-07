import React, { useState } from 'react';
import { PaymentPlan, RefinancingProposal } from '../../types';
import { formatUSD } from '../../domain/rules';
import { calculateAccountStatementSummary } from '../../domain/paymentsDomain';
import { Button } from '../../components/ui/Button';
import { X, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface RefinancingModalProps {
  plan: PaymentPlan;
  isOpen: boolean;
  onClose: () => void;
  onSaveProposal: (proposal: RefinancingProposal) => void;
}

export const RefinancingModal: React.FC<RefinancingModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSaveProposal,
}) => {
  if (!isOpen) return null;

  const summary = calculateAccountStatementSummary(plan);
  const outstandingBalanceUSD = summary.totalOutstandingUSD;

  const [newInstallmentCount, setNewInstallmentCount] = useState<number>(72);
  const [reason, setReason] = useState<string>('');

  const newMonthlyAmountUSD = Math.round(outstandingBalanceUSD / newInstallmentCount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const proposal: RefinancingProposal = {
      id: `ref-${Date.now()}`,
      saleId: plan.saleId,
      customerId: plan.customerId || 'cust-101',
      customerName: plan.customerName,
      lotNumber: plan.lotNumber,
      originalOutstandingBalance: outstandingBalanceUSD,
      newInstallmentsCount: newInstallmentCount,
      newMonthlyAmount: newMonthlyAmountUSD,
      status: 'PENDIENTE_REVISION',
      reason: reason || 'Solicitud de reestructuración por dificultades de pago.',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onSaveProposal(proposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-purple-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Solicitud de Refinanciación / Reestructuración</h3>
              <p className="text-[11px] text-purple-200">
                {plan.customerName} — Lote {plan.lotNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-purple-900 hover:bg-purple-800 flex items-center justify-center text-purple-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1 text-xs text-purple-950">
            <span className="font-bold text-purple-900 block">Saldo Financiero Actual Adeudado</span>
            <div className="text-xl font-black font-mono text-purple-950">
              {formatUSD(outstandingBalanceUSD)}
            </div>
            <p className="text-[11px] text-purple-800">
              Cuotas restantes según plan original: <strong>{summary.pendingInstallmentsCount} cuotas</strong> (~{formatUSD(plan.monthlyAmountUSD)}/mes)
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nuevo Plazo Sugerido (Total Cuotas Refinanciadas) *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[48, 60, 72].map(count => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setNewInstallmentCount(count)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    newInstallmentCount === count
                      ? 'bg-purple-900 text-white font-black border-purple-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs block">{count} Cuotas</span>
                  <span className="text-[10px] opacity-80 font-mono">
                    ~{formatUSD(Math.round(outstandingBalanceUSD / count))}/mes
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-1">
            <span className="text-slate-300 block font-medium">Proyección Nuevo Esquema:</span>
            <div className="flex items-center justify-between font-mono font-bold">
              <span>Nueva Cuota Mensual Estimada:</span>
              <strong className="text-emerald-400 text-sm">{formatUSD(newMonthlyAmountUSD)} / mes</strong>
            </div>
            <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              Reducción de cuota mensual: <span className="text-emerald-400 font-bold">-{Math.round(((plan.monthlyAmountUSD - newMonthlyAmountUSD) / plan.monthlyAmountUSD) * 100)}%</span>
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Justificación / Causa de la Refinanciación *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Ej: El comprador atravesó una reestructuración de ingresos laborales y solicita extender plazo para mantener al día su compromiso."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button variant="outline" type="button" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" size="sm" className="gap-1.5 bg-purple-800 hover:bg-purple-900 text-white font-bold">
              <CheckCircle className="w-4 h-4" />
              Enviar Propuesta a Revisión
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
