import React, { useState } from 'react';
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
  DocumentStatus
} from './types';
import { createDefaultChecklist } from './domain/reservationDomain';

// Components & Layout
import { Header } from './components/navigation/Header';
import { BottomNav } from './components/navigation/BottomNav';
import { ModuleDrawer } from './components/navigation/ModuleDrawer';

// Modules
import { DashboardModule } from './modules/dashboard/DashboardModule';
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
  const [activeModule, setActiveModule] = useState<string>('dashboard');
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

  const [favoriteLotIds, setFavoriteLotIds] = useState<string[]>(['lot-a1', 'lot-b2']);

  // Modal selections
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isNewHoldOpen, setIsNewHoldOpen] = useState(false);
  const [selectedLotForDetail, setSelectedLotForDetail] = useState<Lot | null>(null);
  const [selected360Lot, setSelected360Lot] = useState<Lot | null>(null);
  const [quoteLot, setQuoteLot] = useState<Lot | null>(null);
  const [selectedLeadForContext, setSelectedLeadForContext] = useState<Lead | null>(mockLeads[0] || null);

  // Module Titles
  const moduleTitles: Record<string, string> = {
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

  // Phase 6 Handlers
  const handleUpdateLegalProcess = (processId: string, updates: Partial<LegalProcess>) => {
    setLegalProcesses(prev => prev.map(p => p.id === processId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const handleStartLegalProcess = (lotId: string) => {
    const lotObj = lots.find(l => l.id === lotId);
    if (!lotObj) return;

    const newProc: LegalProcess = {
      id: `leg-${Date.now()}`,
      lotId: lotObj.id,
      lotNumber: lotObj.number,
      customerName: 'Titular Registrado',
      type: 'ESCRITURACION',
      status: 'EXPEDIENTE_COMPLETO',
      stage: 'PREPARANDO_EXPEDIENTE',
      assignedLegalUserId: 'usr-legal-1',
      assignedLegalUserName: 'Dra. María Elena San Martín',
      notaryOfficeId: 'notary-01',
      notaryOfficeName: 'Escribanía Bunge & Asociados',
      assignedNotary: 'Escribanía Bunge & Asociados',
      startedAt: new Date().toISOString().split('T')[0],
      targetDate: '2026-10-30',
      estimatedCompletion: '2026-10-30',
      currentStep: 'Expediente iniciado — Documentación en revisión por escribanía',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLegalProcesses(prev => [newProc, ...prev]);

    setTimelineEvents(prev => [
      {
        id: `evt-${Date.now()}`,
        lotId: lotObj.id,
        lotNumber: lotObj.number,
        category: 'LEGAL',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        title: 'Tramitación de Escritura Iniciada',
        description: 'Se dió inicio al proceso escriturario con Escribanía Bunge & Asociados.',
        authorName: 'Dra. María Elena San Martín',
      },
      ...prev,
    ]);
  };

  const handleUpdateDocumentStatus = (docId: string, status: DocumentStatus) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status, reviewedAt: new Date().toISOString() } : d));
  };

  const handleUploadDocument = (doc: Partial<LotDocument>) => {
    const createdDoc: LotDocument = {
      id: `doc-${Date.now()}`,
      ownerType: doc.ownerType || 'LOT',
      ownerId: doc.ownerId || doc.lotId || 'lot-1',
      lotId: doc.lotId || 'lot-1',
      lotNumber: doc.lotNumber || 'A-1',
      type: doc.type || 'DNI',
      title: doc.title || 'Documento',
      status: doc.status || 'EN_REVISION',
      fileName: doc.fileName || 'archivo.pdf',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDocuments(prev => [createdDoc, ...prev]);
  };

  const handleScheduleSigning = (params: Partial<DeedSigningAppointment>) => {
    const newApp: DeedSigningAppointment = {
      id: `sign-${Date.now()}`,
      legalProcessId: params.legalProcessId || 'leg-1',
      lotId: params.lotId || 'lot-a4',
      lotNumber: params.lotNumber || 'A-4',
      customerName: params.customerName || 'Comprador',
      notaryOfficeId: params.notaryOfficeId || 'notary-01',
      notaryName: params.notaryName || 'Escribanía Bunge & Asociados',
      scheduledDate: params.scheduledDate || '2026-08-25',
      scheduledTime: params.scheduledTime || '11:00 hs',
      location: params.location || 'Escribanía',
      representatives: params.representatives || ['Escribano', 'Fiduciario'],
      requiredDocuments: params.requiredDocuments || ['DNI', 'Boleto'],
      status: 'CONFIRMADA',
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newApp, ...prev]);

    if (params.legalProcessId) {
      setLegalProcesses(prev => prev.map(p => p.id === params.legalProcessId ? {
        ...p,
        status: 'LISTA_PARA_FIRMA',
        stage: 'ESCRITURA_FIRMA',
        currentStep: `Turno de firma agendado para el ${newApp.scheduledDate} a las ${newApp.scheduledTime}`
      } : p));
    }
  };

  const handleCompleteSigning = (appointmentId: string) => {
    const app = appointments.find(a => a.id === appointmentId);
    if (!app) return;

    setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'REALIZADA' } : a));

    if (app.legalProcessId) {
      setLegalProcesses(prev => prev.map(p => p.id === app.legalProcessId ? {
        ...p,
        status: 'FIRMADA',
        stage: 'ESCRITURA_INSCRIPCION',
        currentStep: 'Escritura firmada. En proceso de inscripción registral.'
      } : p));
    }
  };
  const handleSaveQuote = (newQuote: Quote) => {
    setQuotes(prev => [newQuote, ...prev]);
  };

  const handleUpdateQuoteStatus = (quoteId: string, status: Quote['status'], feedbackNotes?: string) => {
    setQuotes(prev => prev.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          status,
          notes: feedbackNotes ? `${q.notes || ''} [Feedback: ${feedbackNotes}]` : q.notes
        };
      }
      return q;
    }));
  };

  const handleToggleFavorite = (lot: Lot) => {
    setFavoriteLotIds(prev =>
      prev.includes(lot.id) ? prev.filter(id => id !== lot.id) : [...prev, lot.id]
    );
  };

  const handleAssociateLotWithLead = (
    lotId: string,
    leadId: string,
    isFavorite = true,
  ) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const existingFavs = l.favoriteLotIds || [];
        const updatedFavs = existingFavs.includes(lotId) ? existingFavs : [...existingFavs, lotId];
        return {
          ...l,
          lotInterestIds: l.lotInterestIds.includes(lotId) ? l.lotInterestIds : [...l.lotInterestIds, lotId],
          favoriteLotIds: isFavorite ? updatedFavs : existingFavs,
        };
      }
      return l;
    }));

    if (isFavorite && !favoriteLotIds.includes(lotId)) {
      setFavoriteLotIds(prev => [...prev, lotId]);
    }
  };

  // CRM Handlers
  const handleCreateLead = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => (l.id === updatedLead.id ? updatedLead : l)));
  };

  const handleAddActivity = (activity: ActivityItem, updatedLeadPartial?: Partial<Lead>, newTask?: TaskItem) => {
    setActivities(prev => [activity, ...prev]);
    if (updatedLeadPartial) {
      setLeads(prev =>
        prev.map(l => (l.id === activity.leadId ? { ...l, ...updatedLeadPartial, updatedAt: new Date().toISOString() } : l))
      );
    }
    if (newTask) {
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const handleAddVisit = (visit: VisitItem, updatedLeadPartial?: Partial<Lead>) => {
    setVisits(prev => [visit, ...prev]);
    if (updatedLeadPartial) {
      setLeads(prev =>
        prev.map(l => (l.id === visit.leadId ? { ...l, ...updatedLeadPartial, updatedAt: new Date().toISOString() } : l))
      );
    }
  };

  const handleMarkLoss = (leadId: string, lossReason: LeadLossReason, lossNote: string, recontactDate?: string) => {
    const now = new Date().toISOString();
    setLeads(prev =>
      prev.map(l =>
        l.id === leadId
          ? {
              ...l,
              status: recontactDate ? 'SEGUIMIENTO_FUTURO' : 'OPORTUNIDAD_PERDIDA',
              lossReason,
              lossNote,
              recontactDate,
              updatedAt: now
            }
          : l
      )
    );
  };

  // ==========================================
  // PHASE 4: BLOQUEO, SEÑA Y RESERVA HANDLERS
  // ==========================================

  // 1. Crear Bloqueo Temporal
  const handleCreateHold = (params: {
    lotId: string;
    leadId: string;
    quoteId?: string;
    quoteOptionId?: string;
    durationHours: number;
    reason: LotHoldReason;
    notes?: string;
  }) => {
    const targetLot = lots.find((l) => l.id === params.lotId);
    const targetLead = leads.find((l) => l.id === params.leadId);
    if (!targetLot || !targetLead) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + params.durationHours * 3600 * 1000);

    const newHold: LotHold = {
      id: `hold-${Date.now()}`,
      lotId: targetLot.id,
      lotNumber: targetLot.number,
      block: targetLot.block,
      leadId: targetLead.id,
      leadName: targetLead.fullName,
      sellerId: targetLead.assignedSellerId || 's1',
      agentName: targetLead.assignedAgent || 'Gonzalo Rossi',
      startsAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      startDate: now.toISOString().replace('T', ' ').slice(0, 16),
      expiryDate: expiresAt.toISOString().replace('T', ' ').slice(0, 16),
      expiresAtIso: expiresAt.toISOString(),
      status: 'ACTIVO',
      reason: params.reason,
      extensionCount: 0,
      notes: params.notes,
      quoteId: params.quoteId,
      quoteOptionId: params.quoteOptionId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setHolds((prev) => [newHold, ...prev]);

    // Actualizar estado del lote
    setLots((prev) =>
      prev.map((l) => (l.id === targetLot.id ? { ...l, status: 'BLOQUEADO', activeHoldId: newHold.id, currentHoldId: newHold.id } : l))
    );

    // Actividad en CRM
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        leadId: targetLead.id,
        type: 'BLOQUEO_CREADO',
        description: `Bloqueo Temporal Lote ${targetLot.number} por ${params.durationHours}hs (${params.reason}).`,
        timestamp: new Date().toISOString(),
        authorName: targetLead.assignedAgent || 'Gonzalo Rossi',
      },
      ...prev,
    ]);
  };

  // 2. Registar Promesa de Seña
  const handleRegisterPromise = (params: {
    holdId?: string;
    intentId?: string;
    promisedAmount: number;
    currency: 'USD' | 'ARS';
    paymentMethod: PaymentMethod;
    promisedDateIso: string;
    notes?: string;
  }) => {
    let targetHold = holds.find((h) => h.id === params.holdId);
    if (!targetHold && params.intentId) {
      const intentObj = intents.find((i) => i.id === params.intentId);
      if (intentObj) {
        targetHold = holds.find((h) => h.id === intentObj.holdId);
      }
    }

    if (targetHold) {
      setHolds((prev) =>
        prev.map((h) =>
          h.id === targetHold!.id
            ? {
                ...h,
                notes: `${h.notes || ''} [Promesa de Seña: ${params.promisedAmount} ${params.currency} para el ${params.promisedDateIso.substring(0, 10)}]`,
              }
            : h
        )
      );
    }
  };

  // 3. Informar Comprobante de Seña
  const handleReportDeposit = (params: {
    holdId?: string;
    intentId?: string;
    amount: number;
    currency: 'USD' | 'ARS';
    paymentMethod: PaymentMethod;
    receiptReference: string;
    receiptFileName: string;
    receiptPreviewUrl?: string;
    paidAtIso: string;
    notes?: string;
  }) => {
    let targetHold = holds.find((h) => h.id === params.holdId);
    if (!targetHold && params.intentId) {
      const intentObj = intents.find((i) => i.id === params.intentId);
      if (intentObj) {
        targetHold = holds.find((h) => h.id === intentObj.holdId);
      }
    }

    const newDeposit: Deposit = {
      id: `dep-${Date.now()}`,
      reservationIntentId: params.intentId || 'intent-default',
      holdId: targetHold?.id,
      intentId: params.intentId,
      lotId: targetHold?.lotId || 'lot-a2',
      lotNumber: targetHold?.lotNumber || '2',
      block: targetHold?.block || 'A',
      leadId: targetHold?.leadId || 'lead-02',
      leadName: targetHold?.leadName || 'Clara Molina',
      quoteId: targetHold?.quoteId || 'q-1',
      amount: params.amount,
      currency: params.currency,
      paymentMethod: params.paymentMethod,
      receiptReference: params.receiptReference,
      receiptFileName: params.receiptFileName,
      receiptPreviewUrl:
        params.receiptPreviewUrl ||
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
      status: 'EN_VALIDACION',
      reportedAt: new Date().toISOString(),
      notes: params.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDeposits((prev) => [newDeposit, ...prev]);

    // Actualizar estado del lote a SENADO
    if (targetHold) {
      setLots((prev) =>
        prev.map((l) => (l.id === targetHold!.lotId ? { ...l, status: 'SENADO' } : l))
      );
    }
  };

  // 4. Validar Seña (Aprobación por Tesorería -> RESERVA CONFIRMADA)
  const handleValidateDeposit = (depositId: string) => {
    const dep = deposits.find((d) => d.id === depositId);
    if (!dep) return;

    const validatedAt = new Date().toISOString();
    const reservationNum = `RES-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Actualizar deposit
    setDeposits((prev) =>
      prev.map((d) =>
        d.id === depositId
          ? {
              ...d,
              status: 'CONFIRMADA',
              validatedAt,
              validatedBy: 'Tesorería & Contabilidad',
            }
          : d
      )
    );

    // 2. Crear / Actualizar Reserva Confirmada
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      reservationNumber: reservationNum,
      depositId: dep.id,
      holdId: dep.holdId,
      lotId: dep.lotId || 'lot-a2',
      lotNumber: dep.lotNumber || '2',
      block: dep.block || 'A',
      leadId: dep.leadId || 'lead-02',
      leadName: dep.leadName || 'Clara Molina',
      agreedPrice: 31000,
      agreedPriceUSD: 31000,
      currency: 'USD',
      depositAmount: dep.amount,
      depositAmountUSD: dep.amount,
      agentName: 'Gonzalo Rossi',
      reservedAt: validatedAt,
      createdAt: validatedAt,
      status: 'CONFIRMADA',
      validatedBy: 'Tesorería & Contabilidad',
      validatedAt,
      checklist: createDefaultChecklist(),
      nextStep: 'PREPARAR_DOCUMENTACION',
      notes: `Seña validada. Referencia: ${dep.receiptReference}`,
    };

    setReservations((prev) => [newReservation, ...prev]);

    // 3. Actualizar Lote a RESERVADO
    setLots((prev) =>
      prev.map((l) => (l.id === dep.lotId ? { ...l, status: 'RESERVADO', currentReservationId: newReservation.id } : l))
    );

    // 4. Actualizar Lead a RESERVA
    setLeads((prev) =>
      prev.map((l) => (l.id === dep.leadId ? { ...l, status: 'RESERVA', updatedAt: validatedAt } : l))
    );

    // 5. Convertir Hold
    if (dep.holdId) {
      setHolds((prev) =>
        prev.map((h) => (h.id === dep.holdId ? { ...h, status: 'CONVERTIDO' } : h))
      );
    }
  };

  // 5. Observar Comprobante (Tesorería)
  const handleObserveDeposit = (depositId: string, note: string) => {
    setDeposits((prev) =>
      prev.map((d) => (d.id === depositId ? { ...d, status: 'OBSERVADA', observationNote: note } : d))
    );
  };

  // 6. Rechazar Comprobante (Tesorería)
  const handleRejectDeposit = (
    depositId: string,
    reason: DepositRejectionReason,
    note: string,
    releaseHoldChoice: boolean
  ) => {
    const dep = deposits.find((d) => d.id === depositId);
    if (!dep) return;

    setDeposits((prev) =>
      prev.map((d) =>
        d.id === depositId
          ? {
              ...d,
              status: 'RECHAZADA',
              rejectionReason: reason,
              observationNote: note,
            }
          : d
      )
    );

    if (releaseHoldChoice) {
      setLots((prev) =>
        prev.map((l) => (l.id === dep.lotId ? { ...l, status: 'DISPONIBLE', activeHoldId: undefined } : l))
      );
      if (dep.holdId) {
        setHolds((prev) =>
          prev.map((h) => (h.id === dep.holdId ? { ...h, status: 'LIBERADO' } : h))
        );
      }
    } else {
      setLots((prev) =>
        prev.map((l) => (l.id === dep.lotId ? { ...l, status: 'BLOQUEADO' } : l))
      );
    }
  };

  // 7. Liberar Lote Manualmente
  const handleReleaseHold = (
    holdId: string,
    releaseReason: LotHoldReleaseReason = 'SENA_NO_RECIBIDA',
    notes?: string
  ) => {
    const targetHold = holds.find((h) => h.id === holdId);
    setHolds((prev) =>
      prev.map((h) =>
        h.id === holdId
          ? {
              ...h,
              status: 'LIBERADO',
              releaseReason,
              notes: notes ? `${h.notes || ''} [Liberación: ${notes}]` : h.notes,
            }
          : h
      )
    );

    if (targetHold) {
      setLots((prev) =>
        prev.map((l) => (l.id === targetHold.lotId ? { ...l, status: 'DISPONIBLE', activeHoldId: undefined, currentHoldId: undefined } : l))
      );
    }
  };

  // 8. Checklist Item Toggle
  const handleToggleChecklist = (resId: string, itemId: string) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === resId) {
          const checklist = r.checklist || createDefaultChecklist();
          const updated = checklist.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed, completedAt: !item.completed ? new Date().toISOString() : undefined } : item
          );
          return { ...r, checklist: updated };
        }
        return r;
      })
    );
  };

  // 9. Cancelar Reserva (Caída de Operación)
  const handleCancelReservation = (params: {
    reservationId: string;
    reason: ReservationCancellationReason;
    refundDeposit: boolean;
    notes?: string;
  }) => {
    const targetRes = reservations.find((r) => r.id === params.reservationId);
    if (!targetRes) return;

    setReservations((prev) =>
      prev.map((r) =>
        r.id === params.reservationId
          ? {
              ...r,
              status: 'CANCELADA',
              cancellationReason: params.reason,
              notes: params.notes ? `${r.notes || ''} [Caída: ${params.notes}]` : r.notes,
            }
          : r
      )
    );

    setLots((prev) =>
      prev.map((l) => (l.id === targetRes.lotId ? { ...l, status: 'DISPONIBLE', currentReservationId: undefined } : l))
    );

    if (targetRes.holdId) {
      setHolds((prev) =>
        prev.map((h) => (h.id === targetRes.holdId ? { ...h, status: 'CANCELADO' } : h))
      );
    }
  };

  // 10. Cambiar de Lote (Reemplazo)
  const handleChangeLot = (params: {
    entityId: string;
    entityType: 'HOLD' | 'RESERVATION';
    newLotId: string;
    notes?: string;
  }) => {
    const newLot = lots.find((l) => l.id === params.newLotId);
    if (!newLot) return;

    if (params.entityType === 'HOLD') {
      const targetHold = holds.find((h) => h.id === params.entityId);
      if (!targetHold) return;

      // 1. Liberar lote anterior
      setLots((prev) =>
        prev.map((l) => (l.id === targetHold.lotId ? { ...l, status: 'DISPONIBLE', activeHoldId: undefined } : l))
      );

      // 2. Bloquear nuevo lote
      setLots((prev) =>
        prev.map((l) => (l.id === newLot.id ? { ...l, status: 'BLOQUEADO', activeHoldId: targetHold.id } : l))
      );

      // 3. Actualizar hold
      setHolds((prev) =>
        prev.map((h) =>
          h.id === params.entityId
            ? {
                ...h,
                lotId: newLot.id,
                lotNumber: newLot.number,
                block: newLot.block,
                notes: `${h.notes || ''} [Cambio de lote desde ${targetHold.lotNumber} a ${newLot.number}]`,
              }
            : h
        )
      );
    } else {
      const targetRes = reservations.find((r) => r.id === params.entityId);
      if (!targetRes) return;

      // 1. Liberar lote anterior
      setLots((prev) =>
        prev.map((l) => (l.id === targetRes.lotId ? { ...l, status: 'DISPONIBLE', currentReservationId: undefined } : l))
      );

      // 2. Reservar nuevo lote
      setLots((prev) =>
        prev.map((l) => (l.id === newLot.id ? { ...l, status: 'RESERVADO', currentReservationId: targetRes.id } : l))
      );

      // 3. Actualizar reserva
      setReservations((prev) =>
        prev.map((r) =>
          r.id === params.entityId
            ? {
                ...r,
                lotId: newLot.id,
                lotNumber: newLot.number,
                block: newLot.block,
                notes: `${r.notes || ''} [Cambio de lote desde ${targetRes.lotNumber} a ${newLot.number}]`,
              }
            : r
        )
      );
    }
  };

  const handleLogPayment = (planId: string, installmentNumber: number) => {
    setPaymentPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        const updatedInstallments = plan.installments.map(inst => {
          if (inst.number === installmentNumber) {
            return {
              ...inst,
              status: 'PAGADO' as const,
              paidDate: new Date().toISOString().split('T')[0],
            };
          }
          return inst;
        });

        const paidCount = updatedInstallments.filter(i => i.status === 'PAGADO').length;
        const hasOverdue = updatedInstallments.some(i => i.status === 'VENCIDO');

        return {
          ...plan,
          paidInstallmentsCount: paidCount,
          status: hasOverdue ? ('VENCIDO' as const) : ('AL_DIA' as const),
          installments: updatedInstallments,
        };
      }
      return plan;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 pb-20">
      {/* Top Mobile Header */}
      <Header
        activeModuleTitle={moduleTitles[activeModule] || 'Nexo Desarrollos'}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-lg w-full mx-auto px-3.5 py-4">
        {activeModule === 'dashboard' && (
          <DashboardModule
            onNavigate={(mod) => setActiveModule(mod)}
            onOpenNewLead={() => setIsNewLeadOpen(true)}
            onOpenHoldModal={() => setIsNewHoldOpen(true)}
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

        {activeModule === 'campaigns' && <CampaignsModule />}

        {activeModule === 'automations' && <AutomationsModule />}

        {activeModule === 'developments' && <DevelopmentsModule />}
      </main>

      {/* Bottom Fixed Navigation Bar */}
      <BottomNav
        activeModule={activeModule}
        onSelectModule={(mod) => setActiveModule(mod)}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* Drawer Menu */}
      <ModuleDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeModule={activeModule}
        onSelectModule={(mod) => setActiveModule(mod)}
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
        onNavigate={(mod) => setActiveModule(mod)}
      />
    </div>
  );
}
