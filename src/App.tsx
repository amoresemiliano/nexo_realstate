import React, { useState, useEffect } from 'react';
import {
  getStoredVisibilityConfig,
  saveVisibilityConfig,
  PRESETS,
  ModuleVisibilityConfig,
  PresetKey,
  ModuleKey
} from './config/moduleVisibility';
import { PresenterConfigModal } from './components/modals/PresenterConfigModal';
import { ShieldAlert, X } from 'lucide-react';
import {
  mockLots,
  mockLeads,
  mockHolds,
  mockReservations,
  mockDeposits,
  mockReservationIntents,
  mockPaymentPlans,
  mockSellers,
  mockCampaigns,
  mockActivities,
  mockTasks,
  mockVisits,
  mockDevelopments,
  mockQuotes,
  mockNotaryOffices,
  mockSurveyors,
  mockDocuments,
  mockLegalProcesses,
  mockSigningAppointments,
  mockSurveys,
  mockPermits,
  mockLotTimelineEvents,
  mockSales
} from './data/mockData';
import {
  mockAutomationRules,
  mockDomainEvents,
  mockAutomationExecutions,
  mockNotifications,
  mockAlerts,
  mockSystemTasks,
  mockApprovalRequests,
  mockAuditEvents
} from './data/mockAutomationData';
import {
  Lot,
  Lead,
  LotHold,
  Reservation,
  Deposit,
  ReservationIntent,
  PaymentPlan,
  Seller,
  Campaign,
  ActivityItem,
  TaskItem,
  VisitItem,
  LeadLossReason,
  Quote,
  Development,
  UserRole,
  LotHoldReason,
  LotHoldReleaseReason,
  PaymentMethod,
  DepositRejectionReason,
  ReservationCancellationReason,
  LotDocument,
  LegalProcess,
  NotaryOffice,
  Surveyor,
  Survey,
  Permit,
  DeedSigningAppointment,
  LotTimelineEvent,
  Sale,
  DocumentStatus,
  AutomationRule,
  AutomationExecution,
  NotificationItem,
  AlertItem,
  SystemTask,
  ApprovalRequest,
  AuditEvent,
  DomainEventType,
  DomainEvent
} from './types';
import { createDefaultChecklist } from './domain/reservationDomain';
import {
  processDomainEvent,
  approveHumanDecision,
  rejectHumanDecision
} from './domain/automationEngine';

// Components & Layout
import { Header } from './components/navigation/Header';
import { BottomNav } from './components/navigation/BottomNav';
import { ModuleDrawer } from './components/navigation/ModuleDrawer';

// Operational Center & Modals
import { OperationalCenterView } from './components/operational/OperationalCenterView';
import { MultiActorWalkthroughModal } from './components/automations/MultiActorWalkthroughModal';
import { EscalationWalkthroughModal } from './components/automations/EscalationWalkthroughModal';

// Modules
import { DashboardModule } from './modules/dashboard/DashboardModule';
import { ReportsModule } from './modules/reports/ReportsModule';
import { LotsModule } from './modules/lots/LotsModule';
import { LeadsModule } from './modules/leads/LeadsModule';
import { QuotesModule } from './modules/quotes/QuotesModule';
import { ReservationsModule } from './modules/reservations/ReservationsModule';
import { SalesModule } from './modules/sales/SalesModule';
import { PaymentsModule } from './modules/payments/PaymentsModule';
import { LegalModule } from './modules/legal/LegalModule';
import { WorksModule } from './modules/works/WorksModule';
import { CampaignsModule } from './modules/campaigns/CampaignsModule';
import { AutomationsModule } from './modules/automations/AutomationsModule';
import { DevelopmentsModule } from './modules/developments/DevelopmentsModule';

// Modals & Bottom Sheets
import { NewLeadModal } from './components/modals/NewLeadModal';
import { NewHoldModal } from './components/modals/NewHoldModal';
import { LotDetailSheet } from './components/modals/LotDetailSheet';
import { Lot360ViewModal } from './components/lots/Lot360ViewModal';
import { NotificationsSheet } from './components/modals/NotificationsSheet';

