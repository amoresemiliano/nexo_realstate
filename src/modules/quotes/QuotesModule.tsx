import React, { useState } from 'react';
import { Lot, Lead, Quote, QuoteOption } from '../../types';
import { calculateQuote, formatUSD, formatARS, QUOTE_STATUS_LABELS } from '../../domain/rules';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Calculator, Download, Share2, DollarSign, Calendar, CheckCircle2, ArrowRight, UserCheck, MessageSquare, History, FilePlus, Sparkles, Send } from 'lucide-react';

interface QuotesModuleProps {
  initialLot?: Lot | null;
  lots: Lot[];
  leads?: Lead[];
  quotes?: Quote[];
  onSaveQuote?: (quote: Quote) => void;
  onUpdateQuoteStatus?: (quoteId: string, status: Quote['status'], feedbackNotes?: string) => void;
}

export const QuotesModule: React.FC<QuotesModuleProps> = ({
  initialLot,
  lots,
  leads = [],
  quotes = [],
  onSaveQuote,
  onUpdateQuoteStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'SIMULADOR' | 'HISTORIAL'>('SIMULADOR');

  // Simulator State
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [selectedLotId, setSelectedLotId] = useState<string>(
    initialLot ? initialLot.id : (lots.find(l => l.status === 'DISPONIBLE')?.id || lots[0]?.id || '')
  );
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [installmentsCount, setInstallmentsCount] = useState<number>(36);
  const [adjustmentType, setAdjustmentType] = useState<QuoteOption['adjustmentType']>('CAC_MENSUAL');
  const [usdToArsRate, setUsdToArsRate] = useState<number>(1280);
  const [cacEstimatePercent, setCacEstimatePercent] = useState<number>(38);
  const [commercialNotes, setCommercialNotes] = useState<string>('Condiciones válidas por 7 días corridos desde la emisión.');

  // Generated / Saved Quote State
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [quoteVersion, setQuoteVersion] = useState<number>(1);
  const [clientReactionModalOpen, setClientReactionModalOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<Quote['status']>('ENVIADA');
  const [reactionNotes, setReactionNotes] = useState<string>('');

  const selectedLot = lots.find(l => l.id === selectedLotId) || lots[0];
  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];
  const lotPrice = selectedLot ? selectedLot.priceUSD : 30000;

  const quoteCalculated = calculateQuote({
    lotPriceUSD: lotPrice,
    downPaymentPercent,
    installmentsCount,
    usdToArsRate,
    cacAnnualEstimatePercent: cacEstimatePercent,
  });

  const handleGenerateQuote = () => {
    if (!selectedLot) return;

    const newOption: QuoteOption = {
      id: `opt-${Date.now()}`,
      lotId: selectedLot.id,
      lotNumber: selectedLot.number,
      block: selectedLot.block,
      stage: selectedLot.stage,
      listPrice: selectedLot.listPrice || selectedLot.priceUSD,
      offeredPrice: selectedLot.priceUSD,
      downPayment: quoteCalculated.downPaymentUSD,
      downPaymentPercent: downPaymentPercent,
      financedAmount: quoteCalculated.balanceToFinanceUSD,
      installmentCount: installmentsCount,
      initialInstallmentAmount: quoteCalculated.monthlyInstallmentUSD,
      totalInitialPayment: quoteCalculated.downPaymentUSD,
      adjustmentType: adjustmentType,
      currency: 'USD',
    };

    const newQuote: Quote = {
      id: `cot-${Date.now()}`,
      quoteNumber: `COT-${Math.floor(1000 + Math.random() * 9000)}`,
      leadId: selectedLead?.id || 'lead-guest',
      leadName: selectedLead?.fullName || 'Cliente Potencial',
      developmentId: selectedLot.developmentId || 'dev-1',
      developmentName: 'Nexo Desarrollos',
      sellerId: 'seller-1',
      sellerName: 'Gonzalo Rossi',
      options: [newOption],
      version: quoteVersion,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'BORRADOR',
      createdAt: new Date().toISOString(),
      notes: commercialNotes,
    };

    setCurrentQuote(newQuote);
    if (onSaveQuote) {
      onSaveQuote(newQuote);
    }
  };

  const handleShareWhatsApp = () => {
    if (!currentQuote || !selectedLot) return;
    const text = `*COTIZACIÓN COMERCIAL - NEXO DESARROLLOS*%0A` +
      `Cód: ${currentQuote.quoteNumber} (v${currentQuote.version})%0A` +
      `Lote ${selectedLot.block}-${selectedLot.number} (${selectedLot.stage})%0A` +
      `Precio: ${formatUSD(selectedLot.priceUSD)}%0A` +
      `Anticipo: ${formatUSD(quoteCalculated.downPaymentUSD)} (${downPaymentPercent}%)%0A` +
      `Financiación: ${installmentsCount} cuotas de ${formatUSD(quoteCalculated.monthlyInstallmentUSD)}/mes%0A` +
      `Ajuste: ${adjustmentType}%0A` +
      `Validez: ${currentQuote.validUntil}%0A` +
      `_Contacta a tu asesor comercial para reservar._`;

    window.open(`https://wa.me/?text=${text}`, '_blank');

    // Update status to ENVIADA
    const updated = { ...currentQuote, status: 'ENVIADA' as Quote['status'] };
    setCurrentQuote(updated);
    if (onSaveQuote) onSaveQuote(updated);
  };

  const handleRegisterReaction = () => {
    if (!currentQuote) return;
    const updated = {
      ...currentQuote,
      status: selectedReaction,
      notes: `${currentQuote.notes || ''} [Reacción: ${selectedReaction} - ${reactionNotes}]`,
    };
    setCurrentQuote(updated);
    if (onSaveQuote) onSaveQuote(updated);
    if (onUpdateQuoteStatus) onUpdateQuoteStatus(currentQuote.id, selectedReaction, reactionNotes);
    setClientReactionModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div>
          <h2 className="text-lg font-black text-slate-900">Cotizador & Simulador Comercial</h2>
          <p className="text-xs text-slate-500">Cálculo de propuestas, versiones y registro de respuesta del cliente</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-extrabold">
          <button
            onClick={() => setActiveTab('SIMULADOR')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'SIMULADOR' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-brand-600" />
            <span>Simulador</span>
          </button>
          <button
            onClick={() => setActiveTab('HISTORIAL')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'HISTORIAL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            <History className="w-3.5 h-3.5 text-brand-600" />
            <span>Cotizaciones ({quotes.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'SIMULADOR' ? (
        <div className="space-y-4">
          {/* Associated Lead & Lot Selection Card */}
          <Card padding="md" className="space-y-3 border-2 border-brand-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  1. Cliente / Lead Destinatario:
                </label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} ({l.phone}) — Prep: {formatUSD(l.budgetUSD)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  2. Lote Seleccionado:
                </label>
                <select
                  value={selectedLotId}
                  onChange={(e) => setSelectedLotId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {lots.map(l => (
                    <option key={l.id} value={l.id}>
                      Lote {l.block}-{l.number} ({l.stage}) — {formatUSD(l.priceUSD)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedLot && (
              <div className="bg-brand-50 p-3 rounded-xl border border-brand-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-brand-900">Lote {selectedLot.block}-{selectedLot.number} ({selectedLot.stage})</span>
                  <span className="text-brand-700 block text-[11px]">{selectedLot.surfaceM2} m² • Orientación {selectedLot.orientation}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-brand-600 block uppercase font-bold">Precio Lista</span>
                  <span className="text-base font-black text-brand-900">{formatUSD(selectedLot.priceUSD)}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Configuration Inputs */}
          <Card padding="md" className="space-y-4">
            {/* Down Payment % Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Porcentaje de Anticipo Sugerido:</span>
                <span className="font-black text-brand-600 text-sm">{downPaymentPercent}% ({formatUSD(quoteCalculated.downPaymentUSD)})</span>
              </div>
              <input
                type="range"
                min={10}
                max={70}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-brand-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10% (Min)</span>
                <span>30% (Standard)</span>
                <span>50%</span>
                <span>70%</span>
              </div>
            </div>

            {/* Installment Duration Buttons */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">Plazo de Financiación (Meses):</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[12, 24, 36, 48, 60].map(months => (
                  <button
                    key={months}
                    onClick={() => setInstallmentsCount(months)}
                    className={`py-2 rounded-xl text-xs font-extrabold transition-all ${
                      installmentsCount === months
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {months} cuotas
                  </button>
                ))}
              </div>
            </div>

            {/* Adjustment Type & Financial Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tipo de Ajuste:
                </label>
                <select
                  value={adjustmentType}
                  onChange={(e) => setAdjustmentType(e.target.value as QuoteOption['adjustmentType'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold"
                >
                  <option value="CAC_MENSUAL">CAC Mensual</option>
                  <option value="CAC_TRIMESTRAL">CAC Trimestral</option>
                  <option value="FIJO_USD">Fijo en USD</option>
                  <option value="SIN_AJUSTE">Sin Ajuste</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Cotización USD/ARS:
                </label>
                <input
                  type="number"
                  value={usdToArsRate}
                  onChange={(e) => setUsdToArsRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  CAC Anual Est. (%):
                </label>
                <input
                  type="number"
                  value={cacEstimatePercent}
                  onChange={(e) => setCacEstimatePercent(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-bold"
                />
              </div>
            </div>

            {/* Generate Quote Button */}
            <div className="pt-2">
              <Button variant="primary" fullWidth onClick={handleGenerateQuote}>
                <FilePlus className="w-4 h-4" /> Generar Propuesta de Cotización (v{quoteVersion})
              </Button>
            </div>
          </Card>

          {/* Quote Result Card if generated */}
          {currentQuote && (
            <Card padding="md" className="bg-slate-900 text-white space-y-4 shadow-xl border border-slate-800 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-brand-400">{currentQuote.quoteNumber}</span>
                    <Badge className="bg-brand-500/20 text-brand-300 border-0 text-[10px]">v{currentQuote.version}</Badge>
                  </div>
                  <span className="text-xs text-slate-400 block">Cliente: {currentQuote.leadName}</span>
                </div>
                <Badge className={QUOTE_STATUS_LABELS[currentQuote.status]?.color || 'bg-slate-700 text-white'}>
                  {QUOTE_STATUS_LABELS[currentQuote.status]?.label || currentQuote.status}
                </Badge>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Anticipo Integrado</span>
                  <div className="text-xl font-black text-white">{formatUSD(quoteCalculated.downPaymentUSD)}</div>
                  <span className="text-[10px] text-slate-300 font-mono">{formatARS(quoteCalculated.downPaymentARS)}</span>
                </div>

                <div className="bg-brand-900/60 p-3 rounded-xl border border-brand-700">
                  <span className="text-[10px] text-brand-300 block uppercase font-bold">Cuota Mensual</span>
                  <div className="text-xl font-black text-brand-300">{formatUSD(quoteCalculated.monthlyInstallmentUSD)}</div>
                  <span className="text-[10px] text-brand-200 font-mono">{formatARS(quoteCalculated.monthlyInstallmentARS)} / mes</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span>Saldo a Financiar:</span>
                  <span className="font-bold">{formatUSD(quoteCalculated.balanceToFinanceUSD)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Plazo:</span>
                  <span className="font-bold">{installmentsCount} meses</span>
                </div>
                <div className="flex justify-between">
                  <span>Ajuste Aplicado:</span>
                  <span className="font-bold">{adjustmentType}</span>
                </div>
              </div>

              {/* Commercial Actions: Share & Record Reaction */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <Button variant="secondary" size="sm" onClick={handleShareWhatsApp} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                  <Send className="w-3.5 h-3.5" /> Enviar por WhatsApp
                </Button>

                <Button variant="outline" size="sm" onClick={() => setClientReactionModalOpen(true)} className="text-xs text-slate-300 border-slate-700 hover:bg-slate-800">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Registrar Reacción
                </Button>
              </div>
            </Card>
          )}
        </div>
      ) : (
        /* History Tab */
        <div className="space-y-3">
          <div className="text-xs text-slate-500 font-medium">
            Historial de cotizaciones enviadas y registradas en el sistema.
          </div>

          {quotes.length === 0 ? (
            <Card padding="md" className="py-8 text-center text-slate-400 text-xs">
              No se han registrado cotizaciones todavía.
            </Card>
          ) : (
            quotes.map(q => {
              const statusInfo = QUOTE_STATUS_LABELS[q.status];
              const opt = q.options[0];

              return (
                <Card key={q.id} padding="md" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-slate-900">{q.quoteNumber}</span>
                        <Badge variant="brand" size="sm">v{q.version}</Badge>
                      </div>
                      <span className="text-xs font-bold text-slate-700 block">{q.leadName}</span>
                    </div>
                    <Badge className={statusInfo?.color}>{statusInfo?.label || q.status}</Badge>
                  </div>

                  {opt && (
                    <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Anticipo:</span>
                        <span className="font-bold">{formatUSD(opt.downPayment)} ({opt.downPaymentPercent}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Financiación:</span>
                        <span className="font-bold">{opt.installmentCount} cuotas de {formatUSD(opt.initialInstallmentAmount)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 border-t border-slate-200/60 pt-1 mt-1">
                        <span>Emisión: {q.createdAt.split('T')[0]}</span>
                        <span>Validez: {q.validUntil}</span>
                      </div>
                    </div>
                  )}

                  {q.notes && (
                    <div className="text-[11px] text-slate-600 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                      "{q.notes}"
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Client Reaction Modal */}
      {clientReactionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900">Registrar Reacción Comercial</h3>
            <p className="text-xs text-slate-500">Feedback directo del cliente tras recibir la cotización:</p>

            <div className="space-y-1.5">
              {[
                { status: 'INTERESADO', label: '⭐ Interesado - Avanza a Seña' },
                { status: 'SOLICITO_MAS_CUOTAS', label: '💬 Solicitó más cuotas / refinanciación' },
                { status: 'PARECIO_COSTOSO', label: '📉 Le pareció costoso' },
                { status: 'ACEPTADA', label: '✅ Cotización Aceptada' },
                { status: 'RECHAZADA', label: '❌ Rechazada' },
              ].map(opt => (
                <button
                  key={opt.status}
                  onClick={() => setSelectedReaction(opt.status as Quote['status'])}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedReaction === opt.status
                      ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Notas Comerciales:</label>
              <textarea
                value={reactionNotes}
                onChange={(e) => setReactionNotes(e.target.value)}
                placeholder="Detalles de la conversación..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" fullWidth onClick={() => setClientReactionModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" fullWidth onClick={handleRegisterReaction}>
                Guardar Reacción
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
