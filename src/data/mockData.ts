import {
  Development,
  Lot,
  Lead,
  Campaign,
  LotHold,
  Reservation,
  PaymentPlan,
  Sale,
  LegalProcess,
  WorkItem,
  SystemAlert
} from '../types';

export const mockDevelopment: Development = {
  id: 'dev-001',
  name: 'Altos del Horizonte',
  location: 'Luján, Provincia de Buenos Aires',
  totalAreaM2: 185000,
  description: 'Barrio abierto residencial de alta gama con infraestructura subterránea, club house y espacios verdes primarios.',
  stages: [
    {
      id: 'stg-01',
      name: 'Etapa 1 - Los Pinos',
      totalLots: 28,
      availableLots: 8,
      completionPercentage: 85,
      estimatedDeliveryDate: '2026-11-30',
    },
    {
      id: 'stg-02',
      name: 'Etapa 2 - Las Acacias',
      totalLots: 24,
      availableLots: 14,
      completionPercentage: 40,
      estimatedDeliveryDate: '2027-06-15',
    }
  ]
};

// Generate realistic lots for Blocks A, B, C, D
export const mockLots: Lot[] = [
  // Manzana A
  { id: 'lot-a1', number: '1', block: 'A', stage: 'Etapa 1', surfaceM2: 420, frontageM: 14, depthM: 30, priceUSD: 28500, status: 'DISPONIBLE', orientation: 'Norte', features: ['Perimetral', 'Vista Park'] },
  { id: 'lot-a2', number: '2', block: 'A', stage: 'Etapa 1', surfaceM2: 450, frontageM: 15, depthM: 30, priceUSD: 31000, status: 'BLOQUEADO', orientation: 'Norte', features: ['Cerca de Entrada'], currentHoldId: 'hold-101' },
  { id: 'lot-a3', number: '3', block: 'A', stage: 'Etapa 1', surfaceM2: 480, frontageM: 16, depthM: 30, priceUSD: 33500, status: 'SENADO', orientation: 'Sur', features: ['Arbolado'], currentReservationId: 'res-201' },
  { id: 'lot-a4', number: '4', block: 'A', stage: 'Etapa 1', surfaceM2: 520, frontageM: 16, depthM: 32.5, priceUSD: 38000, status: 'VENDIDO', orientation: 'Este', features: ['Esquina Premium'] },
  { id: 'lot-a5', number: '5', block: 'A', stage: 'Etapa 1', surfaceM2: 410, frontageM: 13.5, depthM: 30.3, priceUSD: 27900, status: 'DISPONIBLE', orientation: 'Norte', features: ['Plano'] },
  { id: 'lot-a6', number: '6', block: 'A', stage: 'Etapa 1', surfaceM2: 430, frontageM: 14, depthM: 30.7, priceUSD: 29500, status: 'INTENCION_RESERVA', orientation: 'Oeste', features: ['Buena Sombra'] },
  
  // Manzana B
  { id: 'lot-b1', number: '1', block: 'B', stage: 'Etapa 1', surfaceM2: 600, frontageM: 20, depthM: 30, priceUSD: 44000, status: 'RESERVADO', orientation: 'Esquina', features: ['Frente al Club House', 'Esquina'] },
  { id: 'lot-b2', number: '2', block: 'B', stage: 'Etapa 1', surfaceM2: 510, frontageM: 17, depthM: 30, priceUSD: 36000, status: 'DISPONIBLE', orientation: 'Sur', features: ['Cerca de Plaza'] },
  { id: 'lot-b3', number: '3', block: 'B', stage: 'Etapa 1', surfaceM2: 490, frontageM: 16, depthM: 30.6, priceUSD: 34500, status: 'BLOQUEADO', orientation: 'Norte', features: ['Suelo Firme'], currentHoldId: 'hold-102' },
  { id: 'lot-b4', number: '4', block: 'B', stage: 'Etapa 1', surfaceM2: 460, frontageM: 15, depthM: 30.6, priceUSD: 32000, status: 'VENDIDO', orientation: 'Este', features: ['Escriturable'] },
  { id: 'lot-b5', number: '5', block: 'B', stage: 'Etapa 1', surfaceM2: 450, frontageM: 15, depthM: 30, priceUSD: 31500, status: 'DISPONIBLE', orientation: 'Oeste', features: ['Acceso Rápido'] },

  // Manzana C
  { id: 'lot-c1', number: '1', block: 'C', stage: 'Etapa 2', surfaceM2: 380, frontageM: 12.6, depthM: 30, priceUSD: 24500, status: 'DISPONIBLE', orientation: 'Norte', features: ['Oportunidad Preventa'] },
  { id: 'lot-c2', number: '2', block: 'C', stage: 'Etapa 2', surfaceM2: 390, frontageM: 13, depthM: 30, priceUSD: 25200, status: 'DISPONIBLE', orientation: 'Norte', features: ['Financiación Especial'] },
  { id: 'lot-c3', number: '3', block: 'C', stage: 'Etapa 2', surfaceM2: 400, frontageM: 13.3, depthM: 30, priceUSD: 26000, status: 'INTENCION_RESERVA', orientation: 'Sur', features: ['Plano'] },
  { id: 'lot-c4', number: '4', block: 'C', stage: 'Etapa 2', surfaceM2: 410, frontageM: 13.6, depthM: 30.1, priceUSD: 26800, status: 'DISPONIBLE', orientation: 'Este', features: ['Vista Despejada'] },
  { id: 'lot-c5', number: '5', block: 'C', stage: 'Etapa 2', surfaceM2: 500, frontageM: 16.6, depthM: 30.1, priceUSD: 34000, status: 'BLOQUEADO', orientation: 'Esquina', features: ['Esquina Central'], currentHoldId: 'hold-103' },

  // Manzana D
  { id: 'lot-d1', number: '1', block: 'D', stage: 'Etapa 2', surfaceM2: 360, frontageM: 12, depthM: 30, priceUSD: 22800, status: 'DISPONIBLE', orientation: 'Oeste', features: ['Inversión Inicial'] },
  { id: 'lot-d2', number: '2', block: 'D', stage: 'Etapa 2', surfaceM2: 370, frontageM: 12.3, depthM: 30, priceUSD: 23500, status: 'SENADO', orientation: 'Sur', features: ['Cerca de Reserva Verde'], currentReservationId: 'res-202' },
  { id: 'lot-d3', number: '3', block: 'D', stage: 'Etapa 2', surfaceM2: 440, frontageM: 14.6, depthM: 30.1, priceUSD: 28900, status: 'DISPONIBLE', orientation: 'Norte', features: ['Lote Ancho'] },
  { id: 'lot-d4', number: '4', block: 'D', stage: 'Etapa 2', surfaceM2: 460, frontageM: 15, depthM: 30.6, priceUSD: 30500, status: 'DISPONIBLE', orientation: 'Este', features: ['Sol Mañana'] }
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-01',
    name: 'Meta Ads - Lotes Verano Luján',
    platform: 'Meta Ads',
    budgetUSD: 1800,
    spentUSD: 1420,
    leadsGenerated: 64,
    conversions: 5,
    startDate: '2026-07-01',
    endDate: '2026-08-31',
    status: 'ACTIVA',
  },
  {
    id: 'camp-02',
    name: 'Google Search - Lotes Financiados',
    platform: 'Google Ads',
    budgetUSD: 2500,
    spentUSD: 2100,
    leadsGenerated: 48,
    conversions: 7,
    startDate: '2026-06-15',
    endDate: '2026-08-15',
    status: 'ACTIVA',
  },
  {
    id: 'camp-03',
    name: 'Instagram - Inversión Fideicomiso',
    platform: 'Instagram',
    budgetUSD: 1200,
    spentUSD: 1200,
    leadsGenerated: 32,
    conversions: 3,
    startDate: '2026-05-01',
    endDate: '2026-06-30',
    status: 'FINALIZADA',
  }
];

