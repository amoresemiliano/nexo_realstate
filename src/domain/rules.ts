import { LotStatus, ReservationStatus, LeadStatus, LeadSource, LeadTemperature, LeadPriority, Lead, Lot, QuoteStatus, DevelopmentStatus } from '../types';

/**
 * Business Rule: Lot Status Sequence
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
  EN_MORA: {
    label: 'En Mora',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200'
  },
  ESCRITURADO: {
    label: 'Escriturado',
    color: 'text-cyan-800',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200'
  },
  ENTREGADO: {
    label: 'Entregado',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  NO_COMERCIALIZABLE: {
    label: 'No Comercializable',
    color: 'text-zinc-600',
    bg: 'bg-zinc-100',
    border: 'border-zinc-300'
  }
};

export const DEVELOPMENT_STATUS_LABELS: Record<DevelopmentStatus, { label: string; color: string; bg: string }> = {
  EN_PREVENTA: { label: 'En Preventa', color: 'text-amber-800', bg: 'bg-amber-100' },
  COMERCIALIZACION_ACTIVA: { label: 'Comercialización Activa', color: 'text-emerald-800', bg: 'bg-emerald-100' },
  ULTIMAS_UNIDADES: { label: 'Últimas Unidades', color: 'text-rose-800', bg: 'bg-rose-100' },
  EN_DESARROLLO: { label: 'En Desarrollo', color: 'text-blue-800', bg: 'bg-blue-100' },
  ENTREGADO: { label: 'Entregado', color: 'text-slate-800', bg: 'bg-slate-200' },
  PAUSADO: { label: 'Pausado', color: 'text-zinc-700', bg: 'bg-zinc-100' },
  CERRADO: { label: 'Cerrado', color: 'text-stone-700', bg: 'bg-stone-200' },
};

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, { label: string; color: string; bg: string; border: string }> = {
  BORRADOR: { label: 'Borrador', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300' },
  PREPARADA: { label: 'Preparada', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  ENVIADA: { label: 'Enviada', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200' },
  VISTA: { label: 'Vista por Cliente', color: 'text-indigo-800', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  EVALUACION: { label: 'En Evaluación', color: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-200' },
  MODIFICACION_SOLICITADA: { label: 'Modif. Solicitada', color: 'text-orange-800', bg: 'bg-orange-50', border: 'border-orange-200' },
  ACEPTADA: { label: 'Aceptada', color: 'text-emerald-800', bg: 'bg-emerald-100', border: 'border-emerald-300' },
  RECHAZADA: { label: 'Rechazada', color: 'text-rose-800', bg: 'bg-rose-100', border: 'border-rose-300' },
  VENCIDA: { label: 'Vencida', color: 'text-zinc-700', bg: 'bg-zinc-200', border: 'border-zinc-300' },
  CANCELADA: { label: 'Cancelada', color: 'text-stone-600', bg: 'bg-stone-100', border: 'border-stone-300' },
  SUSTITUIDA: { label: 'Sustituida (v1)', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' },
};

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  INTENCION: { label: '1. Intención Registrada', color: 'text-sky-700', bg: 'bg-sky-100' },
  PROMESA_SENA: { label: '2. Promesa de Seña', color: 'text-amber-700', bg: 'bg-amber-100' },
  SENA_INFORMADA: { label: '3. Seña Informada (Pendiente Tesorería)', color: 'text-indigo-700', bg: 'bg-indigo-100' },
  SENA_VALIDADA: { label: '4. Seña Validada', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  CONFIRMADA: { label: '5. Reserva Confirmada', color: 'text-purple-700', bg: 'bg-purple-100' },
  DOCUMENTACION_PENDIENTE: { label: 'Documentación Pendiente', color: 'text-orange-700', bg: 'bg-orange-100' },
  PREPARACION_CONTRATUAL: { label: 'Preparación Contratual', color: 'text-cyan-700', bg: 'bg-cyan-100' },
  LISTA_VENTA: { label: 'Lista para Venta', color: 'text-blue-700', bg: 'bg-blue-100' },
  EN_REVISION: { label: 'En Revisión', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  DEVUELTA: { label: 'Seña Devuelta', color: 'text-zinc-700', bg: 'bg-zinc-100' },
  CANCELADA: { label: 'Caída / Cancelada', color: 'text-rose-700', bg: 'bg-rose-100' },
};

export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string; border: string; category: 'pipeline' | 'closed' }> = {
  NUEVO: { label: 'Lead Recibido', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200', category: 'pipeline' },
  PENDIENTE_PRIMER_CONTACTO: { label: 'Pend. Primer Contacto', color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200', category: 'pipeline' },
  CONTACTADO: { label: 'Contactado', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', category: 'pipeline' },
  EN_CALIFICACION: { label: 'En Calificación', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200', category: 'pipeline' },
  CALIFICADO: { label: 'Calificado', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200', category: 'pipeline' },
  SEGUIMIENTO: { label: 'Seguimiento', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', category: 'pipeline' },
  VISITA_AGENDADA: { label: 'Visita Agendada', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', category: 'pipeline' },
  VISITA_REALIZADA: { label: 'Visita Realizada', color: 'text-fuchsia-700', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', category: 'pipeline' },
  LOTE_IDENTIFICADO: { label: 'Lote Identificado', color: 'text-brand-700', bg: 'bg-brand-50', border: 'border-brand-200', category: 'pipeline' },
  COTIZACION_PENDIENTE: { label: 'Cotización Pendiente', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', category: 'pipeline' },
  COTIZACION_ENVIADA: { label: 'Cotización Enviada', color: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200', category: 'pipeline' },
  NEGOCIACION: { label: 'Negociación', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', category: 'pipeline' },
  INTENCION_RESERVA: { label: 'Intención de Reserva', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200', category: 'pipeline' },
  SENA_PENDIENTE: { label: 'Seña Pendiente', color: 'text-indigo-800', bg: 'bg-indigo-100', border: 'border-indigo-300', category: 'pipeline' },
  RESERVA_CONFIRMADA: { label: 'Reserva Confirmada', color: 'text-emerald-900', bg: 'bg-emerald-100', border: 'border-emerald-300', category: 'pipeline' },
  VENTA_PREPARACION: { label: 'Venta en Preparación', color: 'text-slate-900', bg: 'bg-slate-200', border: 'border-slate-400', category: 'pipeline' },

  // Closed / Alternate
  SIN_RESPUESTA: { label: 'Sin Respuesta', color: 'text-zinc-700', bg: 'bg-zinc-100', border: 'border-zinc-200', category: 'closed' },
  SEGUIMIENTO_FUTURO: { label: 'Seguimiento Futuro', color: 'text-sky-800', bg: 'bg-sky-100/70', border: 'border-sky-200', category: 'closed' },
  NO_CALIFICADO: { label: 'No Calificado', color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200', category: 'closed' },
  OPORTUNIDAD_PERDIDA: { label: 'Oportunidad Perdida', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', category: 'closed' },
  DUPLICADO: { label: 'Duplicado', color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200', category: 'closed' },
  CONTACTO_INVALIDO: { label: 'Contacto Inválido', color: 'text-rose-800', bg: 'bg-rose-100', border: 'border-rose-300', category: 'closed' },

  // Mappings for compatibility
  RESERVA: { label: 'Reserva Confirmada', color: 'text-emerald-900', bg: 'bg-emerald-100', border: 'border-emerald-300', category: 'pipeline' },
  LOTE_IDENTIFICATED: { label: 'Lote Identificado', color: 'text-brand-700', bg: 'bg-brand-50', border: 'border-brand-200', category: 'pipeline' },
  PERDIDO: { label: 'Oportunidad Perdida', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', category: 'closed' },
  RESERVADO: { label: 'Reserva Confirmada', color: 'text-emerald-900', bg: 'bg-emerald-100', border: 'border-emerald-300', category: 'pipeline' },
  VISITA: { label: 'Visita Agendada', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', category: 'pipeline' },
};

export const TEMPERATURE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  FRIO: { label: 'Frío', color: 'text-sky-700', bg: 'bg-sky-50', icon: '❄️' },
  FRÍO: { label: 'Frío', color: 'text-sky-700', bg: 'bg-sky-50', icon: '❄️' },
  TIBIO: { label: 'Tibio', color: 'text-amber-700', bg: 'bg-amber-50', icon: '🌤️' },
  CALIENTE: { label: 'Caliente', color: 'text-orange-700', bg: 'bg-orange-50', icon: '🔥' },
  MUY_CALIENTE: { label: 'Muy Caliente', color: 'text-rose-700', bg: 'bg-rose-100', icon: '💥' },
};

export const PRIORITY_CONFIG: Record<LeadPriority, { label: string; color: string; bg: string }> = {
  BAJA: { label: 'Baja', color: 'text-slate-600', bg: 'bg-slate-100' },
  MEDIA: { label: 'Media', color: 'text-blue-700', bg: 'bg-blue-50' },
  ALTA: { label: 'Alta', color: 'text-amber-800', bg: 'bg-amber-100' },
  URGENTE: { label: 'Urgente', color: 'text-rose-800', bg: 'bg-rose-100' },
};

/**
 * First Response SLA Calculation
 */
