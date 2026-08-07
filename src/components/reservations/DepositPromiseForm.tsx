import React, { useState } from 'react';
import { LotHold, ReservationIntent, PaymentMethod } from '../../types';
import { Button } from '../ui/Button';
import { X, Calendar, DollarSign, CreditCard, Clock, FileText, Check } from 'lucide-react';

interface DepositPromiseFormProps {
  isOpen: boolean;
  onClose: () => void;
  hold?: LotHold | null;
  intent?: ReservationIntent | null;
  onConfirmPromise: (params: {
    holdId?: string;
    intentId?: string;
    promisedAmount: number;
    currency: 'USD' | 'ARS';
    paymentMethod: PaymentMethod;
    promisedDateIso: string;
    notes?: string;
  }) => void;
}

export const DepositPromiseForm: React.FC<DepositPromiseFormProps> = ({
  isOpen,
  onClose,
  hold,
  intent,
  onConfirmPromise,
}) => {
  const [amount, setAmount] = useState<number>(intent?.expectedDepositAmount || 2000);
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFERENCIA');
  const [promisedDate, setPromisedDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
  );
  const [promisedTime, setPromisedTime] = useState<string>('18:00');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const promisedDateIso = `${promisedDate}T${promisedTime}:00`;

    onConfirmPromise({
      holdId: hold?.id,
      intentId: intent?.id,
      promisedAmount: Number(amount),
      currency,
      paymentMethod,
      promisedDateIso,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">Registrar Promesa de Seña</h2>
              <p className="text-xs text-slate-400">
                {hold ? `Lote ${hold.lotNumber} (${hold.leadName})` : 'Compromiso comercial de pago'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Monto Prometido */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" /> Monto de Seña Prometido
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={100}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'USD' | 'ARS')}
                className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800"
              >
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
              </select>
            </div>
          </div>

          {/* Método de Pago */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-500" /> Medio de Pago Estimado
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="TRANSFERENCIA">Transferencia Bancaria CBU/CVU</option>
              <option value="DEPOSITO">Depósito por Ventanilla / Autoservicio</option>
              <option value="EFECTIVO">Efectivo en Oficinas Comerciales</option>
              <option value="TARJETA">Tarjeta de Débito / Crédito</option>
              <option value="OTRO">Otro Medio Acordado</option>
            </select>
          </div>

          {/* Fecha y Hora Comprometida */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="font-black text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Fecha Límite
              </label>
              <input
                type="date"
                value={promisedDate}
                onChange={(e) => setPromisedDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-black text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Hora Límite
              </label>
              <input
                type="time"
                value={promisedTime}
                onChange={(e) => setPromisedTime(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Notas Comerciales */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" /> Detalle Acordado con el Cliente
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. El cliente enviará el comprobante bancario por WhatsApp tras realizar la transferencia..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-2">
            <Button type="button" variant="outline" size="md" fullWidth onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="md" fullWidth className="bg-sky-600 hover:bg-sky-700 text-white">
              <Check className="w-4 h-4" /> Registrar Promesa
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
