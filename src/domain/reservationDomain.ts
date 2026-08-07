import {
  Lot,
  Lead,
  LotHold,
  LotHoldReason,
  LotHoldReleaseReason,
  ReservationIntent,
  ReservationIntentStatus,
  Deposit,
  DepositStatus,
  DepositRejectionReason,
  Reservation,
  ReservationStatus,
  ReservationNextStep,
  DocumentationStatus,
  ReservationCancellationReason,
  ReservationChecklistItem,
  PaymentMethod,
  ActivityItem,
  TaskItem,
  SystemAlert,
  UserRole
} from '../types';
import { formatUSD } from './rules';

export const HOLD_REASON_LABELS: Record<LotHoldReason, string> = {
  COTIZACION_ACEPTADA: 'Cotización Aceptada',
  INTENCION_RESERVA: 'Intención de Reserva Comercial',
  ESPERANDO_SENA: 'Esperando Pago de Seña',
  AUTORIZACION_COMERCIAL: 'Autorización Comercial Especial',
  OTRO: 'Otro Motivo',
};

export const HOLD_RELEASE_REASON_LABELS: Record<LotHoldReleaseReason, string> = {
  SENA_NO_RECIBIDA: 'Seña no recibida dentro del plazo',
  CLIENTE_DESISTIO: 'El cliente desistió de la compra',
  COMPROBANTE_RECHAZADO: 'Comprobante de seña rechazado',
  VENCIMIENTO: 'Vencimiento automático de plazo',
  CAMBIO_LOTE: 'Cambio de lote por otra unidad',
  DECISION_ADMINISTRATIVA: 'Decisión de dirección / administración',
  DUPLICACION: 'Duplicación o error administrativo',
  OTRO: 'Otro motivo',
};

