import React, { useState } from 'react';
import { PaymentPlan, Installment, PaymentMethod, ReceiptInternal } from '../../types';
import { formatUSD, formatARS } from '../../domain/rules';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { X, DollarSign, CheckCircle, AlertTriangle, FileText, ArrowRight, Wallet } from 'lucide-react';

interface RegisterPaymentModalProps {
  plan: PaymentPlan;
  initialInstallmentNumber?: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (paymentData: {
    planId: string;
    installmentNumbers: number[];
    amountUSD: number;
    paymentMethod: PaymentMethod;
    reference: string;
    notes: string;
    isPartial: boolean;
  }) => void;
}

export const RegisterPaymentModal: React.FC<RegisterPaymentModalProps> = ({
  plan,
  initialInstallmentNumber,
  isOpen,
  onClose,
  onConfirmPayment,
}) => {
  if (!isOpen) return null;

  const unpaidInstallments = (plan.installments || []).filter(
    i => i.status !== 'PAGADO' && i.status !== 'CANCELADO'
  );

  const defaultSelectedNum = initialInstallmentNumber || unpaidInstallments[0]?.number || 1;
  const [selectedInstallmentNums, setSelectedInstallmentNums] = useState<number[]>([defaultSelectedNum]);

  const targetInstallment = plan.installments.find(i => i.number === selectedInstallmentNums[0]);
  const defaultAmount = targetInstallment ? targetInstallment.outstandingAmount || targetInstallment.amountUSD : plan.monthlyAmountUSD || 400;

  const [amountUSD, setAmountUSD] = useState<number>(defaultAmount);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFERENCIA');
  const [reference, setReference] = useState<string>('TRF-' + Math.floor(100000 + Math.random() * 900000));
  const [notes, setNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleInstallmentSelection = (num: number) => {
    if (selectedInstallmentNums.includes(num)) {
      if (selectedInstallmentNums.length > 1) {
        setSelectedInstallmentNums(selectedInstallmentNums.filter(n => n !== num));
      }
    } else {
      setSelectedInstallmentNums([...selectedInstallmentNums, num].sort((a, b) => a - b));
    }
  };

  const totalTargetAmountUSD = selectedInstallmentNums.reduce((sum, num) => {
    const inst = plan.installments.find(i => i.number === num);
    return sum + (inst ? inst.outstandingAmount || inst.amountUSD : 0);
  }, 0);

  const isPartial = amountUSD < totalTargetAmountUSD;
  const remainingBalance = Math.max(0, totalTargetAmountUSD - amountUSD);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (amountUSD <= 0) {
      setValidationError('El importe debe ser mayor a 0 USD.');
      return;
    }

    if (!reference.trim()) {
      setValidationError('Debe ingresar un número de comprobante o referencia de pago.');
      return;
    }

    onConfirmPayment({
      planId: plan.id,
      installmentNumbers: selectedInstallmentNums,
      amountUSD,
      paymentMethod,
      reference,
      notes,
      isPartial,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Registrar Pago de Cuota</h3>
              <p className="text-[11px] text-slate-300">
                {plan.customerName} — Lote {plan.lotNumber} ({plan.block || 'A'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Installment Selector list */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Seleccionar Cuota(s) a Imputar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
              {unpaidInstallments.map(inst => {
                const isSelected = selectedInstallmentNums.includes(inst.number);
                return (
                  <button
                    type="button"
                    key={inst.number}
                    onClick={() => toggleInstallmentSelection(inst.number)}
                    className={`p-2 rounded-lg text-left text-xs border transition-all ${
                      isSelected
                        ? 'bg-brand-50 border-brand-500 text-brand-900 font-black shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold">Cuota #{inst.number}</span>
                      {inst.status === 'VENCIDO' && (
                        <span className="text-[9px] font-black bg-rose-100 text-rose-700 px-1 rounded">Vencida</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {formatUSD(inst.outstandingAmount || inst.amountUSD)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount input & payment summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Monto Recibido (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={amountUSD}
                  onChange={e => setAmountUSD(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-500 block mt-1">
                Equivalente aprox: {formatARS(amountUSD * 1180)}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Medio de Pago *
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-brand-500"
              >
                <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                <option value="DEPOSITO">Depósito Bancario</option>
                <option value="EFECTIVO">Efectivo en Oficina</option>
                <option value="CHEQUE">Cheque de Terceros</option>
              </select>
            </div>
          </div>

          {/* Reference & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                N° Comprobante / Ref. *
              </label>
              <input
                type="text"
                value={reference}
                onChange={e => setReference(e.target.value)}
                placeholder="Ej: TRF-GALICIA-889123"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Notas / Observaciones
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ej: Acreditación confirmada en Cta USD"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Partial payment indicator */}
          {isPartial ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-black">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Pago Parcial Detectado</span>
              </div>
              <p className="text-[11px] text-amber-800">
                El monto ingresado ({formatUSD(amountUSD)}) no cubre el total de las cuotas seleccionadas ({formatUSD(totalTargetAmountUSD)}).
              </p>
              <div className="text-[11px] font-bold text-amber-900 pt-1 border-t border-amber-200">
                Saldo pendiente resultante: <span className="font-extrabold">{formatUSD(remainingBalance)}</span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-bold">Pago Total Cancelatorio</span>
              </div>
              <span className="font-extrabold text-emerald-800">{formatUSD(amountUSD)}</span>
            </div>
          )}

          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Comprobante y Recibo Interno</span>
            <p>
              Al confirmar el pago se generará automáticamente un <strong>Recibo Interno</strong> en el sistema y se actualizará la cuenta corriente del cliente.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={onClose} size="sm">
              Cancelar
            </Button>
            <Button variant="primary" type="submit" size="sm" className="gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Confirmar y Generar Recibo
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
