export type LotStatus =
  | 'DISPONIBLE'
  | 'BLOQUEADO'
  | 'INTENCION_RESERVA'
  | 'SENADO'
  | 'RESERVADO'
  | 'VENDIDO'
  | 'EN_MORA'
  | 'ESCRITURADO'
  | 'ENTREGADO'
  | 'NO_COMERCIALIZABLE';

export type DevelopmentStatus =
  | 'EN_PREVENTA'
  | 'COMERCIALIZACION_ACTIVA'
  | 'ULTIMAS_UNIDADES'
  | 'EN_DESARROLLO'
  | 'ENTREGADO'
  | 'PAUSADO'
  | 'CERRADO';

export type StageStatus = 'EN_PREVENTA' | 'COMERCIALIZACION' | 'EN_OBRA' | 'ENTREGADA';

export type LotOrientation = 'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Esquina';

export type LotPosition =
  | 'Interno'
  | 'Esquina'
  | 'Perimetral'
  | 'Frente a espacio verde'
  | 'Frente a avenida'
  | 'Próximo al acceso'
  | 'Cul-de-sac'
  | 'Vista abierta';

export type AdjustmentType = 'SIN_AJUSTE' | 'CAC_MENSUAL' | 'CAC_TRIMESTRAL' | 'FIJO_USD' | 'ICL';

export type QuoteStatus =
  | 'BORRADOR'
  | 'PREPARADA'
  | 'ENVIADA'
  | 'VISTA'
  | 'EVALUACION'
  | 'MODIFICACION_SOLICITADA'
  | 'ACEPTADA'
  | 'RECHAZADA'
  | 'VENCIDA'
  | 'CANCELADA'
  | 'SUSTITUIDA';

export type LeadStatus =
  | 'NUEVO'
  | 'PENDIENTE_PRIMER_CONTACTO'
  | 'CONTACTADO'
  | 'EN_CALIFICACION'
  | 'CALIFICADO'
  | 'SEGUIMIENTO'
  | 'VISITA_AGENDADA'
  | 'VISITA_REALIZADA'
  | 'LOTE_IDENTIFICATED'
  | 'LOTE_IDENTIFICADO'
  | 'COTIZACION_PENDIENTE'
  | 'COTIZACION_ENVIADA'
  | 'NEGOCIACION'
  | 'INTENCION_RESERVA'
  | 'SENA_PENDIENTE'
  | 'RESERVA_CONFIRMADA'
  | 'VENTA_PREPARACION'
  | 'SIN_RESPUESTA'
  | 'SEGUIMIENTO_FUTURO'
  | 'NO_CALIFICADO'
  | 'OPORTUNIDAD_PERDIDA'
  | 'DUPLICADO'
  | 'CONTACTO_INVALIDO'
  | 'PERDIDO'
  | 'RESERVADO'
  | 'RESERVA'
  | 'VISITA';

export type LeadSource =
  | 'Google Ads'
  | 'Meta Ads'
  | 'Facebook Orgánico'
  | 'Instagram Orgánico'
  | 'WhatsApp'
  | 'Sitio Web'
  | 'Referido'
  | 'Inmobiliaria'
  | 'Evento'
  | 'Contacto Directo'
  | 'Carga Manual'
  | 'Otro';

export type LeadTemperature = 'FRIO' | 'TIBIO' | 'CALIENTE' | 'MUY_CALIENTE' | 'FRÍO';

export type LeadPriority = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export type LeadLossReason =
  | 'NO_RESPONDE'
  | 'DATOS_INCORRECTOS'
  | 'CONTACTO_INVALIDO'
  | 'PRESUPUESTO_INSUFICIENTE'
  | 'CUOTA_FUERA_ALCANCE'
  | 'SIN_ANTICIPO'
  | 'UBICACION_NO_ADECUADA'
  | 'PLAZO_LEJANO'
  | 'ELIGIO_OTRO_DESARROLLO'
  | 'PERDIO_INTERES'
  | 'NO_ACORDO_CONDICIONES'
  | 'NO_AVANZO_POST_VISITA'
  | 'DUPLICADO'
  | 'OTRO';