export function App() {
  // Navigation & Role State
  const [activeModule, setActiveModule] = useState<string>('operational');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('VENDEDOR');

  // Core Entities State
  const [lots, setLots] = useState<Lot[]>(mockLots);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [holds, setHolds] = useState<LotHold[]>(mockHolds);
  const [deposits, setDeposits] = useState<Deposit[]>(mockDeposits);
  const [intents, setIntents] = useState<ReservationIntent[]>(mockReservationIntents);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);

  const [sellers, setSellers] = useState<Seller[]>(mockSellers);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [tasks, setTasks] = useState<TaskItem[]>(mockTasks);
  const [visits, setVisits] = useState<VisitItem[]>(mockVisits);
  const [developments, setDevelopments] = useState<Development[]>(mockDevelopments);
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>(mockPaymentPlans);
  const [sales, setSales] = useState<Sale[]>(mockSales);

  // Phase 6 State
  const [documents, setDocuments] = useState<LotDocument[]>(mockDocuments);
  const [legalProcesses, setLegalProcesses] = useState<LegalProcess[]>(mockLegalProcesses);
  const [notaryOffices, setNotaryOffices] = useState<NotaryOffice[]>(mockNotaryOffices);
  const [surveyors, setSurveyors] = useState<Surveyor[]>(mockSurveyors);
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveys);
  const [permits, setPermits] = useState<Permit[]>(mockPermits);
  const [appointments, setAppointments] = useState<DeedSigningAppointment[]>(mockSigningAppointments);
  const [timelineEvents, setTimelineEvents] = useState<LotTimelineEvent[]>(mockLotTimelineEvents);

  // PHASE 8: AUTOMATIONS & OPERATIONAL STATE
  const [autoRules, setAutoRules] = useState<AutomationRule[]>(mockAutomationRules);
  const [autoExecutions, setAutoExecutions] = useState<AutomationExecution[]>(mockAutomationExecutions);
  const [autoNotifications, setAutoNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [autoAlerts, setAutoAlerts] = useState<AlertItem[]>(mockAlerts);
  const [autoTasks, setAutoTasks] = useState<SystemTask[]>(mockSystemTasks);
  const [autoApprovals, setAutoApprovals] = useState<ApprovalRequest[]>(mockApprovalRequests);
  const [autoAuditEvents, setAutoAuditEvents] = useState<AuditEvent[]>(mockAuditEvents);

  const [isMultiActorWalkthroughOpen, setIsMultiActorWalkthroughOpen] = useState(false);
  const [isEscalationWalkthroughOpen, setIsEscalationWalkthroughOpen] = useState(false);

  const [favoriteLotIds, setFavoriteLotIds] = useState<string[]>(['lot-a1', 'lot-b2']);

  // PRESENTER CONTROL (MODULE VISIBILITY STATE)
  const [visibilityState, setVisibilityState] = useState<{ config: ModuleVisibilityConfig; preset: PresetKey }>(
    () => getStoredVisibilityConfig()
  );
  const [isPresenterConfigOpen, setIsPresenterConfigOpen] = useState(false);
  const [disabledModuleNotice, setDisabledModuleNotice] = useState<string | null>(null);

  const handleUpdateVisibilityConfig = (newConfig: ModuleVisibilityConfig, newPreset: PresetKey) => {
    setVisibilityState({ config: newConfig, preset: newPreset });
    saveVisibilityConfig(newConfig, newPreset);
  };

  const handleResetPresentation = () => {
    const defaultPreset = PRESETS.CRM_OPERATIVO;
    setVisibilityState({ config: { ...defaultPreset.config }, preset: 'CRM_OPERATIVO' });
    saveVisibilityConfig({ ...defaultPreset.config }, 'CRM_OPERATIVO');
  };

  // Safe navigation guard checking module visibility
  const handleSelectModule = (mod: string) => {
    if (visibilityState.config && !visibilityState.config[mod as ModuleKey]) {
      setDisabledModuleNotice(mod);
      setTimeout(() => setDisabledModuleNotice(null), 4000);
      setActiveModule('dashboard');
    } else {
      setActiveModule(mod);
    }
  };

  // Redirect to dashboard if currently viewing a module that gets disabled
  useEffect(() => {
    if (visibilityState.config && !visibilityState.config[activeModule as ModuleKey]) {
      setActiveModule('dashboard');
    }
  }, [visibilityState.config, activeModule]);

  // Modal selections
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isNewHoldOpen, setIsNewHoldOpen] = useState(false);
  const [selectedLotForDetail, setSelectedLotForDetail] = useState<Lot | null>(null);
  const [selected360Lot, setSelected360Lot] = useState<Lot | null>(null);
  const [quoteLot, setQuoteLot] = useState<Lot | null>(null);
  const [selectedLeadForContext, setSelectedLeadForContext] = useState<Lead | null>(mockLeads[0] || null);

  // Module Titles
  const moduleTitles: Record<string, string> = {
    operational: 'Centro Operativo Multiactor',
    dashboard: 'Dashboard Principal',
    lots: 'Masterplan & Lotes',
    leads: 'CRM Leads & Preventa',
    quotes: 'Cotizador & Simulación',
    reservations: 'Señas & Reservas',
    sales: 'Ventas & Contratos',
    payments: 'Cobranzas & Mora',
    legal: 'Escrituración & Legales',
    works: 'Avance de Obras',
    campaigns: 'Campañas de Marketing',
    automations: 'Reglas de Automatización',
    developments: 'Ficha del Desarrollo',
  };

  // ENGINE HANDLER: Process domain event and update engine state
  const handleTriggerDomainEvent = (type: DomainEventType, payload?: Record<string, unknown>) => {
    const newEvent: DomainEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type,
      entityType: (payload?.entityType as any) || 'LOT',
      entityId: (payload?.entityId as string) || 'A-4',
      lotId: (payload?.lotId as string) || 'lot-a4',
      lotNumber: (payload?.lotNumber as string) || 'A-4',
      customerId: (payload?.customerId as string) || 'lead-1',
      customerName: (payload?.customerName as string) || 'Cliente Modelo',
      actorRole: userRole,
      actorUserName: 'Usuario Activo',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      payload: payload || {}
    };

    const currentState = {
      rules: autoRules,
      executions: autoExecutions,
      notifications: autoNotifications,
      alerts: autoAlerts,
      tasks: autoTasks,
      approvals: autoApprovals,
      auditEvents: autoAuditEvents
    };

    const { state: nextState } = processDomainEvent(newEvent, currentState, { userId: 'user-1', userName: 'Usuario Activo', userRole });

    setAutoRules(nextState.rules);
    setAutoExecutions(nextState.executions);
    setAutoNotifications(nextState.notifications);
    setAutoAlerts(nextState.alerts);
    setAutoTasks(nextState.tasks);
    setAutoApprovals(nextState.approvals);
    setAutoAuditEvents(nextState.auditEvents);
  };

  // TASK COMPLETION
  const handleCompleteSystemTask = (taskId: string) => {
    setAutoTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'COMPLETADA', completedAt: 'Ahora' } : t))
    );
    setAutoAuditEvents(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userId: 'user-1',
        userRole,
        userName: 'Usuario Activo',
        action: 'Tarea Completada',
        entityType: 'TASK',
        entityId: taskId,
        reason: 'Marcada como completada desde el Centro Operativo'
      },
      ...prev
    ]);
  };

  // ALERT RESOLUTION
  const handleResolveAlert = (alertId: string, note: string) => {
    setAutoAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'RESUELTA' } : a))
    );
    setAutoAuditEvents(prev => [
      {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        userId: 'user-1',
        userRole,
        userName: 'Usuario Activo',
        action: 'Alerta Resuelta',
        entityType: 'ALERT',
        entityId: alertId,
        reason: note || 'Alerta gestionada y resuelta'
      },
      ...prev
    ]);
  };

  // APPROVAL HANDLERS
  const handleApproveDecision = (approvalId: string, note: string) => {
    const currentState = {
      rules: autoRules,
      executions: autoExecutions,
      notifications: autoNotifications,
      alerts: autoAlerts,
      tasks: autoTasks,
      approvals: autoApprovals,
      auditEvents: autoAuditEvents
    };

    const nextState = approveHumanDecision(approvalId, 'user-1', 'Usuario Activo', userRole, note, currentState);

    setAutoExecutions(nextState.executions);
    setAutoNotifications(nextState.notifications);
    setAutoAlerts(nextState.alerts);
    setAutoTasks(nextState.tasks);
    setAutoApprovals(nextState.approvals);
    setAutoAuditEvents(nextState.auditEvents);
  };

  const handleRejectDecision = (approvalId: string, note: string) => {
    const currentState = {
      rules: autoRules,
      executions: autoExecutions,
      notifications: autoNotifications,
      alerts: autoAlerts,
      tasks: autoTasks,
      approvals: autoApprovals,
      auditEvents: autoAuditEvents
    };

    const nextState = rejectHumanDecision(approvalId, 'user-1', 'Usuario Activo', userRole, note, currentState);

    setAutoExecutions(nextState.executions);
    setAutoNotifications(nextState.notifications);
    setAutoAlerts(nextState.alerts);
    setAutoTasks(nextState.tasks);
    setAutoApprovals(nextState.approvals);
    setAutoAuditEvents(nextState.auditEvents);
  };

  // RULE MANAGEMENT HANDLERS
  const handleToggleRuleStatus = (ruleId: string) => {
    setAutoRules(prev =>
      prev.map(r =>
        r.id === ruleId ? { ...r, status: r.status === 'ACTIVA' ? 'PAUSADA' : 'ACTIVA' } : r
      )
    );
  };

  const handleDuplicateRule = (ruleId: string) => {
    const found = autoRules.find(r => r.id === ruleId);
    if (!found) return;
    const duplicated: AutomationRule = {
      ...found,
      id: `rule-${Date.now()}`,
      name: `${found.name} (Copia)`,
      executionsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAutoRules(prev => [duplicated, ...prev]);
  };

  const handleCreateRule = (newRule: Partial<AutomationRule>) => {
    const ruleObj: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name || 'Nueva Regla',
      description: newRule.description || '',
      category: newRule.category || 'COMERCIAL',
      triggerEvent: newRule.triggerEvent || 'LeadCreated',
      conditions: newRule.conditions || [],
      actions: newRule.actions || [],
      status: 'ACTIVA',
      requiresHumanApproval: !!newRule.requiresHumanApproval,
      priority: newRule.priority || 'MEDIA',
      responsibleRole: newRule.responsibleRole || 'VENDEDOR',
      executionsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAutoRules(prev => [ruleObj, ...prev]);
  };

  const handleResetDemoData = () => {
    setLots(mockLots);
    setLeads(mockLeads);
    setHolds(mockHolds);
    setReservations(mockReservations);
    setDeposits(mockDeposits);
    setIntents(mockReservationIntents);
    setPaymentPlans(mockPaymentPlans);
    setSellers(mockSellers);
    setCampaigns(mockCampaigns);
    setActivities(mockActivities);
    setTasks(mockTasks);
    setVisits(mockVisits);
    setDevelopments(mockDevelopments);
    setQuotes(mockQuotes);
    setNotaryOffices(mockNotaryOffices);
    setSurveyors(mockSurveyors);
    setDocuments(mockDocuments);
    setLegalProcesses(mockLegalProcesses);
    setAppointments(mockSigningAppointments);
    setSurveys(mockSurveys);
    setPermits(mockPermits);
    setTimelineEvents(mockLotTimelineEvents);
    setSales(mockSales);

    setAutoRules(mockAutomationRules);
    setAutoExecutions(mockAutomationExecutions);
    setAutoNotifications(mockNotifications);
    setAutoAlerts(mockAlerts);
    setAutoTasks(mockSystemTasks);
    setAutoApprovals(mockApprovalRequests);
    setAutoAuditEvents(mockAuditEvents);

    setActiveModule('operational');
  };

  // WALKTHROUGH DEMO TRIGGER HANDLERS
  const handleRunFullLifecycleDemo = () => {
    handleTriggerDomainEvent('LeadUncontacted', { lotNumber: 'A-4', customerName: 'Roberto Gómez' });
    handleTriggerDomainEvent('QuoteAccepted', { lotNumber: 'A-4', amountUSD: 45000 });
    handleTriggerDomainEvent('DepositReported', { lotNumber: 'A-4', amountUSD: 1500 });
    handleTriggerDomainEvent('InstallmentOverdue', { lotNumber: 'B-2', daysOverdue: 15 });
    handleTriggerDomainEvent('BalancePaidOff', { lotNumber: 'C-1', customerName: 'Analía Rossi' });
    handleTriggerDomainEvent('LotDelivered', { lotNumber: 'D-5', customerName: 'Gabriel Paz' });
  };

  const handleRunEscalationDemo = () => {
    handleTriggerDomainEvent('InstallmentOverdue', { lotNumber: 'B-2', daysOverdue: 35, customerName: 'Mariano Silva' });
  };

  // Phase 6 Handlers
  const handleUpdateLegalProcess = (processId: string, updates: Partial<LegalProcess>) => {
    setLegalProcesses(prev =>
      prev.map(p => (p.id === processId ? { ...p, ...updates } : p))
    );
  };

  const handleStartLegalProcess = (lotId: string, buyerName?: string) => {
    const existing = legalProcesses.find(p => p.lotId === lotId);
    if (existing) return;
    const lot = lots.find(l => l.id === lotId);
    const newProcess: LegalProcess = {
      id: `proc-${Date.now()}`,
      lotId,
      lotNumber: lot?.number || 'A-1',
      customerName: buyerName || 'Comprador Modelo',
      type: 'ESCRITURACION',
      status: 'EN_PREPARACION',
      currentStep: 'Iniciado el proceso legal',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setLegalProcesses(prev => [newProcess, ...prev]);
  };

  const handleUpdateDocumentStatus = (docId: string, status: DocumentStatus) => {
    setDocuments(prev =>
      prev.map(d => (d.id === docId ? { ...d, status, reviewedAt: new Date().toISOString().split('T')[0] } : d))
    );
  };

  const handleUploadDocument = (doc: Partial<LotDocument>) => {
    const createdDoc: LotDocument = {
      id: `doc-${Date.now()}`,
      ownerType: 'LOT',
      ownerId: doc.lotId || 'lot-a1',
      type: 'BOLETO',
      title: doc.title || 'Nuevo Documento',
      fileType: 'pdf',
      fileName: doc.fileName || 'documento.pdf',
      status: 'EN_REVISION',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [createdDoc, ...prev]);
  };

  const handleScheduleSigning = (appointmentData: Partial<DeedSigningAppointment>) => {
    const newApp: DeedSigningAppointment = {
      id: `app-${Date.now()}`,
      legalProcessId: 'proc-1',
      lotId: appointmentData.lotId || 'lot-a1',
      lotNumber: 'A-1',
      customerName: 'Comprador Modelo',
      notaryOfficeId: appointmentData.notaryOfficeId || 'notary-1',
      notaryName: 'Escribanía Bunge',
      scheduledDate: appointmentData.scheduledDate || '2025-12-15',
      scheduledTime: appointmentData.scheduledTime || '10:00',
      location: appointmentData.location || 'Escribanía Bunge, CABA',
      representatives: ['Apoderado Nexo'],
      requiredDocuments: ['DNI', 'Boleto'],
      status: 'CONFIRMADA',
      notes: appointmentData.notes || '',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newApp, ...prev]);
  };

  const handleCompleteSigning = (appointmentId: string) => {
    setAppointments(prev =>
      prev.map(a => (a.id === appointmentId ? { ...a, status: 'REALIZADA' } : a))
    );
  };

  // Phase 4 Reservation Handlers
  const handleCreateHold = (data: { lotId: string; leadId: string; durationHours: number; reason: LotHoldReason; notes?: string }) => {
    const lot = lots.find(l => l.id === data.lotId);
    const lead = leads.find(l => l.id === data.leadId);
    if (!lot || !lead) return;

    const newHold: LotHold = {
      id: `hold-${Date.now()}`,
      lotId: lot.id,
      lotNumber: lot.number,
      block: lot.block || 'A',
      leadId: lead.id,
      leadName: lead.fullName,
      sellerId: lead.assignedSellerId || 'seller-1',
      agentName: lead.assignedAgent || 'Gonzalo Rossi',
      sellerName: lead.assignedAgent || 'Gonzalo Rossi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startsAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + data.durationHours * 3600 * 1000).toISOString(),
      status: 'ACTIVO',
      reason: data.reason,
      extensionCount: 0,
      notes: data.notes
    };

    setHolds(prev => [newHold, ...prev]);
    setLots(prev => prev.map(l => (l.id === lot.id ? { ...l, status: 'BLOQUEADO' } : l)));

    // Trigger Phase 8 Domain Event
    handleTriggerDomainEvent('LeadUncontacted', { lotId: lot.id, lotNumber: lot.number, customerName: lead.fullName });
  };

  const handleRegisterPromise = (params: any) => {
    const hold = holds.find(h => h.id === params.holdId);
    if (!hold) return;

    const newIntent: ReservationIntent = {
      id: `intent-${Date.now()}`,
      holdId: hold.id,
      lotHoldId: hold.id,
      lotId: hold.lotId,
      leadId: hold.leadId,
      leadName: hold.leadName,
      quoteId: 'q-1',
      quoteOptionId: 'qo-1',
      sellerId: hold.sellerId,
      expectedDepositAmount: params.promisedAmount || params.expectedAmountUSD || 5000,
      currency: 'USD',
      status: 'PENDIENTE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: params.notes
    };

    setIntents(prev => [newIntent, ...prev]);
  };

  const handleReportDeposit = (params: any) => {
    const hold = holds.find(h => h.id === params.holdId);
    if (!hold) return;

    const amount = params.amount || params.amountUSD || 5000;

    const newDeposit: Deposit = {
      id: `dep-${Date.now()}`,
      reservationIntentId: 'intent-1',
      holdId: hold.id,
      lotHoldId: hold.id,
      quoteId: 'q-1',
      lotId: hold.lotId,
      lotNumber: hold.lotNumber,
      leadId: hold.leadId,
      leadName: hold.leadName,
      amount,
      currency: 'USD',
      paymentMethod: params.paymentMethod || 'TRANSFERENCIA',
      receiptPreviewUrl: params.receiptPreviewUrl || 'receipt_placeholder.png',
      receiptReference: params.receiptReference || 'REF-12345',
      status: 'REPORTADA',
      notes: params.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDeposits(prev => [newDeposit, ...prev]);
    setHolds(prev => prev.map(h => (h.id === hold.id ? { ...h, status: 'SEÑA_REPORTADA' } : h)));

    // Trigger Phase 8 Domain Event
    handleTriggerDomainEvent('DepositReported', { lotId: hold.lotId, lotNumber: hold.lotNumber, customerName: hold.leadName, amountUSD: amount });
  };

  const handleValidateDeposit = (depositId: string, notes?: string) => {
    const dep = deposits.find(d => d.id === depositId);
    if (!dep) return;

    setDeposits(prev =>
      prev.map(d =>
        d.id === depositId
          ? {
              ...d,
              status: 'VALIDADA',
              validatedAt: new Date().toISOString(),
              validatedBy: 'TESORERIA',
              notes: notes || d.notes
            }
          : d
      )
    );

    setHolds(prev => prev.map(h => (h.id === dep.holdId ? { ...h, status: 'CONVERTIDO' } : h)));

    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      reservationNumber: `RES-${Date.now().toString().slice(-4)}`,
      lotId: dep.lotId,
      lotNumber: dep.lotNumber || 'A-1',
      block: dep.block || 'A',
      leadId: dep.leadId,
      leadName: dep.leadName || 'Cliente',
      agentName: 'Gonzalo Rossi',
      agreedPrice: 50000,
      currency: 'USD',
      depositAmount: dep.amount,
      depositAmountUSD: dep.amount,
      depositId: dep.id,
      reservedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      status: 'CONFIRMADA',
      checklist: createDefaultChecklist(),
      notes: 'Reserva confirmada tras validación de seña en Tesorería',
      createdAt: new Date().toISOString()
    };

    setReservations(prev => [newReservation, ...prev]);
    setLots(prev => prev.map(l => (l.id === dep.lotId ? { ...l, status: 'RESERVADO' } : l)));
  };

  const handleObserveDeposit = (depositId: string, notes: string) => {
    setDeposits(prev =>
      prev.map(d => (d.id === depositId ? { ...d, status: 'OBSERVADA', notes } : d))
    );
  };

  const handleRejectDeposit = (depositId: string, reason: DepositRejectionReason, notes?: string) => {
    const dep = deposits.find(d => d.id === depositId);
    if (!dep) return;

    setDeposits(prev =>
      prev.map(d =>
        d.id === depositId
          ? {
              ...d,
              status: 'RECHAZADA',
              rejectionReason: reason,
              notes: notes || d.notes
            }
          : d
      )
    );

    setHolds(prev => prev.map(h => (h.id === dep.holdId ? { ...h, status: 'ACTIVO' } : h)));
  };

  const handleReleaseHold = (holdId: string, reason: LotHoldReleaseReason) => {
    const hold = holds.find(h => h.id === holdId);
    if (!hold) return;

    setHolds(prev =>
      prev.map(h => (h.id === holdId ? { ...h, status: 'LIBERADO', releaseReason: reason } : h))
    );

    setLots(prev => prev.map(l => (l.id === hold.lotId ? { ...l, status: 'DISPONIBLE' } : l)));
  };

  const handleToggleChecklist = (reservationId: string, itemId: string) => {
    setReservations(prev =>
      prev.map(r => {
        if (r.id !== reservationId) return r;
        if (!r.checklist) return r;
        return {
          ...r,
          checklist: r.checklist.map(c =>
            c.id === itemId ? { ...c, completed: !c.completed, completedAt: !c.completed ? new Date().toISOString() : undefined } : c
          )
        };
      })
    );
  };

  const handleCancelReservation = (
    paramsOrId: { reservationId: string; reason: ReservationCancellationReason; refundDeposit?: boolean; notes?: string } | string,
    reasonArg?: ReservationCancellationReason,
    notesArg?: string
  ) => {
    const reservationId = typeof paramsOrId === 'string' ? paramsOrId : paramsOrId.reservationId;
    const reason = typeof paramsOrId === 'string' ? reasonArg! : paramsOrId.reason;
    const notes = typeof paramsOrId === 'string' ? notesArg : paramsOrId.notes;

    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;

    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: 'CANCELADA', cancellationReason: reason, notes } : r))
    );

    setLots(prev => prev.map(l => (l.id === res.lotId ? { ...l, status: 'DISPONIBLE' } : l)));
  };

  const handleChangeLot = (
    paramsOrId: { entityId: string; entityType?: 'HOLD' | 'RESERVATION'; newLotId: string; notes?: string } | string,
    newLotIdArg?: string
  ) => {
    const reservationId = typeof paramsOrId === 'string' ? paramsOrId : paramsOrId.entityId;
    const newLotId = typeof paramsOrId === 'string' ? newLotIdArg! : paramsOrId.newLotId;

    const newLot = lots.find(l => l.id === newLotId);
    if (!newLot) return;

    setReservations(prev =>
      prev.map(r => {
        if (r.id !== reservationId) return r;
        return {
          ...r,
          lotId: newLot.id,
          lotNumber: newLot.number,
          notes: `${r.notes || ''} [Cambio de lote a ${newLot.number}]`
        };
      })
    );
  };

  // Other Core Handlers
  const handleToggleFavorite = (lotOrId: Lot | string) => {
    const lotId = typeof lotOrId === 'string' ? lotOrId : lotOrId.id;
    setFavoriteLotIds(prev =>
      prev.includes(lotId) ? prev.filter(id => id !== lotId) : [...prev, lotId]
    );
  };

  const handleAssociateLotWithLead = (
    lotOrId: Lot | string,
    leadId?: string
  ) => {
    const lotId = typeof lotOrId === 'string' ? lotOrId : lotOrId.id;
    const targetLeadId = leadId || selectedLeadForContext?.id;
    if (!targetLeadId) return;
    setLeads(prev =>
      prev.map(l =>
        l.id === targetLeadId
          ? { ...l, lotInterestIds: Array.from(new Set([...(l.lotInterestIds || []), lotId])) }
          : l
      )
    );
  };

  const handleCreateLead = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
  };

  const handleUpdateLead = (leadOrId: Lead | string, updates?: Partial<Lead>) => {
    if (typeof leadOrId === 'string') {
      if (!updates) return;
      setLeads(prev => prev.map(l => (l.id === leadOrId ? { ...l, ...updates } : l)));
    } else {
      setLeads(prev => prev.map(l => (l.id === leadOrId.id ? { ...l, ...leadOrId } : l)));
    }
  };

  const handleAddActivity = (act: ActivityItem) => {
    setActivities(prev => [act, ...prev]);
  };

  const handleAddVisit = (vst: VisitItem) => {
    setVisits(prev => [vst, ...prev]);
  };

  const handleMarkLoss = (leadId: string, reason: LeadLossReason, notes?: string) => {
    setLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, status: 'PERDIDO', notes: notes || '' } : l))
    );
  };

  const handleSaveQuote = (q: Quote) => {
    setQuotes(prev => [q, ...prev]);
  };

  const handleUpdateQuoteStatus = (quoteId: string, status: Quote['status']) => {
    setQuotes(prev => prev.map(q => (q.id === quoteId ? { ...q, status } : q)));
    if (status === 'ACEPTADA') {
      const q = quotes.find(item => item.id === quoteId);
      if (q) {
        handleTriggerDomainEvent('QuoteAccepted', { lotId: q.options[0]?.lotId || 'lot-a1', amountUSD: q.options[0]?.offeredPrice || 45000 });
      }
    }
  };

  const handleLogPayment = (paymentData: any) => {
    // Payment logging logic
  };

  // Unread Notification Count
  const unreadCount = autoNotifications.filter(n => !n.readAt).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 pb-20">
      {/* Toast notice when an unincluded module is triggered */}
      {disabledModuleNotice && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 border border-amber-500/40 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-top-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <strong className="text-amber-300 block">Módulo Oculto en Presentación</strong>
            <span className="text-slate-300">Este módulo no está incluido en la configuración de demostración actual.</span>
          </div>
          <button onClick={() => setDisabledModuleNotice(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Mobile Header */}
      <Header
        activeModuleTitle={moduleTitles[activeModule] || 'Nexo Desarrollos'}
        userRole={userRole}
        unreadCount={unreadCount}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenOperationalCenter={() => handleSelectModule('operational')}
        onResetDemo={handleResetDemoData}
        onOpenPresenterConfig={() => setIsPresenterConfigOpen(true)}
        activePreset={visibilityState.preset}
        moduleVisibility={visibilityState.config}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-3 sm:px-4 py-4">
        {activeModule === 'operational' && (
          <OperationalCenterView
            userRole={userRole}
            onSelectRole={setUserRole}
            tasks={autoTasks}
            alerts={autoAlerts}
            approvals={autoApprovals}
            notifications={autoNotifications}
            auditEvents={autoAuditEvents}
            rules={autoRules}
            onCompleteTask={handleCompleteSystemTask}
            onResolveAlert={handleResolveAlert}
            onApproveDecision={handleApproveDecision}
            onRejectDecision={handleRejectDecision}
            onNavigateModule={(mod) => handleSelectModule(mod)}
            onTriggerDemoWalkthrough={() => setIsMultiActorWalkthroughOpen(true)}
            onTriggerEscalationDemo={() => setIsEscalationWalkthroughOpen(true)}
            onResetDemoData={handleResetDemoData}
          />
        )}

        {activeModule === 'dashboard' && (
          <DashboardModule
            userRole={userRole}
            onSelectRole={setUserRole}
            lots={lots}
            leads={leads}
            sales={sales}
            paymentPlans={paymentPlans}
            legalProcesses={legalProcesses}
            alerts={autoAlerts}
            sellers={sellers}
            campaigns={campaigns}
            quotes={quotes}
            holds={holds}
            reservations={reservations}
            deposits={deposits}
            documents={documents}
            developments={developments}
            commissions={[]}
            autoRules={autoRules}
            autoExecutions={autoExecutions}
            autoTasks={autoTasks}
            onNavigate={(mod) => handleSelectModule(mod)}
            onOpenNewLead={() => setIsNewLeadOpen(true)}
            onOpenHoldModal={() => setIsNewHoldOpen(true)}
            moduleVisibility={visibilityState.config}
          />
        )}

        {activeModule === 'reports' && (
          <ReportsModule
            lots={lots}
            leads={leads}
            sales={sales}
            paymentPlans={paymentPlans}
            legalProcesses={legalProcesses}
            sellers={sellers}
            campaigns={campaigns}
            quotes={quotes}
            developments={developments}
            commissions={[]}
          />
        )}

        {activeModule === 'lots' && (
          <LotsModule
            lots={lots}
            leads={leads}
            developments={developments}
            favoriteLotIds={favoriteLotIds}
            selectedLead={selectedLeadForContext}
            onSelectLot={(lot) => setSelectedLotForDetail(lot)}
            onToggleFavorite={handleToggleFavorite}
            onAssociateLotWithLead={handleAssociateLotWithLead}
            onOpenHoldModalForLot={(lot) => {
              setSelectedLotForDetail(lot);
              setIsNewHoldOpen(true);
            }}
            onOpenQuoteModalForLot={(lot) => {
              setQuoteLot(lot);
              setActiveModule('quotes');
            }}
          />
        )}

        {activeModule === 'leads' && (
          <LeadsModule
            leads={leads}
            lots={lots}
            campaigns={campaigns}
            sellers={sellers}
            activities={activities}
            tasks={tasks}
            visits={visits}
            onAddLead={handleCreateLead}
            onUpdateLead={handleUpdateLead}
            onAddActivity={handleAddActivity}
            onAddVisit={handleAddVisit}
            onMarkLoss={handleMarkLoss}
            onOpenNewLeadModal={() => setIsNewLeadOpen(true)}
          />
        )}

        {activeModule === 'quotes' && (
          <QuotesModule
            initialLot={quoteLot}
            lots={lots}
            leads={leads}
            quotes={quotes}
            onSaveQuote={handleSaveQuote}
            onUpdateQuoteStatus={handleUpdateQuoteStatus}
          />
        )}

        {activeModule === 'reservations' && (
          <ReservationsModule
            holds={holds}
            reservations={reservations}
            deposits={deposits}
            intents={intents}
            lots={lots}
            leads={leads}
            quotes={quotes}
            developments={developments}
            userRole={userRole}
            onChangeUserRole={setUserRole}
            onCreateHold={handleCreateHold}
            onRegisterPromise={handleRegisterPromise}
            onReportDeposit={handleReportDeposit}
            onValidateDeposit={handleValidateDeposit}
            onObserveDeposit={handleObserveDeposit}
            onRejectDeposit={handleRejectDeposit}
            onReleaseHold={handleReleaseHold}
            onToggleChecklist={handleToggleChecklist}
            onCancelReservation={handleCancelReservation}
            onChangeLot={handleChangeLot}
            onCreateLot={(newLot) => setLots((prev) => [newLot, ...prev])}
            onCreateDevelopment={(newDev) => setDevelopments((prev) => [newDev, ...prev])}
            onPrepareSale={(res) => setActiveModule('sales')}
          />
        )}

        {activeModule === 'sales' && <SalesModule />}

        {activeModule === 'payments' && (
          <PaymentsModule
            paymentPlans={paymentPlans}
            onLogPayment={handleLogPayment}
          />
        )}

        {activeModule === 'legal' && (
          <LegalModule
            lots={lots}
            sales={sales}
            paymentPlans={paymentPlans}
            documents={documents}
            legalProcesses={legalProcesses}
            notaryOffices={notaryOffices}
            surveyors={surveyors}
            surveys={surveys}
            permits={permits}
            appointments={appointments}
            tasks={tasks}
            timelineEvents={timelineEvents}
            onUpdateLegalProcess={handleUpdateLegalProcess}
            onStartLegalProcess={handleStartLegalProcess}
            onUpdateDocumentStatus={handleUpdateDocumentStatus}
            onScheduleSigning={handleScheduleSigning}
            onCompleteSigning={handleCompleteSigning}
            onCreateTask={(task) => setTasks(prev => [task as TaskItem, ...prev])}
            onOpenPaymentsModule={(planId) => setActiveModule('payments')}
          />
        )}

        {activeModule === 'works' && <WorksModule />}

        {activeModule === 'campaigns' && (
          <CampaignsModule
            campaigns={campaigns}
            onCreateCampaign={(newCamp) => setCampaigns((prev) => [newCamp, ...prev])}
          />
        )}

        {activeModule === 'automations' && (
          <AutomationsModule
            rules={autoRules}
            executions={autoExecutions}
            onToggleRuleStatus={handleToggleRuleStatus}
            onDuplicateRule={handleDuplicateRule}
            onCreateRule={handleCreateRule}
            onTriggerEvent={handleTriggerDomainEvent}
            onOpenMultiActorWalkthrough={() => setIsMultiActorWalkthroughOpen(true)}
            onOpenEscalationWalkthrough={() => setIsEscalationWalkthroughOpen(true)}
          />
        )}

        {activeModule === 'developments' && <DevelopmentsModule />}
      </main>

      {/* Bottom Fixed Navigation Bar */}
      <BottomNav
        activeModule={activeModule}
        onSelectModule={(mod) => handleSelectModule(mod)}
        onOpenMenu={() => setIsMenuOpen(true)}
        activePreset={visibilityState.preset}
        moduleVisibility={visibilityState.config}
      />

      {/* Drawer Menu */}
      <ModuleDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeModule={activeModule}
        onSelectModule={(mod) => handleSelectModule(mod)}
        onResetDemo={handleResetDemoData}
        onOpenPresenterConfig={() => setIsPresenterConfigOpen(true)}
        moduleVisibility={visibilityState.config}
      />

      {/* Presenter Config Modal */}
      <PresenterConfigModal
        isOpen={isPresenterConfigOpen}
        onClose={() => setIsPresenterConfigOpen(false)}
        config={visibilityState.config}
        preset={visibilityState.preset}
        onUpdateConfig={handleUpdateVisibilityConfig}
        onResetPresentation={handleResetPresentation}
      />

      {/* Walkthrough Modals */}
      <MultiActorWalkthroughModal
        isOpen={isMultiActorWalkthroughOpen}
        onClose={() => setIsMultiActorWalkthroughOpen(false)}
        onExecuteFullLifecycleDemo={handleRunFullLifecycleDemo}
      />

      <EscalationWalkthroughModal
        isOpen={isEscalationWalkthroughOpen}
        onClose={() => setIsEscalationWalkthroughOpen(false)}
        onExecuteEscalationDemo={handleRunEscalationDemo}
      />

      {/* Modals & Bottom Sheets */}
      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onSubmitLead={(leadData) => {
          const created: Lead = {
            id: `lead-${Date.now()}`,
            firstName: leadData.fullName?.split(' ')[0] || 'Nuevo',
            lastName: leadData.fullName?.split(' ').slice(1).join(' ') || 'Lead',
            fullName: leadData.fullName || 'Nuevo Lead',
            email: leadData.email || 'lead@ejemplo.com',
            phone: leadData.phone || '+54 11 0000 0000',
            source: (leadData.channel as any) || 'Meta Ads',
            channel: leadData.channel || 'Meta Ads',
            developmentInterestIds: ['dev-001'],
            lotInterestIds: [],
            assignedSellerId: 'seller-1',
            assignedAgent: 'Gonzalo Rossi',
            status: 'NUEVO',
            qualification: 'TIBIO',
            priority: 'ALTA',
            score: 70,
            notes: leadData.notes || '',
            budgetUSD: leadData.budgetUSD || 30000,
            lastActivityAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ['Meta Ads', 'Carga Directa']
          };
          handleCreateLead(created);
        }}
      />

      <NewHoldModal
        isOpen={isNewHoldOpen}
        onClose={() => setIsNewHoldOpen(false)}
        lots={lots}
        leads={leads}
        preselectedLot={selectedLotForDetail}
        onSubmitHold={(holdData) => {
          handleCreateHold({
            lotId: holdData.lotId,
            leadId: holdData.leadId,
            durationHours: 24,
            reason: 'COTIZACION_ACEPTADA',
            notes: holdData.notes,
          });
        }}
      />

      <LotDetailSheet
        lot={selectedLotForDetail}
        isOpen={!!selectedLotForDetail}
        onClose={() => setSelectedLotForDetail(null)}
        isFavorite={selectedLotForDetail ? favoriteLotIds.includes(selectedLotForDetail.id) : false}
        selectedLead={selectedLeadForContext}
        onToggleFavorite={handleToggleFavorite}
        onAssociateLead={(lot) => handleAssociateLotWithLead(lot)}
        onOpen360View={(lot) => setSelected360Lot(lot)}
        onSimulateQuote={(lot) => {
          setQuoteLot(lot);
          setActiveModule('quotes');
        }}
        onHoldLot={(lot) => {
          setIsNewHoldOpen(true);
        }}
        onReserveLot={(lot) => {
          setActiveModule('reservations');
        }}
      />

      <Lot360ViewModal
        isOpen={!!selected360Lot}
        onClose={() => setSelected360Lot(null)}
        lot={selected360Lot}
        sale={sales.find(s => s.lotId === selected360Lot?.id)}
        paymentPlan={paymentPlans.find(p => p.lotId === selected360Lot?.id)}
        documents={documents.filter(d => d.lotId === selected360Lot?.id)}
        legalProcess={legalProcesses.find(p => p.lotId === selected360Lot?.id)}
        surveys={surveys.filter(s => s.lotId === selected360Lot?.id)}
        permits={permits}
        notaryOffices={notaryOffices}
        appointments={appointments.filter(a => a.lotId === selected360Lot?.id)}
        timelineEvents={timelineEvents.filter(t => t.lotId === selected360Lot?.id)}
        tasks={tasks}
        onUpdateDocumentStatus={handleUpdateDocumentStatus}
        onUploadDocument={handleUploadDocument}
        onUpdateLegalProcess={handleUpdateLegalProcess}
        onStartLegalProcess={handleStartLegalProcess}
        onScheduleSigning={handleScheduleSigning}
        onCompleteSigning={handleCompleteSigning}
        onCreateTask={(task) => setTasks(prev => [task as TaskItem, ...prev])}
        onOpenPaymentsModule={(planId) => {
          setSelected360Lot(null);
          setActiveModule('payments');
        }}
      />

      <NotificationsSheet
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={autoNotifications}
        userRole={userRole}
        onMarkAllAsRead={() => setAutoNotifications(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })))}
        onMarkAsRead={(id) => setAutoNotifications(prev => prev.map(n => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)))}
        onNavigate={(mod) => setActiveModule(mod)}
      />
    </div>
  );
}
