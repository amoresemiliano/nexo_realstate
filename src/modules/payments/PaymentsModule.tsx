import React, { useState } from 'react';
import {
  PaymentPlan,
  Installment,
  UnreconciledPayment,
  PaymentPromise,
  CollectionCommunication,
  RefinancingProposal,
  ReceiptInternal,
  PaymentMethod
} from '../../types';
import {
  mockPaymentPlans,
  mockUnreconciledPayments,
  mockPaymentPromises,
  mockCollectionCommunications,
  mockRefinancingProposals,
  mockReceiptsInternal
} from '../../data/mockData';
import { formatUSD, formatARS } from '../../domain/rules';
import { classifyOverdueStatus, calculateAccountStatementSummary } from '../../domain/paymentsDomain';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Wallet,
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  Search,
  Filter,
  PhoneCall,
  MessageSquare,
  RefreshCw,
  FileText,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Inbox,
  Clock,
  Printer,
  Sparkles
} from 'lucide-react';

import { RegisterPaymentModal } from './RegisterPaymentModal';
import { CustomerAccountStatementModal } from './CustomerAccountStatementModal';
import { ReceiptModal } from './ReceiptModal';
import { CollectionContactModal } from './CollectionContactModal';
import { RefinancingModal } from './RefinancingModal';

interface PaymentsModuleProps {
  paymentPlans?: PaymentPlan[];
  onLogPayment?: (planId: string, installmentNumber: number) => void;
}