export type ActivityType =
  | 'LLAMADA'
  | 'LLAMADA_SIN_RESPUESTA'
  | 'WHATSAPP'
  | 'MENSAJE_RECIBIDO'
  | 'CORREO'
  | 'NOTA_INTERNA'
  | 'REUNION'
  | 'VISITA_AGENDADA'
  | 'VISITA_REALIZADA'
  | 'VISITA'
  | 'COTIZACION'
  | 'COTIZACION_PREPARADA'
  | 'COTIZACION_ENVIADA'
  | 'SEGUIMIENTO'
  | 'SEGUIMIENTO_REPROGRAMADO'
  | 'CAMBIO_ESTADO'
  | 'CAMBIO_VENDEDOR'
  | 'CALIFICACION_ACTUALIZADA'
  | 'LOTE_SUGERIDO'
  | 'BLOQUEO_CREADO'
  | 'RESERVA_CREADA'
  | 'SENA_INFORMADA'
  | 'SENA_VALIDADA';

export type VisitStatus = 'PROGRAMADA' | 'CONFIRMADA' | 'REALIZADA' | 'REPROGRAMADA' | 'CANCELADA' | 'NO_ASISTIO';

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  activeLeadsCount: number;
  conversionRatePercent: number;
  role: string;
}

export interface ActivityItem {
  id: string;
  leadId: string;
  type: ActivityType;
  timestamp: string;
  authorName: string;
  description: string;
  result?: string;
  nextActionType?: ActivityType;
  nextActionAt?: string;
}

export interface TaskItem {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  type: ActivityType;
  dueDate: string;
  priority: LeadPriority;
  assignedSellerId: string;
  assignedSellerName: string;
  completed: boolean;
  contextText: string;
}

export interface VisitItem {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  developmentId: string;
  developmentName: string;
  scheduledAt: string;
  meetingPoint: string;
  assignedSellerId: string;
  assignedSellerName: string;
  participantsCount: number;
  status: VisitStatus;
  notes?: string;
  clientImpression?: string;
  interestedLots?: string[];
  objections?: string;
  nextStep?: string;
}

export interface LeadFavoriteLot {
  lotId: string;
  interestType: 'PRIMARY' | 'SECONDARY' | 'DISCARDED';
  notes?: string;
  addedAt: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string;
  city?: string;
  source: LeadSource;
  channel?: string;
  campaignId?: string;
  campaignName?: string;
  developmentInterestIds: string[];
  lotInterestIds: string[];
  favoriteLotIds?: string[];
  favoriteLots?: LeadFavoriteLot[];
  assignedSellerId?: string;
  assignedAgent: string;
  status: LeadStatus;
  qualification: LeadTemperature;
  qualificationScore?: number;
  priority: LeadPriority;
  score: number;
  scoreReasons?: string[];
  initialMessage?: string;
  notes: string;
  budgetMin?: number;
  budgetMax?: number;
  budgetUSD: number;
  availableDownPayment?: number;
  maximumMonthlyPayment?: number;
  financingRequired?: boolean;
  expectedPurchaseDate?: string;
  motivation?: 'VIVIENDA_PERMANENTE' | 'SEGUNDA_VIVIENDA' | 'INVERSION' | 'REVENTA' | 'CONSTRUCCION_FUTURA' | 'OTRO';
  decisionMaker?: 'SOLO' | 'EN_PAREJA' | 'FAMILIA' | 'SOCIEDAD';
  hasVisited?: boolean;
  comparingAlternatives?: boolean;
  needsToSellProperty?: boolean;
  mainObjections?: string[];
  interestedBlock?: string;
  lastActivityAt: string;
  lastInteractionAt?: string; // backwards compatibility
  nextActionAt?: string;
  nextActionType?: ActivityType;
  createdAt: string;
  updatedAt: string;
  lossReason?: LeadLossReason;
  lossNote?: string;
  recontactDate?: string;
  tags: string[];
}

export type HoldStatus = 'ACTIVO' | 'PROXIMO_A_VENCER' | 'VENCIDO' | 'LIBERADO' | 'CONVERTIDO' | 'CANCELADO' | 'REEMPLAZADO';

export type LotHoldStatus = HoldStatus;

export type LotHoldReason =
  | 'COTIZACION_ACEPTADA'
  | 'INTENCION_RESERVA'
  | 'ESPERANDO_SENA'
  | 'AUTORIZACION_COMERCIAL'
  | 'OTRO';