export const mockLeads: Lead[] = [
  {
    id: 'lead-01',
    fullName: 'Lucas Benítez',
    email: 'lucas.benitez@gmail.com',
    phone: '+54 11 4982 1102',
    channel: 'Meta Ads',
    campaignId: 'camp-01',
    status: 'VISITA',
    budgetUSD: 35000,
    assignedAgent: 'Gonzalo Rossi',
    notes: 'Buscando lote de 450m2 para edificar vivienda familiar. Interesado en Manzana A.',
    createdAt: '2026-08-01',
    lastInteractionAt: '2026-08-05',
    interestedBlock: 'A',
    qualificationScore: 8,
  },
  {
    id: 'lead-02',
    fullName: 'Mariana Gómez',
    email: 'mgomez.arq@hotmail.com',
    phone: '+54 11 3211 8899',
    channel: 'Google Ads',
    campaignId: 'camp-02',
    status: 'NEGOCIACION',
    budgetUSD: 45000,
    assignedAgent: 'Gonzalo Rossi',
    notes: 'Arquitecta buscando inversión. Desea comprar con anticipo + 36 cuotas.',
    createdAt: '2026-07-28',
    lastInteractionAt: '2026-08-06',
    interestedBlock: 'B',
    qualificationScore: 9,
  },
  {
    id: 'lead-03',
    fullName: 'Esteban Soria',
    email: 'estebansoria@yahoo.com.ar',
    phone: '+54 11 6543 2109',
    channel: 'Referido',
    status: 'CALIFICADO',
    budgetUSD: 28000,
    assignedAgent: 'Valeria Maza',
    notes: 'Referido por comprador de Etapa 1. Quiere presupuesto de Manzana C.',
    createdAt: '2026-08-03',
    lastInteractionAt: '2026-08-04',
    interestedBlock: 'C',
    qualificationScore: 7,
  },
  {
    id: 'lead-04',
    fullName: 'Sofia Carrizo',
    email: 'sofi.carrizo@outlook.com',
    phone: '+54 11 5566 7788',
    channel: 'Meta Ads',
    campaignId: 'camp-01',
    status: 'NUEVO',
    budgetUSD: 25000,
    assignedAgent: 'Valeria Maza',
    notes: 'Ingresó por formulario de Instagram ayer por la noche.',
    createdAt: '2026-08-05',
    lastInteractionAt: '2026-08-05',
    interestedBlock: 'D',
    qualificationScore: 5,
  },
  {
    id: 'lead-05',
    fullName: 'Roberto D\'Angelo',
    email: 'rdangelo@empresa.com.ar',
    phone: '+54 11 8877 6655',
    channel: 'Cartel Obra',
    status: 'RESERVADO',
    budgetUSD: 40000,
    assignedAgent: 'Gonzalo Rossi',
    notes: 'Señó el Lote A-3. Pendiente de validación de transferencia de seña.',
    createdAt: '2026-07-20',
    lastInteractionAt: '2026-08-06',
    interestedBlock: 'A',
    qualificationScore: 10,
  }
];

