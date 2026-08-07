import {
  Lot,
  Sale,
  PaymentPlan,
  LotDocument,
  LegalProcess,
  Survey,
  Permit,
  DeedStatus,
  LegalConfig
} from '../types';

export type { LegalConfig };

export interface DeedEligibilityResult {
  isEligible: boolean;
  scorePercent: number;
  completedRequirements: string[];
  missingRequirements: string[];
  financialRequirementMet: boolean;
  documentRequirementMet: boolean;
  technicalRequirementMet: boolean;
  legalRequirementMet: boolean;
  statusBadge: {
    label: string;
    variant: 'success' | 'warning' | 'error' | 'brand' | 'neutral';
  };
}

export const DEFAULT_LEGAL_CONFIG: LegalConfig = {
  requiresFullPayment: false, // Por defecto no exige saldo 0 si está al día con el plan de pagos acordado
  minDocumentProgressPercent: 80,
};

export function evaluateDeedEligibility(
  lot: Lot,
  sale?: Sale,
  plan?: PaymentPlan,
  documents: LotDocument[] = [],
  legalProcess?: LegalProcess,
  survey?: Survey,
  config: LegalConfig = DEFAULT_LEGAL_CONFIG
): DeedEligibilityResult {
  const completedRequirements: string[] = [];
  const missingRequirements: string[] = [];

  // 1. Condición Comercial: Debe estar Vendido (o Reserva Formalizada)
  const isSoldOrReserved = lot.status === 'VENDIDO' || lot.status === 'RESERVADO';
  if (isSoldOrReserved || sale) {
    completedRequirements.push('Operación comercial confirmada');
  } else {
    missingRequirements.push('Lote no cuenta con Venta ni Reserva activa');
  }

  // 2. Condición Financiera
  let financialRequirementMet = false;
  if (config.requiresFullPayment) {
    const isFullyPaid =
      lot.financialStatus === 'CANCELADO_ECONOMICAMENTE' ||
      (plan && plan.paidInstallmentsCount === plan.totalInstallments) ||
      (sale && (sale.status === 'CANCELADA_ECONOMICAMENTE' || (plan && plan.status === 'CANCELADO_ECONOMICAMENTE')));

    if (isFullyPaid) {
      financialRequirementMet = true;
      completedRequirements.push('Cancelación económica 100% alcanzada');
    } else {
      missingRequirements.push('Se requiere Cancelación Económica Total (Regla activa)');
    }
  } else {
    const isUpToDate =
      lot.financialStatus === 'AL_DIA' ||
      lot.financialStatus === 'CANCELADO_ECONOMICAMENTE' ||
      (plan && plan.status === 'AL_DIA');

    if (isUpToDate) {
      financialRequirementMet = true;
      completedRequirements.push('Plan de pagos al día sin cuotas en mora');
    } else {
      missingRequirements.push('El plan de pagos presenta cuotas vencidas/mora');
    }
  }

  // 3. Condición Documental
  const lotDocs = documents.filter(d => d.lotId === lot.id || d.ownerId === lot.id || (sale && d.saleId === sale.id));
  const requiredDocTypes = ['DNI', 'CUIT_CUIL', 'BOLETO', 'INFORME_DOMINIO', 'LIBRE_DEUDA'];
  const approvedTypes = new Set(lotDocs.filter(d => d.status === 'APROBADO').map(d => d.type));

  let approvedCount = 0;
  requiredDocTypes.forEach(type => {
    if (approvedTypes.has(type as any)) {
      approvedCount++;
    }
  });

  const docScore = Math.round((approvedCount / requiredDocTypes.length) * 100);
  const documentRequirementMet = docScore >= config.minDocumentProgressPercent;

  if (documentRequirementMet) {
    completedRequirements.push(`Documentación legal clave aprobada (${approvedCount}/${requiredDocTypes.length})`);
  } else {
    const missingDocs = requiredDocTypes.filter(t => !approvedTypes.has(t as any));
    missingRequirements.push(`Faltan aprobar documentos obligatorios: ${missingDocs.join(', ')}`);
  }

  // 4. Condición Técnica (Agrimensura / Mensura)
  const technicalRequirementMet =
    lot.technicalStatus === 'VALIDADO' ||
    (survey && survey.status === 'FINALIZADO') ||
    approvedTypes.has('MENSURA');

  if (technicalRequirementMet) {
    completedRequirements.push('Plano de Mensura y cotas de lote validadas');
  } else {
    missingRequirements.push('Agrimensura / Plano de Mensura pendiente de aprobación');
  }

  // 5. Condición Dominial / Titularidad
  const legalRequirementMet = approvedTypes.has('INFORME_DOMINIO') && approvedTypes.has('CERTIFICADO_INHIBICION');
  if (legalRequirementMet) {
    completedRequirements.push('Informe de Dominio e Inhibición sin observaciones');
  } else {
    missingRequirements.push('Certificado de Dominio / Inhibición registral pendiente');
  }

  // Puntaje global
  const totalChecks = 5;
  const passedChecks =
    (isSoldOrReserved ? 1 : 0) +
    (financialRequirementMet ? 1 : 0) +
    (documentRequirementMet ? 1 : 0) +
    (technicalRequirementMet ? 1 : 0) +
    (legalRequirementMet ? 1 : 0);

  const scorePercent = Math.round((passedChecks / totalChecks) * 100);
  const isEligible = passedChecks === totalChecks;

  let statusBadge: DeedEligibilityResult['statusBadge'] = {
    label: isEligible ? 'Apto para Escriturar' : `${missingRequirements.length} Requisito(s) Pendiente(s)`,
    variant: isEligible ? 'success' : 'warning',
  };

  return {
    isEligible,
    scorePercent,
    completedRequirements,
    missingRequirements,
    financialRequirementMet,
    documentRequirementMet,
    technicalRequirementMet,
    legalRequirementMet,
    statusBadge,
  };
}

