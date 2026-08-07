import React, { useState } from 'react';
import { Reservation, ReservationCancellationReason } from '../../types';
import { RESERVATION_CANCEL_REASON_LABELS } from '../../domain/reservationDomain';
import { Button } from '../ui/Button';
import { X, AlertTriangle, ShieldAlert, Check } from 'lucide-react';

interface CancelReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onConfirmCancel: (params: {
    reservationId: string;
    reason: ReservationCancellationReason;
    refundDeposit: boolean;
    notes?: string;
  }) => void;
}

export const CancelReservationDialog: React.FC<CancelReservationDialogProps> = ({
  isOpen,
  onClose,
  reservation,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState<ReservationCancellationReason>('DESISTIMIENTO_COMPRADOR');
  const [refundDeposit, setRefundDeposit] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen || !reservation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmCancel({
      reservationId: reservation.id,
      reason,
      refundDeposit,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">Cancelar Reserva Lote {reservation.lotNumber}</h2>
              <p className="text-xs text-slate-400">Caída formal de la operación comercial</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-950">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-rose-950">Efectos de la Cancelación</p>
              <p className="text-[11px] text-rose-900 mt-0.5 leading-relaxed">
                El lote {reservation.lotNumber} volverá a estado <strong>DISPONIBLE</strong>. La reserva {reservation.reservationNumber} pasará a estado <strong>CANCELADA</strong> en el historial.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-black text-slate-800 block">Motivo de Caída de Operación <span className="text-rose-500">*</span></label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReservationCancellationReason)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900"
            >
              {(Object.keys(RESERVATION_CANCEL_REASON_LABELS) as ReservationCancellationReason[]).map((rk) => (
                <option key={rk} value={rk}>
                  {RESERVATION_CANCEL_REASON_LABELS[rk]}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-extrabold text-slate-900">
              <input
                type="checkbox"
                checked={refundDeposit}
                onChange={(e) => setRefundDeposit(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span>Devolución / Reembolso de Seña Acreditada</span>
            </label>
            <p className="text-[10px] text-slate-500 leading-normal pl-6">
              Si está marcado, la seña se registrará como "Seña Devuelta" en la contabilidad administrativa.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-black text-slate-800 block">Observaciones Administrativas</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalle acordado de la rescisión..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <Button type="button" variant="outline" size="md" fullWidth onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="danger" size="md" fullWidth className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold">
              <Check className="w-4 h-4" /> Confirmar Cancelación
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
