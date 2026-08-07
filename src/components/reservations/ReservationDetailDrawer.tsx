import React, { useState } from 'react';
import { Reservation, ReservationChecklistItem, UserRole } from '../../types';
import { RESERVATION_NEXT_STEP_LABELS, createDefaultChecklist } from '../../domain/reservationDomain';
import { formatUSD } from '../../domain/rules';
import { Button } from '../ui/Button';
import { X, CheckCircle2, Clock, FileText, User, MapPin, ShieldCheck, AlertTriangle, RefreshCw, XCircle, ArrowRight } from 'lucide-react';

interface ReservationDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  userRole: UserRole;
  onToggleChecklist: (resId: string, itemId: string) => void;
  onPrepareSale: (res: Reservation) => void;
  onChangeLot: (res: Reservation) => void;
  onCancelReservation: (res: Reservation) => void;
}

export const ReservationDetailDrawer: React.FC<ReservationDetailDrawerProps> = ({
  isOpen,
  onClose,
  reservation,
  userRole,
  onToggleChecklist,
  onPrepareSale,
  onChangeLot,
  onCancelReservation,
}) => {
  const [activeTab, setActiveTab] = useState<'RESUMEN' | 'CHECKLIST' | 'HISTORIAL'>('CHECKLIST');

  if (!isOpen || !reservation) return null;

  const checklist = reservation.checklist || createDefaultChecklist();
  const completedCount = checklist.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black">Reserva Lote {reservation.lotNumber}</h2>
                <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                  {reservation.reservationNumber || `RES-${reservation.id}`}
                </span>
              </div>
              <p className="text-xs text-slate-400">Titular: {reservation.leadName} (Bloque {reservation.block})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="bg-slate-100 px-5 py-2 flex gap-2 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('CHECKLIST')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'CHECKLIST' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Checklist ({completedCount}/{checklist.length})
          </button>
          <button
            onClick={() => setActiveTab('RESUMEN')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'RESUMEN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Detalles Comerciales
          </button>
          <button
            onClick={() => setActiveTab('HISTORIAL')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'HISTORIAL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Historial de Eventos
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* TAB 1: CHECKLIST */}
          {activeTab === 'CHECKLIST' && (
            <div className="space-y-4">
              {/* Progress bar */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900">Progreso de Documentación Post-Reserva</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {progressPercent}% Completado
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Checklist list */}
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onToggleChecklist(reservation.id, item.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      item.completed
                        ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        item.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-slate-50'
                      }`}
                    >
                      {item.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-bold text-xs ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {item.task}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                          {item.assignedRole}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RESUMEN */}
          {activeTab === 'RESUMEN' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Precio Acordado</span>
                  <span className="font-extrabold text-slate-900 text-sm">{formatUSD(reservation.agreedPrice)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Seña Validada</span>
                  <span className="font-extrabold text-emerald-700 text-sm">{formatUSD(reservation.depositAmount)}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Fecha de Reserva</span>
                  <span className="font-bold text-slate-800">{reservation.reservedAt?.substring(0, 10) || reservation.createdAt}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Validado Por</span>
                  <span className="font-bold text-slate-800">{reservation.validatedBy || 'Tesorería / Contabilidad'}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Próximo Hito Administrativo</span>
                <p className="font-extrabold text-slate-900 text-xs">
                  {reservation.nextStep ? RESERVATION_NEXT_STEP_LABELS[reservation.nextStep] : 'Firma de Boleto de Compraventa'}
                </p>
              </div>

              {reservation.notes && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 italic">
                  "{reservation.notes}"
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HISTORIAL */}
          {activeTab === 'HISTORIAL' && (
            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {[
                { title: 'Bloqueo Temporal Creado', date: reservation.createdAt, desc: 'Lote bloqueado por la fuerza de ventas.' },
                { title: 'Comprobante de Seña Cargado', date: reservation.reservedAt, desc: 'Pago enviado a revisión por Tesorería.' },
                { title: 'Seña Validada y Aprobada', date: reservation.validatedAt || reservation.reservedAt, desc: 'Tesorería confirmó acreditación. Reserva confirmada.' },
                { title: 'Apertura de Legajo Legal', date: 'Hoy', desc: 'Checklist de documentación iniciado.' },
              ].map((evt, idx) => (
                <div key={idx} className="relative pl-8 text-xs">
                  <span className="absolute left-2 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <p className="font-extrabold text-slate-900">{evt.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{evt.date}</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">{evt.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2 shrink-0">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChangeLot(reservation)}
              className="flex-1 text-slate-800 border-slate-300 font-bold"
            >
              <RefreshCw className="w-4 h-4 text-purple-600" /> Cambiar de Lote
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancelReservation(reservation)}
              className="flex-1 text-rose-700 border-rose-300 hover:bg-rose-50 font-bold"
            >
              <XCircle className="w-4 h-4 text-rose-600" /> Caída / Cancelar
            </Button>
          </div>

          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => onPrepareSale(reservation)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5"
          >
            Preparar Firma de Venta <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