export const mockHolds: LotHold[] = [
  {
    id: 'hold-101',
    lotId: 'lot-a2',
    lotNumber: 'A-2',
    block: 'A',
    leadId: 'lead-01',
    leadName: 'Lucas Benítez',
    agentName: 'Gonzalo Rossi',
    startDate: '2026-08-05 14:30',
    expiryDate: '2026-08-07 14:30',
    status: 'ACTIVO',
    notes: 'Bloqueo temporal de 48hs asignado durante visita al predio.',
  },
  {
    id: 'hold-102',
    lotId: 'lot-b3',
    lotNumber: 'B-3',
    block: 'B',
    leadId: 'lead-02',
    leadName: 'Mariana Gómez',
    agentName: 'Gonzalo Rossi',
    startDate: '2026-08-04 10:00',
    expiryDate: '2026-08-06 10:00',
    status: 'ACTIVO',
    notes: 'Próximo a vencer. Cliente confirmó transferencia para la tarde.',
  },
  {
    id: 'hold-103',
    lotId: 'lot-c5',
    lotNumber: 'C-5',
    block: 'C',
    leadId: 'lead-03',
    leadName: 'Esteban Soria',
    agentName: 'Valeria Maza',
    startDate: '2026-08-06 09:15',
    expiryDate: '2026-08-08 09:15',
    status: 'ACTIVO',
    notes: 'Bloqueo en preventa Etapa 2.',
  }
];

export const mockReservations: Reservation[] = [
  {
    id: 'res-201',
    lotId: 'lot-a3',
    lotNumber: 'A-3',
    block: 'A',
    leadId: 'lead-05',
    leadName: 'Roberto D\'Angelo',
    agentName: 'Gonzalo Rossi',
    agreedPriceUSD: 33500,
    depositAmountUSD: 2000,
    status: 'SENA_INFORMADA',
    depositReceiptUrl: '/comprobantes/recibo_201.pdf',
    depositDate: '2026-08-06',
    createdAt: '2026-08-05',
    notes: 'Transferencia bancaria efectuada en USD. Requiere validación de Tesorería.',
  },
  {
    id: 'res-202',
    lotId: 'lot-d2',
    lotNumber: 'D-2',
    block: 'D',
    leadId: 'lead-03',
    leadName: 'Esteban Soria',
    agentName: 'Valeria Maza',
    agreedPriceUSD: 23500,
    depositAmountUSD: 1500,
    status: 'SENA_VALIDADA',
    depositDate: '2026-08-03',
    validatedBy: 'Contabilidad - Ana Silva',
    validatedAt: '2026-08-04',
    createdAt: '2026-08-02',
    notes: 'Seña aprobada y reserva confirmada.',
  }
];

