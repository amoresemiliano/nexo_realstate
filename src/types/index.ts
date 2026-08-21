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

export type HoldStatus = 'ACTIVO' | 'PROXIMO_A_VENCER' | 'VENCIDO' | 'LIBERADO' | 'CONVERTIDO' | 'CANCELADO' | 'REEMPLAZADO' | 'SEÑA_REPORTADA';

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
  | 'PENDIENTE'
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
  | 'REPORTADA'
  | 'EN_VALIDACION'
  | 'CONFIRMADA'
  | 'VALIDADA'
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

export type UserRole =
  | 'COMERCIAL'
  | 'ADMINISTRACION'
  | 'ADMIN'
  | 'VENDEDOR'
  | 'GERENTE_COMERCIAL'
  | 'SUPERVISOR'
  | 'TESORERIA'
  | 'LEGAL'
  | 'OBRAS'
  | 'GERENCIA'
  | 'CLIENTE';

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
  financialStatus?: FinancialLotStatus;
  documentStatus?: DocumentLotStatus;
  legalStatus?: LegalLotStatus;
  technicalStatus?: TechnicalLotStatus;
  deliveryStatus?: DeliveryLotStatus;
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
  objective?: string;
  audience?: string;
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
  sellerName?: string;
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

export type CommercialLotStatus = 'DISPONIBLE' | 'BLOQUEADO' | 'RESERVADO' | 'VENDIDO';
export type FinancialLotStatus = 'SIN_PLAN' | 'AL_DIA' | 'EN_MORA' | 'CANCELADO_ECONOMICAMENTE';
export type DocumentLotStatus = 'INCOMPLETO' | 'EN_REVISION' | 'COMPLETO' | 'OBSERVADO';
export type LegalLotStatus = 'SIN_INICIAR' | 'EN_PREPARACION' | 'EN_TRAMITE' | 'OBSERVADO' | 'LISTO_PARA_FIRMA' | 'FIRMADO' | 'INSCRIPTO';
export type TechnicalLotStatus = 'SIN_RELEVAMIENTO' | 'MENSURA_PENDIENTE' | 'AMOJONAMIENTO_PENDIENTE' | 'VALIDADO';
export type DeliveryLotStatus = 'PENDIENTE' | 'PREPARANDO_ENTREGA' | 'ENTREGADO';

export type DocumentOwnerType = 'LOT' | 'CUSTOMER' | 'SALE' | 'LEGAL_PROCESS';
export type DocumentStatus = 'PENDIENTE' | 'RECIBIDO' | 'EN_REVISION' | 'APROBADO' | 'OBSERVADO' | 'RECHAZADO' | 'VENCIDO' | 'REEMPLAZADO';

export type DocumentType =
  // Comprador
  | 'DNI'
  | 'CUIT_CUIL'
  | 'CONSTANCIA_FISCAL'
  | 'ESTADO_CIVIL'
  | 'DOMICILIO'
  | 'JUSTIFICACION_FONDOS'
  | 'PODER'
  // Venta
  | 'RESERVA'
  | 'COTIZACION_ACEPTADA'
  | 'BOLETO'
  | 'CONTRATO'
  | 'CONVENIO_FINANCIACION'
  | 'RECIBO'
  // Lote
  | 'PLANO'
  | 'NOMENCLATURA_CATASTRAL'
  | 'MENSURA'
  | 'CERTIFICADO_PARCELARIO'
  | 'AMOJONAMIENTO'
  | 'FACTIBILIDADES'
  // Legal
  | 'INFORME_DOMINIO'
  | 'CERTIFICADO_INHIBICION'
  | 'LIBRE_DEUDA'
  | 'MINUTA'
  | 'ESCRITURA'
  | 'TESTIMONIO'
  // Obra futura
  | 'PERMISO'
  | 'PLANO_MUNICIPAL'
  | 'FACTIBILIDAD'
  | 'CERTIFICADO_TECNICO';

