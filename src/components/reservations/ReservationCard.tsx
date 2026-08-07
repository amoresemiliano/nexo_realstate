import React from 'react';
import { Reservation, UserRole } from '../../types';
import { RESERVATION_NEXT_STEP_LABELS } from '../../domain/reservationDomain';
import { formatUSD } from '../../domain/rules';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { BookmarkCheck, Calendar, FileText, CheckCircle2, User, ChevronRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface ReservationCardProps {
  reservation: Reservation;
  userRole: UserRole;
  onOpenDetail: (res: Reservation) => void;
  onPrepareSale?: (res: Reservation) => void;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  userRole,
  onOpenDetail,
  onPrepareSale,
}) => {
  const isConfirmed = ['CONFIRMADA', 'SENA_VALIDADA'].includes(reservation.status);

  return (
    <Card padding="md" className="space-y-3 border-l-4 border-l-emerald-600 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900">
              Lote {reservation.lotNumber} (Manzana {reservation.block})
            </span>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-300">
              {reservation.reservationNumber || `RES-${reservation.id}`}
            </span>
          </div>
          <span className="text-xs text-slate-600 font-medium block mt-0.5">
            Titular: <strong className="text-slate-900">{reservation.leadName}</strong>
          </span>
        </div>
        <Badge variant={isConfirmed ? 'success' : 'info'}>
          {isConfirmed ? 'Reserva Confirmada' : 'Seña en Validación'}
        </Badge>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Precio Acordado</span>
          <span className="font-extrabold text-slate-900">{formatUSD(reservation.agreedPrice || reservation.agreedPriceUSD)}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Seña Validada</span>
          <span className="font-extrabold text-emerald-700">{formatUSD(reservation.depositAmount || reservation.depositAmountUSD)}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Saldo Restante</span>
          <span className="font-extrabold text-slate-700">
            {formatUSD((reservation.agreedPrice || reservation.agreedPriceUSD || 0) - (reservation.depositAmount || reservation.depositAmountUSD || 0))}
          </span>
        </div>
      </div>

      {/* Next Step Banner */}
      {reservation.nextStep && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Próximo Paso Administrativo</span>
              <span className="font-extrabold">{RESERVATION_NEXT_STEP_LABELS[reservation.nextStep]}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0" />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-1 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => onOpenDetail(reservation)}
          className="text-slate-800 border-slate-300 font-bold"
        >
          <FileText className="w-4 h-4" /> Ver Ficha de Reserva & Checklist
        </Button>

        {onPrepareSale && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onPrepareSale(reservation)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold shrink-0 whitespace-nowrap"
          >
            Preparar Venta
          </Button>
        )}
      </div>
    </Card>
  );
};
