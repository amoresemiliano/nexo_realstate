import {
  Lot,
  Lead,
  Sale,
  PaymentPlan,
  LegalProcess,
  AlertItem,
  Seller,
  Campaign,
  Quote,
  LotHold,
  Reservation,
  Deposit,
  LotDocument,
  Development,
  Commission,
  AutomationRule,
  AutomationExecution,
  SystemTask
} from '../types';

export interface AnalyticsFilter {
  developmentId: string; // 'ALL' or specific dev id
  dateRange: 'TODAY' | '7D' | '30D' | '90D' | 'THIS_YEAR' | 'ALL';
  sellerId: string; // 'ALL' or specific seller id
  currency: 'ALL' | 'USD' | 'ARS';
}

export const defaultAnalyticsFilter: AnalyticsFilter = {
  developmentId: 'ALL',
  dateRange: 'ALL',
  sellerId: 'ALL',
  currency: 'ALL'
};

// 1. EXECUTIVE METRICS MODEL
export interface ExecutiveMetrics {
  totalLots: number;
  availableLots: number;
  reservedLots: number;
  soldLots: number;
  blockedLots: number;
  totalSalesValueUSD: number;
  totalSalesValueARS: number;
  financedAmountUSD: number;
  expectedCollectionMonthUSD: number;
  collectedAmountMonthUSD: number;
  totalMoraAmountUSD: number;
  defaultRatePercent: number;
  activeLegalProcesses: number;
  activeWorksCount: number;
  postSaleOpportunitiesValueUSD: number;
  devengadasCommissionsUSD: number;
  estimatedMRRUSD: number;
  criticalAlertsCount: number;
}

// 2. COMMERCIAL & FUNNEL METRICS MODEL
export interface FunnelStep {
  key: string;
  label: string;
  count: number;
  conversionFromPrevPercent: number;
  overallPercent: number;
  dropOffCount: number;
}

export interface SellerPerformanceItem {
  sellerId: string;
  sellerName: string;
  avatar: string;
  assignedLeads: number;
  contactedLeads: number;
  avgResponseHours: number;
  visitsCount: number;
  quotesCount: number;
  reservationsCount: number;
  salesCount: number;
  conversionRatePercent: number;
  totalSalesValueUSD: number;
  overdueFollowups: number;
}

export interface CampaignPerformanceItem {
  campaignId: string;
  name: string;
  channel: string;
  spendUSD: number;
  leadsCount: number;
  cplUSD: number;
  qualifiedCount: number;
  visitsCount: number;
  reservationsCount: number;
  salesCount: number;
  conversionPercent: number;
  costPerReservationUSD: number;
  costPerSaleUSD: number;
  generatedValueUSD: number;
}

export interface CommercialMetrics {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  activeOpportunities: number;
  stagnantLeadsCount: number;
  avgFirstResponseTimeHours: number;
  avgSalesCycleDays: number;
  overallConversionRatePercent: number;
  totalSales: number;
  potentialPipelineValueUSD: number;
  funnel: FunnelStep[];
  sellerPerformance: SellerPerformanceItem[];
  campaignPerformance: CampaignPerformanceItem[];
}

// 3. COLLECTION & TREASURY METRICS MODEL
export interface AgingBucket {
  rangeKey: 'CURRENT' | '1_30' | '31_60' | '61_90' | 'OVER_90';
  label: string;
  amountUSD: number;
  clientsCount: number;
  percentOfTotal: number;
  colorClass: string;
}

export interface CollectionMetrics {
  expectedTodayUSD: number;
  expectedMonthUSD: number;
  collectedMonthUSD: number;
  collectionFulfillmentPercent: number;
  overdueInstallmentsCount: number;
  moraCriticalUSD: number;
  unconciliatedPaymentsUSD: number;
  paymentPromisesCount: number;
  refinancingsCount: number;
  agingBuckets: AgingBucket[];
  projections: {
    period: string;
    label: string;
    expectedUSD: number;
    collectedUSD: number;
    overdueUSD: number;
  }[];
}

// 4. LEGAL & DEED METRICS MODEL
export interface LegalMetrics {
  eligibleForDeedCount: number;
  activeProcessesCount: number;
  incompleteDocsCount: number;
  observedCasesCount: number;
  upcomingSigningsCount: number;
  pendingRegistrationCount: number;
  delayedCasesCount: number;
  moraEscalatedCount: number;
  avgCycleDays: {
    initToCompleteDoc: number;
    docToSigning: number;
    signingToRegistration: number;
    totalCycleDays: number;
  };
  processByStatus: {
    status: string;
    label: string;
    count: number;
  }[];
}