export interface LotDocument {
  id: string;
  ownerType: DocumentOwnerType;
  ownerId: string;
  lotId?: string;
  lotNumber?: string;
  customerId?: string;
  customerName?: string;
  saleId?: string;
  legalProcessId?: string;
  type: DocumentType;
  title: string;
  fileType?: string;
  status: DocumentStatus;
  issuedAt?: string;
  expiresAt?: string;
  receivedAt?: string;
  reviewedAt?: string;
  reviewedByUserId?: string;
  fileName?: string;
  filePreviewUrl?: string;
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type LegalProcessType =
  | 'PREPARACION_CONTRATUAL'
  | 'REGULARIZACION_DOMINIAL'
  | 'ESCRITURACION'
  | 'CESION'
  | 'RESCISION'
  | 'REVISION_LEGAL';

export type DeedStatus =
  | 'NO_INICIADA'
  | 'EN_PREPARACION'
  | 'DOCUMENTACION_PENDIENTE'
  | 'PREPARANDO_EXPEDIENTE'
  | 'INFORME_DOMINIO_SOLICITADO'
  | 'CERTIFICADOS_PENDIENTES'
  | 'EXPEDIENTE_COMPLETO'
  | 'EN_ESCRIBANIA'
  | 'OBSERVADA'
  | 'LISTA_PARA_FIRMA'
  | 'FIRMA_AGENDADA'
  | 'FIRMADA'
  | 'INSCRIPCION_PENDIENTE'
  | 'INSCRIPTA'
  | 'FINALIZADA';

export interface LegalProcess {
  id: string;
  lotId: string;
  lotNumber: string;
  saleId?: string;
  customerId?: string;
  customerName: string;
  type: LegalProcessType;
  status: DeedStatus;
  stage?: string; // backwards compatibility
  assignedLegalUserId?: string;
  assignedLegalUserName?: string;
  notaryOfficeId?: string;
  notaryOfficeName?: string;
  assignedNotary?: string; // backwards compatibility
  startedAt?: string;
  targetDate?: string;
  estimatedCompletion?: string; // backwards compatibility
  completedAt?: string;
  currentStep?: string;
  notes?: string;
  documents?: { name: string; url: string; verified: boolean }[]; // backwards compatibility
  createdAt: string;
  updatedAt: string;
}

export interface NotaryOffice {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  assignedLegalProcessIds: string[];
  status: 'ACTIVO' | 'INACTIVO';
}

export interface DeedSigningAppointment {
  id: string;
  legalProcessId: string;
  lotId: string;
  lotNumber: string;
  customerName: string;
  notaryOfficeId: string;
  notaryName: string;
  scheduledDate: string;
  scheduledTime: string;
  location: string;
  representatives: string[];
  requiredDocuments: string[];
  status: 'PENDIENTE' | 'CONFIRMADA' | 'REPROGRAMADA' | 'CANCELADA' | 'REALIZADA';
  notes?: string;
  createdAt: string;
}

export type SurveyType = 'MENSURA' | 'AMOJONAMIENTO' | 'RELEVAMIENTO' | 'COTAS' | 'VERIFICACION_LIMITES';
export type SurveyStatus = 'PENDIENTE' | 'SOLICITADO' | 'PROGRAMADO' | 'EN_EJECUCION' | 'OBSERVADO' | 'FINALIZADO';

export interface Survey {
  id: string;
  lotId: string;
  lotNumber: string;
  type: SurveyType;
  surveyorId?: string;
  surveyorName?: string;
  status: SurveyStatus;
  requestedAt?: string;
  scheduledAt?: string;
  completedAt?: string;
  result?: string;
  documentIds: string[];
  notes?: string;
  createdAt: string;
}

export interface Surveyor {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  assignedLotIds: string[];
  status: 'ACTIVO' | 'INACTIVO';
}

export type PermitType = 'FACTIBILIDAD_AGUA' | 'ELECTRICIDAD' | 'GAS' | 'PERFORACION' | 'OBRA' | 'AMBIENTAL' | 'MUNICIPAL' | 'OTROS';
export type PermitStatus = 'PENDIENTE' | 'SOLICITADO' | 'EN_TRAMITE' | 'APROBADO' | 'OBSERVADO' | 'VENCIDO';

export interface Permit {
  id: string;
  lotId?: string;
  lotNumber?: string;
  developmentId?: string;
  developmentName?: string;
  type: PermitType;
  authority: string;
  status: PermitStatus;
  requestedAt?: string;
  expiresAt?: string;
  approvedAt?: string;
  documentIds: string[];
  notes?: string;
  createdAt: string;
}

export type LotTimelineCategory = 'COMERCIAL' | 'FINANCIERO' | 'LEGAL' | 'TECNICO' | 'OPERATIVO';

export interface LotTimelineEvent {
  id: string;
  lotId: string;
  lotNumber?: string;
  category: LotTimelineCategory;
  timestamp: string;
  title: string;
  description: string;
  authorName: string;
  metadata?: Record<string, any>;
}

export interface SystemAlert {
  id: string;
  type:
    | 'HOLD_EXPIRING'
    | 'OVERDUE_PAYMENT'
    | 'DEPOSIT_VALIDATION'
    | 'WORK_DELAY'
    | 'LEAD_ATTENTION'
    | 'DOCUMENT_MISSING'
    | 'DOCUMENT_OBSERVED'
    | 'DOCUMENT_EXPIRED'
    | 'DEED_STALLED'
    | 'SIGNING_UPCOMING'
    | 'SURVEY_PENDING'
    | 'PERMIT_EXPIRING';
  title: string;
  description: string;
  severity: 'ALTA' | 'MEDIA' | 'BAJA';
  createdAt: string;
  actionRequired: string;
  targetModule: string;
  lotId?: string;
  lotNumber?: string;
  customerId?: string;
}

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  progressPercentage: number;
  status: string;
  contractor: string;
  startDate: string;
  targetDate: string;
}