export function calculateSLA(createdAtIso: string, status: LeadStatus) {
  const createdDate = new Date(createdAtIso).getTime();
  const now = Date.now();
  const diffMinutes = Math.floor(Math.max(0, now - createdDate) / (1000 * 60));

  let ageText = '';
  if (diffMinutes < 60) {
    ageText = `Hace ${diffMinutes} min`;
  } else if (diffMinutes < 1440) {
    const hours = Math.floor(diffMinutes / 60);
    ageText = `Hace ${hours} h`;
  } else {
    const days = Math.floor(diffMinutes / 1440);
    ageText = days === 1 ? 'Ayer' : `Hace ${days} días`;
  }

  const isContactedOrBeyond = !['NUEVO', 'PENDIENTE_PRIMER_CONTACTO'].includes(status);

  let slaStatus: 'OK' | 'RECOMMENDED' | 'OVERDUE' | 'CRITICAL' = 'OK';
  let badgeText = 'Dentro del Objetivo';
  let badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let suggestedAction = 'Contactar a la brevedad';

  if (isContactedOrBeyond) {
    badgeText = 'Primer Contacto Realizado';
    badgeClass = 'bg-slate-100 text-slate-700 border-slate-200';
    suggestedAction = 'Continuar seguimiento según pipeline';
  } else if (diffMinutes <= 15) {
    slaStatus = 'OK';
    badgeText = '<15 min — SLA Cumplido';
    badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    suggestedAction = 'Enviar WhatsApp o llamar ahora';
  } else if (diffMinutes <= 60) {
    slaStatus = 'RECOMMENDED';
    badgeText = '15-60 min — Atención Recomendada';
    badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
    suggestedAction = 'Lead esperando contacto';
  } else if (diffMinutes <= 1440) {
    slaStatus = 'OVERDUE';
    badgeText = '>60 min — Atrasado';
    badgeClass = 'bg-orange-50 text-orange-800 border-orange-200';
    suggestedAction = 'Priorizar contacto urgente';
  } else {
    slaStatus = 'CRITICAL';
    badgeText = '>24hs — SLA Crítico';
    badgeClass = 'bg-rose-100 text-rose-900 border-rose-300 font-extrabold animate-pulse';
    suggestedAction = 'Rescatar lead o reasignar vendedor';
  }

  return { diffMinutes, ageText, slaStatus, badgeText, badgeClass, suggestedAction, isContactedOrBeyond };
}

