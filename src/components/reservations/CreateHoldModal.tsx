import React, { useState } from 'react';
import { Lot, Lead, Quote, LotHoldReason, LotHold } from '../../types';
import { canBlockLot, HOLD_REASON_LABELS } from '../../domain/reservationDomain';
import { formatUSD } from '../../domain/rules';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Clock, MapPin, User, Calculator, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

interface CreateHoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  lots: Lot[];
  leads: Lead[];
  quotes: Quote[];
  activeHolds: LotHold[];
  initialLot?: Lot | null;
  initialLead?: Lead | null;
  initialQuote?: Quote | null;
  onConfirmHold: (params: {
    lotId: string;
    leadId: string;
    quoteId?: string;
    quoteOptionId?: string;
    durationHours: number;
    reason: LotHoldReason;
    notes?: string;
  }) => void;
}

export const CreateHoldModal: React.FC<CreateHoldModalProps> = ({
  isOpen,
  onClose,
  lots,
  leads,
  quotes,
  activeHolds,
  initialLot,
  initialLead,
  initialQuote,
  onConfirmHold,
}) => {
  const [selectedLotId, setSelectedLotId] = useState<string>(initialLot?.id || '');
  const [selectedLeadId, setSelectedLeadId] = useState<string>(initialLead?.id || '');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>(initialQuote?.id || '');
  const [durationHours, setDurationHours] = useState<number>(24);
  const [reason, setReason] = useState<LotHoldReason>('COTIZACION_ACEPTADA');
  const [notes, setNotes] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const availableLots = lots.filter((l) => l.status === 'DISPONIBLE' || l.id === selectedLotId);
  const selectedLot = lots.find((l) => l.id === selectedLotId);
  const selectedLead = leads.find((l) => l.id === selectedLeadId);
  const selectedQuote = quotes.find((q) => q.id === selectedQuoteId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedLotId) {
      setErrorMessage('Por favor selecciona un lote disponible.');
      return;
    }
    if (!selectedLeadId) {
      setErrorMessage('Por favor selecciona el lead / cliente titular.');
      return;
    }

    if (selectedLot) {
      const check = canBlockLot(selectedLot, activeHolds);
      if (!check.allowed && selectedLot.id !== initialLot?.id) {
        setErrorMessage(check.reason || 'El lote no se encuentra disponible para bloqueo.');
        return;
      }
    }

    let optionId = undefined;
    if (selectedQuote && selectedQuote.options && selectedQuote.options.length > 0) {
      const matchingOpt = selectedQuote.options.find((o) => o.lotId === selectedLotId) || selectedQuote.options[0];
      optionId = matchingOpt.id;
    }

    onConfirmHold({
      lotId: selectedLotId,
      leadId: selectedLeadId,
      quoteId: selectedQuoteId || undefined,
      quoteOptionId: optionId,
      durationHours,
      reason,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight">Nuevo Bloqueo Temporal</h2>
              <p className="text-xs text-slate-400">Reserva de inventario con vencimiento automático</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Rule banner */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-950">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-amber-950">Regla Comercial de Exclusividad</p>
              <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                El bloqueo reserva el lote temporalmente a nombre del cliente. Si no se registra promesa o seña válida antes del vencimiento, el lote se liberará automáticamente.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Selección de Lote */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> Lote a Bloquear <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedLotId}
              onChange={(e) => setSelectedLotId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="">-- Seleccionar Lote Disponible --</option>
              {availableLots.map((l) => (
                <option key={l.id} value={l.id}>
                  Lote {l.number} (Manzana {l.block}) — {formatUSD(l.priceUSD)} — {l.surfaceM2}m² ({l.status})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Selección de Lead */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" /> Lead Titular <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="">-- Seleccionar Lead --</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.fullName || `${l.firstName} ${l.lastName}`} ({l.phone}) — Status: {l.status}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Vínculo con Cotización (opcional) */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-slate-500" /> Cotización Asociada (Opcional)
            </label>
            <select
              value={selectedQuoteId}
              onChange={(e) => setSelectedQuoteId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Sin cotización previa formal</option>
              {quotes
                .filter((q) => !selectedLeadId || q.leadId === selectedLeadId)
                .map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.quoteNumber} — {q.leadName} (Estado: {q.status})
                  </option>
                ))}
            </select>
          </div>

          {/* 4. Duración del Bloqueo */}
          <div className="space-y-2">
            <label className="font-black text-slate-800 block">Duración del Bloqueo</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { hours: 2, label: '2 Horas' },
                { hours: 6, label: '6 Horas' },
                { hours: 24, label: '24 Horas' },
                { hours: 48, label: '48 Horas' },
              ].map((opt) => (
                <button
                  key={opt.hours}
                  type="button"
                  onClick={() => setDurationHours(opt.hours)}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                    durationHours === opt.hours
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Motivo del Bloqueo */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 block">Motivo / Justificación Comercial</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as LotHoldReason)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500"
            >
              {(Object.keys(HOLD_REASON_LABELS) as LotHoldReason[]).map((rKey) => (
                <option key={rKey} value={rKey}>
                  {HOLD_REASON_LABELS[rKey]}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Observaciones */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-800 block">Notas o Comentarios Adicionales</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. El cliente va a transferir seña desde su homebanking Galicia hoy por la tarde..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex gap-2">
            <Button type="button" variant="outline" size="md" fullWidth onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="md" fullWidth className="bg-amber-600 hover:bg-amber-700 text-white">
              <Check className="w-4 h-4" /> Confirmar Bloqueo ({durationHours}hs)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