// 5. WORKS & PROVIDER METRICS MODEL
export interface ProviderPerformanceItem {
  providerId: string;
  name: string;
  category: string;
  rating: number;
  compliancePercent: number;
  incidentsCount: number;
  contractedValueUSD: number;
  avgResponseDays: number;
  assignedJobs: number;
  completedJobs: number;
}

export interface WorksMetrics {
  activeWorksCount: number;
  worksToStartCount: number;
  completedWorksCount: number;
  delayedWorksCount: number;
  openRequestsCount: number;
  pendingQuotesCount: number;
  openIncidentsCount: number;
  activeWarrantiesCount: number;
  providerPerformances: ProviderPerformanceItem[];
}

// 6. AUTOMATION METRICS MODEL
export interface AutomationMetrics {
  activeRulesCount: number;
  pausedRulesCount: number;
  totalExecutionsCount: number;
  automatedTasksCreated: number;
  alertsGenerated: number;
  pendingApprovals: number;
  failedExecutionsCount: number;
  estimatedHoursSaved: number;
}

// 7. DEVELOPMENT PORTFOLIO MODEL
export interface DevelopmentPortfolioItem {
  developmentId: string;
  name: string;
  location: string;
  totalLots: number;
  availableLots: number;
  reservedLots: number;
  soldLots: number;
  occupancyPercent: number;
  totalSalesUSD: number;
  collectedUSD: number;
  moraPercent: number;
  infrastructureProgressPercent: number;
  activeWorks: number;
}

// 8. QUICK INSIGHTS MODEL
export interface QuickInsight {
  id: string;
  type: 'ATENCION' | 'OPORTUNIDAD' | 'TENDENCIA';
  title: string;
  description: string;
  actionText?: string;
  moduleTarget?: string;
}

// Helper filters
function filterByDev<T extends { developmentId?: string }>(items: T[], devId: string): T[] {
  if (devId === 'ALL' || !devId) return items;
  return items.filter(i => i.developmentId === devId);
}

// ==========================================
// SELECTOR & CALCULATOR ENGINE FUNCTIONS
// ==========================================

// 1. EXECUTIVE METRICS SELECTOR
export function getExecutiveMetrics(
  lots: Lot[],
  leads: Lead[],
  sales: Sale[],
  paymentPlans: PaymentPlan[],
  legalProcesses: LegalProcess[],
  alerts: AlertItem[],
  commissions: Commission[] = [],
  filter: AnalyticsFilter = defaultAnalyticsFilter
): ExecutiveMetrics {
  const filteredLots = filterByDev(lots, filter.developmentId);
  const totalLots = filteredLots.length || 1;
  const availableLots = filteredLots.filter(l => l.status === 'DISPONIBLE').length;
  const reservedLots = filteredLots.filter(l => l.status === 'RESERVADO' || l.status === 'SENADO').length;
  const soldLots = filteredLots.filter(l => l.status === 'VENDIDO').length;
  const blockedLots = filteredLots.filter(l => l.status === 'BLOQUEADO' || l.status === 'INTENCION_RESERVA').length;

  const totalSalesValueUSD = sales.reduce((acc, s) => acc + (s.totalAmountUSD || 0), 0) || 385000;
  const totalSalesValueARS = sales.reduce((acc, s) => acc + ((s.totalAmountUSD || 0) * 1400), 0) || 125000000;

  // Calculate financed balance from payment plans
  let financedAmountUSD = 0;
  let expectedCollectionMonthUSD = 0;
  let collectedAmountMonthUSD = 0;
  let totalMoraAmountUSD = 0;
  let totalInstallments = 0;
  let overdueInstallments = 0;

  paymentPlans.forEach(plan => {
    financedAmountUSD += plan.financedAmount || plan.downPaymentUSD || 0;
    plan.installments.forEach(inst => {
      totalInstallments++;
      if (inst.status === 'VENCIDO') {
        overdueInstallments++;
        totalMoraAmountUSD += inst.amountUSD || 0;
      }
      if (inst.status === 'PAGADO') {
        collectedAmountMonthUSD += inst.paidAmount || inst.amountUSD || 0;
      } else {
        expectedCollectionMonthUSD += inst.amountUSD || 0;
      }
    });
  });

  const defaultRatePercent = totalInstallments > 0
    ? Number(((overdueInstallments / totalInstallments) * 100).toFixed(1))
    : 4.2;

  const activeLegalProcesses = legalProcesses.filter(p => p.status !== 'INSCRIPTA' && p.status !== 'FINALIZADA').length;
  const activeWorksCount = 4; // 4 obras en ejecucion
  const postSaleOpportunitiesValueUSD = 24500;

  const devengadasCommissionsUSD = commissions
    .filter(c => c.status === 'DEVENGADA' || c.status === 'PAGADA')
    .reduce((acc, c) => acc + (c.commissionAmount || 0), 0) || 18400;

  const estimatedMRRUSD = 4800; // Servicios recurrentes barrio
  const criticalAlertsCount = alerts.filter(a => a.severity === 'ALTA').length;

  return {
    totalLots,
    availableLots,
    reservedLots,
    soldLots,
    blockedLots,
    totalSalesValueUSD,
    totalSalesValueARS,
    financedAmountUSD,
    expectedCollectionMonthUSD,
    collectedAmountMonthUSD,
    totalMoraAmountUSD,
    defaultRatePercent,
    activeLegalProcesses,
    activeWorksCount,
    postSaleOpportunitiesValueUSD,
    devengadasCommissionsUSD,
    estimatedMRRUSD,
    criticalAlertsCount
  };
}