export type LotHoldReleaseReason =
  | 'SENA_NO_RECIBIDA'
  | 'CLIENTE_DESISTIO'
  | 'COMPROBANTE_RECHAZADO'
  | 'VENCIMIENTO'
  | 'CAMBIO_LOTE'
  | 'DECISION_ADMINISTRATIVA'
  | 'DUPLICACION'
  | 'OTRO';

export type ReservationIntentStatus =
  | 'BORRADOR'
  | 'CONFIRMADA'
  | 'ESPERANDO_SENA'
  | 'SENA_INFORMADA'
  | 'EN_VALIDACION'
  | 'CONVERTIDA'
  | 'CANCELADA'
  | 'VENCIDA'
  | 'RECHAZADA';

export type PaymentMethod =
  | 'TRANSFERENCIA'
  | 'DEPOSITO'
  | 'EFECTIVO'
  | 'TARJETA'
  | 'OTRO';

export type DepositStatus =
  | 'PENDIENTE'
  | 'PROMETIDA'
  | 'INFORMADA'
  | 'EN_VALIDACION'
  | 'CONFIRMADA'
  | 'OBSERVADA'
  | 'RECHAZADA'
  | 'CANCELADA'
  | 'DEVUELTA'
  | 'VENCIDA';

export type DepositRejectionReason =
  | 'IMPORTE_INCORRECTO'
  | 'PAGO_NO_IDENTIFICADO'
  | 'COMPROBANTE_ILEGIBLE'
  | 'REFERENCIA_INCORRECTA'
  | 'MONEDA_INCORRECTA'
  | 'PAGO_DUPLICADO'
  | 'FECHA_INCONSISTENTE'
  | 'DATOS_NO_COINCIDEN'
  | 'OPERACION_ANULADA'
  | 'LOTE_NO_DISPONIBLE'
  | 'OTRO';

export type ReservationStatus =
  | 'INTENCION'
  | 'PROMESA_SENA'
  | 'SENA_INFORMADA'
  | 'SENA_VALIDADA'
  | 'CONFIRMADA'
  | 'DOCUMENTACION_PENDIENTE'
  | 'PREPARACION_CONTRATUAL'
  | 'LISTA_VENTA'
  | 'CANCELADA'
  | 'DEVUELTA'
  | 'EN_REVISION';

export type ReservationNextStep =
  | 'PREPARAR_DOCUMENTACION'
  | 'SOLICITAR_DNI'
  | 'SOLICITAR_DATOS_FISCALES'
  | 'VERIFICAR_COTIZACION'
  | 'PREPARAR_BOLETO'
  | 'FIRMA_CONTRATO';

export type DocumentationStatus =
  | 'COMPLETA'
  | 'PENDIENTE'
  | 'EN_REVISION'
  | 'INCOMPLETA';

export type ReservationCancellationReason =
  | 'DESISTIMIENTO_COMPRADOR'
  | 'DOCUMENTACION_INCOMPLETA'
  | 'CONDICIONES_NO_ACORDADAS'
  | 'SENA_DEVUELTA'
  | 'ERROR_ADMINISTRATIVO'
  | 'CAMBIO_LOTE'
  | 'INCUMPLIMIENTO_PLAZO'
  | 'OTRO';

export type UserRole = 'COMERCIAL' | 'ADMINISTRACION' | 'ADMIN' | 'VENDEDOR' | 'GERENTE_COMERCIAL';

export type PaymentStatus = 'AL_DIA' | 'PROXIMO_VENCIMIENTO' | 'VENCIDO' | 'EN_MORA_GRAVE' | 'CANCELADO_ECONOMICAMENTE';

export type InstallmentStatus = 'PENDIENTE' | 'PROXIMA' | 'PAGADO' | 'VENCIDO' | 'PARCIAL' | 'REFINANCIADO' | 'CANCELADO';

