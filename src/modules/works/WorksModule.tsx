import React, { useState } from 'react';
import {
  mockPostSaleOpportunities,
  mockWorkRequests,
  mockTechnicalSurveys,
  mockWorkQuoteRequests,
  mockSupplierQuotes,
  mockClientProposals,
  mockWorkOrders,
  mockWorkMilestones,
  mockIncidents,
  mockWarranties,
  mockProviders,
  mockServiceSubscriptions,
  mockCommissions,
  mockLots,
  mockSales
} from '../../data/mockData';
import {
  PostSaleOpportunity,
  WorkRequest,
  TechnicalSurvey,
  WorkQuoteRequest,
  SupplierQuote,
  ClientProposal,
  WorkOrder,
  WorkMilestone,
  Incident,
  Warranty,
  Provider,
  ServiceSubscription,
  Commission
} from '../../types';
import { detectPostSaleOpportunities, validateWorkOrderCompletion } from '../../domain/worksDomain';

// Sub-components
import { WorksDashboardTab } from '../../components/works/WorksDashboardTab';
import { PostSaleOpportunitiesTab } from '../../components/works/PostSaleOpportunitiesTab';
import { ProviderQuotesTab } from '../../components/works/ProviderQuotesTab';
import { WorkOrdersTab } from '../../components/works/WorkOrdersTab';
import { Providers360Tab } from '../../components/works/Providers360Tab';
import { RecurringServicesTab } from '../../components/works/RecurringServicesTab';
import { CommissionsTab } from '../../components/works/CommissionsTab';

// Modals
import { NewWorkRequestModal } from '../../components/works/NewWorkRequestModal';
import { TechnicalSurveyModal } from '../../components/works/TechnicalSurveyModal';
import { CompareQuotesModal } from '../../components/works/CompareQuotesModal';
import { CreateProposalModal } from '../../components/works/CreateProposalModal';
import { GuidedMainDemoModal } from '../../components/works/GuidedMainDemoModal';
import { GuidedRecurringDemoModal } from '../../components/works/GuidedRecurringDemoModal';

import {
  HardHat,
  Sparkles,
  ClipboardList,
  Scale,
  Building2,
  Repeat,
  DollarSign,
  TrendingUp,
  Play
} from 'lucide-react';