export const mockPaymentPlans: PaymentPlan[] = [
  {
    id: 'plan-301',
    saleId: 'sale-401',
    lotNumber: 'A-4',
    customerName: 'Martín Peralta',
    downPaymentUSD: 11400,
    totalInstallments: 36,
    paidInstallmentsCount: 8,
    monthlyAmountUSD: 740,
    status: 'AL_DIA',
    installments: [
      { number: 1, dueDate: '2026-01-10', amountUSD: 740, amountARS: 888000, cacIndexAdjustment: 1.0, status: 'PAGADO', paidDate: '2026-01-08' },
      { number: 2, dueDate: '2026-02-10', amountUSD: 740, amountARS: 915000, cacIndexAdjustment: 1.03, status: 'PAGADO', paidDate: '2026-02-09' },
      { number: 3, dueDate: '2026-03-10', amountUSD: 740, amountARS: 940000, cacIndexAdjustment: 1.06, status: 'PAGADO', paidDate: '2026-03-10' },
      { number: 4, dueDate: '2026-04-10', amountUSD: 740, amountARS: 970000, cacIndexAdjustment: 1.09, status: 'PAGADO', paidDate: '2026-04-09' },
      { number: 5, dueDate: '2026-05-10', amountUSD: 740, amountARS: 1010000, cacIndexAdjustment: 1.13, status: 'PAGADO', paidDate: '2026-05-11' },
      { number: 6, dueDate: '2026-06-10', amountUSD: 740, amountARS: 1045000, cacIndexAdjustment: 1.17, status: 'PAGADO', paidDate: '2026-06-08' },
      { number: 7, dueDate: '2026-07-10', amountUSD: 740, amountARS: 1080000, cacIndexAdjustment: 1.21, status: 'PAGADO', paidDate: '2026-07-09' },
      { number: 8, dueDate: '2026-08-10', amountUSD: 740, amountARS: 1120000, cacIndexAdjustment: 1.25, status: 'PENDIENTE' },
      { number: 9, dueDate: '2026-09-10', amountUSD: 740, amountARS: 1160000, cacIndexAdjustment: 1.29, status: 'PENDIENTE' },
    ]
  },
  {
    id: 'plan-302',
    saleId: 'sale-402',
    lotNumber: 'B-4',
    customerName: 'Guillermo Varela',
    downPaymentUSD: 9600,
    totalInstallments: 24,
    paidInstallmentsCount: 5,
    monthlyAmountUSD: 933,
    status: 'VENCIDO',
    installments: [
      { number: 1, dueDate: '2026-03-15', amountUSD: 933, amountARS: 1120000, cacIndexAdjustment: 1.0, status: 'PAGADO', paidDate: '2026-03-14' },
      { number: 2, dueDate: '2026-04-15', amountUSD: 933, amountARS: 1160000, cacIndexAdjustment: 1.04, status: 'PAGADO', paidDate: '2026-04-15' },
      { number: 3, dueDate: '2026-05-15', amountUSD: 933, amountARS: 1200000, cacIndexAdjustment: 1.08, status: 'PAGADO', paidDate: '2026-05-18' },
      { number: 4, dueDate: '2026-06-15', amountUSD: 933, amountARS: 1250000, cacIndexAdjustment: 1.12, status: 'PAGADO', paidDate: '2026-06-12' },
      { number: 5, dueDate: '2026-07-15', amountUSD: 933, amountARS: 1300000, cacIndexAdjustment: 1.16, status: 'VENCIDO' }, // Overdue!
      { number: 6, dueDate: '2026-08-15', amountUSD: 933, amountARS: 1350000, cacIndexAdjustment: 1.20, status: 'PENDIENTE' },
    ]
  }
];

