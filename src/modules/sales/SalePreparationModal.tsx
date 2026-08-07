import React, { useState } from 'react';
import { Reservation, Lot, Sale, PaymentPlan, AdjustmentType } from '../../types';
import { formatUSD, formatARS } from '../../domain/rules';
import { generateInstallmentSchedule } from '../../domain/paymentsDomain';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  X,
  CheckCircle,
  FileText,
  DollarSign,
  User,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SalePreparationModalProps {
  reservation: Reservation;
  lot?: Lot;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSale: (saleData: {
    sale: Sale;
    paymentPlan: PaymentPlan;
  }) => void;
}

export const SalePreparationModal: React.FC<SalePreparationModalProps> = ({
  reservation,
  lot,
  isOpen,
  onClose,
  onConfirmSale,
}) => {
  if (!isOpen) return null;

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Buyer Info
  const [customerName, setCustomerName] = useState(reservation.leadName || 'Cliente Comprador');
  const [customerDni, setCustomerDni] = useState('32.890.112');
  const [customerPhone, setCustomerPhone] = useState('+54 9 11 5544 3322');
  const [customerEmail, setCustomerEmail] = useState('cliente@ejemplo.com');

  // Pricing & Financing
  const agreedPriceUSD = reservation.agreedPriceUSD || reservation.agreedPrice || 35000;
  const depositAmountUSD = reservation.depositAmountUSD || reservation.depositAmount || 2000;

  const [additionalDownPaymentUSD, setAdditionalDownPaymentUSD] = useState<number>(
    Math.round(agreedPriceUSD * 0.3) - depositAmountUSD
  );

  const totalDownPaymentUSD = depositAmountUSD + additionalDownPaymentUSD;
  const financedAmountUSD = Math.max(0, agreedPriceUSD - totalDownPaymentUSD);

  const [installmentCount, setInstallmentCount] = useState<36 | 48 | 60>(60);
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('CAC_MENSUAL');

  // Monthly payment estimation
  const monthlyPaymentUSD = Math.round(financedAmountUSD / installmentCount);

  // Documentation checklist
  const [docsChecked, setDocsChecked] = useState({
    identityProof: true,
    cuitProof: true,
    incomeProof: true,
    maritalStatusProof: true,
    contractDraftApproved: true,
  });

  const allDocsComplete = Object.values(docsChecked).every(Boolean);

  const handleExecuteSale = () => {
    const saleId = `sale-${Date.now().toString().slice(-6)}`;
    const paymentPlanId = `plan-${Date.now().toString().slice(-6)}`;

    const newSale: Sale = {
      id: saleId,
      saleNumber: `VEN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      reservationId: reservation.id,
      lotId: reservation.lotId,
      lotNumber: reservation.lotNumber,
      block: reservation.block,
      customerName,
      customerDni,
      customerPhone,
      customerEmail,
      agentName: reservation.agentName || 'Gonzalo Rossi',
      saleDate: new Date().toISOString().slice(0, 10),
      totalAmountUSD: agreedPriceUSD,
      downPaymentUSD: totalDownPaymentUSD,
      agreedPrice: agreedPriceUSD,
      initialPaymentAmount: totalDownPaymentUSD,
      financedAmount: financedAmountUSD,
      installmentCount,
      contractStatus: 'BOLETO_FIRMADO',
      status: 'FINANCIADA',
      currency: 'USD',
      notes: 'Venta formalizada mediante firma de Boleto de Compraventa con plan financiado.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const generatedInstallments = generateInstallmentSchedule({
      paymentPlanId,
      totalAmountUSD: agreedPriceUSD,
      downPaymentUSD: totalDownPaymentUSD,
      installmentCount,
      firstDueDateIso: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const newPaymentPlan: PaymentPlan = {
      id: paymentPlanId,
      saleId,
      customerName,
      lotId: reservation.lotId,
      lotNumber: reservation.lotNumber,
      block: reservation.block,
      currency: 'USD',
      originalAmount: agreedPriceUSD,
      downPaymentUSD: totalDownPaymentUSD,
      financedAmount: financedAmountUSD,
      totalInstallments: installmentCount,
      installmentCount,
      paidInstallmentsCount: 0,
      monthlyAmountUSD: monthlyPaymentUSD,
      adjustmentType,
      installments: generatedInstallments,
      status: 'AL_DIA',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onConfirmSale({
      sale: newSale,
      paymentPlan: newPaymentPlan,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Formalización y Firma de Venta</h3>
              <p className="text-[11px] text-slate-300">
                Reserva {reservation.reservationNumber} — Lote {reservation.lotNumber} ({reservation.block})
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

        {/* Wizard Steps Navigation */}
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 flex items-center justify-around text-xs font-extrabold">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              step === 1 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>1. Datos Comprador</span>
          </button>
          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              step === 2 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>2. Plan Financiero</span>
          </button>
          <button
            onClick={() => setStep(3)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              step === 3 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>3. Checklist & Firma</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* STEP 1: BUYER DETAILS */}
          {step === 1 && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                Información Personal del Titular
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">DNI / CUIT *</label>
                  <input
                    type="text"
                    value={customerDni}
                    onChange={e => setCustomerDni(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Teléfono Móvil *</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <span className="font-extrabold text-slate-800 block">Lote a Formalizar</span>
                <div className="flex items-center justify-between font-mono font-bold text-slate-900">
                  <span>Lote {reservation.lotNumber} (Manzana {reservation.block})</span>
                  <span>Precio de Lista: {formatUSD(agreedPriceUSD)}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" size="sm" onClick={() => setStep(2)} className="gap-1">
                  Siguiente: Configurar Financiación <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: FINANCING CONFIG */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                Estructura Económica y Plan de Pagos
              </h4>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2">
                <div className="flex justify-between font-bold text-emerald-900">
                  <span>Seña Acreditada Previamente:</span>
                  <span className="font-mono text-sm">{formatUSD(depositAmountUSD)}</span>
                </div>

                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                  <label className="font-extrabold text-emerald-950">
                    Anticipo Adicional a Integrar en Firma (USD):
                  </label>
                  <input
                    type="number"
                    value={additionalDownPaymentUSD}
                    onChange={e => setAdditionalDownPaymentUSD(Number(e.target.value))}
                    className="w-32 px-2 py-1 bg-white border border-emerald-300 rounded-lg text-right font-mono font-bold text-emerald-950 text-xs"
                  />
                </div>

                <div className="flex justify-between text-xs text-emerald-800 font-extrabold pt-1 border-t border-emerald-200">
                  <span>Anticipo Total Consolidado:</span>
                  <span className="font-mono">{formatUSD(totalDownPaymentUSD)}</span>
                </div>
              </div>

              {/* Installment count radio buttons */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 block">
                  Plazo de Financiación (Cuotas)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[36, 48, 60].map(count => (
                    <button
                      type="button"
                      key={count}
                      onClick={() => setInstallmentCount(count as 36 | 48 | 60)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        installmentCount === count
                          ? 'bg-slate-900 text-white font-black border-slate-900 shadow-md'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm block">{count} Cuotas</span>
                      <span className="text-[10px] opacity-80 font-mono">
                        ~{formatUSD(Math.round(financedAmountUSD / count))}/mes
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Adjustment Type selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tipo de Ajuste
                </label>
                <select
                  value={adjustmentType}
                  onChange={e => setAdjustmentType(e.target.value as AdjustmentType)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="CAC_MENSUAL">Índice CAC (Cámara Argentina de la Construcción) — Ajuste Mensual</option>
                  <option value="FIJO_USD">Cuota Fija en USD (Sin ajuste)</option>
                  <option value="CAC_TRIMESTRAL">Índice CAC — Ajuste Trimestral</option>
                </select>
              </div>

              {/* Summary calculated box */}
              <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-300">Saldo a Financiar:</span>
                  <strong className="font-mono text-brand-400">{formatUSD(financedAmountUSD)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Cuota Inicial Estimada:</span>
                  <strong className="font-mono text-emerald-400 text-sm">{formatUSD(monthlyPaymentUSD)} / mes</strong>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  Anterior
                </Button>
                <Button variant="primary" size="sm" onClick={() => setStep(3)} className="gap-1">
                  Siguiente: Checklist & Confirmación <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: CHECKLIST & EXECUTE */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                Verificación de Documentación Contractual
              </h4>

              <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {Object.entries({
                  identityProof: 'DNI / CUIT del comprador verificado',
                  cuitProof: 'Constancia de CUIT / CUIL actualizada',
                  incomeProof: 'Justificación de Fondos / Recibo de sueldo',
                  maritalStatusProof: 'Acreditación de Estado Civil',
                  contractDraftApproved: 'Borrador de Boleto revisado y aceptado',
                }).map(([key, label]) => {
                  const checked = docsChecked[key as keyof typeof docsChecked];
                  return (
                    <label key={key} className="flex items-center gap-2 text-xs text-slate-800 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={e =>
                          setDocsChecked({ ...docsChecked, [key]: e.target.checked })
                        }
                        className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>

              {/* Execution Summary */}
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-xs text-emerald-950">
                <div className="flex items-center gap-2 font-black text-emerald-900">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Resumen de Venta a Confirmar</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <div>Cliente: <strong>{customerName}</strong></div>
                  <div>Lote: <strong>{reservation.lotNumber}</strong></div>
                  <div>Precio Venta: <strong>{formatUSD(agreedPriceUSD)}</strong></div>
                  <div>Anticipo Total: <strong>{formatUSD(totalDownPaymentUSD)}</strong></div>
                  <div>Financiación: <strong>{installmentCount} cuotas de ~{formatUSD(monthlyPaymentUSD)}</strong></div>
                  <div>Ajuste: <strong>{adjustmentType}</strong></div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                  Anterior
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExecuteSale}
                  disabled={!allDocsComplete}
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirmar Venta y Generar Plan (60 Cuotas)
                </Button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