/**
 * Simulated Lead Score Calculation (0 - 100)
 */
export function calculateLeadScore(lead: Partial<Lead>): { score: number; scoreReasons: string[] } {
  let score = 20; // base score for lead ingestion
  const reasons: string[] = ['Lead ingresado en CRM (+20)'];

  if (lead.budgetMin && lead.budgetMin >= 20000) {
    score += 20;
    reasons.push('Presupuesto declarado adecuado (+20)');
  } else if (lead.budgetUSD && lead.budgetUSD >= 20000) {
    score += 15;
    reasons.push('Presupuesto general verificado (+15)');
  }

  if (lead.availableDownPayment && lead.availableDownPayment >= 8000) {
    score += 20;
    reasons.push('Anticipo líquido disponible (+20)');
  }

  if (lead.expectedPurchaseDate && ['30 días', '60 días', 'Inmediata'].includes(lead.expectedPurchaseDate)) {
    score += 15;
    reasons.push('Plazo de compra cercano < 60 días (+15)');
  }

  if (lead.hasVisited) {
    score += 15;
    reasons.push('Visita presencial al desarrollo realizada (+15)');
  }

  if (lead.lotInterestIds && lead.lotInterestIds.length > 0) {
    score += 10;
    reasons.push('Lote de preferencia identificado (+10)');
  }

  const finalScore = Math.min(100, Math.max(0, score));
  return { score: finalScore, scoreReasons: reasons };
}

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
export function formatUSD(amount?: number): string {
  if (amount === undefined || amount === null) return '$0 USD';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export function formatARS(amount?: number): string {
  if (amount === undefined || amount === null) return '$0 ARS';
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);
}