// 2. COMMERCIAL METRICS SELECTOR
export function getCommercialMetrics(
  leads: Lead[],
  sellers: Seller[],
  campaigns: Campaign[],
  quotes: Quote[],
  holds: LotHold[],
  reservations: Reservation[],
  sales: Sale[],
  filter: AnalyticsFilter = defaultAnalyticsFilter
): CommercialMetrics {
  const filteredLeads = filter.sellerId === 'ALL'
    ? leads
    : leads.filter(l => l.assignedSellerId === filter.sellerId);

  const totalLeads = filteredLeads.length || 1;
  const newLeads = filteredLeads.filter(l => l.status === 'NUEVO').length;
  const qualifiedLeads = filteredLeads.filter(l => l.qualification === 'CALIENTE' || l.qualification === 'MUY_CALIENTE').length;
  const activeOpportunities = filteredLeads.filter(l => l.status === 'COTIZACION_ENVIADA' || l.status === 'VISITA_AGENDADA').length;
  const stagnantLeadsCount = filteredLeads.filter(l => l.qualification === 'FRIO').length;

  const totalSales = sales.length || 12;
  const overallConversionRatePercent = Number(((totalSales / totalLeads) * 100).toFixed(1));

  // Build Funnel Steps
  const leadCount = totalLeads;
  const contactedCount = Math.round(leadCount * 0.85);
  const visitedCount = Math.round(leadCount * 0.55);
  const quotedCount = Math.round(leadCount * 0.38);
  const reservedCount = Math.round(leadCount * 0.22);
  const closedCount = totalSales;

  const funnel: FunnelStep[] = [
    {
      key: 'LEADS',
      label: 'Leads Ingresados',
      count: leadCount,
      conversionFromPrevPercent: 100,
      overallPercent: 100,
      dropOffCount: leadCount - contactedCount
    },
    {
      key: 'CONTACTADOS',
      label: 'Contactados / Calificados',
      count: contactedCount,
      conversionFromPrevPercent: 85,
      overallPercent: 85,
      dropOffCount: contactedCount - visitedCount
    },
    {
      key: 'VISITAS',
      label: 'Visitas / Interés Identificado',
      count: visitedCount,
      conversionFromPrevPercent: 64.7,
      overallPercent: 55,
      dropOffCount: visitedCount - quotedCount
    },
    {
      key: 'COTIZACIONES',
      label: 'Cotizaciones Enviadas',
      count: quotedCount,
      conversionFromPrevPercent: 69,
      overallPercent: 38,
      dropOffCount: quotedCount - reservedCount
    },
    {
      key: 'RESERVAS',
      label: 'Reservas / Señas Validadas',
      count: reservedCount,
      conversionFromPrevPercent: 57.8,
      overallPercent: 22,
      dropOffCount: reservedCount - closedCount
    },
    {
      key: 'VENTAS',
      label: 'Ventas Cerradas / Boleto',
      count: closedCount,
      conversionFromPrevPercent: 85.7,
      overallPercent: 18.7,
      dropOffCount: 0
    }
  ];

  // Seller Performance Mapping
  const sellerPerformance: SellerPerformanceItem[] = sellers.map(s => {
    const sAssigned = filteredLeads.filter(l => l.assignedSellerId === s.id).length || 20;
    const sSales = sales.filter(sl => sl.sellerId === s.id).length || 3;
    const sReservations = holds.filter(h => h.sellerId === s.id).length || 4;
    const sQuotes = quotes.filter(q => q.sellerId === s.id).length || 8;
    const sVisits = Math.round(sAssigned * 0.5);

    return {
      sellerId: s.id,
      sellerName: s.name,
      avatar: s.avatar,
      assignedLeads: sAssigned,
      contactedLeads: Math.round(sAssigned * 0.9),
      avgResponseHours: s.id === 'seller-1' ? 1.2 : 2.4,
      visitsCount: sVisits,
      quotesCount: sQuotes,
      reservationsCount: sReservations,
      salesCount: sSales,
      conversionRatePercent: s.conversionRatePercent,
      totalSalesValueUSD: sSales * 32000,
      overdueFollowups: s.id === 'seller-3' ? 2 : 0
    };
  });

  // Campaign Performance
  const campaignPerformance: CampaignPerformanceItem[] = campaigns.map(c => {
    const leadsCnt = c.leadsGenerated || 15;
    const spend = c.budgetUSD || 500;
    const cpl = leadsCnt > 0 ? Number((spend / leadsCnt).toFixed(1)) : 0;
    const qual = Math.round(leadsCnt * 0.5);
    const vis = Math.round(leadsCnt * 0.3);
    const res = (c as any).reservationsGeneratedCount || Math.round(leadsCnt * 0.15);
    const sls = (c as any).salesClosedCount || Math.round(leadsCnt * 0.08);
    const conv = leadsCnt > 0 ? Number(((sls / leadsCnt) * 100).toFixed(1)) : 0;
    const costPerRes = res > 0 ? Math.round(spend / res) : spend;
    const costPerSale = sls > 0 ? Math.round(spend / sls) : spend;
    const genValue = sls * 34000;

    return {
      campaignId: c.id,
      name: c.name,
      channel: c.platform || 'Meta Ads',
      spendUSD: spend,
      leadsCount: leadsCnt,
      cplUSD: cpl,
      qualifiedCount: qual,
      visitsCount: vis,
      reservationsCount: res,
      salesCount: sls,
      conversionPercent: conv,
      costPerReservationUSD: costPerRes,
      costPerSaleUSD: costPerSale,
      generatedValueUSD: genValue
    };
  });

  return {
    totalLeads,
    newLeads,
    qualifiedLeads,
    activeOpportunities,
    stagnantLeadsCount,
    avgFirstResponseTimeHours: 1.8,
    avgSalesCycleDays: 14,
    overallConversionRatePercent,
    totalSales,
    potentialPipelineValueUSD: 420000,
    funnel,
    sellerPerformance,
    campaignPerformance
  };
}

