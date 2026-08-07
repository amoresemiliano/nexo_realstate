import React, { useState } from 'react';
import { PaymentPlan, Installment, Sale } from '../../types';
import { formatUSD, formatARS } from '../../domain/rules';
import { calculateAccountStatementSummary } from '../../domain/paymentsDomain';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  X,
  FileText,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Download,
  DollarSign,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Plus
} from 'lucide-react';

interface CustomerAccountStatementModalProps {
  plan: PaymentPlan;
  sale?: Sale;
  isOpen: boolean;
  onClose: () => void;
  onOpenRegisterPayment: (installmentNumber?: number) => void;
  onOpenRefinancing?: () => void;
}

export const CustomerAccountStatementModal: React.FC<CustomerAccountStatementModalProps> = ({
  plan,
  sale,
  isOpen,
  onClose,
  onOpenRegisterPayment,
  onOpenRefinancing,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'CRONOGRAMA' | 'MOVIMIENTOS' | 'ACCIONES'>('CRONOGRAMA');
  const [statusFilter, setStatusFilter] = useState<'TODAS' | 'VENCIDAS' | 'PENDIENTES' | 'PAGADAS'>('TODAS');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const summary = calculateAccountStatementSummary(plan);
  const installments = plan.installments || [];

  // Filter logic
  const filteredInstallments = installments.filter(i => {
    if (statusFilter === 'VENCIDAS' && i.status !== 'VENCIDO') return false;
    if (statusFilter === 'PENDIENTES' && i.status !== 'PENDIENTE' && i.status !== 'PROXIMA') return false;
    if (statusFilter === 'PAGADAS' && i.status !== 'PAGADO') return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const numMatch = i.number.toString().includes(term);
      const dateMatch = i.dueDate.toLowerCase().includes(term);
      return numMatch || dateMatch;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredInstallments.length / pageSize) || 1;
  const paginatedInstallments = filteredInstallments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">Estado de Cuenta Corriente</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${summary.classification.badgeClass}`}>
                  {summary.classification.label}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {plan.customerName} — Lote {plan.lotNumber} ({plan.block || 'A'}) | {plan.totalInstallments || 60} Cuotas Financiadas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-slate-50">
          
          {/* Executive Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Precio Total Lote
              </span>
              <div className="text-base font-black text-slate-900 font-mono mt-0.5">
                {formatUSD(summary.lotPriceUSD)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Anticipo: {formatUSD(summary.downPaymentUSD)}
              </div>
            </div>

            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 shadow-sm">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Total Abonado
              </span>
              <div className="text-base font-black text-emerald-900 font-mono mt-0.5">
                {formatUSD(summary.totalPaidUSD)}
              </div>
              <div className="text-[10px] text-emerald-700 mt-1 font-semibold">
                {summary.paidInstallmentsCount} de {plan.totalInstallments || 60} cuotas ({Math.round((summary.paidInstallmentsCount / (plan.totalInstallments || 60)) * 100)}%)
              </div>
            </div>

            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 shadow-sm">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Saldo Pendiente
              </span>
              <div className="text-base font-black text-amber-900 font-mono mt-0.5">
                {formatUSD(summary.totalOutstandingUSD)}
              </div>
              <div className="text-[10px] text-amber-800 mt-1">
                {summary.pendingInstallmentsCount} cuotas restantes
              </div>
            </div>

            <div className={`p-3 rounded-xl border shadow-sm ${
              summary.overdueInstallmentsCount > 0
                ? 'bg-rose-50 border-rose-200'
                : 'bg-white border-slate-200'
            }`}>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Cuotas Vencidas / Mora
              </span>
              <div className={`text-base font-black font-mono mt-0.5 ${
                summary.overdueInstallmentsCount > 0 ? 'text-rose-700' : 'text-slate-900'
              }`}>
                {summary.overdueInstallmentsCount} cuota(s)
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-medium">
                {summary.maxDaysOverdue > 0 ? `${summary.maxDaysOverdue} días de atraso máx.` : 'Al día sin mora'}
              </div>
            </div>
          </div>

          {/* Cancellation Banner if 100% paid */}
          {summary.isFullyPaid && (
            <div className="bg-emerald-600 text-white p-3 rounded-xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-6 h-6 text-emerald-200 shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wide">Saldo Económico Cancelado al 100%</h4>
                  <p className="text-[11px] text-emerald-100">
                    El comprador ha saldado la totalidad de las cuotas. Se habilitó el inicio de tramitación para la Escrituración Definitiva.
                  </p>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="text-xs shrink-0 font-bold">
                Iniciar Escrituración
              </Button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white p-1 rounded-xl shadow-sm">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('CRONOGRAMA')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'CRONOGRAMA'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cronograma de Cuotas ({installments.length})
              </button>
              <button
                onClick={() => setActiveTab('MOVIMIENTOS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'MOVIMIENTOS'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Historial de Pagos
              </button>
              <button
                onClick={() => setActiveTab('ACCIONES')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'ACCIONES'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Acciones de Cobranza
              </button>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => onOpenRegisterPayment()}
              className="gap-1 text-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Registrar Pago
            </Button>
          </div>

          {/* TAB 1: CRONOGRAMA DE CUOTAS */}
          {activeTab === 'CRONOGRAMA' && (
            <div className="space-y-3">
              
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => { setStatusFilter('TODAS'); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                      statusFilter === 'TODAS'
                        ? 'bg-slate-800 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Todas ({installments.length})
                  </button>
                  <button
                    onClick={() => { setStatusFilter('VENCIDAS'); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                      statusFilter === 'VENCIDAS'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-slate-200 text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    Vencidas ({summary.overdueInstallmentsCount})
                  </button>
                  <button
                    onClick={() => { setStatusFilter('PENDIENTES'); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                      statusFilter === 'PENDIENTES'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border border-slate-200 text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    Pendientes ({summary.pendingInstallmentsCount})
                  </button>
                  <button
                    onClick={() => { setStatusFilter('PAGADAS'); setCurrentPage(1); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                      statusFilter === 'PAGADAS'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    Pagadas ({summary.paidInstallmentsCount})
                  </button>
                </div>

                <div className="relative w-full sm:w-48">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    placeholder="Buscar cuota N°..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-1 focus:ring-slate-400"
                  />
                </div>
              </div>

              {/* Installments Table / Grid */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Cuota</th>
                        <th className="py-2.5 px-3">Vencimiento</th>
                        <th className="py-2.5 px-3">Monto (USD)</th>
                        <th className="py-2.5 px-3">Ajuste CAC</th>
                        <th className="py-2.5 px-3">Estado</th>
                        <th className="py-2.5 px-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedInstallments.map(inst => {
                        const isPaid = inst.status === 'PAGADO';
                        const isOverdue = inst.status === 'VENCIDO';
                        const isUpcoming = inst.status === 'PROXIMA';

                        return (
                          <tr key={inst.number} className={`hover:bg-slate-50 transition-colors ${
                            isOverdue ? 'bg-rose-50/40' : isUpcoming ? 'bg-sky-50/30' : ''
                          }`}>
                            <td className="py-2.5 px-3 font-extrabold text-slate-900">
                              #{inst.number}
                            </td>
                            <td className="py-2.5 px-3 text-slate-700 font-mono">
                              {inst.dueDate}
                              {inst.daysOverdue ? (
                                <span className="ml-1 text-[10px] font-bold text-rose-600">
                                  ({inst.daysOverdue}d mora)
                                </span>
                              ) : null}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">
                              {formatUSD(inst.amountUSD)}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                              {inst.cacIndexAdjustment ? `x${inst.cacIndexAdjustment.toFixed(2)}` : '1.00'}
                            </td>
                            <td className="py-2.5 px-3">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  Pagado ({inst.paidDate || 'Acreditado'})
                                </span>
                              ) : isOverdue ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                                  Vencida
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                  Pendiente
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {!isPaid && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onOpenRegisterPayment(inst.number)}
                                  className="text-[10px] py-1 px-2 h-auto"
                                >
                                  Cobrar
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <span>
                      Página {currentPage} de {totalPages} ({filteredInstallments.length} cuotas)
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="text-[10px] py-0.5 px-2"
                      >
                        Anterior
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="text-[10px] py-0.5 px-2"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: HISTORIAL DE MOVIMIENTOS */}
          {activeTab === 'MOVIMIENTOS' && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                Registro de Transacciones e Ingresos
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 block">Seña de Reserva Lote {plan.lotNumber}</span>
                    <span className="text-[11px] text-slate-500">Acreditación inicial vía Transferencia</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-700 block">+ {formatUSD(plan.downPaymentUSD * 0.2 || 2000)}</span>
                    <span className="text-[10px] text-slate-400">Confirmado</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 block">Anticipo en Firma de Boleto</span>
                    <span className="text-[11px] text-slate-500">Pago anticipo consolidado</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-700 block">+ {formatUSD(plan.downPaymentUSD)}</span>
                    <span className="text-[10px] text-slate-400">Confirmado</span>
                  </div>
                </div>

                {installments.filter(i => i.status === 'PAGADO').slice(0, 10).map(i => (
                  <div key={i.number} className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div>
                      <span className="font-bold text-slate-800 block">Cobro Cuota #{i.number} de {plan.totalInstallments || 60}</span>
                      <span className="text-[11px] text-slate-500">Recibo {i.receiptNumber || `REC-2026-00${i.number}`}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700 block">+ {formatUSD(i.amountUSD)}</span>
                      <span className="text-[10px] text-slate-400">{i.paidDate || 'Acreditado'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ACCIONES DE COBRANZA */}
          {activeTab === 'ACCIONES' && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                Gestión Directa y Refinanciaciones
              </h4>
              <p className="text-xs text-slate-600">
                Opciones administrativas para solucionar situaciones de mora o emitir estados de cuenta exportables.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => onOpenRegisterPayment()}
                  className="p-3 bg-brand-50 hover:bg-brand-100/80 border border-brand-200 rounded-xl text-left transition-colors"
                >
                  <DollarSign className="w-5 h-5 text-brand-600 mb-1" />
                  <strong className="text-xs font-bold text-brand-900 block">Registrar Cobro</strong>
                  <span className="text-[11px] text-brand-700">Imputar pago manual a cuotas vencidas o futuras</span>
                </button>

                <button
                  onClick={onOpenRefinancing}
                  className="p-3 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 rounded-xl text-left transition-colors"
                >
                  <RefreshCw className="w-5 h-5 text-purple-600 mb-1" />
                  <strong className="text-xs font-bold text-purple-900 block">Solicitar Refinanciación</strong>
                  <span className="text-[11px] text-purple-700">Rearmar plan a más cuotas o modificar plazos</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-3 px-4 border-t border-slate-200 flex items-center justify-between shrink-0 no-print">
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1 text-xs">
            <Download className="w-3.5 h-3.5" />
            Exportar Estado de Cuenta (PDF/Print)
          </Button>

          <Button variant="primary" size="sm" onClick={onClose} className="text-xs font-bold">
            Cerrar
          </Button>
        </div>

      </div>
    </div>
  );
};
