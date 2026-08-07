import React from 'react';
import { HoldStatus } from '../../types';
import { Clock, AlertTriangle, CheckCircle2, XCircle, ShieldAlert, RefreshCw } from 'lucide-react';

interface HoldStatusBadgeProps {
  status: HoldStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const HoldStatusBadge: React.FC<HoldStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const configs: Record<HoldStatus, { label: string; icon: React.FC<{ className?: string }>; className: string }> = {
    ACTIVO: {
      label: 'Bloqueado Temporal',
      icon: Clock,
      className: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    },
    PROXIMO_A_VENCER: {
      label: '¡Próximo a Vencer!',
      icon: AlertTriangle,
      className: 'bg-rose-100 text-rose-900 border-rose-300 font-extrabold animate-pulse',
    },
    VENCIDO: {
      label: 'Vencido',
      icon: ShieldAlert,
      className: 'bg-zinc-200 text-zinc-800 border-zinc-400 font-semibold',
    },
    LIBERADO: {
      label: 'Lote Liberado',
      icon: CheckCircle2,
      className: 'bg-slate-100 text-slate-700 border-slate-300',
    },
    CONVERTIDO: {
      label: 'Convertido a Reserva',
      icon: CheckCircle2,
      className: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold',
    },
    CANCELADO: {
      label: 'Bloqueo Anulado',
      icon: XCircle,
      className: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    REEMPLAZADO: {
      label: 'Cambio de Lote',
      icon: RefreshCw,
      className: 'bg-purple-100 text-purple-900 border-purple-300',
    },
  };

  const config = configs[status] || configs.ACTIVO;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border ${sizeClasses} ${config.className}`}>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} />
      <span>{config.label}</span>
    </span>
  );
};