/**
 * Calculates deterministic compatibility score between a lot and a lead's qualification specs
 */
export function calculateLotCompatibility(lot: Lot, lead?: Partial<Lead> | null): {
  level: 'ALTA' | 'MEDIA' | 'BAJA' | 'INCOMPATIBLE';
  label: string;
  badgeClass: string;
  reasons: string[];
} {
  if (!lead) {
    return {
      level: 'MEDIA',
      label: 'Sin Lead Asociado',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      reasons: ['No se ha seleccionado un lead para evaluar compatibilidad.'],
    };
  }

  const reasons: string[] = [];
  let points = 50;

  const lotPrice = lot.listPrice || lot.priceUSD;
  const leadBudget = lead.budgetUSD || lead.budgetMax || 0;

  if (leadBudget > 0) {
    if (lotPrice <= leadBudget) {
      points += 25;
      reasons.push('Dentro del presupuesto informado');
    } else if (lotPrice <= leadBudget * 1.15) {
      points += 10;
      reasons.push('Marginalmente sobre el presupuesto (+15%)');
    } else {
      points -= 20;
      reasons.push('Supera el presupuesto declarado');
    }
  }

  const estimatedDownPayment = lot.priceUSD * ((lot.minimumDownPaymentPercentage || 30) / 100);
  if (lead.availableDownPayment && lead.availableDownPayment > 0) {
    if (lead.availableDownPayment >= estimatedDownPayment) {
      points += 15;
      reasons.push('Anticipo compatible con liquidez informada');
    } else {
      points -= 10;
      reasons.push('Anticipo mínimo requeriría ajuste');
    }
  }

  if (lead.maximumMonthlyPayment && lead.maximumMonthlyPayment > 0) {
    const est60Monthly = (lot.priceUSD * 0.7) / 60;
    if (est60Monthly <= lead.maximumMonthlyPayment) {
      points += 10;
      reasons.push('Cuota mensual proyectada dentro de la capacidad');
    } else {
      points -= 10;
      reasons.push('Cuota proyectada excede el máximo mensual preferido');
    }
  }

  if (lead.interestedBlock && lot.block === lead.interestedBlock) {
    points += 10;
    reasons.push(`Ubicación en Manzana ${lot.block} preferida`);
  }

  if (lot.featured) {
    points += 5;
    reasons.push('Lote destacado con valor comercial');
  }

  if (points >= 75) {
    return {
      level: 'ALTA',
      label: 'Alta Compatibilidad',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      reasons,
    };
  } else if (points >= 50) {
    return {
      level: 'MEDIA',
      label: 'Compatibilidad Media',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-semibold',
      reasons,
    };
  } else {
    return {
      level: 'BAJA',
      label: 'Fuera de Presupuesto / Baja',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-medium',
      reasons,
    };
  }
}
