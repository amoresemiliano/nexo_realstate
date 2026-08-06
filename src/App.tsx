import React, { useState } from 'react';
import {
  mockLots,
  mockLeads,
  mockHolds,
  mockReservations,
  mockPaymentPlans
} from './data/mockData';
import { Lot, Lead, LotHold, Reservation, PaymentPlan } from './types';

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
import { NotificationsSheet } from './components/modals/NotificationsSheet';

export function App() {
  // State management
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Entities state
  const [lots, setLots] = useState<Lot[]>(mockLots);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [holds, setHolds] = useState<LotHold[]>(mockHolds);
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>(mockPaymentPlans);

  // Modal selections
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isNewHoldOpen, setIsNewHoldOpen] = useState(false);
  const [selectedLotForDetail, setSelectedLotForDetail] = useState<Lot | null>(null);
  const [quoteLot, setQuoteLot] = useState<Lot | null>(null);

  // Module Title Dictionary
  const moduleTitles: Record<string, string> = {
    dashboard: 'Dashboard Principal',
    lots: 'Masterplan & Lotes',
    leads: 'CRM Leads & Oportunidades',
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

  // Handlers
  const handleAddLead = (newLeadData: Partial<Lead>) => {
    const created: Lead = {
      id: `lead-${Date.now()}`,
      fullName: newLeadData.fullName || 'Nuevo Lead',
      email: newLeadData.email || 'lead@ejemplo.com',
      phone: newLeadData.phone || '+54 11 0000 0000',
      channel: newLeadData.channel || 'Meta Ads',
      status: 'NUEVO',
      budgetUSD: newLeadData.budgetUSD || 30000,
      assignedAgent: 'Gonzalo Rossi',
      notes: newLeadData.notes || '',
      createdAt: new Date().toISOString().split('T')[0],
      lastInteractionAt: new Date().toISOString().split('T')[0],
      qualificationScore: 7,
      interestedBlock: newLeadData.interestedBlock || 'A',
    };
    setLeads(prev => [created, ...prev]);
  };

  const handleCreateHold = (holdData: { lotId: string; leadId: string; agentName: string; notes: string }) => {
    const targetLot = lots.find(l => l.id === holdData.lotId);
    const targetLead = leads.find(l => l.id === holdData.leadId);
    if (!targetLot || !targetLead) return;

    const newHold: LotHold = {
      id: `hold-${Date.now()}`,
      lotId: targetLot.id,
      lotNumber: `${targetLot.block}-${targetLot.number}`,
      block: targetLot.block,
      leadId: targetLead.id,
      leadName: targetLead.fullName,
      agentName: holdData.agentName,
      startDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      expiryDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().replace('T', ' ').slice(0, 16),
      status: 'ACTIVO',
      notes: holdData.notes,
    };

    setHolds(prev => [newHold, ...prev]);

    // Update lot status to BLOQUEADO
    setLots(prev => prev.map(l => l.id === targetLot.id ? { ...l, status: 'BLOQUEADO', currentHoldId: newHold.id } : l));
  };

  const handleValidateDeposit = (reservationId: string) => {
    setReservations(prev => prev.map(r => {
      if (r.id === reservationId) {
        return {
          ...r,
          status: 'SENA_VALIDADA',
          validatedBy: 'Tesorería - Aprobación Manual',
          validatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return r;
    }));

    // Find reservation & lot
    const targetRes = reservations.find(r => r.id === reservationId);
    if (targetRes) {
      setLots(prev => prev.map(l => l.id === targetRes.lotId ? { ...l, status: 'RESERVADO' } : l));
    }
  };

  const handleReleaseHold = (holdId: string) => {
    const targetHold = holds.find(h => h.id === holdId);
    setHolds(prev => prev.map(h => h.id === holdId ? { ...h, status: 'LIBERADO' } : h));
    if (targetHold) {
      setLots(prev => prev.map(l => l.id === targetHold.lotId ? { ...l, status: 'DISPONIBLE', currentHoldId: undefined } : l));
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
            onSelectLot={(lot) => setSelectedLotForDetail(lot)}
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
            onOpenNewLead={() => setIsNewLeadOpen(true)}
            onSelectLead={(lead) => alert(`Perfil de lead: ${lead.fullName}\nTel: ${lead.phone}\nPresupuesto: USD ${lead.budgetUSD}`)}
          />
        )}

        {activeModule === 'quotes' && (
          <QuotesModule initialLot={quoteLot} lots={lots} />
        )}

        {activeModule === 'reservations' && (
          <ReservationsModule
            holds={holds}
            reservations={reservations}
            onOpenHoldModal={() => setIsNewHoldOpen(true)}
            onValidateDeposit={handleValidateDeposit}
            onReleaseHold={handleReleaseHold}
          />
        )}

        {activeModule === 'sales' && <SalesModule />}

        {activeModule === 'payments' && (
          <PaymentsModule
            paymentPlans={paymentPlans}
            onLogPayment={handleLogPayment}
          />
        )}

        {activeModule === 'legal' && <LegalModule />}

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
        onSubmitLead={handleAddLead}
      />

      <NewHoldModal
        isOpen={isNewHoldOpen}
        onClose={() => setIsNewHoldOpen(false)}
        lots={lots}
        leads={leads}
        preselectedLot={selectedLotForDetail}
        onSubmitHold={handleCreateHold}
      />

      <LotDetailSheet
        lot={selectedLotForDetail}
        isOpen={!!selectedLotForDetail}
        onClose={() => setSelectedLotForDetail(null)}
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

      <NotificationsSheet
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={(mod) => setActiveModule(mod)}
      />
    </div>
  );
}
