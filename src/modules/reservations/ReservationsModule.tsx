import React, { useState } from 'react';
import { LotHold, Reservation, Lot } from '../../types';
import { mockHolds, mockReservations } from '../../data/mockData';
import { RESERVATION_STATUS_LABELS, formatUSD } from '../../domain/rules';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { BookmarkCheck, Clock, CheckCircle2, AlertTriangle, FileText, UserCheck, ShieldCheck, XCircle } from 'lucide-react';

interface ReservationsModuleProps {
  holds: LotHold[];
  reservations: Reservation[];
  onOpenHoldModal: () => void;
  onValidateDeposit: (resId: string) => void;
  onReleaseHold: (holdId: string) => void;
}

export const ReservationsModule: React.FC<ReservationsModuleProps> = ({
  holds,
  reservations,
  onOpenHoldModal,
  onValidateDeposit,
  onReleaseHold,
}) => {
  const [activeTab, setActiveTab] = useState<string>('SENA');

  const tabs = [
    { id: 'SENA', label: 'Validación de Señas', count: reservations.filter(r => r.status === 'SENA_INFORMADA').length },
    { id: 'HOLDS', label: 'Bloqueos Temporales', count: holds.filter(h => h.status === 'ACTIVO').length },
    { id: 'CONFIRMADA', label: 'Reservas Confirmadas', count: reservations.filter(r => r.status === 'CONFIRMADA' || r.status === 'SENA_VALIDADA').length },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Señas & Reservas</h2>
          <p className="text-xs text-slate-500">Validación de señas y control de bloqueos temporales</p>
        </div>
        <Button variant="primary" size="sm" onClick={onOpenHoldModal}>
          <Clock className="w-4 h-4" /> Nuevo Bloqueo
        </Button>
      </div>

      {/* Domain Rule Reminder Box */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-xs text-indigo-900 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-extrabold text-indigo-950">Regla de Reserva de Lotes</h3>
          <p className="text-[11px] text-indigo-800 mt-0.5">
            Un lote no se confirma reservado solo con manifestar interés. Requiere la secuencia: 
            <strong> Bloqueo → Intención → Promesa → Seña Informada → Validación de Tesorería</strong>.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Deposit Validation */}
      {activeTab === 'SENA' && (
        <div className="space-y-3">
          {reservations.filter(r => r.status === 'SENA_INFORMADA').length === 0 ? (
            <Card padding="md" className="text-center py-8 text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
              <p className="text-xs font-bold">No hay señas pendientes de validación por Tesorería.</p>
            </Card>
          ) : (
            reservations.filter(r => r.status === 'SENA_INFORMADA').map(res => (
              <Card key={res.id} padding="md" className="space-y-3 border-l-4 border-l-indigo-600">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900">
                      Reserva Lote {res.lotNumber} ({res.block})
                    </span>
                    <span className="text-xs text-slate-500 block">Comprador: {res.leadName}</span>
                  </div>
                  <Badge variant="info">
                    {RESERVATION_STATUS_LABELS[res.status].label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Precio Acordado</span>
                    <span className="font-extrabold text-slate-900">{formatUSD(res.agreedPriceUSD)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Monto Seña Transferida</span>
                    <span className="font-extrabold text-indigo-700">{formatUSD(res.depositAmountUSD)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                  "{res.notes}"
                </p>

                <div className="flex gap-2 pt-1 border-t border-slate-100">
                  <Button
                    variant="success"
                    size="sm"
                    fullWidth
                    onClick={() => onValidateDeposit(res.id)}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Validar Seña (Tesorería)
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Holds */}
      {activeTab === 'HOLDS' && (
        <div className="space-y-3">
          {holds.map(hold => (
            <Card key={hold.id} padding="md" className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900">
                    Bloqueo Temporal Lote {hold.lotNumber}
                  </span>
                  <span className="text-xs text-slate-500 block">Lead: {hold.leadName}</span>
                </div>
                <Badge variant={hold.status === 'ACTIVO' ? 'warning' : 'default'}>
                  {hold.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                <span className="flex items-center gap-1 font-semibold text-amber-900">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Vence: {hold.expiryDate}
                </span>
                <span className="text-slate-500 text-[11px]">Agente: {hold.agentName}</span>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => onReleaseHold(hold.id)}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Liberar Lote Manualmente
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Confirmed Reservations */}
      {activeTab === 'CONFIRMADA' && (
        <div className="space-y-3">
          {reservations.filter(r => r.status === 'CONFIRMADA' || r.status === 'SENA_VALIDADA').map(res => (
            <Card key={res.id} padding="md" className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900">Lote {res.lotNumber} — Reserva Confirmada</span>
                  <span className="text-xs text-slate-500 block">Titular: {res.leadName}</span>
                </div>
                <Badge variant="success">Reserva Aprobada</Badge>
              </div>
              <div className="text-xs text-slate-600 flex justify-between bg-slate-50 p-2 rounded-xl">
                <span>Monto Seña: <strong>{formatUSD(res.depositAmountUSD)}</strong></span>
                <span>Validado por: <strong>{res.validatedBy || 'Tesorería'}</strong></span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
