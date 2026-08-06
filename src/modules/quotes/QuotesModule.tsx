import React, { useState } from 'react';
import { Lot } from '../../types';
import { calculateQuote, formatUSD, formatARS } from '../../domain/rules';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Calculator, Download, Share2, DollarSign, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

interface QuotesModuleProps {
  initialLot?: Lot | null;
  lots: Lot[];
}

export const QuotesModule: React.FC<QuotesModuleProps> = ({
  initialLot,
  lots,
}) => {
  const [selectedLotId, setSelectedLotId] = useState<string>(
    initialLot ? initialLot.id : (lots.find(l => l.status === 'DISPONIBLE')?.id || lots[0]?.id || '')
  );
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(30);
  const [installmentsCount, setInstallmentsCount] = useState<number>(36);
  const [usdToArsRate, setUsdToArsRate] = useState<number>(1280);
  const [cacEstimatePercent, setCacEstimatePercent] = useState<number>(38);
  const [showSchedule, setShowSchedule] = useState<boolean>(true);

  const selectedLot = lots.find(l => l.id === selectedLotId) || lots[0];
  const lotPrice = selectedLot ? selectedLot.priceUSD : 30000;

  const quote = calculateQuote({
    lotPriceUSD: lotPrice,
    downPaymentPercent,
    installmentsCount,
    usdToArsRate,
    cacAnnualEstimatePercent: cacEstimatePercent,
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Simulador de Cotización</h2>
          <p className="text-xs text-slate-500">Cálculo de anticipo y cuotas en USD / ARS ajustadas por CAC</p>
        </div>
        <Calculator className="w-6 h-6 text-brand-600" />
      </div>

      {/* Lot Selector */}
      <Card padding="md" className="space-y-3">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Seleccionar Lote a Cotizar:
          </label>
          <select
            value={selectedLotId}
            onChange={(e) => setSelectedLotId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {lots.map(l => (
              <option key={l.id} value={l.id}>
                Lote {l.block}-{l.number} ({l.stage}) — {formatUSD(l.priceUSD)} ({l.surfaceM2}m²)
              </option>
            ))}
          </select>
        </div>

        {selectedLot && (
          <div className="bg-brand-50 p-3 rounded-xl border border-brand-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-extrabold text-brand-900">Lote {selectedLot.block}-{selectedLot.number}</span>
              <span className="text-brand-700 block text-[11px]">{selectedLot.surfaceM2} m² • {selectedLot.orientation}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-brand-600 block uppercase font-bold">Precio Lista</span>
              <span className="text-base font-black text-brand-900">{formatUSD(selectedLot.priceUSD)}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Simulator Inputs */}
      <Card padding="md" className="space-y-4">
        {/* Down Payment % Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Porcentaje de Anticipo (Seña + Boleto):</span>
            <span className="font-black text-brand-600 text-sm">{downPaymentPercent}%</span>
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
            <span>10% (Mínimo)</span>
            <span>30% (Standard)</span>
            <span>50%</span>
            <span>70%</span>
          </div>
        </div>

        {/* Installment Duration Buttons */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-700 block">Plazo de Financiación (Meses):</span>
          <div className="grid grid-cols-4 gap-1.5">
            {[12, 24, 36, 48].map(months => (
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

        {/* Currency & CAC Adjustment Inputs */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Cotización USD / ARS:
            </label>
            <input
              type="number"
              value={usdToArsRate}
              onChange={(e) => setUsdToArsRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Ajuste CAC Anual Est.:
            </label>
            <input
              type="number"
              value={cacEstimatePercent}
              onChange={(e) => setCacEstimatePercent(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold"
            />
          </div>
        </div>
      </Card>

      {/* Quote Financial Result Card */}
      <Card padding="md" className="bg-slate-900 text-white space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Resultado de Cotización</span>
          <span className="text-[10px] text-slate-400 font-mono">Validez 7 días</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">Anticipo Integrado</span>
            <div className="text-lg font-black text-white">{formatUSD(quote.downPaymentUSD)}</div>
            <span className="text-[10px] text-slate-300 font-mono">{formatARS(quote.downPaymentARS)}</span>
          </div>

          <div className="bg-brand-900/60 p-3 rounded-xl border border-brand-700">
            <span className="text-[10px] text-brand-300 block uppercase font-semibold">Cuota Mensual (USD)</span>
            <div className="text-lg font-black text-brand-300">{formatUSD(quote.monthlyInstallmentUSD)}</div>
            <span className="text-[10px] text-brand-200 font-mono">{formatARS(quote.monthlyInstallmentARS)} / mes</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
          <span>Saldo Financiado: <strong>{formatUSD(quote.balanceToFinanceUSD)}</strong></span>
          <span>{installmentsCount} Cuotas Fijas USD</span>
        </div>
      </Card>

      {/* Projected Schedule Preview */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Cronograma Proyectado (Primeras 6 cuotas)</span>
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="text-xs text-brand-600 font-bold hover:underline"
          >
            {showSchedule ? 'Ocultar' : 'Ver Tabla'}
          </button>
        </div>

        {showSchedule && (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase">
                  <th className="py-1.5 font-bold">Cuota #</th>
                  <th className="py-1.5 font-bold">Valor USD</th>
                  <th className="py-1.5 font-bold">Proyección ARS</th>
                  <th className="py-1.5 font-bold">Factor CAC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {quote.projectedSchedule.slice(0, 6).map(row => (
                  <tr key={row.monthNum}>
                    <td className="py-2 font-bold text-slate-900">Cuota {row.monthNum}</td>
                    <td className="py-2 font-semibold text-slate-900">{formatUSD(row.projectedUSD)}</td>
                    <td className="py-2 font-mono text-slate-600">{formatARS(row.projectedARS)}</td>
                    <td className="py-2 font-mono text-xs text-brand-600">+{((parseFloat(row.cacFactor) - 1) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="primary" fullWidth size="sm" onClick={() => alert('PDF de cotización generado e impreso.')}>
            <Download className="w-4 h-4" /> Exportar Cotización PDF
          </Button>
        </div>
      </Card>
    </div>
  );
};