// 3. COLLECTION METRICS
export function getCollectionMetrics(
  paymentPlans: PaymentPlan[],
  deposits: Deposit[],
  filter: AnalyticsFilter = defaultAnalyticsFilter
): CollectionMetrics {
  let expectedTodayUSD = 1850;
  let expectedMonthUSD = 42500;
  let collectedMonthUSD = 36100;
  let overdueInstallmentsCount = 4;
  let moraCriticalUSD = 7400;
  let unconciliatedPaymentsUSD = 2300;
  let paymentPromisesCount = 3;
  let refinancingsCount = 1;

  const collectionFulfillmentPercent = expectedMonthUSD > 0
    ? Number(((collectedMonthUSD / expectedMonthUSD) * 100).toFixed(1))
    : 84.9;

  const agingBuckets: AgingBucket[] = [
    {
      rangeKey: 'CURRENT',
      label: 'Al día (<30d)',
      amountUSD: 142000,
      clientsCount: 38,
      percentOfTotal: 82,
      colorClass: 'bg-emerald-500'
    },
    {
      rangeKey: '1_30',
      label: '1 a 30 días',
      amountUSD: 18500,
      clientsCount: 5,
      percentOfTotal: 10.7,
      colorClass: 'bg-amber-400'
    },
    {
      rangeKey: '31_60',
      label: '31 a 60 días',
      amountUSD: 8200,
      clientsCount: 2,
      percentOfTotal: 4.7,
      colorClass: 'bg-orange-500'
    },
    {
      rangeKey: '61_90',
      label: '61 a 90 días',
      amountUSD: 3100,
      clientsCount: 1,
      percentOfTotal: 1.8,
      colorClass: 'bg-rose-500'
    },
    {
      rangeKey: 'OVER_90',
      label: '+90 días (Mora grave)',
      amountUSD: 1400,
      clientsCount: 1,
      percentOfTotal: 0.8,
      colorClass: 'bg-rose-700'
    }
  ];

  const projections = [
    { period: 'M1', label: 'Agosto 2026', expectedUSD: 42500, collectedUSD: 38200, overdueUSD: 4300 },
    { period: 'M2', label: 'Septiembre 2026', expectedUSD: 44100, collectedUSD: 39600, overdueUSD: 4500 },
    { period: 'M3', label: 'Octubre 2026', expectedUSD: 45800, collectedUSD: 41100, overdueUSD: 4700 }
  ];

  return {
    expectedTodayUSD,
    expectedMonthUSD,
    collectedMonthUSD,
    collectionFulfillmentPercent,
    overdueInstallmentsCount,
    moraCriticalUSD,
    unconciliatedPaymentsUSD,
    paymentPromisesCount,
    refinancingsCount,
    agingBuckets,
    projections
  };
}

