import { LotStatus, ReservationStatus } from '../types';

/**
 * Business Rule: Lot Status Sequence
 * Interest -> Selection -> Temporary Hold (Bloqueo) -> Reservation Intent -> Deposit Promise -> Deposit Info -> Validated -> Confirmed Reservation / Sale
 */
export const LOT_STATUS_LABELS: Record<LotStatus, { label: string; color: string; bg: string; border: string }> = {
  DISPONIBLE: {
    label: 'Disponible',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  BLOQUEADO: {
    label: 'Bloqueado Temporal',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  INTENCION_RESERVA: {
    label: 'Intención Reserva',
    color: 'text-sky-700',
    bg: 'bg-sky-50',
    border: 'border-sky-200'
  },
  SENADO: {
    label: 'Seña Validando',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200'
  },
  RESERVADO: {
    label: 'Reservado',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  VENDIDO: {
    label: 'Vendido',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-300'
  },
};

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  INTENCION: { label: '1. Intención Registrada', color: 'text-sky-700', bg: 'bg-sky-100' },
  PROMESA_SENA: { label: '2. Promesa de Seña', color: 'text-amber-700', bg: 'bg-amber-100' },
  SENA_INFORMADA: { label: '3. Seña Informada (Pendiente Tesorería)', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  SENA_VALIDADA: { label: '4. Seña Validada', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  CONFIRMADA: { label: '5. Reserva Confirmada', color: 'text-purple-700', bg: 'bg-purple-100' },
  CANCELADA: { label: 'Caída / Cancelada', color: 'text-rose-700', bg: 'bg-rose-100' },
};

/**
 * Quote calculation helper
 */
export function calculateQuote(params: {
  lotPriceUSD: number;
  downPaymentPercent: number; // e.g. 30
  installmentsCount: number; // e.g. 24, 36, 48
  usdToArsRate?: number; // default 1250
  cacAnnualEstimatePercent?: number; // default 40%
}) {
  const { lotPriceUSD, downPaymentPercent, installmentsCount, usdToArsRate = 1250, cacAnnualEstimatePercent = 40 } = params;

  const downPaymentUSD = (lotPriceUSD * downPaymentPercent) / 100;
  const balanceToFinanceUSD = lotPriceUSD - downPaymentUSD;
  
  const monthlyInstallmentUSD = installmentsCount > 0 ? balanceToFinanceUSD / installmentsCount : 0;
  
  const downPaymentARS = downPaymentUSD * usdToArsRate;
  const monthlyInstallmentARS = monthlyInstallmentUSD * usdToArsRate;

  const monthlyCacRate = cacAnnualEstimatePercent / 12 / 100;

  // Schedule preview for first 6 months with CAC projection
  const projectedSchedule = Array.from({ length: Math.min(installmentsCount, 12) }, (_, i) => {
    const monthNum = i + 1;
    const factor = Math.pow(1 + monthlyCacRate, i);
    const projectedUSD = monthlyInstallmentUSD;
    const projectedARS = monthlyInstallmentARS * factor;
    return {
      monthNum,
      projectedUSD: Math.round(projectedUSD),
      projectedARS: Math.round(projectedARS),
      cacFactor: factor.toFixed(3)
    };
  });

  return {
    lotPriceUSD,
    downPaymentPercent,
    downPaymentUSD,
    downPaymentARS,
    balanceToFinanceUSD,
    installmentsCount,
    monthlyInstallmentUSD: Math.round(monthlyInstallmentUSD),
    monthlyInstallmentARS: Math.round(monthlyInstallmentARS),
    projectedSchedule
  };
}

/**
 * Format currency helper
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export function formatARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);
}
