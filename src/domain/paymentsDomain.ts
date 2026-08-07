import {
  Sale,
  PaymentPlan,
  Installment,
  InstallmentStatus,
  PaymentPlanStatus,
  PaymentRecord,
  UnreconciledPayment,
  PaymentPromise,
  CollectionCommunication,
  RefinancingProposal,
  ReceiptInternal,
  AdjustmentType,
  PaymentMethod
} from '../types';
import { formatUSD, formatARS } from './rules';

/**
 * Calculates days overdue from a due date ISO string.
 * Returns 0 if due date is in the future.
 */
export function calculateDaysOverdue(dueDateIso: string, referenceDateIso: string = new Date().toISOString()): number {
  const due = new Date(dueDateIso).getTime();
  const ref = new Date(referenceDateIso).getTime();
  if (ref <= due) return 0;
  return Math.floor((ref - due) / (1000 * 60 * 60 * 24));
}

/**
 * Single Traffic Light (Semáforo de Mora) classification
 */
export interface DefaultStatusClassification {
  status: PaymentPlanStatus;
  label: string;
  badgeClass: string;
  color: string;
  bg: string;
  border: string;
  overdueCount: number;
  maxDaysOverdue: number;
  description: string;
}

export function classifyOverdueStatus(
  installments: Installment[],
  referenceDateIso: string = new Date().toISOString()
): DefaultStatusClassification {
  const overdueInstallments = installments.filter(i => {
    if (i.status === 'PAGADO' || i.status === 'CANCELADO' || i.status === 'REFINANCIADO') return false;
    const days = calculateDaysOverdue(i.dueDate, referenceDateIso);
    return days > 0 || i.status === 'VENCIDO';
  });

  const overdueCount = overdueInstallments.length;
  let maxDaysOverdue = 0;
  overdueInstallments.forEach(i => {
    const days = calculateDaysOverdue(i.dueDate, referenceDateIso);
    if (days > maxDaysOverdue) maxDaysOverdue = days;
  });

  // Determine classification
  if (overdueCount >= 3 || maxDaysOverdue > 90) {
    return {
      status: 'RIESGO_CONTRACTUAL',
      label: 'Riesgo Contractual (Revisión Legal)',
      badgeClass: 'bg-purple-100 text-purple-900 border-purple-300 font-extrabold',
      color: 'text-purple-900',
      bg: 'bg-purple-100',
      border: 'border-purple-300',
      overdueCount,
      maxDaysOverdue,
      description: 'Acumula 3+ cuotas impagas o más de 90 días de mora. Requiere revisión humana e intervención administrativa/legal.',
    };
  }

  if (overdueCount === 3) {
    return {
      status: 'MORA_CRITICA',
      label: 'Mora Crítica (3 Cuotas)',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold',
      color: 'text-rose-800',
      bg: 'bg-rose-100',
      border: 'border-rose-300',
      overdueCount,
      maxDaysOverdue,
      description: 'Atención urgente requerida. Se recomienda llamada prioritaria o carta documento de notificación.',
    };
  }

  if (overdueCount === 2) {
    return {
      status: 'MORA_MEDIA',
      label: 'Mora Media (2 Cuotas)',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300 font-bold',
      color: 'text-orange-800',
      bg: 'bg-orange-100',
      border: 'border-orange-300',
      overdueCount,
      maxDaysOverdue,
      description: '2 cuotas impagas consecutivas. Registrar compromiso de pago formal.',
    };
  }

  if (overdueCount === 1) {
    return {
      status: 'MORA_LEVE',
      label: 'Mora Leve (1 Cuota)',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
      color: 'text-amber-800',
      bg: 'bg-amber-100',
      border: 'border-amber-300',
      overdueCount,
      maxDaysOverdue,
      description: '1 cuota vencida. Enviar recordatorio amable vía WhatsApp o correo.',
    };
  }

  // Check if upcoming installment is due within 5 days
  const upcoming = installments.find(i => i.status === 'PENDIENTE' || i.status === 'PROXIMA');
  if (upcoming) {
    const daysUntilDue = Math.floor((new Date(upcoming.dueDate).getTime() - new Date(referenceDateIso).getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue >= 0 && daysUntilDue <= 5) {
      return {
        status: 'AL_DIA',
        label: 'Próximo Vencimiento',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
        color: 'text-sky-800',
        bg: 'bg-sky-100',
        border: 'border-sky-300',
        overdueCount: 0,
        maxDaysOverdue: 0,
        description: 'Vence en menos de 5 días. Enviar aviso preventivo.',
      };
    }
  }

  return {
    status: 'AL_DIA',
    label: 'Al Día',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    color: 'text-emerald-800',
    bg: 'bg-emerald-100',
    border: 'border-emerald-300',
    overdueCount: 0,
    maxDaysOverdue: 0,
    description: 'Cuenta corriente al día sin cuotas adeudadas.',
  };
}

/**
 * Deterministically generates an array of 36, 48, or 60 installments for a payment plan.
 */
export function generateInstallmentSchedule(params: {
  paymentPlanId: string;
  totalAmountUSD: number;
  downPaymentUSD: number;
  installmentCount: number;
  startDateIso?: string;
  firstDueDateIso?: string;
  exchangeRateARS?: number;
}): Installment[] {
  const {
    paymentPlanId,
    totalAmountUSD,
    downPaymentUSD,
    installmentCount,
    firstDueDateIso = new Date().toISOString(),
    exchangeRateARS = 1180,
  } = params;

  const financedAmountUSD = Math.max(0, totalAmountUSD - downPaymentUSD);
  const monthlyAmountUSD = Math.round(financedAmountUSD / installmentCount);

  const installments: Installment[] = [];
  const startDate = new Date(firstDueDateIso);

  for (let i = 1; i <= installmentCount; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + (i - 1));

    // Handle last installment rounding difference
    const amountUSD = i === installmentCount
      ? financedAmountUSD - (monthlyAmountUSD * (installmentCount - 1))
      : monthlyAmountUSD;

    const amountARS = Math.round(amountUSD * exchangeRateARS);
    const dueDateString = dueDate.toISOString().slice(0, 10);

    installments.push({
      id: `inst-${paymentPlanId}-${i}`,
      paymentPlanId,
      number: i,
      dueDate: dueDateString,
      baseAmount: amountUSD,
      adjustedAmount: amountUSD,
      paidAmount: 0,
      outstandingAmount: amountUSD,
      amountUSD,
      amountARS,
      cacIndexAdjustment: 0,
      status: 'PENDIENTE',
      daysOverdue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return installments;
}

/**
 * Calculates Account Statement Totals for a Payment Plan
 */
export interface AccountStatementSummary {
  lotPriceUSD: number;
  downPaymentUSD: number;
  financedAmountUSD: number;
  totalPaidUSD: number;
  totalOutstandingUSD: number;
  paidInstallmentsCount: number;
  pendingInstallmentsCount: number;
  overdueInstallmentsCount: number;
  nextDueDate?: string;
  nextDueAmountUSD?: number;
  maxDaysOverdue: number;
  classification: DefaultStatusClassification;
  isFullyPaid: boolean;
}

export function calculateAccountStatementSummary(
  plan: PaymentPlan,
  referenceDateIso: string = new Date().toISOString()
): AccountStatementSummary {
  const installments = plan.installments || [];
  const classification = classifyOverdueStatus(installments, referenceDateIso);

  let totalPaidUSD = plan.downPaymentUSD || plan.downPayment || 0;
  let totalOutstandingUSD = 0;
  let paidInstallmentsCount = 0;
  let pendingInstallmentsCount = 0;
  let overdueInstallmentsCount = 0;
  let nextDueDate: string | undefined = undefined;
  let nextDueAmountUSD: number | undefined = undefined;

  installments.forEach(inst => {
    const paid = inst.paidAmount ?? (inst.status === 'PAGADO' ? inst.amountUSD : 0);
    const outstanding = inst.outstandingAmount ?? (inst.status === 'PAGADO' ? 0 : inst.amountUSD - paid);

    totalPaidUSD += paid;
    totalOutstandingUSD += outstanding;

    if (inst.status === 'PAGADO') {
      paidInstallmentsCount++;
    } else {
      pendingInstallmentsCount++;
      const days = calculateDaysOverdue(inst.dueDate, referenceDateIso);
      if (days > 0 || inst.status === 'VENCIDO') {
        overdueInstallmentsCount++;
      } else if (!nextDueDate) {
        nextDueDate = inst.dueDate;
        nextDueAmountUSD = inst.amountUSD;
      }
    }
  });

  const isFullyPaid = totalOutstandingUSD <= 0 || (paidInstallmentsCount === installments.length && installments.length > 0);

  return {
    lotPriceUSD: (plan.originalAmount || 0) || ((plan.downPaymentUSD || 0) + (plan.financedAmount || 0)),
    downPaymentUSD: plan.downPaymentUSD || plan.downPayment || 0,
    financedAmountUSD: plan.financedAmount || (plan.monthlyAmountUSD * plan.totalInstallments),
    totalPaidUSD,
    totalOutstandingUSD,
    paidInstallmentsCount,
    pendingInstallmentsCount,
    overdueInstallmentsCount,
    nextDueDate,
    nextDueAmountUSD,
    maxDaysOverdue: classification.maxDaysOverdue,
    classification: isFullyPaid
      ? {
          status: 'CANCELADO_ECONOMICAMENTE',
          label: 'Saldo Cancelado Totalmente',
          badgeClass: 'bg-emerald-600 text-white font-extrabold border-emerald-700',
          color: 'text-emerald-700',
          bg: 'bg-emerald-100',
          border: 'border-emerald-300',
          overdueCount: 0,
          maxDaysOverdue: 0,
          description: 'El comprador ha cancelado el 100% del plan financiado. Habilitado para inicio de escrituración.',
        }
      : classification,
    isFullyPaid,
  };
}