export interface LegalConfig {
  requiresFullPayment: boolean;
  minDocumentProgressPercent: number;
}

// Phase 7: Obras, Proveedores, Postventa & Comisiones

export type ServiceCategory =
  | 'PREPARACION_TERRENO'
  | 'CERRAMIENTOS_LIMITES'
  | 'AGUA_RIEGO'
  | 'EXTERIOR_PAISAJISMO'
  | 'ENERGIA_SOLAR'
  | 'CONSTRUCCION_PROYECTO'
  | 'SERVICIOS_RECURRENTES'
  | 'OTRO';

export type OpportunitySource =
  | 'SISTEMA'
  | 'COMERCIAL'
  | 'CLIENTE'
  | 'PROVEEDOR'
  | 'OBRA_PREVIA'
  | 'INSPECCION'
  | 'POST_ENTREGA'
  | 'CAMPAÑA';

export type PostSaleOpportunityStatus =
  | 'DETECTADA'
  | 'SUGERIDA'
  | 'CONTACTADO'
  | 'INTERESADO'
  | 'RELEVAMIENTO_REQUERIDO'
  | 'COTIZANDO'
  | 'PROPUESTA_ENVIADA'
  | 'NEGOCIANDO'
  | 'APROBADA'
  | 'PERDIDA'
  | 'POSTERGADA'
  | 'CONVERTIDA';

