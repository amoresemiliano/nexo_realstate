export type LotStatus = 'DISPONIBLE' | 'BLOQUEADO' | 'INTENCION_RESERVA' | 'SENADO' | 'RESERVADO' | 'VENDIDO';

export type LeadStatus = 'NUEVO' | 'CONTACTADO' | 'CALIFICADO' | 'VISITA' | 'NEGOCIACION' | 'RESERVADO' | 'PERDIDO';

export type HoldStatus = 'ACTIVO' | 'VENCIDO' | 'LIBERADO' | 'CONVERTIDO';

export type ReservationStatus = 'INTENCION' | 'PROMESA_SENA' | 'SENA_INFORMADA' | 'SENA_VALIDADA' | 'CONFIRMADA' | 'CANCELADA';

export type PaymentStatus = 'AL_DIA' | 'PROXIMO_VENCIMIENTO' | 'VENCIDO' | 'EN_MORA_GRAVE';

export type InstallmentStatus = 'PENDIENTE' | 'PAGADO' | 'VENCIDO' | 'PARCIAL';

export interface Lot {
  id: string;
  number: string;
  block: string; // e.g., 'Manzana A'
  stage: string; // e.g., 'Etapa 1'
  surfaceM2: number;
  frontageM: number;
  depthM: number;
  priceUSD: number;
  status: LotStatus;
  orientation: 'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Esquina';
  features: string[];
  currentHoldId?: string;
  currentReservationId?: string;
  assignedLeadId?: string;
}

export interface DevelopmentStage {
  id: string;
  name: string;
  totalLots: number;
  availableLots: number;
  completionPercentage: number;
  estimatedDeliveryDate: string;
}

export interface Development {
  id: string;
  name: string;
  location: string;
  totalAreaM2: number;
  stages: DevelopmentStage[];
  description: string;
}

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  channel: 'Meta Ads' | 'Google Ads' | 'Instagram' | 'Referido' | 'Sitio Web' | 'Cartel Obra';
  campaignId?: string;
  status: LeadStatus;
  budgetUSD: number;
  assignedAgent: string;
  notes: string;
  createdAt: string;
  lastInteractionAt: string;
  interestedBlock?: string;
  qualificationScore: number; // 1 to 10
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
}

export interface LotHold {
  id: string;
  lotId: string;
  lotNumber: string;
  block: string;
  leadId: string;
  leadName: string;
  agentName: string;
  startDate: string;
  expiryDate: string; // Typically 48-72h
  status: HoldStatus;
  notes?: string;
}

export interface Reservation {
  id: string;
  lotId: string;
  lotNumber: string;
  block: string;
  leadId: string;
  leadName: string;
  agentName: string;
  agreedPriceUSD: number;
  depositAmountUSD: number;
  status: ReservationStatus;
  depositReceiptUrl?: string;
  depositDate?: string;
  validatedBy?: string;
  validatedAt?: string;
  createdAt: string;
  notes?: string;
}

export interface Installment {
  number: number;
  dueDate: string;
  amountUSD: number;
  amountARS: number;
  cacIndexAdjustment: number; // e.g. 1.04 (+4%)
  status: InstallmentStatus;
  paidDate?: string;
  receiptNumber?: string;
}

export interface PaymentPlan {
  id: string;
  saleId: string;
  lotNumber: string;
  customerName: string;
  downPaymentUSD: number;
  totalInstallments: number;
  paidInstallmentsCount: number;
  monthlyAmountUSD: number;
  installments: Installment[];
  status: PaymentStatus;
}

export interface Sale {
  id: string;
  lotId: string;
  lotNumber: string;
  block: string;
  customerName: string;
  customerDni: string;
  customerPhone: string;
  customerEmail: string;
  saleDate: string;
  totalAmountUSD: number;
  downPaymentUSD: number;
  agentName: string;
  contractStatus: 'BOLETO_FIRMATO' | 'EN_REVISION_LEGAL' | 'PENDIENTE_BOLETO' | 'ESCRITURADO';
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
  downPaymentPercent: number; // e.g., 30%
  installmentsCount: number; // e.g., 24, 36, 48
  currency: 'USD' | 'ARS';
  cacAdjustmentAnnual: number; // e.g., 40%
}