// 4. LEGAL METRICS
export function getLegalMetrics(
  lots: Lot[],
  legalProcesses: LegalProcess[],
  documents: LotDocument[],
  filter: AnalyticsFilter = defaultAnalyticsFilter
): LegalMetrics {
  const eligibleForDeedCount = lots.filter(l => l.status === 'VENDIDO').length || 4;
  const activeProcessesCount = legalProcesses.length || 3;
  const incompleteDocsCount = documents.filter(d => d.status === 'PENDIENTE' || d.status === 'OBSERVADO').length || 2;
  const observedCasesCount = legalProcesses.filter(p => p.status === 'OBSERVADA' || p.status === 'DOCUMENTACION_PENDIENTE').length || 1;
  const upcomingSigningsCount = 2;
  const pendingRegistrationCount = 1;
  const delayedCasesCount = 1;
  const moraEscalatedCount = 1;

  const processByStatus = [
    { status: 'EN_PREPARACION', label: 'En Preparación Expediente', count: 2 },
    { status: 'ESTUDIO_TITULOS', label: 'Estudio de Títulos / Agrimensura', count: 2 },
    { status: 'ESCRITURA_FIRMAR', label: 'Firma Próxima', count: 1 },
    { status: 'INSCRIPTO', label: 'Inscripto en Registro', count: 3 }
  ];

  return {
    eligibleForDeedCount,
    activeProcessesCount,
    incompleteDocsCount,
    observedCasesCount,
    upcomingSigningsCount,
    pendingRegistrationCount,
    delayedCasesCount,
    moraEscalatedCount,
    avgCycleDays: {
      initToCompleteDoc: 12,
      docToSigning: 24,
      signingToRegistration: 35,
      totalCycleDays: 71
    },
    processByStatus
  };
}

// 5. WORKS METRICS
export function getWorksMetrics(
  providerList: any[] = [],
  filter: AnalyticsFilter = defaultAnalyticsFilter
): WorksMetrics {
  const providerPerformances: ProviderPerformanceItem[] = [
    {
      providerId: 'prov-001',
      name: 'VialSur Infraestructura S.A.',
      category: 'Movimiento de Suelos & Pavimento',
      rating: 4.8,
      compliancePercent: 94,
      incidentsCount: 0,
      contractedValueUSD: 85000,
      avgResponseDays: 1.2,
      assignedJobs: 5,
      completedJobs: 4
    },
    {
      providerId: 'prov-002',
      name: 'Electricidad & Cercos San Martín',
      category: 'Red Eléctrica y Cercos Perimetrales',
      rating: 4.2,
      compliancePercent: 86,
      incidentsCount: 1,
      contractedValueUSD: 34000,
      avgResponseDays: 2.1,
      assignedJobs: 3,
      completedJobs: 2
    },
    {
      providerId: 'prov-003',
      name: 'AguaPotable del Valle SRL',
      category: 'Redes Subterráneas de Agua y Riego',
      rating: 4.9,
      compliancePercent: 98,
      incidentsCount: 0,
      contractedValueUSD: 52000,
      avgResponseDays: 0.8,
      assignedJobs: 4,
      completedJobs: 4
    }
  ];

  return {
    activeWorksCount: 4,
    worksToStartCount: 2,
    completedWorksCount: 8,
    delayedWorksCount: 1,
    openRequestsCount: 3,
    pendingQuotesCount: 2,
    openIncidentsCount: 1,
    activeWarrantiesCount: 6,
    providerPerformances
  };
}

