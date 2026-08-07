import React, { useState } from 'react';
import { LotHold, ReservationIntent, PaymentMethod } from '../../types';
import { Button } from '../ui/Button';
import { X, Upload, FileCheck, DollarSign, CreditCard, Hash, Calendar, ShieldAlert, Check } from 'lucide-react';

interface DepositReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  hold?: LotHold | null;
  intent?: ReservationIntent | null;
  lotNumber?: string;
  leadName?: string;
  onReportDeposit: (params: {
    holdId?: string;
    intentId?: string;
    amount: number;
    currency: 'USD' | 'ARS';
    paymentMethod: PaymentMethod;
    receiptReference: string;
    receiptFileName: string;
    receiptPreviewUrl?: string;
    paidAtIso: string;
    notes?: string;
  }) => void;
}

export const DepositReportForm: React.FC<DepositReportFormProps> = ({
  isOpen,
  onClose,
  hold,
  intent,
  lotNumber = hold?.lotNumber || intent?.lotNumber || '',
  leadName = hold?.leadName || intent?.leadName || '',
  onReportDeposit,
}) => {
  const [amount, setAmount] = useState<number>(intent?.expectedDepositAmount || 2000);
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFERENCIA');
  const [receiptReference, setReceiptReference] = useState<string>(`TRF-${Math.floor(100000 + Math.random() * 900000)}`);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [fileName, setFileName] = useState<string>('Comprobante_Transferencia_Seña.pdf');
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60'
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setFileName(file.name);
        if (file.type.startsWith('image/')) {
          setFilePreviewUrl(URL.createObjectURL(file));
        }
        setIsUploading(false);
      }, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReportDeposit({
      holdId: hold?.id,
      intentId: intent?.id,
      amount: Number(amount),
      currency,
      paymentMethod,
      receiptReference,
      receiptFileName: fileName,
      receiptPreviewUrl: filePreviewUrl,
      paidAtIso: `${paymentDate}T${new Date().toISOString().substring(11, 16)}:00`,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-indigo-950 text-white flex items-center justify-between shrink-0 border-b border-indigo-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/30 text-indigo-300">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">Informar Comprobante de Seña</h2>
              <p className="text-xs text-indigo-300">
                Lote {lotNumber} — Lead: {leadName}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-indigo-900 text-indigo-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Banner de flujo */}
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-2 text-indigo-950">
            <FileCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-900 leading-relaxed">
              Al cargar el comprobante, el lote cambiará a estado <strong>"Seña Informada (En Validación)"</strong>. El equipo de Tesorería / Administración revisará y aprobará la acreditación bancaria.
            </p>
          </div>

          {/* Monto depositado */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" /> Monto Acreditado / Transferido <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
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

          {/* Medio de pago y Número de referencia */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="font-black text-slate-800 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" /> Medio de Pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900"
              >
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="DEPOSITO">Depósito Bancario</option>
                <option value="EFECTIVO">Efectivo Oficina</option>
                <option value="TARJETA">Tarjeta Débito/Crédito</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-black text-slate-800 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-500" /> N° Referencia / TRF
              </label>
              <input
                type="text"
                value={receiptReference}
                onChange={(e) => setReceiptReference(e.target.value)}
                placeholder="Ej. TRF-GALICIA-889021"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Fecha de Pago */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Fecha Efectiva del Pago
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
            />
          </div>

          {/* Carga de Comprobante / Dropzone */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 block">Comprobante de Pago (PDF / Imagen)</label>
            <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 rounded-2xl p-4 text-center transition-all cursor-pointer relative">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleSimulateFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-1.5" />
              <p className="font-bold text-indigo-950 text-xs">
                {isUploading ? 'Subiendo archivo...' : 'Arrastra tu comprobante aquí o haz clic'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Soporta PDF, JPG, PNG de hasta 10MB</p>
            </div>

            {/* Simulated file preview bar */}
            {fileName && (
              <div className="flex items-center justify-between p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800 truncate">{fileName}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Listo
                </span>
              </div>
            )}
          </div>

          {/* Comentarios para Tesorería */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 block">Observaciones para Administración / Tesorería</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Transferencia efectuada desde la cuenta de la esposa (María Gómez)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex gap-2">
            <Button type="button" variant="outline" size="md" fullWidth onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="md" fullWidth className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Check className="w-4 h-4" /> Enviar a Tesorería
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
