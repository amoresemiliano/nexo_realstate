import React, { useState } from 'react';
import {
  SupplierQuote,
  WorkRequest,
  ClientProposal,
  CommissionModel
} from '../../types';
import { calculateCommercialPricing } from '../../domain/worksDomain';
import { Button } from '../ui/Button';
import { X, DollarSign, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface CreateProposalModalProps {
  isOpen: boolean;
  supplierQuote: SupplierQuote;
  workRequest: WorkRequest;
  onClose: () => void;
  onSubmit: (proposal: Partial<ClientProposal>) => void;
}

export const CreateProposalModal: React.FC<CreateProposalModalProps> = ({
  isOpen,
  supplierQuote,
  workRequest,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [commissionModel, setCommissionModel] = useState<CommissionModel>('MARKUP');
  const [rateOrFee, setRateOrFee] = useState<number>(12); // 12% markup
  const [title, setTitle] = useState<string>(
    `Propuesta Comercial — ${supplierQuote.providerName}`
  );
  const [version, setVersion] = useState<number>(1);

  // Live commercial calculation
  const pricing = calculateCommercialPricing(supplierQuote.amount, commissionModel, rateOrFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      workRequestId: workRequest.id,
      selectedSupplierQuoteId: supplierQuote.id,
      lotId: workRequest.lotId,
      lotNumber: workRequest.lotNumber,
      customerId: workRequest.customerId,
      customerName: workRequest.customerName,
      providerId: supplierQuote.providerId,
      providerName: supplierQuote.providerName,
      title,
      version,
      status: 'EN_EVALUACION',
      providerCost: pricing.providerCost,
      clientPrice: pricing.clientPrice,
      commissionAmount: pricing.commissionAmount,
      marginAmount: pricing.marginAmount,
      currency: 'USD',
      validUntil: '2026-08-30',
      estimatedDurationDays: supplierQuote.estimatedDays,
      warrantyMonths: supplierQuote.warrantyMonths || 24,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900">Crear Propuesta Comercial al Cliente</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
          <p className="font-bold text-slate-900">Lote {workRequest.lotNumber || workRequest.lotId} — {workRequest.customerName}</p>
          <p className="text-slate-500">Proveedor Seleccionado: {supplierQuote.providerName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Modelo de Comisión:</label>
              <select
                value={commissionModel}
                onChange={e => setCommissionModel(e.target.value as CommissionModel)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-900"
              >
                <option value="MARKUP">Markup (Sobreprecio %)</option>
                <option value="PERCENTAGE">Porcentaje de Comisión %</option>
                <option value="FIXED_FEE">Fee Fijo (USD)</option>
                <option value="MANAGEMENT_FEE">Fee de Gestión de Obra</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {commissionModel === 'FIXED_FEE' ? 'Monto Fee (USD):' : 'Porcentaje (%):'}
              </label>
              <input
                type="number"
                value={rateOrFee}
                onChange={e => setRateOrFee(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-900"
                min={0}
              />
            </div>
          </div>

          {/* DYNAMIC FINANCIAL BREAKDOWN PREVIEW */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-2">
            <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 text-amber-400 font-bold uppercase text-[10px]">
              <span>Cálculo de Precios & Margen Nexo</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-slate-400 text-[10px] block">Costo Base Proveedor:</span>
                <span className="text-sm font-bold text-slate-200">${pricing.providerCost.toLocaleString()} USD</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Precio Final al Cliente:</span>
                <span className="text-base font-black text-emerald-400">${pricing.clientPrice.toLocaleString()} USD</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Comisión Nexo:</span>
                <span className="text-xs font-bold text-amber-300">${pricing.commissionAmount.toLocaleString()} USD</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Margen Neto:</span>
                <span className="text-xs font-bold text-teal-300">${pricing.marginAmount.toLocaleString()} USD</span>
              </div>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Título de la Propuesta:</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-900"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              <CheckCircle2 className="w-4 h-4" /> Guardar Propuesta V{version}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