// 6. AUTOMATION METRICS
export function getAutomationMetrics(
  rules: AutomationRule[] = [],
  executions: AutomationExecution[] = [],
  tasks: SystemTask[] = [],
  alerts: AlertItem[] = []
): AutomationMetrics {
  const activeRulesCount = rules.filter(r => r.status === 'ACTIVA').length || 8;
  const pausedRulesCount = rules.filter(r => r.status === 'PAUSADA').length || 1;
  const totalExecutionsCount = executions.length || 42;
  const automatedTasksCreated = tasks.length || 18;
  const alertsGenerated = alerts.length || 6;
  const pendingApprovals = 2;
  const failedExecutionsCount = executions.filter(e => e.status === 'FALLIDA').length || 1;
  const estimatedHoursSaved = Math.round(totalExecutionsCount * 0.4); // 0.4 hrs saved per auto task

  return {
    activeRulesCount,
    pausedRulesCount,
    totalExecutionsCount,
    automatedTasksCreated,
    alertsGenerated,
    pendingApprovals,
    failedExecutionsCount,
    estimatedHoursSaved
  };
}

// 7. DEVELOPMENT PORTFOLIO
export function getDevelopmentPortfolio(
  developments: Development[],
  lots: Lot[],
  sales: Sale[]
): DevelopmentPortfolioItem[] {
  return developments.map(dev => {
    const devLots = lots.filter(l => l.developmentId === dev.id);
    const totalLots = devLots.length || dev.totalLots || 50;
    const availableLots = devLots.filter(l => l.status === 'DISPONIBLE').length || dev.availableLots || 20;
    const reservedLots = devLots.filter(l => l.status === 'RESERVADO' || l.status === 'SENADO').length || 8;
    const soldLots = devLots.filter(l => l.status === 'VENDIDO').length || 12;
    const occupancyPercent = Number((((totalLots - availableLots) / totalLots) * 100).toFixed(1));
    const totalSalesUSD = soldLots * 33000;
    const collectedUSD = Math.round(totalSalesUSD * 0.75);

    const locStr = typeof dev.location === 'string'
      ? dev.location
      : `${dev.location.city}, ${dev.location.province}`;

    return {
      developmentId: dev.id,
      name: dev.name,
      location: locStr,
      totalLots,
      availableLots,
      reservedLots,
      soldLots,
      occupancyPercent,
      totalSalesUSD,
      collectedUSD,
      moraPercent: 4.2,
      infrastructureProgressPercent: 88,
      activeWorks: 2
    };
  });
}

// 8. QUICK INSIGHTS ENGINE
export function getQuickInsights(
  leads: Lead[],
  lots: Lot[],
  legalProcesses: LegalProcess[],
  alerts: AlertItem[]
): QuickInsight[] {
  return [
    {
      id: 'ins-1',
      type: 'ATENCION',
      title: '3 Leads Estancados > 48hs sin Contactar',
      description: 'Asignados a Vendedor 3 (Gonzalo Rossi). Requiere reasignación automática o alerta directa.',
      actionText: 'Ver CRM Leads',
      moduleTarget: 'leads'
    },
    {
      id: 'ins-2',
      type: 'OPORTUNIDAD',
      title: '5 Lotes Disponibles con Alta Demanda de Cotización',
      description: 'Lotes B-04 y A-12 recibieron más de 4 consultas esta semana. Oportunidad de ajuste de precio o promoción.',
      actionText: 'Ver Lotes',
      moduleTarget: 'lots'
    },
    {
      id: 'ins-3',
      type: 'TENDENCIA',
      title: 'Aumento de Conversión en Campaña Meta Ads "Preventa Etapa 2"',
      description: 'Costo por Lead disminuyó a $12 USD. Tasa de conversión a reserva subió al 22%.',
      actionText: 'Ver Campañas',
      moduleTarget: 'campaigns'
    },
    {
      id: 'ins-4',
      type: 'ATENCION',
      title: '2 Clientes con Cuota Vencida > 60 Días',
      description: 'Disparada regla de intimación legal automática y suspensión temporal de avance de escrituración.',
      actionText: 'Ver Cobranzas',
      moduleTarget: 'payments'
    }
  ];
}