export const WorksModule: React.FC = () => {
  // Primary collections state
  const [opportunities, setOpportunities] = useState<PostSaleOpportunity[]>(mockPostSaleOpportunities);
  const [workRequests, setWorkRequests] = useState<WorkRequest[]>(mockWorkRequests);
  const [technicalSurveys, setTechnicalSurveys] = useState<TechnicalSurvey[]>(mockTechnicalSurveys);
  const [quoteRequests, setQuoteRequests] = useState<WorkQuoteRequest[]>(mockWorkQuoteRequests);
  const [supplierQuotes, setSupplierQuotes] = useState<SupplierQuote[]>(mockSupplierQuotes);
  const [clientProposals, setClientProposals] = useState<ClientProposal[]>(mockClientProposals);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [milestones, setMilestones] = useState<WorkMilestone[]>(mockWorkMilestones);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [warranties, setWarranties] = useState<Warranty[]>(mockWarranties);
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [subscriptions, setSubscriptions] = useState<ServiceSubscription[]>(mockServiceSubscriptions);
  const [commissions, setCommissions] = useState<Commission[]>(mockCommissions);

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modal control states
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedOpportunityForReq, setSelectedOpportunityForReq] = useState<PostSaleOpportunity | undefined>();

  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [selectedRequestForSurvey, setSelectedRequestForSurvey] = useState<WorkRequest | null>(null);

  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareRequest, setCompareRequest] = useState<WorkRequest | null>(null);

  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedQuoteForProposal, setSelectedQuoteForProposal] = useState<SupplierQuote | null>(null);
  const [selectedRequestForProposal, setSelectedRequestForProposal] = useState<WorkRequest | null>(null);

  const [showMainDemoModal, setShowMainDemoModal] = useState(false);
  const [showRecurringDemoModal, setShowRecurringDemoModal] = useState(false);

  // Auto Detection Motor Handler
  const handleRunAutoDetection = () => {
    const detected = detectPostSaleOpportunities(mockLots, mockSales, workOrders, subscriptions, opportunities);
    const newItems = detected.filter(
      d => !opportunities.some(o => o.lotId === d.lotId && o.category === d.category)
    );

    if (newItems.length > 0) {
      setOpportunities(prev => [...newItems, ...prev]);
      alert(`¡Motor de Oportunidades!: Se han detectado ${newItems.length} nuevas oportunidades postventa basadas en el estado de lotes.`);
    } else {
      alert('Motor de Oportunidades: No se encontraron nuevas oportunidades sin registrar.');
    }
  };

  // Convert Opportunity or Create Request Handler
  const handleOpenNewRequest = (op?: PostSaleOpportunity) => {
    setSelectedOpportunityForReq(op);
    setShowNewRequestModal(true);
  };

  const handleCreateWorkRequest = (reqData: Partial<WorkRequest>) => {
    const newReq: WorkRequest = {
      id: `req-${Date.now()}`,
      lotId: reqData.lotId || 'lot-1',
      lotNumber: reqData.lotNumber || 'A-4',
      customerId: reqData.customerId || 'cust-1',
      customerName: reqData.customerName || 'Cliente',
      category: reqData.category || 'CERRAMIENTOS_LIMITES',
      title: reqData.title || 'Solicitud de Servicio',
      description: reqData.description || '',
      status: 'NUEVA',
      priority: reqData.priority || 'ALTA',
      requestedAt: new Date().toISOString().split('T')[0],
      requestedBy: 'CLIENTE',
      budgetExpectation: reqData.budgetExpectation || 3000,
      currency: 'USD',
      siteVisitRequired: reqData.siteVisitRequired ?? true,
      assignedCoordinatorName: reqData.assignedCoordinatorName || 'Ing. Gonzalo Bunge',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkRequests(prev => [newReq, ...prev]);

    // Mark opportunity as converted if applicable
    if (reqData.opportunityId) {
      setOpportunities(prev =>
        prev.map(o => (o.id === reqData.opportunityId ? { ...o, status: 'CONVERTIDA' } : o))
      );
    }

    alert(`Solicitud de Servicio #${newReq.id} creada exitosamente para el Lote ${newReq.lotNumber}.`);
  };

  // Technical Survey Handler
  const handleOpenSurveyModal = (request: WorkRequest) => {
    setSelectedRequestForSurvey(request);
    setShowSurveyModal(true);
  };

  const handleCompleteSurvey = (surveyData: Partial<TechnicalSurvey>) => {
    const newSurvey: TechnicalSurvey = {
      id: `surv-${Date.now()}`,
      workRequestId: surveyData.workRequestId!,
      lotId: surveyData.lotId!,
      lotNumber: surveyData.lotNumber!,
      assignedUserId: 'usr-coord-1',
      assignedUserName: surveyData.assignedUserName || 'Ing. Gonzalo Bunge',
      scheduledAt: surveyData.scheduledAt || '2026-08-10 11:00',
      completedAt: surveyData.completedAt || '2026-08-10 12:00',
      status: 'REALIZADO',
      measurements: surveyData.measurements,
      terrainStatus: surveyData.terrainStatus,
      accessInfo: surveyData.accessInfo,
      restrictions: surveyData.restrictions,
      recommendations: surveyData.recommendations,
      simulatedPhotos: surveyData.simulatedPhotos || [],
      createdAt: new Date().toISOString(),
    };

    setTechnicalSurveys(prev => [newSurvey, ...prev]);

    // Update request status
    setWorkRequests(prev =>
      prev.map(r => (r.id === surveyData.workRequestId ? { ...r, status: 'LISTA_PARA_COTIZAR' } : r))
    );

    alert('Relevamiento Técnico registrado y asociado exitosamente al legajo del lote.');
  };

  // Compare Quotes Handler
  const handleOpenCompareModal = (workRequestId: string) => {
    const req = workRequests.find(r => r.id === workRequestId);
    if (req) {
      setCompareRequest(req);
      setShowCompareModal(true);
    }
  };

  // Create Proposal Handler
  const handleOpenCreateProposal = (quote: SupplierQuote, request: WorkRequest) => {
    setSelectedQuoteForProposal(quote);
    setSelectedRequestForProposal(request);
    setShowProposalModal(true);
  };

  const handleCreateProposalSubmit = (proposalData: Partial<ClientProposal>) => {
    const newProp: ClientProposal = {
      id: `prop-${Date.now()}`,
      workRequestId: proposalData.workRequestId!,
      selectedSupplierQuoteId: proposalData.selectedSupplierQuoteId!,
      lotId: proposalData.lotId!,
      lotNumber: proposalData.lotNumber!,
      customerId: proposalData.customerId!,
      customerName: proposalData.customerName!,
      providerId: proposalData.providerId!,
      providerName: proposalData.providerName!,
      title: proposalData.title!,
      version: proposalData.version || 1,
      status: 'EN_EVALUACION',
      providerCost: proposalData.providerCost!,
      clientPrice: proposalData.clientPrice!,
      commissionAmount: proposalData.commissionAmount!,
      marginAmount: proposalData.marginAmount!,
      currency: 'USD',
      validUntil: proposalData.validUntil || '2026-08-30',
      estimatedDurationDays: proposalData.estimatedDurationDays || 10,
      warrantyMonths: proposalData.warrantyMonths || 24,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setClientProposals(prev => [newProp, ...prev]);

    // Update supplier quote status
    setSupplierQuotes(prev =>
      prev.map(q => (q.id === proposalData.selectedSupplierQuoteId ? { ...q, status: 'SELECCIONADA' } : q))
    );

    alert(`Propuesta Comercial V${newProp.version} generada exitosamente ($${newProp.clientPrice} USD).`);
  };

  // Approve Client Proposal -> Converts to WorkOrder & Commission
  const handleApproveProposal = (proposal: ClientProposal) => {
    setClientProposals(prev =>
      prev.map(p => (p.id === proposal.id ? { ...p, status: 'APROBADA' } : p))
    );

    // Create Work Order
    const newWorkOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      workRequestId: proposal.workRequestId,
      proposalId: proposal.id,
      lotId: proposal.lotId,
      lotNumber: proposal.lotNumber,
      customerId: proposal.customerId,
      customerName: proposal.customerName,
      providerId: proposal.providerId,
      providerName: proposal.providerName,
      category: proposal.title.toLowerCase().includes('cerco') ? 'CERRAMIENTOS_LIMITES' : 'PREPARACION_TERRENO',
      title: proposal.title,
      status: 'PREPARACION',
      progress: 0,
      contractedAmount: proposal.clientPrice,
      providerCost: proposal.providerCost,
      marginAmount: proposal.marginAmount,
      currency: 'USD',
      coordinatorName: 'Ing. Gonzalo Bunge',
      warrantyMonths: proposal.warrantyMonths,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorkOrders(prev => [newWorkOrder, ...prev]);

    // Create Commission Entry
    const newCommission: Commission = {
      id: `comm-${Date.now()}`,
      sourceType: 'OBRA',
      sourceId: newWorkOrder.id,
      lotId: proposal.lotId,
      lotNumber: proposal.lotNumber,
      customerId: proposal.customerId,
      customerName: proposal.customerName,
      providerId: proposal.providerId,
      providerName: proposal.providerName,
      model: 'MARKUP',
      baseAmount: proposal.providerCost,
      commissionAmount: proposal.commissionAmount,
      marginAmount: proposal.marginAmount,
      currency: 'USD',
      status: 'DEVENGADA',
      createdAt: new Date().toISOString().split('T')[0],
      notes: `Devengada por aprobación de propuesta ${proposal.title}`,
    };

    setCommissions(prev => [newCommission, ...prev]);

    alert(`¡Propuesta Aprobada por el Cliente!: Se ha emitido la Orden de Trabajo #${newWorkOrder.id} y devengado la comisión de $${newCommission.commissionAmount} USD.`);
  };

  // Progress Update Handler
  const handleUpdateProgress = (orderId: string, newProgress: number) => {
    setWorkOrders(prev =>
      prev.map(w => {
        if (w.id === orderId) {
          const newStatus = newProgress === 100 ? 'FINALIZADA' : newProgress > 0 ? 'EN_EJECUCION' : w.status;
          return { ...w, progress: newProgress, status: newStatus };
        }
        return w;
      })
    );

    // Update milestones accordingly
    setMilestones(prev =>
      prev.map(m => {
        if (m.workOrderId === orderId && m.percentage <= newProgress) {
          return { ...m, status: 'COMPLETADO' };
        }
        return m;
      })
    );
  };

  // Incident Management Handlers
  const handleReportIncident = (
    orderId: string,
    description: string,
    severity: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
    type: any
  ) => {
    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      workOrderId: orderId,
      lotId: workOrders.find(w => w.id === orderId)?.lotId || 'lot-1',
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type,
      severity,
      description,
      status: 'ABIERTA',
    };

    setIncidents(prev => [newInc, ...prev]);

    if (severity === 'CRITICA' || severity === 'ALTA') {
      setWorkOrders(prev =>
        prev.map(w => (w.id === orderId ? { ...w, status: 'DEMORADA' } : w))
      );
    }
  };

  const handleResolveIncident = (incidentId: string) => {
    setIncidents(prev =>
      prev.map(i => (i.id === incidentId ? { ...i, status: 'RESUELTA', resolvedAt: new Date().toISOString() } : i))
    );
  };

  // Finalize Work Order Handler -> Activates Warranty
  const handleFinalizeWorkOrder = (orderId: string) => {
    const targetOrder = workOrders.find(w => w.id === orderId);
    if (!targetOrder) return;

    const orderIncidents = incidents.filter(i => i.workOrderId === orderId);
    const orderMilestones = milestones.filter(m => m.workOrderId === orderId);
    const validation = validateWorkOrderCompletion(targetOrder, orderMilestones, orderIncidents);

    if (!validation.canFinalize) {
      alert(`No se puede finalizar la obra: ${validation.blockReason}`);
      return;
    }

    setWorkOrders(prev =>
      prev.map(w => (w.id === orderId ? { ...w, status: 'FINALIZADA', progress: 100, actualEndDate: new Date().toISOString().split('T')[0] } : w))
    );

    // Activate 24-month Warranty
    const newWarranty: Warranty = {
      id: `war-${Date.now()}`,
      workOrderId: targetOrder.id,
      lotId: targetOrder.lotId,
      lotNumber: targetOrder.lotNumber,
      customerId: targetOrder.customerId,
      customerName: targetOrder.customerName,
      providerId: targetOrder.providerId,
      providerName: targetOrder.providerName,
      serviceName: targetOrder.title,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2028-08-01',
      months: 24,
      coverageDetails: 'Garantía oficial por escrito de estructura, materiales y alineación.',
      status: 'ACTIVA',
      createdAt: new Date().toISOString(),
    };

    setWarranties(prev => [newWarranty, ...prev]);
    alert(`Obra #${orderId} finalizada con éxito. Se emitió el Acta Definitiva y se activó la Garantía Oficial por 24 meses.`);
  };

  // Execute Guided Walkthrough Demos
  const handleExecuteMainDemo = () => {
    alert('Demo Ejecutada: Se procesó el recorrido completo del Cerco Perimetral en Lote A-4. Se actualizaron los datos con garantía emitida.');
  };

  const handleApplyRecurringDemo = () => {
    alert('Demo Recurrente Ejecutada: Se activó el abono semanal de piscina para Lote B-12 ($120/mes MRR).');
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-400" />
            <h2 className="text-lg font-black text-white">Fase 7: Obras, Proveedores & Postventa</h2>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Gestión integral de postventa, cotizaciones, contratistas, comisiones y servicios recurrentes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMainDemoModal(true)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-500 text-slate-900 hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Play className="w-3.5 h-3.5" /> Demo Caso Principal
          </button>
          <button
            onClick={() => setShowRecurringDemoModal(true)}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Repeat className="w-3.5 h-3.5" /> Demo MRR
          </button>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS (MOBILE-FIRST FLEX SCROLL) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs border-b border-slate-200">
        {[
          { key: 'dashboard', label: 'Panel Ejecutivo', icon: HardHat },
          { key: 'opportunities', label: `Oportunidades (${opportunities.length})`, icon: Sparkles },
          { key: 'quotes', label: 'Cotizaciones & Propuestas', icon: Scale },
          { key: 'orders', label: `Obras & Hitos (${workOrders.length})`, icon: ClipboardList },
          { key: 'providers', label: `Proveedores (${providers.length})`, icon: Building2 },
          { key: 'recurring', label: `Abonos Recurrentes (${subscriptions.length})`, icon: Repeat },
          { key: 'commissions', label: 'Comisiones Postventa', icon: DollarSign },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-bold flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'dashboard' && (
        <WorksDashboardTab
          opportunities={opportunities}
          workOrders={workOrders}
          subscriptions={subscriptions}
          commissions={commissions}
          providers={providers}
          lots={mockLots}
          onConvertToRequest={handleOpenNewRequest}
          onRunAutoDetection={handleRunAutoDetection}
          onOpenMainDemo={() => setShowMainDemoModal(true)}
          onOpenRecurringDemo={() => setShowRecurringDemoModal(true)}
          onSelectSubTab={tab => setActiveTab(tab)}
        />
      )}

      {activeTab === 'opportunities' && (
        <PostSaleOpportunitiesTab
          opportunities={opportunities}
          workRequests={workRequests}
          technicalSurveys={technicalSurveys}
          lots={mockLots}
          onOpenNewRequestModal={handleOpenNewRequest}
          onOpenSurveyModal={handleOpenSurveyModal}
          onRequestQuotes={req => setActiveTab('quotes')}
          onRunAutoDetection={handleRunAutoDetection}
        />
      )}

      {activeTab === 'quotes' && (
        <ProviderQuotesTab
          quoteRequests={quoteRequests}
          supplierQuotes={supplierQuotes}
          clientProposals={clientProposals}
          workRequests={workRequests}
          providers={providers}
          lots={mockLots}
          onCompareQuotes={handleOpenCompareModal}
          onCreateProposal={handleOpenCreateProposal}
          onApproveProposal={handleApproveProposal}
        />
      )}

      {activeTab === 'orders' && (
        <WorkOrdersTab
          workOrders={workOrders}
          milestones={milestones}
          incidents={incidents}
          warranties={warranties}
          providers={providers}
          onUpdateProgress={handleUpdateProgress}
          onReportIncident={handleReportIncident}
          onResolveIncident={handleResolveIncident}
          onFinalizeWorkOrder={handleFinalizeWorkOrder}
        />
      )}

      {activeTab === 'providers' && (
        <Providers360Tab providers={providers} />
      )}

      {activeTab === 'recurring' && (
        <RecurringServicesTab subscriptions={subscriptions} providers={providers} />
      )}

      {activeTab === 'commissions' && (
        <CommissionsTab commissions={commissions} />
      )}

      {/* MODALS */}
      <NewWorkRequestModal
        isOpen={showNewRequestModal}
        opportunity={selectedOpportunityForReq}
        lots={mockLots}
        customers={mockSales.map(s => ({ id: s.customerId || 'cust-1', name: s.customerName }))}
        onClose={() => setShowNewRequestModal(false)}
        onSubmit={handleCreateWorkRequest}
      />

      {selectedRequestForSurvey && (
        <TechnicalSurveyModal
          isOpen={showSurveyModal}
          request={selectedRequestForSurvey}
          providers={providers}
          onClose={() => setShowSurveyModal(false)}
          onSubmit={handleCompleteSurvey}
        />
      )}

      {compareRequest && (
        <CompareQuotesModal
          isOpen={showCompareModal}
          workRequest={compareRequest}
          quotes={supplierQuotes.filter(s => s.workRequestId === compareRequest.id)}
          providers={providers}
          onClose={() => setShowCompareModal(false)}
          onSelectQuoteForProposal={quote => handleOpenCreateProposal(quote, compareRequest)}
        />
      )}

      {selectedQuoteForProposal && selectedRequestForProposal && (
        <CreateProposalModal
          isOpen={showProposalModal}
          supplierQuote={selectedQuoteForProposal}
          workRequest={selectedRequestForProposal}
          onClose={() => setShowProposalModal(false)}
          onSubmit={handleCreateProposalSubmit}
        />
      )}

      <GuidedMainDemoModal
        isOpen={showMainDemoModal}
        onClose={() => setShowMainDemoModal(false)}
        onExecuteFullFlow={handleExecuteMainDemo}
      />

      <GuidedRecurringDemoModal
        isOpen={showRecurringDemoModal}
        onClose={() => setShowRecurringDemoModal(false)}
        onApplyRecurringDemo={handleApplyRecurringDemo}
      />
    </div>
  );
};
