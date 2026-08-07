import React, { useState } from 'react';
import { Sale, PaymentPlan, Reservation } from '../../types';
import { mockSales, mockReservations, mockPaymentPlans } from '../../data/mockData';
import { formatUSD } from '../../domain/rules';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { FileCheck, Download, Plus, Sparkles, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import { SalePreparationModal } from './SalePreparationModal';
import { CustomerAccountStatementModal } from '../payments/CustomerAccountStatementModal';
import { RegisterPaymentModal } from '../payments/RegisterPaymentModal';

export const SalesModule: React.FC = () => {
  const [salesList, setSalesList] = useState<Sale[]>(mockSales);
  const [reservationsList, setReservationsList] = useState<Reservation[]>(mockReservations);
  const [paymentPlansList, setPaymentPlansList] = useState<PaymentPlan[]>(mockPaymentPlans);

  // Modal States
  const [selectedReservationForModal, setSelectedReservationForModal] = useState<Reservation | null>(null);
  const [selectedPlanForStatement, setSelectedPlanForStatement] = useState<PaymentPlan | null>(null);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<PaymentPlan | null>(null);

  // Available reservations ready for sale conversion
  const confirmedReservations = reservationsList.filter(
    r => r.status === 'CONFIRMADA' || r.documentationStatus === 'COMPLETA' || r.status === 'SENA_INFORMADA'
  );

  const handleConfirmSaleFromModal = (data: { sale: Sale; paymentPlan: PaymentPlan }) => {
    setSalesList([data.sale, ...salesList]);
    setPaymentPlansList([data.paymentPlan, ...paymentPlansList]);

    // Update reservation status to converted
    if (data.sale.reservationId) {
      setReservationsList(
        reservationsList.map(r =>
          r.id === data.sale.reservationId ? { ...r, status: 'CONFIRMADA' as const } : r
        )
      );
    }

    // Automatically open statement for newly created sale
    setSelectedPlanForStatement(data.paymentPlan);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-brand-400 font-black flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Ventas & Contratos Formalizados</h2>
            <p className="text-xs text-slate-500">
              Transformación contractual de Reservas en Ventas, Boletos de Compraventa y Planes Financiados
            </p>
          </div>
        </div>

        {/* Action button if there are confirmed reservations */}
        {confirmedReservations.length > 0 && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => setSelectedReservationForModal(confirmedReservations[0])}
            className="text-xs font-black gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
          >
            <Sparkles className="w-4 h-4" /> Formalizar Venta de Reserva ({confirmedReservations.length})
          </Button>
        )}
      </div>

      {/* Confirmed Reservations Pending Sale Formalization Bar */}
      {confirmedReservations.length > 0 && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="font-extrabold uppercase block text-emerald-900">
                Reservas Confirmadas listas para Firma de Boleto
              </strong>
              <p className="text-[11px] text-emerald-800">
                Lote {confirmedReservations[0].lotNumber} — {confirmedReservations[0].leadName} (Seña de {formatUSD(confirmedReservations[0].depositAmountUSD || 2000)} acreditada)
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => setSelectedReservationForModal(confirmedReservations[0])}
            className="text-xs font-bold gap-1 bg-emerald-700 hover:bg-emerald-800 text-white shrink-0"
          >
            Formalizar Venta <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Confirmed Sales List */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
          Registro Oficial de Boletos y Ventas Confirmadas ({salesList.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {salesList.map(sale => {
            const correspondingPlan = paymentPlansList.find(p => p.saleId === sale.id || p.customerName === sale.customerName);

            return (
              <Card key={sale.id} padding="md" className="space-y-3 border-slate-200 hover:shadow-md transition-all">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-brand-600 block">
                      {sale.saleNumber || 'VEN-2026-0001'}
                    </span>
                    <h4 className="text-sm font-black text-slate-900">Lote {sale.lotNumber} ({sale.block})</h4>
                    <span className="text-xs text-slate-600 font-medium">{sale.customerName}</span>
                  </div>

                  <Badge variant={sale.status === 'CANCELADA_ECONOMICAMENTE' ? 'success' : 'brand'}>
                    {sale.contractStatus || 'BOLETO_FIRMADO'}
                  </Badge>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Precio Total</span>
                    <strong className="text-slate-900">{formatUSD(sale.agreedPrice || sale.totalAmountUSD)}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Anticipo</span>
                    <strong className="text-emerald-700">{formatUSD(sale.initialPaymentAmount || sale.downPaymentUSD)}</strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Financiado</span>
                    <strong className="text-slate-900">{formatUSD(sale.financedAmount || (sale.totalAmountUSD - sale.downPaymentUSD))}</strong>
                  </div>
                </div>

                {/* Buyer Data & Agent */}
                <div className="text-xs text-slate-600 space-y-0.5">
                  <div className="flex justify-between">
                    <span>DNI/CUIT: <strong>{sale.customerDni}</strong></span>
                    <span>Tel: <strong>{sale.customerPhone}</strong></span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Fecha Venta: {sale.saleDate}</span>
                    <span>Agente: {sale.agentName}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  {correspondingPlan && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPlanForStatement(correspondingPlan)}
                      className="text-[11px] font-bold gap-1 text-slate-800"
                    >
                      Ver Cta. Cte. (60 Cuotas) <ArrowUpRight className="w-3 h-3 text-brand-600" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => alert(`Descargando Boleto de Compraventa en PDF para ${sale.customerName}...`)}
                    className="text-[11px] font-bold gap-1 text-brand-700 border-brand-200 hover:bg-brand-50"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF Boleto
                  </Button>
                </div>

              </Card>
            );
          })}
        </div>
      </div>

      {/* MODAL: SALE PREPARATION */}
      {selectedReservationForModal && (
        <SalePreparationModal
          reservation={selectedReservationForModal}
          isOpen={!!selectedReservationForModal}
          onClose={() => setSelectedReservationForModal(null)}
          onConfirmSale={handleConfirmSaleFromModal}
        />
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
          }}
        />
      )}

      {/* MODAL: REGISTER PAYMENT */}
      {selectedPlanForPayment && (
        <RegisterPaymentModal
          plan={selectedPlanForPayment}
          isOpen={!!selectedPlanForPayment}
          onClose={() => setSelectedPlanForPayment(null)}
          onConfirmPayment={() => alert('Pago registrado correctamente.')}
        />
      )}

    </div>
  );
};