export const PaymentsModule: React.FC<PaymentsModuleProps> = ({
  paymentPlans: initialPlans,
  onLogPayment,
}) => {
  // State initialization
  const [plans, setPlans] = useState<PaymentPlan[]>(initialPlans && initialPlans.length > 0 ? initialPlans : mockPaymentPlans);
  const [unreconciledList, setUnreconciledList] = useState<UnreconciledPayment[]>(mockUnreconciledPayments);
  const [promisesList, setPromisesList] = useState<PaymentPromise[]>(mockPaymentPromises);
  const [communicationsList, setCommunicationsList] = useState<CollectionCommunication[]>(mockCollectionCommunications);
  const [refinancingList, setRefinancingList] = useState<RefinancingProposal[]>(mockRefinancingProposals);
  const [receiptsList, setReceiptsList] = useState<ReceiptInternal[]>(mockReceiptsInternal);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'PLANES' | 'COBRANZAS' | 'CONCILIACION' | 'PROMESAS' | 'RECIBOS'>('COBRANZAS');
  const [riskFilter, setRiskFilter] = useState<'TODOS' | 'MORA_LEVE' | 'MORA_MEDIA' | 'MORA_CRITICA' | 'RIESGO_CONTRACTUAL' | 'AL_DIA'>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [selectedPlanForStatement, setSelectedPlanForStatement] = useState<PaymentPlan | null>(null);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PaymentPlan | null>(null);
  const [initialInstallmentNumForPayment, setInitialInstallmentNumForPayment] = useState<number | undefined>(undefined);
  
  const [selectedPlanForContact, setSelectedPlanForContact] = useState<PaymentPlan | null>(null);
  const [selectedPlanForRefinancing, setSelectedPlanForRefinancing] = useState<PaymentPlan | null>(null);

  const [activeReceiptForModal, setActiveReceiptForModal] = useState<ReceiptInternal | null>(null);

  // Calculation summaries
  const totalForecastUSD = plans.reduce((acc, p) => acc + (p.monthlyAmountUSD || 400), 0);
  const totalCollectedThisMonthUSD = plans.reduce((acc, p) => {
    const paidCount = p.paidInstallmentsCount || 0;
    return acc + paidCount * (p.monthlyAmountUSD || 400);
  }, 0);

  const overduePlansCount = plans.filter(p => {
    const summary = calculateAccountStatementSummary(p);
    return summary.overdueInstallmentsCount > 0;
  }).length;

  const criticalRiskPlansCount = plans.filter(p => {
    const summary = calculateAccountStatementSummary(p);
    return summary.classification.status === 'RIESGO_CONTRACTUAL' || summary.classification.status === 'MORA_CRITICA';
  }).length;

  // Filter plans based on search & risk filter
  const filteredPlans = plans.filter(p => {
    const summary = calculateAccountStatementSummary(p);
    
    if (riskFilter !== 'TODOS') {
      if (riskFilter === 'AL_DIA' && summary.classification.status !== 'AL_DIA') return false;
      if (riskFilter === 'MORA_LEVE' && summary.classification.status !== 'MORA_LEVE') return false;
      if (riskFilter === 'MORA_MEDIA' && summary.classification.status !== 'MORA_MEDIA') return false;
      if (riskFilter === 'MORA_CRITICA' && summary.classification.status !== 'MORA_CRITICA') return false;
      if (riskFilter === 'RIESGO_CONTRACTUAL' && summary.classification.status !== 'RIESGO_CONTRACTUAL') return false;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const nameMatch = p.customerName.toLowerCase().includes(term);
      const lotMatch = p.lotNumber.toLowerCase().includes(term);
      return nameMatch || lotMatch;
    }

    return true;
  });

  // Handler: Confirm Payment
  const handleConfirmPayment = (data: {
    planId: string;
    installmentNumbers: number[];
    amountUSD: number;
    paymentMethod: PaymentMethod;
    reference: string;
    notes: string;
    isPartial: boolean;
  }) => {
    const targetPlan = plans.find(p => p.id === data.planId);
    if (!targetPlan) return;

    // Update installments
    const updatedInstallments = targetPlan.installments.map(inst => {
      if (data.installmentNumbers.includes(inst.number)) {
        const paid = data.isPartial ? (inst.paidAmount || 0) + data.amountUSD : inst.amountUSD;
        const outstanding = Math.max(0, inst.amountUSD - paid);
        return {
          ...inst,
          paidAmount: paid,
          outstandingAmount: outstanding,
          status: outstanding <= 0 ? ('PAGADO' as const) : ('PARCIAL' as const),
          paidDate: new Date().toISOString().slice(0, 10),
          daysOverdue: 0,
        };
      }
      return inst;
    });

    const newlyPaidCount = updatedInstallments.filter(i => i.status === 'PAGADO').length;

    const updatedPlan: PaymentPlan = {
      ...targetPlan,
      installments: updatedInstallments,
      paidInstallmentsCount: newlyPaidCount,
    };

    // Update classification status
    const summary = calculateAccountStatementSummary(updatedPlan);
    updatedPlan.status = summary.classification.status;

    setPlans(plans.map(p => (p.id === data.planId ? updatedPlan : p)));

    // Generate receipt
    const newReceipt: ReceiptInternal = {
      id: `rec-${Date.now()}`,
      number: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: targetPlan.customerId || 'cust-101',
      customerName: targetPlan.customerName,
      lotNumber: targetPlan.lotNumber,
      saleId: targetPlan.saleId,
      amount: data.amountUSD,
      currency: 'USD',
      paymentMethod: data.paymentMethod,
      concept: `Pago de Cuotas [${data.installmentNumbers.join(', ')}] — Lote ${targetPlan.lotNumber}`,
      issuedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      agentName: 'Gonzalo Rossi',
    };

    setReceiptsList([newReceipt, ...receiptsList]);
    setActiveReceiptForModal(newReceipt);

    if (onLogPayment && data.installmentNumbers[0]) {
      onLogPayment(data.planId, data.installmentNumbers[0]);
    }
  };

  // Handler: Reconcile Unreconciled Payment
  const handleReconcilePayment = (unrecId: string) => {
    const unrec = unreconciledList.find(u => u.id === unrecId);
    if (!unrec) return;

    // Find target plan by lot or customer name
    const targetPlan = plans.find(p => p.lotNumber === unrec.lotNumber || p.customerName === unrec.clientName) || plans[0];
    if (targetPlan) {
      handleConfirmPayment({
        planId: targetPlan.id,
        installmentNumbers: [unrec.suggestedInstallmentNumber || 1],
        amountUSD: unrec.amount,
        paymentMethod: unrec.paymentMethod,
        reference: unrec.reference,
        notes: `Conciliado desde depósito sin conciliar (${unrec.notes || ''})`,
        isPartial: false,
      });
    }

    setUnreconciledList(unreconciledList.map(u => u.id === unrecId ? { ...u, status: 'CONCILIADO' as const } : u));
  };

  // Demo simulation buttons
  const handleSimulateCriticalMora = () => {
    // Set Plan 1 (Martín Peralta) to 3 Overdue Installments (>90 days)
    const targetPlan = plans[0];
    if (!targetPlan) return;

    const modifiedInstallments = targetPlan.installments.map((inst, idx) => {
      if (idx === 8 || idx === 9 || idx === 10) {
        return {
          ...inst,
          status: 'VENCIDO' as const,
          daysOverdue: 95 - idx * 10,
        };
      }
      return inst;
    });

    const updatedPlan: PaymentPlan = {
      ...targetPlan,
      installments: modifiedInstallments,
      status: 'RIESGO_CONTRACTUAL',
    };

    setPlans(plans.map(p => (p.id === targetPlan.id ? updatedPlan : p)));
  };

  const handleSimulateFullCancellation = () => {
    // Set Clara Molina or Plan 0 to 100% paid
    const targetPlan = plans.find(p => p.customerName.includes('Clara')) || plans[0];
    if (!targetPlan) return;

    const fullyPaidInstallments = targetPlan.installments.map(inst => ({
      ...inst,
      status: 'PAGADO' as const,
      paidAmount: inst.amountUSD,
      outstandingAmount: 0,
      paidDate: '2026-08-07',
      daysOverdue: 0,
    }));

    const updatedPlan: PaymentPlan = {
      ...targetPlan,
      installments: fullyPaidInstallments,
      paidInstallmentsCount: targetPlan.totalInstallments || 60,
      status: 'CANCELADO_ECONOMICAMENTE',
    };

    setPlans(plans.map(p => (p.id === targetPlan.id ? updatedPlan : p)));
    setSelectedPlanForStatement(updatedPlan);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-brand-400 font-black flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Venta, Plan de Pagos & Cobranzas</h2>
            <p className="text-xs text-slate-500">
              Gestión integral de cartera, semáforo de mora, conciliación bancaria y recibos
            </p>
          </div>
        </div>

        {/* Demo Simulations Toolbar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSimulateCriticalMora}
            className="text-[10px] font-bold text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100 py-1"
          >
            <ShieldAlert className="w-3 h-3" /> Simular Mora Crítica (3 Cuotas)
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleSimulateFullCancellation}
            className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 py-1"
          >
            <Sparkles className="w-3 h-3 text-emerald-600" /> Simular Cancelación ($0 Saldo)
          </Button>
        </div>
      </div>

      {/* Top Executive Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Card padding="sm" className="bg-white border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Cartera de Clientes Activa
          </span>
          <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
            {plans.length} Planes
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {plans.filter(p => p.totalInstallments === 60).length} con financiamiento a 60 cuotas
          </span>
        </Card>

        <Card padding="sm" className="bg-emerald-50/80 border-emerald-200 shadow-sm">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Cobrado este Mes (USD)
          </span>
          <div className="text-xl font-black text-emerald-900 font-mono mt-0.5">
            {formatUSD(totalCollectedThisMonthUSD)}
          </div>
          <span className="text-[10px] text-emerald-700 block mt-1 font-semibold">
            Proyección mes: {formatUSD(totalForecastUSD)}
          </span>
        </Card>

        <Card padding="sm" className="bg-amber-50/80 border-amber-200 shadow-sm">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
            Clientes en Mora
          </span>
          <div className="text-xl font-black text-amber-900 font-mono mt-0.5">
            {overduePlansCount} Cliente(s)
          </div>
          <span className="text-[10px] text-amber-800 block mt-1 font-bold">
            {criticalRiskPlansCount} en Riesgo Contractual
          </span>
        </Card>

        <Card padding="sm" className="bg-sky-50/80 border-sky-200 shadow-sm">
          <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
            Pagos sin Conciliar
          </span>
          <div className="text-xl font-black text-sky-900 font-mono mt-0.5">
            {unreconciledList.filter(u => u.status === 'SIN_CONCILIAR').length} Inbox
          </div>
          <span className="text-[10px] text-sky-700 block mt-1 font-semibold">
            {promisesList.filter(p => p.status === 'VIGENTE').length} promesas de pago vigentes
          </span>
        </Card>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white p-1.5 rounded-2xl shadow-sm">
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'COBRANZAS', label: 'Semáforo de Mora & Cartera', icon: AlertTriangle },
            { id: 'PLANES', label: 'Cuentas Corrientes', icon: FileText },
            { id: 'CONCILIACION', label: `Conciliación Inbox (${unreconciledList.filter(u => u.status === 'SIN_CONCILIAR').length})`, icon: Inbox },
            { id: 'PROMESAS', label: `Promesas (${promisesList.filter(p => p.status === 'VIGENTE').length})`, icon: Clock },
            { id: 'RECIBOS', label: 'Historial de Recibos', icon: Printer },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: SEMÁFORO DE MORA & CARTERA DE COBRANZAS */}
      {activeTab === 'COBRANZAS' && (
        <div className="space-y-3">
          
          {/* Risk Level Filter */}
          <div className="flex items-center justify-between gap-2 flex-wrap bg-white p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'TODOS', label: 'Todos' },
                { id: 'AL_DIA', label: 'Al Día' },
                { id: 'MORA_LEVE', label: 'Mora Leve (1 Cuota)' },
                { id: 'MORA_MEDIA', label: 'Mora Media (2 Cuotas)' },
                { id: 'MORA_CRITICA', label: 'Mora Crítica (3 Cuotas)' },
                { id: 'RIESGO_CONTRACTUAL', label: 'Riesgo Contractual' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setRiskFilter(id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    riskFilter === id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar cliente o lote..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Collection Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPlans.map(plan => {
              const summary = calculateAccountStatementSummary(plan);
              const { classification } = summary;

              return (
                <Card
                  key={plan.id}
                  padding="md"
                  className={`space-y-3 border-2 transition-all hover:shadow-md ${classification.border} ${classification.bg}/20`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900">{plan.customerName}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${classification.badgeClass}`}>
                          {classification.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Lote {plan.lotNumber} (Manzana {plan.block || 'A'}) — Plan 60 Cuotas
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPlanForStatement(plan)}
                      className="text-[11px] font-bold gap-1 shrink-0"
                    >
                      Ver Cta. Cte. <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Financial Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 text-xs bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Valor Cuota</span>
                      <strong className="text-slate-900 font-mono">{formatUSD(plan.monthlyAmountUSD)}</strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Progreso Pagos</span>
                      <strong className="text-emerald-700 font-mono">
                        {summary.paidInstallmentsCount} / {plan.totalInstallments || 60}
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase block">Saldo Pendiente</span>
                      <strong className="text-slate-900 font-mono">{formatUSD(summary.totalOutstandingUSD)}</strong>
                    </div>
                  </div>

                  {/* Risk Alert Detail */}
                  {summary.overdueInstallmentsCount > 0 && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-0.5">
                      <div className="flex items-center justify-between font-extrabold">
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          {summary.overdueInstallmentsCount} Cuota(s) Vencida(s)
                        </span>
                        <span className="font-mono text-rose-800">{summary.maxDaysOverdue} días de atraso</span>
                      </div>
                      <p className="text-[11px] text-rose-800 font-medium">
                        {classification.description}
                      </p>
                    </div>
                  )}

                  {/* Card Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedPlanForContact(plan)}
                        className="text-[10px] py-1 px-2.5 font-bold gap-1"
                      >
                        <PhoneCall className="w-3 h-3 text-sky-600" /> Contactar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedPlanForRefinancing(plan)}
                        className="text-[10px] py-1 px-2.5 font-bold gap-1 text-purple-800 border-purple-200 hover:bg-purple-50"
                      >
                        <RefreshCw className="w-3 h-3 text-purple-600" /> Refinanciar
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setSelectedPlanForPayment(plan);
                        setInitialInstallmentNumForPayment(undefined);
                      }}
                      className="text-[11px] font-bold py-1 px-3 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <DollarSign className="w-3.5 h-3.5" /> Registrar Pago
                    </Button>
                  </div>

                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CUENTAS CORRIENTES */}
      {activeTab === 'PLANES' && (
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Mostrando {plans.length} planes financiados
            </span>
            <span className="text-slate-500 text-[11px]">
              Seleccione un cliente para abrir su Estado de Cuenta interactivo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {plans.map(plan => {
              const summary = calculateAccountStatementSummary(plan);
              return (
                <Card
                  key={plan.id}
                  padding="md"
                  onClick={() => setSelectedPlanForStatement(plan)}
                  className="space-y-2 cursor-pointer hover:border-brand-500 hover:shadow-md transition-all border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-black text-slate-900">{plan.customerName}</strong>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${summary.classification.badgeClass}`}>
                      {summary.classification.label}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 block">
                    Lote {plan.lotNumber} | {plan.totalInstallments || 60} Cuotas
                  </span>

                  <div className="p-2 bg-slate-50 rounded-lg text-xs flex justify-between font-mono">
                    <span className="text-slate-500">Pagado:</span>
                    <strong className="text-emerald-700">{formatUSD(summary.totalPaidUSD)}</strong>
                  </div>

                  <Button size="sm" variant="outline" className="w-full text-xs font-bold gap-1 mt-1">
                    Abrir Estado de Cuenta <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CONCILIACIÓN DE PAGOS (INBOX) */}
      {activeTab === 'CONCILIACION' && (
        <div className="space-y-3">
          <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-xs text-sky-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-sky-600" />
              <div>
                <h4 className="font-extrabold uppercase">Bandeja de Conciliación Bancaria</h4>
                <p className="text-[11px] text-sky-800">
                  Transferencias y depósitos ingresados pendientes de asociación con la cuota correspondiente.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {unreconciledList.map(item => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-xs font-black text-slate-900">{item.clientName}</strong>
                    <Badge variant={item.status === 'CONCILIADO' ? 'success' : 'warning'}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 font-mono space-x-2">
                    <span>Lote: {item.lotNumber}</span>
                    <span>•</span>
                    <span>Ref: {item.reference}</span>
                    <span>•</span>
                    <span>Fecha: {item.paymentDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    {item.notes}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-medium block">Monto Acreditado</span>
                    <strong className="text-sm font-black text-emerald-800 font-mono">{formatUSD(item.amount)}</strong>
                  </div>

                  {item.status !== 'CONCILIADO' ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleReconcilePayment(item.id)}
                      className="text-xs font-extrabold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Conciliar Pago
                    </Button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Conciliado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROMESAS DE PAGO & GESTIONES */}
      {activeTab === 'PROMESAS' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Active Promises */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" /> Promesas de Pago Vigentes
              </h4>

              <div className="space-y-2">
                {promisesList.map(prom => (
                  <div key={prom.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{prom.customerName} (Lote {prom.lotNumber})</span>
                      <span className="font-mono text-emerald-700">{formatUSD(prom.promisedAmount)}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex justify-between">
                      <span>Compromiso para: <strong>{prom.promisedDate}</strong></span>
                      <Badge variant={prom.status === 'VIGENTE' ? 'info' : 'danger'}>{prom.status}</Badge>
                    </div>
                    <p className="text-[10px] text-slate-500 italic pt-1">{prom.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Communications Log */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-brand-600" /> Historial de Gestiones
              </h4>

              <div className="space-y-2">
                {communicationsList.map(comm => (
                  <div key={comm.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{comm.customerName} — {comm.type}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{comm.date}</span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{comm.result}</p>
                    {comm.nextAction && (
                      <div className="text-[10px] text-brand-700 font-bold pt-1">
                        Próxima acción: {comm.nextAction}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: HISTORIAL DE RECIBOS INTERNOS */}
      {activeTab === 'RECIBOS' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm">
          <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
            Recibos Internos de Pago Emitidos
          </h4>

          <div className="space-y-2">
            {receiptsList.map(rec => (
              <div
                key={rec.id}
                className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="font-mono text-brand-600">{rec.number}</span>
                    <span>•</span>
                    <span>{rec.customerName} (Lote {rec.lotNumber})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {rec.concept} | {rec.issuedAt}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <strong className="text-sm font-black text-emerald-800 font-mono">
                    {formatUSD(rec.amount)}
                  </strong>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveReceiptForModal(rec)}
                    className="text-[10px] py-1 font-bold gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Ver Recibo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ACCOUNT STATEMENT */}
      {selectedPlanForStatement && (
        <CustomerAccountStatementModal
          plan={selectedPlanForStatement}
          isOpen={!!selectedPlanForStatement}
          onClose={() => setSelectedPlanForStatement(null)}
          onOpenRegisterPayment={(installmentNum) => {
            const p = selectedPlanForStatement;
            setSelectedPlanForStatement(null);
            setSelectedPlanForPayment(p);
            setInitialInstallmentNumForPayment(installmentNum);
          }}
          onOpenRefinancing={() => {
            const p = selectedPlanForStatement;
            setSelectedPlanForStatement(null);
            setSelectedPlanForRefinancing(p);
          }}
        />
      )}

      {/* MODAL: REGISTER PAYMENT */}
      {selectedPlanForPayment && (
        <RegisterPaymentModal
          plan={selectedPlanForPayment}
          initialInstallmentNumber={initialInstallmentNumForPayment}
          isOpen={!!selectedPlanForPayment}
          onClose={() => setSelectedPlanForPayment(null)}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      {/* MODAL: RECEIPT */}
      {activeReceiptForModal && (
        <ReceiptModal
          receipt={activeReceiptForModal}
          isOpen={!!activeReceiptForModal}
          onClose={() => setActiveReceiptForModal(null)}
        />
      )}

      {/* MODAL: CONTACT & COMMUNICATION */}
      {selectedPlanForContact && (
        <CollectionContactModal
          plan={selectedPlanForContact}
          isOpen={!!selectedPlanForContact}
          onClose={() => setSelectedPlanForContact(null)}
          onSaveCommunication={comm => setCommunicationsList([comm, ...communicationsList])}
          onSavePromise={prom => setPromisesList([prom, ...promisesList])}
        />
      )}

      {/* MODAL: REFINANCING */}
      {selectedPlanForRefinancing && (
        <RefinancingModal
          plan={selectedPlanForRefinancing}
          isOpen={!!selectedPlanForRefinancing}
          onClose={() => setSelectedPlanForRefinancing(null)}
          onSaveProposal={prop => setRefinancingList([prop, ...refinancingList])}
        />
      )}

    </div>
  );
};