export const DEPOSIT_STATUS_LABELS: Record<DepositStatus, { label: string; color: string; bg: string; border: string }> = {
  PENDIENTE: { label: 'Pendiente de Pago', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' },
  PROMETIDA: { label: 'Promesa de Seña', color: 'text-sky-800', bg: 'bg-sky-50', border: 'border-sky-200' },
  INFORMADA: { label: 'Comprobante Carga Comercial', color: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' },
  REPORTADA: { label: 'Seña Reportada', color: 'text-blue-800', bg: 'bg-blue-50', border: 'border-blue-200' },
  EN_VALIDACION: { label: 'En Validacion Tesorería', color: 'text-indigo-800', bg: 'bg-indigo-100', border: 'border-indigo-300' },
  CONFIRMADA: { label: 'Seña Validada y Aprobada', color: 'text-emerald-900', bg: 'bg-emerald-100', border: 'border-emerald-300' },
  VALIDADA: { label: 'Seña Validada', color: 'text-emerald-900', bg: 'bg-emerald-100', border: 'border-emerald-300' },
  OBSERVADA: { label: 'Comprobante Observado', color: 'text-orange-900', bg: 'bg-orange-100', border: 'border-orange-300' },
  RECHAZADA: { label: 'Seña Rechazada', color: 'text-rose-900', bg: 'bg-rose-100', border: 'border-rose-300' },
  CANCELADA: { label: 'Operación Anulada', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300' },
  DEVUELTA: { label: 'Seña Devuelta', color: 'text-purple-800', bg: 'bg-purple-100', border: 'border-purple-300' },
  VENCIDA: { label: 'Promesa Vencida', color: 'text-zinc-700', bg: 'bg-zinc-200', border: 'border-zinc-300' },
};

export const DEPOSIT_REJECTION_REASON_LABELS: Record<DepositRejectionReason, string> = {
  IMPORTE_INCORRECTO: 'Importe acreditado inferior al acordado',
  PAGO_NO_IDENTIFICADO: 'Pago no reflejado en cuenta bancaria',
  COMPROBANTE_ILEGIBLE: 'Comprobante ilegible o fragmentado',
  REFERENCIA_INCORRECTA: 'Número de transferencia o referencia inválida',
  MONEDA_INCORRECTA: 'Moneda depositada distinta a la pactada',
  PAGO_DUPLICADO: 'Comprobante duplicado o ya procesado',
  FECHA_INCONSISTENTE: 'Fecha del comprobante previa o inconsistente',
  DATOS_NO_COINCIDEN: 'Datos del titular no coinciden con el lead',
  OPERACION_ANULADA: 'Transferencia revertida o anulada',
  LOTE_NO_DISPONIBLE: 'El lote ya no se encuentra en estado disponible',
  OTRO: 'Otro motivo verificado por Tesorería',
};

export const RESERVATION_NEXT_STEP_LABELS: Record<ReservationNextStep, string> = {
  PREPARAR_DOCUMENTACION: '1. Solicitar documentación y datos fiscales',
  SOLICITAR_DNI: '2. Verificar DNI/CUIT de los compradores',
  SOLICITAR_DATOS_FISCALES: '3. Completar ficha de datos fiscales y domicilio',
  VERIFICAR_COTIZACION: '4. Ratificar plan comercial y anexos de cuotas',
  PREPARAR_BOLETO: '5. Elaborar borrador de Boleto de Compraventa',
  FIRMA_CONTRATO: '6. Coordinar fecha de firma presencial',
};

export const RESERVATION_CANCEL_REASON_LABELS: Record<ReservationCancellationReason, string> = {
  DESISTIMIENTO_COMPRADOR: 'Desistimiento voluntario del comprador',
  DOCUMENTACION_INCOMPLETA: 'Documentación legal/fiscal no presentada',
  CONDICIONES_NO_ACORDADAS: 'No hubo acuerdo en cláusulas del boleto',
  SENA_DEVUELTA: 'Devolución formal de seña acordada',
  ERROR_ADMINISTRATIVO: 'Error en la asignación del lote o datos',
  CAMBIO_LOTE: 'Sustitución por reserva en otro lote',
  INCUMPLIMIENTO_PLAZO: 'Incumplimiento de plazos de pago acordados',
  OTRO: 'Otro motivo comercial',
};

/**
 * Calculates countdown and expiration display for holds and deposit promises
 */
export function getHoldCountdown(expiresAtIso?: string): {
  text: string;
  badgeClass: string;
  isExpired: boolean;
  isCritical: boolean;
  remainingMinutes: number;
} {
  if (!expiresAtIso) {
    return {
      text: 'Sin Fecha Expiración',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      isExpired: false,
      isCritical: false,
      remainingMinutes: 9999,
    };
  }
  const expiry = new Date(expiresAtIso).getTime();
  const now = Date.now();
  const diffMs = expiry - now;
  const remainingMinutes = Math.floor(diffMs / (1000 * 60));

  if (remainingMinutes <= 0) {
    const overdueMinutes = Math.abs(remainingMinutes);
    const overdueHours = Math.floor(overdueMinutes / 60);
    const overdueText = overdueHours > 0 ? `${overdueHours}h ${overdueMinutes % 60}m` : `${overdueMinutes}m`;
    return {
      text: `Vencido hace ${overdueText}`,
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
      isExpired: true,
      isCritical: true,
      remainingMinutes,
    };
  }

  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;

  if (hours < 2) {
    return {
      text: `¡Crítico! Vence en ${hours}h ${mins}m`,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-extrabold animate-pulse',
      isExpired: false,
      isCritical: true,
      remainingMinutes,
    };
  }

  if (hours < 6) {
    return {
      text: `Vence en ${hours}h ${mins}m`,
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
      isExpired: false,
      isCritical: true,
      remainingMinutes,
    };
  }

  if (hours < 24) {
    return {
      text: `Vence hoy (${hours}h ${mins}m)`,
      badgeClass: 'bg-sky-50 text-sky-800 border-sky-200 font-semibold',
      isExpired: false,
      isCritical: false,
      remainingMinutes,
    };
  }

  const days = Math.floor(hours / 24);
  return {
    text: `Vence en ${days}d ${hours % 24}h`,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
    isExpired: false,
    isCritical: false,
    remainingMinutes,
  };
}

/**
 * Domain Validation: Can a lot be blocked?
 */
export function canBlockLot(lot: Lot, activeHolds: LotHold[]): { allowed: boolean; reason?: string } {
  if (lot.status !== 'DISPONIBLE') {
    return {
      allowed: false,
      reason: `El lote no está Disponible (Estado actual: ${lot.status}).`,
    };
  }

  const existingActiveHold = activeHolds.find(
    (h) => h.lotId === lot.id && ['ACTIVO', 'PROXIMO_A_VENCER'].includes(h.status)
  );

  if (existingActiveHold) {
    return {
      allowed: false,
      reason: `El lote ya posee un bloqueo activo (Lead: ${existingActiveHold.leadName}). No se permiten bloqueos simultáneos.`,
    };
  }

  return { allowed: true };
}

/**
 * Creates default 12-item post-reservation checklist
 */
export function createDefaultChecklist(): ReservationChecklistItem[] {
  return [
    { id: 'chk-1', task: 'Confirmar datos personales completos de los titulares', completed: true, assignedRole: 'COMERCIAL' },
    { id: 'chk-2', task: 'Solicitar copia de DNI/Pasaporte legible', completed: true, assignedRole: 'COMERCIAL' },
    { id: 'chk-3', task: 'Solicitar constancia de CUIT/CUIL y datos fiscales', completed: false, assignedRole: 'ADMINISTRACION' },
    { id: 'chk-4', task: 'Verificar domicilio real y correo electrónico de notificación', completed: false, assignedRole: 'COMERCIAL' },
    { id: 'chk-5', task: 'Confirmar estado civil y datos del cónyuge si corresponde', completed: false, assignedRole: 'LEGAL' },
    { id: 'chk-6', task: 'Verificar cotización aceptada y plazo de financiación', completed: true, assignedRole: 'COMERCIAL' },
    { id: 'chk-7', task: 'Preparar condiciones comerciales definitivas y anexo', completed: false, assignedRole: 'ADMINISTRACION' },
    { id: 'chk-8', task: 'Asignar oficial administrativo responsable del boleto', completed: true, assignedRole: 'ADMINISTRACION' },
    { id: 'chk-9', task: 'Redactar borrador de Boleto de Compraventa', completed: false, assignedRole: 'LEGAL' },
    { id: 'chk-10', task: 'Confirmar plan de cuotas y fechas de vencimiento', completed: false, assignedRole: 'ADMINISTRACION' },
    { id: 'chk-11', task: 'Revisar y validar comisión comercial del vendedor', completed: false, assignedRole: 'ADMINISTRACION' },
    { id: 'chk-12', task: 'Establecer fecha y lugar para firma presencial', completed: false, assignedRole: 'COMERCIAL' },
  ];
}

/**
 * Generates deterministic reservation code
 */
export function generateReservationNumber(sequenceNumber: number): string {
  const padded = sequenceNumber.toString().padStart(5, '0');
  return `RES-2026-${padded}`;
}