export const mockSales: Sale[] = [
  {
    id: 'sale-401',
    lotId: 'lot-a4',
    lotNumber: 'A-4',
    block: 'A',
    customerName: 'Martín Peralta',
    customerDni: '32.411.092',
    customerPhone: '+54 11 5544 3322',
    customerEmail: 'mperalta@gmail.com',
    saleDate: '2025-12-18',
    totalAmountUSD: 38000,
    downPaymentUSD: 11400,
    agentName: 'Gonzalo Rossi',
    contractStatus: 'BOLETO_FIRMATO'
  },
  {
    id: 'sale-402',
    lotId: 'lot-b4',
    lotNumber: 'B-4',
    block: 'B',
    customerName: 'Guillermo Varela',
    customerDni: '28.901.442',
    customerPhone: '+54 11 6611 2233',
    customerEmail: 'gvarela@gmail.com',
    saleDate: '2026-02-10',
    totalAmountUSD: 32000,
    downPaymentUSD: 9600,
    agentName: 'Valeria Maza',
    contractStatus: 'BOLETO_FIRMATO'
  }
];

export const mockLegalProcesses: LegalProcess[] = [
  {
    id: 'leg-501',
    lotNumber: 'A-4',
    customerName: 'Martín Peralta',
    stage: 'BOLETO_COMPRAVENTA',
    status: 'COMPLETADO',
    estimatedCompletion: '2026-01-15',
    documents: [
      { name: 'Boleto_Compraventa_Firmado.pdf', url: '#', verified: true },
      { name: 'Comprobante_Anticipo.pdf', url: '#', verified: true }
    ],
    assignedNotary: 'Escribanía Bunge & Asociados'
  },
  {
    id: 'leg-502',
    lotNumber: 'B-4',
    customerName: 'Guillermo Varela',
    stage: 'PLANO_MENSURA',
    status: 'EN_PROCESO',
    estimatedCompletion: '2026-10-30',
    documents: [
      { name: 'Plano_Aprobado_Subdivision.pdf', url: '#', verified: true },
      { name: 'Certificado_Dominio.pdf', url: '#', verified: false }
    ],
    assignedNotary: 'Escribanía Bunge & Asociados'
  }
];

export const mockWorkItems: WorkItem[] = [
  {
    id: 'work-01',
    title: 'Red Subterránea de Agua Potable',
    category: 'AGUA',
    progressPercentage: 90,
    status: 'EN_EJECUCION',
    contractor: 'HidroObras S.A.',
    startDate: '2026-02-01',
    targetDate: '2026-08-30'
  },
  {
    id: 'work-02',
    title: 'Tendido Eléctrico de Baja Tensión y Alumbrado',
    category: 'ELECTRICIDAD',
    progressPercentage: 75,
    status: 'EN_EJECUCION',
    contractor: 'Electrotécnica Sur',
    startDate: '2026-03-15',
    targetDate: '2026-09-15'
  },
  {
    id: 'work-03',
    title: 'Aprestamiento y Pavimentación Calle Principal',
    category: 'PAVIMENTO',
    progressPercentage: 45,
    status: 'EN_EJECUCION',
    contractor: 'VialCon Constructora',
    startDate: '2026-05-01',
    targetDate: '2026-11-15'
  },
  {
    id: 'work-04',
    title: 'Portal de Acceso y Cabina de Control',
    category: 'PORTAL',
    progressPercentage: 100,
    status: 'FINALIZADO',
    contractor: 'Arquitectura & Diseño SRL',
    startDate: '2025-11-01',
    targetDate: '2026-04-30'
  }
];

export const mockAlerts: SystemAlert[] = [
  {
    id: 'alt-01',
    type: 'HOLD_EXPIRING',
    title: 'Bloqueo temporal B-3 vence hoy',
    description: 'El bloqueo asignado al Lead Mariana Gómez vence a las 10:00hs. Requiere confirmación de seña.',
    severity: 'ALTA',
    createdAt: '2026-08-06 08:00',
    actionRequired: 'Contactar agente o liberar lote',
    targetModule: 'reservations'
  },
  {
    id: 'alt-02',
    type: 'DEPOSIT_VALIDATION',
    title: 'Validación de Seña Pendiente Lote A-3',
    description: 'Comprobante de $2.000 USD cargado por Gonzalo Rossi. Pendiente de aprobación por Tesorería.',
    severity: 'ALTA',
    createdAt: '2026-08-05 18:30',
    actionRequired: 'Validar acreditación bancaria',
    targetModule: 'reservations'
  },
  {
    id: 'alt-03',
    type: 'OVERDUE_PAYMENT',
    title: 'Cuota vencida Lote B-4 (Guillermo Varela)',
    description: 'La cuota #5 con vencimiento 15/07/2026 registra mofosidad de 22 días.',
    severity: 'MEDIA',
    createdAt: '2026-08-01 09:00',
    actionRequired: 'Enviar recordatorio de pago automático',
    targetModule: 'payments'
  }
];