export function computeLotNextMilestone(
  lot: Lot,
  legalProcess?: LegalProcess,
  documents: LotDocument[] = [],
  survey?: Survey
): { milestone: string; action: string; badgeColor: string } {
  if (lot.status === 'DISPONIBLE') {
    return { milestone: 'Asignar Prospecto / Cotizar', action: 'Generar simulación', badgeColor: 'bg-emerald-100 text-emerald-800' };
  }
  if (lot.status === 'BLOQUEADO') {
    return { milestone: 'Validación Comprobante de Seña', action: 'Revisar seña', badgeColor: 'bg-amber-100 text-amber-800' };
  }
  if (lot.status === 'RESERVADO') {
    return { milestone: 'Confeccionar Boleto / Venta', action: 'Formalizar venta', badgeColor: 'bg-blue-100 text-blue-800' };
  }

  // VENDIDO -> Check legal process status
  const deedStatus: DeedStatus = legalProcess?.status || 'NO_INICIADA';

  switch (deedStatus) {
    case 'NO_INICIADA':
      return { milestone: 'Completar Checklist Documental', action: 'Cargar documentos', badgeColor: 'bg-purple-100 text-purple-800' };
    case 'DOCUMENTACION_PENDIENTE':
      return { milestone: 'Aprobar DNI, CUIT e Informe Dominio', action: 'Revisar legajo', badgeColor: 'bg-purple-100 text-purple-800' };
    case 'PREPARANDO_EXPEDIENTE':
      return { milestone: 'Completar Expediente Digital', action: 'Verificar certificados', badgeColor: 'bg-indigo-100 text-indigo-800' };
    case 'INFORME_DOMINIO_SOLICITADO':
    case 'CERTIFICADOS_PENDIENTES':
      return { milestone: 'Recepción de Certificados Registrales', action: 'Seguimiento legal', badgeColor: 'bg-amber-100 text-amber-800' };
    case 'EXPEDIENTE_COMPLETO':
      return { milestone: 'Asignar Escribanía de Registro', action: 'Derivar a escribanía', badgeColor: 'bg-emerald-100 text-emerald-800' };
    case 'EN_ESCRIBANIA':
      return { milestone: 'Redacción Minuta Escrituraria', action: 'Auditar borrador', badgeColor: 'bg-blue-100 text-blue-800' };
    case 'OBSERVADA':
      return { milestone: 'Resolver Observaciones de Escribanía', action: 'Subanar legajo', badgeColor: 'bg-rose-100 text-rose-800' };
    case 'LISTA_PARA_FIRMA':
      return { milestone: 'Agendar Fecha de Firma de Escritura', action: 'Coordinar turno', badgeColor: 'bg-emerald-100 text-emerald-800' };
    case 'FIRMA_AGENDADA':
      return { milestone: 'Firma Presencial en Escribanía', action: 'Confirmar asistencia', badgeColor: 'bg-brand-100 text-brand-800' };
    case 'FIRMADA':
      return { milestone: 'Ingresar a Registro de la Propiedad', action: 'Solicitar inscripción', badgeColor: 'bg-blue-100 text-blue-800' };
    case 'INSCRIPCION_PENDIENTE':
      return { milestone: 'Acreditación de Testimonio Inscripto', action: 'Verificar tomo/folio', badgeColor: 'bg-indigo-100 text-indigo-800' };
    case 'INSCRIPTA':
    case 'FINALIZADA':
      if (lot.deliveryStatus !== 'ENTREGADO') {
        return { milestone: 'Entrega de Posesión y Amojonamiento', action: 'Agendar acta entrega', badgeColor: 'bg-teal-100 text-teal-800' };
      }
      return { milestone: 'Escriturado y Entregado 100%', action: 'Ver legajo histórico', badgeColor: 'bg-slate-100 text-slate-800' };
    default:
      return { milestone: 'Seguimiento Legal Regular', action: 'Ver expediente', badgeColor: 'bg-slate-100 text-slate-800' };
  }
}
