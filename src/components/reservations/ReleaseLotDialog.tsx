import React, { useState } from 'react';
import { LotHold, LotHoldReleaseReason } from '../../types';
import { HOLD_RELEASE_REASON_LABELS } from '../../domain/reservationDomain';
import { Button } from '../ui/Button';
import { X, AlertTriangle, ShieldAlert, Check } from 'lucide-react';

interface ReleaseLotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hold: LotHold | null;
  onConfirmRelease: (holdId: string, releaseReason: LotHoldReleaseReason, notes?: string) => void;
}

export const ReleaseLotDialog: React.FC<ReleaseLotDialogProps> = ({
  isOpen,
  onClose,
  hold,
  onConfirmRelease,
}) => {
  const [releaseReason, setReleaseReason] = useState<LotHoldReleaseReason>('SENA_NO_RECIBIDA');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen || !hold) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmRelease(hold.id, releaseReason, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-rose-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">Liberar Lote {hold.lotNumber}</h2>
              <p className="text-xs text-rose-300">Anulación de bloqueo y devolución a inventario disponible</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-rose-900 text-rose-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-950">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-rose-950">¿Confirmas liberar el lote?</p>
              <p className="text-[11px] text-rose-900 mt-0.5 leading-relaxed">
                El lote {hold.lotNumber} pasará inmediatamente a estado <strong>"DISPONIBLE"</strong> en el Masterplan para cualquier otro cliente.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-black text-slate-800 block">Motivo de Liberación <span className="text-rose-500">*</span></label>
            <select
              value={releaseReason}
              onChange={(e) => setReleaseReason(e.target.value as LotHoldReleaseReason)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900"
            >
              {(Object.keys(HOLD_RELEASE_REASON_LABELS) as LotHoldReleaseReason[]).map((rk) => (
                <option key={rk} value={rk}>
                  {HOLD_RELEASE_REASON_LABELS[rk]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-black text-slate-800 block">Observación para Auditoría</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. El cliente decidió no continuar debido a reorganización presupuestaria..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <Button type="button" variant="outline" size="md" fullWidth onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="danger" size="md" fullWidth className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold">
              <Check className="w-4 h-4" /> Confirmar Liberación
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