export interface Lot {
  id: string;
  developmentId?: string;
  stageId?: string;
  blockId?: string;
  code?: string;
  number: string;
  block: string;
  stage: string;
  cadastralReference?: string;
  surfaceM2: number;
  frontageM: number;
  depthM: number;
  orientation: LotOrientation;
  position?: LotPosition;
  status: LotStatus;
  priceUSD: number;
  listPrice?: number;
  promotionalPrice?: number;
  currency?: 'ARS' | 'USD';
  minimumDownPaymentPercentage?: number;
  allowedInstallmentOptions?: number[];
  adjustmentType?: AdjustmentType;
  cornerLot?: boolean;
  featured?: boolean;
  infrastructure?: string[];
  services?: string[];
  features: string[];
  commercialTags?: string[];
  interestedLeadIds?: string[];
  currentHoldId?: string;
  activeHoldId?: string;
  currentReservationId?: string;
  buyerId?: string;
  assignedLeadId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Block {
  id: string;
  developmentId: string;
  stageId: string;
  name: string;
  code: string;
  lotIds: string[];
}

export interface DevelopmentStage {
  id: string;
  developmentId?: string;
  name: string;
  number?: number;
  status?: StageStatus;
  blockIds?: string[];
  totalLots: number;
  availableLots: number;
  completionPercentage: number;
  estimatedDeliveryDate: string;
  infrastructureProgress?: number;
}

export interface Development {
  id: string;
  name: string;
  slug?: string;
  location: string | {
    city: string;
    province: string;
    country: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  status?: DevelopmentStatus;
  stageIds?: string[];
  totalAreaM2: number;
  stages: DevelopmentStage[];
  description: string;
  totalLots?: number;
  availableLots?: number;
  minimumLotPrice?: number;
  maximumLotPrice?: number;
  minimumLotArea?: number;
  maximumLotArea?: number;
  amenities?: string[];
  infrastructure?: string[];
  financingOptions?: string[];
  heroImage?: string;
  gallery?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuoteOption {
  id: string;
  quoteId?: string;
  lotId: string;
  lotCode?: string;
  lotNumber?: string;
  block?: string;
  stage?: string;
  listPrice: number;
  offeredPrice: number;
  downPayment: number;
  downPaymentPercent: number;
  financedAmount: number;
  installmentCount: number;
  initialInstallmentAmount: number;
  adjustmentType?: AdjustmentType;
  administrativeFees?: number;
  totalInitialPayment: number;
  commercialNotes?: string;
  currency?: 'USD' | 'ARS';
}

export interface Quote {
  id: string;
  quoteNumber: string;
  leadId: string;
  leadName?: string;
  leadPhone?: string;
  developmentId: string;
  developmentName?: string;
  sellerId: string;
  sellerName?: string;
  status: QuoteStatus;
  version: number;
  createdAt: string;
  validUntil: string;
  notes?: string;
  options: QuoteOption[];
  selectedOptionId?: string;
  sentAt?: string;
  viewedAt?: string;
  respondedAt?: string;
  rejectionReason?: string;
  replacedByQuoteId?: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  budgetUSD: number;
  spentUSD: number;
  leadsGenerated: number;
  conversions: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVA' | 'PAUSADA' | 'FINALIZADA';
  developmentId?: string;
  developmentName?: string;
}

export interface LotHold {
  id: string;
  lotId: string;
  lotNumber: string;
  block: string;
  leadId: string;
  leadName: string;
  quoteId?: string;
  quoteOptionId?: string;
  sellerId: string;
  agentName: string;
  status: LotHoldStatus;
  reason: LotHoldReason;
  startsAt: string;
  expiresAt: string;
  expiresAtIso?: string; // backwards compatibility
  expiryDate?: string; // backwards compatibility
  startDate?: string; // backwards compatibility
  releasedAt?: string;
  releasedByUserId?: string;
  releaseReason?: LotHoldReleaseReason;
  extensionCount: number;
  lastExtendedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationIntent {
  id: string;
  leadId: string;
  leadName?: string;
  lotId: string;
  lotNumber?: string;
  block?: string;
  quoteId: string;
  quoteOptionId: string;
  lotHoldId?: string;
  holdId?: string;
  sellerId: string;
  sellerName?: string;
  status: ReservationIntentStatus;
  expectedDepositAmount: number;
  currency: 'ARS' | 'USD';
  expectedPaymentMethod?: PaymentMethod;
  promisedDepositAt?: string;
  expiresAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deposit {
  id: string;
  reservationIntentId: string;
  intentId?: string;
  leadId: string;
  leadName?: string;
  lotId: string;
  lotNumber?: string;
  block?: string;
  lotHoldId?: string;
  holdId?: string;
  quoteId: string;
  amount: number;
  currency: 'ARS' | 'USD';
  paymentMethod: PaymentMethod;
  reportedAt?: string;
  paidAt?: string;
  status: DepositStatus;
  receiptReference?: string;
  receiptFileName?: string;
  receiptPreviewUrl?: string;
  reportedByUserId?: string;
  validatedByUserId?: string;
  validatedAt?: string;
  rejectedByUserId?: string;
  rejectedAt?: string;
  rejectionReason?: DepositRejectionReason;
  refundedAt?: string;
  refundReason?: string;
  observationNote?: string;
  validatedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  assignedRole: 'COMERCIAL' | 'ADMINISTRACION' | 'LEGAL';
  dueDate?: string;
  completedAt?: string;
  notes?: string;
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  leadId: string;
  leadName: string;
  customerId?: string;
  lotId: string;
  lotNumber: string;
  block: string;
  developmentId?: string;
  developmentName?: string;
  quoteId?: string;
  quoteOptionId?: string;
  depositId?: string;
  lotHoldId?: string;
  holdId?: string;
  sellerId?: string;
  agentName: string;
  status: ReservationStatus;
  reservedAt: string;
  expiresAt?: string;
  agreedPrice: number;
  agreedPriceUSD?: number; // backwards compatibility
  currency: 'ARS' | 'USD';
  depositAmount: number;
  depositAmountUSD?: number; // backwards compatibility
  remainingAmount?: number;
  nextStep?: ReservationNextStep;
  documentationStatus?: DocumentationStatus;
  checklist?: ReservationChecklistItem[];
  depositReceiptUrl?: string;
  depositDate?: string;
  validatedBy?: string;
  validatedAt?: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  cancelledAt?: string;
  cancellationReason?: ReservationCancellationReason;
}

export type SaleStatus =
  | 'EN_PREPARACION'
  | 'DOCUMENTACION_PENDIENTE'
  | 'LISTA_PARA_FORMALIZAR'
  | 'CONFIRMADA'
  | 'FINANCIADA'
  | 'CANCELADA_ECONOMICAMENTE'
  | 'RESCINDIDA'
  | 'EN_REVISION';

export type PaymentPlanStatus =
  | 'ACTIVO'
  | 'AL_DIA'
  | 'EN_MORA'
  | 'MORA_LEVE'
  | 'MORA_MEDIA'
  | 'MORA_CRITICA'
  | 'RIESGO_CONTRACTUAL'
  | 'REFINANCIADO'
  | 'CANCELADO_ECONOMICAMENTE'
  | 'SUSPENDIDO'
  | 'RESCINDIDO';

export interface Installment {
  id?: string;
  paymentPlanId?: string;
  number: number;
  dueDate: string;
  baseAmount?: number;
  adjustedAmount?: number;
  paidAmount?: number;
  outstandingAmount?: number;
  amountUSD: number;
  amountARS: number;
  cacIndexAdjustment: number;
  status: InstallmentStatus;
  paidDate?: string;
  paidAt?: string;
  receiptNumber?: string;
  daysOverdue?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentPlan {
  id: string;
  saleId: string;
  customerId?: string;
  customerName: string;
  lotId?: string;
  lotNumber: string;
  block?: string;
  currency?: 'ARS' | 'USD';
  originalAmount?: number;
  downPaymentUSD: number;
  downPayment?: number;
  financedAmount?: number;
  totalInstallments: number;
  installmentCount?: number;
  paidInstallmentsCount: number;
  monthlyAmountUSD: number;
  monthlyAmount?: number;
  firstDueDate?: string;
  frequency?: 'MONTHLY';
  adjustmentType?: AdjustmentType;
  installments: Installment[];
  status: PaymentPlanStatus | PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Sale {
  id: string;
  saleNumber?: string;
  reservationId?: string;
  customerId?: string;
  leadId?: string;
  lotId: string;
  lotNumber: string;
  block: string;
  developmentId?: string;
  developmentName?: string;
  sellerId?: string;
  agentName: string;
  customerName: string;
  customerDni: string;
  customerPhone: string;
  customerEmail: string;
  contractId?: string;
  paymentPlanId?: string;
  status?: SaleStatus;
  agreedPrice?: number;
  currency?: 'ARS' | 'USD';
  depositAmount?: number;
  initialPaymentAmount?: number;
  financedAmount?: number;
  installmentCount?: number;
  saleDate: string;
  firstDueDate?: string;
  totalAmountUSD: number;
  downPaymentUSD: number;
  contractStatus: 'BOLETO_FIRMADO' | 'EN_REVISION_LEGAL' | 'PENDIENTE_BOLETO' | 'ESCRITURADO' | 'PREPARACION_CONTRATUAL';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentRecord {
  id: string;
  customerId: string;
  customerName?: string;
  saleId: string;
  paymentPlanId: string;
  installmentId?: string;
  installmentNumber?: number;
  lotId?: string;
  lotNumber?: string;
  amount: number;
  currency: 'ARS' | 'USD';
  paymentDate: string;
  paymentMethod: PaymentMethod;
  status: 'INFORMADO' | 'PENDIENTE_CONCILIACION' | 'CONFIRMADO' | 'RECHAZADO' | 'REVERSADO';
  reference?: string;
  receiptId?: string;
  receiptNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface UnreconciledPayment {
  id: string;
  clientName: string;
  leadId?: string;
  customerId?: string;
  lotNumber: string;
  lotId?: string;
  amount: number;
  currency: 'ARS' | 'USD';
  paymentDate: string;
  paymentMethod: PaymentMethod;
  reference: string;
  status: 'SIN_CONCILIAR' | 'CONCILIADO' | 'OBSERVADO' | 'RECHAZADO' | 'DUPLICADO';
  suggestedInstallmentNumber?: number;
  notes?: string;
}

export interface PaymentPromise {
  id: string;
  customerId: string;
  customerName: string;
  lotNumber: string;
  promisedAmount: number;
  promisedDate: string;
  installmentNumbers: number[];
  agentName: string;
  status: 'VIGENTE' | 'CUMPLIDA' | 'VENCIDA' | 'CANCELADA';
  notes?: string;
  createdAt: string;
}

export interface CollectionCommunication {
  id: string;
  customerId: string;
  customerName?: string;
  saleId?: string;
  lotNumber?: string;
  type: 'LLAMADA' | 'WHATSAPP' | 'CORREO' | 'NOTA' | 'REFINANCIACION';
  agentName: string;
  date: string;
  result: string;
  nextAction?: string;
}

export interface RefinancingProposal {
  id: string;
  saleId: string;
  customerId: string;
  customerName: string;
  lotNumber: string;
  originalOutstandingBalance: number;
  newInstallmentsCount: number;
  newMonthlyAmount: number;
  status: 'PENDIENTE_REVISION' | 'APROBADO' | 'RECHAZADO';
  reason: string;
  createdAt: string;
}

export interface ReceiptInternal {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  lotNumber: string;
  saleId: string;
  paymentId?: string;
  amount: number;
  currency: 'ARS' | 'USD';
  paymentMethod: PaymentMethod;
  concept: string;
  issuedAt: string;
  agentName: string;
}

export interface LegalProcess {
  id: string;
  lotNumber: string;
  customerName: string;
  stage: 'PLANO_MENSURA' | 'FIDEICOMISO' | 'BOLETO_COMPRAVENTA' | 'ESCRITURA_CANCELADA' | 'ENTREGA_POSESION';
  status: 'EN_PROCESO' | 'APROBADO' | 'REQUIERE_ACCION' | 'COMPLETADO';
  estimatedCompletion: string;
  documents: { name: string; url: string; verified: boolean }[];
  assignedNotary: string;
}

export interface WorkItem {
  id: string;
  title: string;
  category: 'AGUA' | 'ELECTRICIDAD' | 'PAVIMENTO' | 'PORTAL' | 'SEGURIDAD' | 'GAS';
  progressPercentage: number;
  status: 'PLANIFICADO' | 'EN_EJECUCION' | 'DEMORADO' | 'FINALIZADO';
  contractor: string;
  startDate: string;
  targetDate: string;
}

export interface SystemAlert {
  id: string;
  type: 'HOLD_EXPIRING' | 'OVERDUE_PAYMENT' | 'DEPOSIT_VALIDATION' | 'WORK_DELAY' | 'LEAD_ATTENTION';
  title: string;
  description: string;
  severity: 'ALTA' | 'MEDIA' | 'BAJA';
  createdAt: string;
  actionRequired: string;
  targetModule: string;
}

export interface QuoteRequest {
  lotId: string;
  lotNumber: string;
  priceUSD: number;
  downPaymentPercent: number;
  installmentsCount: number;
  currency: 'USD' | 'ARS';
  cacAdjustmentAnnual: number;
}