export interface PostSaleOpportunity {
  id: string;
  lotId: string;
  lotNumber?: string;
  customerId: string;
  customerName?: string;
  saleId?: string;
  category: ServiceCategory;
  title: string;
  description?: string;
  source: OpportunitySource;
  status: PostSaleOpportunityStatus;
  estimatedValue?: number;
  currency?: 'ARS' | 'USD';
  detectedAt: string;
  suggestedAt?: string;
  interestedAt?: string;
  ownerUserId?: string;
  nextActionAt?: string;
  triggerReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkRequestStatus =
  | 'NUEVA'
  | 'EN_REVISION'
  | 'RELEVAMIENTO_REQUERIDO'
  | 'RELEVAMIENTO_AGENDADO'
  | 'LISTA_PARA_COTIZAR'
  | 'COTIZANDO'
  | 'PROPUESTA_ENVIADA'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'CONVERTIDA_EN_OBRA'
  | 'CANCELADA';

export type RequestSource = 'CLIENTE' | 'COMERCIAL' | 'COORDINADOR' | 'SISTEMA';

export interface WorkRequest {
  id: string;
  opportunityId?: string;
  lotId: string;
  lotNumber?: string;
  customerId: string;
  customerName?: string;
  category: ServiceCategory;
  title: string;
  description: string;
  status: WorkRequestStatus;
  priority: 'ALTA' | 'MEDIA' | 'BAJA' | 'URGENTE';
  requestedAt: string;
  requestedBy: RequestSource;
  preferredStartDate?: string;
  budgetExpectation?: number;
  currency?: 'ARS' | 'USD';
  siteVisitRequired: boolean;
  assignedCoordinatorId?: string;
  assignedCoordinatorName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicalSurvey {
  id: string;
  workRequestId: string;
  lotId: string;
  lotNumber?: string;
  assignedUserId?: string;
  assignedUserName?: string;
  assignedProviderId?: string;
  assignedProviderName?: string;
  scheduledAt: string;
  completedAt?: string;
  status: 'PENDIENTE' | 'AGENDADO' | 'REALIZADO' | 'REQUIERE_REVISION' | 'APROBADO';
  measurements?: string;
  terrainStatus?: string;
  accessInfo?: string;
  restrictions?: string;
  recommendations?: string;
  simulatedPhotos?: string[];
  notes?: string;
  createdAt: string;
}

export type ProviderStatus = 'ACTIVO' | 'EN_EVALUACION' | 'SUSPENDIDO' | 'DOCUMENTACION_VENCIDA' | 'INACTIVO';
export type ProviderDocumentationStatus = 'COMPLETA' | 'PENDIENTE' | 'OBSERVADA' | 'VENCIDA';
export type CommissionModel = 'PERCENTAGE' | 'MARKUP' | 'FIXED_FEE' | 'MANAGEMENT_FEE' | 'NONE';

export interface ProviderDocument {
  id: string;
  providerId: string;
  type: 'CUIT' | 'CONSTANCIA_FISCAL' | 'SEGURO' | 'ART' | 'MATRICULA' | 'HABILITACION' | 'CBU_BANCARIO' | 'OTRO';
  title: string;
  status: 'VIGENTE' | 'PENDIENTE' | 'OBSERVADO' | 'VENCIDO';
  expiresAt?: string;
  fileUrl?: string;
}

export interface Provider {
  id: string;
  organizationName: string;
  contactName?: string;
  categoryIds: ServiceCategory[];
  phone?: string;
  email?: string;
  coverageAreas: string[];
  status: ProviderStatus;
  rating?: number;
  completedWorks: number;
  averageResponseHours?: number;
  documentationStatus: ProviderDocumentationStatus;
  commissionModel?: CommissionModel;
  defaultCommissionRate?: number;
  documents?: ProviderDocument[];
  notes?: string;
}

export type QuoteRequestStatus = 'PENDIENTE' | 'ENVIADA' | 'COTIZADA_PARCIAL' | 'COTIZADA_TOTAL' | 'VENCIDA' | 'CANCELADA';

export interface WorkQuoteRequest {
  id: string;
  workRequestId: string;
  providerIds: string[];
  sentAt?: string;
  dueAt?: string;
  status: QuoteRequestStatus;
  requirements: string[];
  notes?: string;
  createdAt: string;
}

export type SupplierQuoteStatus = 'SOLICITADA' | 'RECIBIDA' | 'OBSERVADA' | 'PRESELECCIONADA' | 'RECHAZADA' | 'SELECCIONADA' | 'VENCIDA';

export interface SupplierQuote {
  id: string;
  quoteRequestId: string;
  providerId: string;
  providerName?: string;
  workRequestId: string;
  status: SupplierQuoteStatus;
  amount: number;
  currency: 'ARS' | 'USD';
  materialCost?: number;
  laborCost?: number;
  estimatedDays?: number;
  startAvailability?: string;
  warrantyMonths?: number;
  paymentTerms?: string;
  validUntil?: string;
  notes?: string;
  createdAt: string;
}

export type ClientProposalStatus =
  | 'BORRADOR'
  | 'ENVIADA'
  | 'VISTA'
  | 'EN_EVALUACION'
  | 'MODIFICACION_SOLICITADA'
  | 'APROBADA'
  | 'RECHAZADA'
  | 'VENCIDA';

export interface ClientProposal {
  id: string;
  workRequestId: string;
  lotId: string;
  lotNumber?: string;
  customerId: string;
  customerName?: string;
  title: string;
  version: number;
  selectedSupplierQuoteId: string;
  providerId: string;
  providerName: string;
  status: ClientProposalStatus;
  providerCost: number;
  clientPrice: number;
  commissionAmount: number;
  marginAmount: number;
  currency: 'ARS' | 'USD';
  estimatedDurationDays: number;
  estimatedStartDate?: string;
  warrantyMonths: number;
  termsAndConditions?: string;
  optionals?: string[];
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export type CommissionSourceType = 'OBRA' | 'SERVICIO_RECURRENTE';
export type CommissionStatus = 'ESTIMADA' | 'DEVENGADA' | 'PENDIENTE' | 'PAGADA' | 'CANCELADA' | 'OBSERVADA';

export interface Commission {
  id: string;
  sourceType: CommissionSourceType;
  sourceId: string;
  providerId?: string;
  providerName?: string;
  lotId?: string;
  lotNumber?: string;
  customerId?: string;
  customerName?: string;
  model: CommissionModel;
  baseAmount: number;
  rate?: number;
  fixedAmount?: number;
  commissionAmount: number;
  marginAmount: number;
  currency: 'ARS' | 'USD';
  status: CommissionStatus;
  earnedAt?: string;
  payableAt?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
}

export type WorkOrderStatus =
  | 'PREPARACION'
  | 'PENDIENTE_INICIO'
  | 'EN_EJECUCION'
  | 'PAUSADA'
  | 'DEMORADA'
  | 'EN_INSPECCION'
  | 'OBSERVADA'
  | 'FINALIZADA'
  | 'GARANTIA'
  | 'CANCELADA';

export interface WorkOrder {
  id: string;
  workRequestId: string;
  lotId: string;
  lotNumber?: string;
  customerId: string;
  customerName?: string;
  providerId: string;
  providerName?: string;
  supplierQuoteId?: string;
  proposalId?: string;
  status: WorkOrderStatus;
  title: string;
  category: ServiceCategory;
  contractedAmount: number;
  providerCost: number;
  marginAmount: number;
  currency: 'ARS' | 'USD';
  startDate?: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  progress: number;
  coordinatorId?: string;
  coordinatorName?: string;
  warrantyMonths?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MilestoneStatus = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'OBSERVADO';

export interface WorkMilestone {
  id: string;
  workOrderId: string;
  title: string;
  description?: string;
  percentage: number;
  status: MilestoneStatus;
  plannedDate?: string;
  completedAt?: string;
  approvedByUserId?: string;
  notes?: string;
}

export type IncidentType = 'DEMORA' | 'DANO' | 'MATERIAL_INCORRECTO' | 'ACCESO' | 'CALIDAD' | 'CLIENTE' | 'CLIMA' | 'SEGURIDAD' | 'OTRO';
export type IncidentSeverity = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type IncidentStatus = 'ABIERTA' | 'EN_ANALISIS' | 'EN_RESOLUCION' | 'RESUELTA' | 'CANCELADA';

export interface Incident {
  id: string;
  workOrderId: string;
  lotId: string;
  lotNumber?: string;
  providerId?: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  reportedAt: string;
  resolvedAt?: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  notes?: string;
}

export type WarrantyStatus = 'ACTIVA' | 'INCIDENCIA_EN_CURSO' | 'PROXIMA_A_VENCER' | 'VENCIDA';

export interface Warranty {
  id: string;
  workOrderId: string;
  lotId: string;
  lotNumber?: string;
  customerId: string;
  customerName?: string;
  providerId: string;
  providerName?: string;
  serviceName: string;
  startDate: string;
  endDate: string;
  months: number;
  coverageDetails: string;
  status: WarrantyStatus;
  createdAt: string;
}

export type SubscriptionStatus = 'ACTIVO' | 'PAUSADO' | 'CANCELADO' | 'PENDIENTE_PAGO';
export type ServiceFrequency = 'SEMANAL' | 'QUINCENAL' | 'MENSUAL' | 'BIMESTRAL' | 'TRIMESTRAL' | 'A_DEMANDA';

export interface ServiceSubscription {
  id: string;
  lotId: string;
  lotNumber?: string;
  customerId: string;
  customerName?: string;
  providerId: string;
  providerName?: string;
  category: ServiceCategory;
  title: string;
  status: SubscriptionStatus;
  frequency: ServiceFrequency;
  price: number;
  providerCost?: number;
  marginAmount?: number;
  currency: 'ARS' | 'USD';
  startDate: string;
  nextVisitDate?: string;
  commissionModel?: CommissionModel;
  commissionAmount?: number;
  notes?: string;
  createdAt: string;
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

// ==========================================
// PHASE 8: AUTOMATION & MULTI-ACTOR ENGINE TYPES
// ==========================================

// UserRole is defined at the top of the file

export type DomainEventType =
  | 'LeadCreated'
  | 'LeadUncontacted'
  | 'LeadQualified'
  | 'VisitScheduled'
  | 'QuoteSent'
  | 'QuoteAccepted'
  | 'HoldCreated'
  | 'HoldExpiring'
  | 'DepositReported'
  | 'DepositConfirmed'
  | 'ReservationConfirmed'
  | 'SaleConfirmed'
  | 'InstallmentDueSoon'
  | 'InstallmentOverdue'
  | 'PaymentPromiseExpired'
  | 'PaymentConfirmed'
  | 'BalancePaidOff'
  | 'DocumentMissing'
  | 'DocumentExpiring'
  | 'LegalProcessDelayed'
  | 'SignatureScheduled'
  | 'DeedRegistered'
  | 'LotDelivered'
  | 'OpportunityDetected'
  | 'SupplierQuoteOverdue'
  | 'WorkMilestoneOverdue'
  | 'CriticalIncidentOpened'
  | 'WorkCompleted'
  | 'WarrantyExpiring'
  | 'SubscriptionVisitDue';

export type EntityType =
  | 'LEAD'
  | 'HOLD'
  | 'RESERVATION'
  | 'SALE'
  | 'PAYMENT_PLAN'
  | 'INSTALLMENT'
  | 'DOCUMENT'
  | 'LEGAL_PROCESS'
  | 'LOT'
  | 'WORK_REQUEST'
  | 'WORK_ORDER'
  | 'SUPPLIER_QUOTE'
  | 'INCIDENT'
  | 'WARRANTY'
  | 'SUBSCRIPTION'
  | 'OPPORTUNITY'
  | 'APPROVAL'
  | 'TASK'
  | 'ALERT'
  | 'RULE'
  | 'DEPOSIT';

export interface DomainEvent {
  id: string;
  type: DomainEventType;
  entityType: EntityType;
  entityId: string;
  occurredAt?: string;
  timestamp?: string;
  actorUserId?: string;
  actorUserName?: string;
  actorRole?: UserRole;
  lotId?: string;
  lotNumber?: string;
  customerId?: string;
  customerName?: string;
  payload?: Record<string, unknown>;
  processedAt?: string;
}

export type AutomationCategory =
  | 'COMERCIAL'
  | 'PREVENTA'
  | 'RESERVAS'
  | 'COBRANZAS'
  | 'LEGAL'
  | 'DOCUMENTAL'
  | 'TECNICO'
  | 'OBRAS'
  | 'PROVEEDORES'
  | 'POSTVENTA'
  | 'MANTENIMIENTO'
  | 'ADMINISTRACION';

export type AutomationRuleStatus = 'ACTIVA' | 'PAUSADA' | 'BORRADOR' | 'DESHABILITADA';
export type AutomationPriority = 'INFO' | 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface AutomationCondition {
  field: string;
  operator: 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'ELAPSED_HOURS_GREATER_THAN' | 'DAYS_OVERDUE_GREATER_THAN';
  value: string | number | boolean;
  description?: string;
}

export type AutomationActionType =
  | 'CREATE_TASK'
  | 'CREATE_ALERT'
  | 'CREATE_NOTIFICATION'
  | 'UPDATE_PRIORITY'
  | 'ASSIGN_RESPONSIBLE'
  | 'SUGGEST_STATUS_CHANGE'
  | 'CREATE_OPPORTUNITY'
  | 'CREATE_CHECKLIST'
  | 'ESCALATE_CASE'
  | 'REQUEST_APPROVAL'
  | 'PREPARE_COMMUNICATION'
  | 'REGISTER_ACTIVITY'
  | 'SCHEDULE_FOLLOWUP';

export interface AutomationAction {
  type: AutomationActionType;
  targetRole?: UserRole;
  title: string;
  description?: string;
  priority?: AutomationPriority;
  approvalType?: ApprovalType;
  payload?: Record<string, unknown>;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: AutomationCategory;
  triggerEvent: DomainEventType;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  status: AutomationRuleStatus;
  requiresHumanApproval: boolean;
  priority: AutomationPriority;
  responsibleRole: UserRole;
  createdAt: string;
  updatedAt: string;
  lastExecutedAt?: string;
  executionsCount: number;
}

export type AutomationExecutionStatus = 'EJECUTADA' | 'PENDIENTE' | 'ESPERANDO_APROBACION' | 'OMITIDA' | 'FALLIDA';

export interface AutomationExecution {
  id: string;
  automationRuleId: string;
  ruleName: string;
  domainEventId: string;
  domainEventType: DomainEventType;
  status: AutomationExecutionStatus;
  startedAt: string;
  completedAt?: string;
  actionResults: {
    actionType: AutomationActionType;
    resultSummary: string;
    targetId?: string;
  }[];
  errorMessage?: string;
  requiresApproval?: boolean;
  approvalId?: string;
  approvedByUserId?: string;
  approvedAt?: string;
}

export type NotificationCategory =
  | 'COMERCIAL'
  | 'COBRANZAS'
  | 'LEGAL'
  | 'OBRAS'
  | 'SISTEMA'
  | 'RESERVAS'
  | 'ADMINISTRACION';

export type NotificationSeverity = 'INFO' | 'ATENCION' | 'ALTA' | 'CRITICA';

export interface NotificationItem {
  id: string;
  userId?: string;
  role?: UserRole;
  title: string;
  message: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  entityType?: EntityType;
  entityId?: string;
  lotId?: string;
  lotNumber?: string;
  actionLabel?: string;
  actionModule?: string;
  readAt?: string;
  createdAt: string;
}

export type AlertCategory = 'COMERCIAL' | 'FINANCIERO' | 'LEGAL' | 'TECNICO' | 'OBRAS' | 'PROVEEDORES' | 'SISTEMA';
export type AlertSeverity = 'INFO' | 'ATENCION' | 'ALTA' | 'CRITICA';
export type AlertStatus = 'NUEVA' | 'EN_GESTION' | 'RESUELTA' | 'IGNORADA' | 'ESCALADA';

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  category: AlertCategory;
  severity: AlertSeverity;
  status: AlertStatus;
  lotId?: string;
  lotNumber?: string;
  entityType?: EntityType;
  entityId?: string;
  customerName?: string;
  responsibleRole: UserRole;
  responsibleUserId?: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedByUserId?: string;
  resolutionNote?: string;
}

export type TaskCategory = 'COMERCIAL' | 'COBRANZAS' | 'ADMINISTRACION' | 'LEGAL' | 'TECNICA' | 'OBRAS' | 'PROVEEDORES' | 'POSTVENTA';
export type TaskStatus = 'PENDIENTE' | 'EN_CURSO' | 'BLOQUEADA' | 'COMPLETADA' | 'CANCELADA';
export type TaskPriority = 'INFO' | 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface SystemTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
  assignedUserId?: string;
  assignedUserName?: string;
  assignedRole?: UserRole;
  lotId?: string;
  lotNumber?: string;
  customerName?: string;
  entityType?: EntityType;
  entityId?: string;
  dueAt?: string;
  createdByAutomationRuleId?: string;
  completedAt?: string;
  completedByUserId?: string;
  notes?: string;
  escalated?: boolean;
}

export type ApprovalType =
  | 'SEÑA'
  | 'REFINANCIACION'
  | 'LIBERACION_EXTRAORDINARIA'
  | 'CAMBIO_COMERCIAL'
  | 'SELECCION_PROVEEDOR'
  | 'COMISION_ESPECIAL'
  | 'CANCELACION_RESERVA'
  | 'CORRECCION_ESTADO'
  | 'RESCISION';

export type ApprovalStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'OBSERVADO';

export interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  type: ApprovalType;
  requestedByUserId: string;
  requestedByUserName: string;
  requestedRole: UserRole;
  assignedRole: UserRole;
  lotId?: string;
  lotNumber?: string;
  customerName?: string;
  impact: string;
  status: ApprovalStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedByUserId?: string;
  resolvedByUserName?: string;
  resolutionNotes?: string;
  automationRuleId?: string;
  domainEventId?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId?: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: EntityType;
  entityId: string;
  previousState?: string;
  newState?: string;
  reason?: string;
}

