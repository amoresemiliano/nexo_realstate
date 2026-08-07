import React from 'react';
import { Lot, Lead } from '../../types';
import { LOT_STATUS_LABELS, formatUSD, calculateLotCompatibility } from '../../domain/rules';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { X, Check, Calculator, Lock, UserPlus, Star, Scale, Info } from 'lucide-react';

interface LotComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lotsToCompare: Lot[];
  onRemoveFromComparison: (lotId: string) => void;
  onSelectForQuote: (lot: Lot) => void;
  onSelectForHold: (lot: Lot) => void;
  onAssociateWithLead: (lot: Lot) => void;
  selectedLead?: Lead | null;
}

export const LotComparisonModal: React.FC<LotComparisonModalProps> = ({
  isOpen,
  onClose,
  lotsToCompare,
  onRemoveFromComparison,
  onSelectForQuote,
  onSelectForHold,
  onAssociateWithLead,
  selectedLead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-500/20 text-brand-300 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Comparador de Lotes</h3>
              <p className="text-xs text-slate-400">
                Comparativa directa de {lotsToCompare.length} alternativa{lotsToCompare.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Lead Banner if exists */}
        {selectedLead && (
          <div className="bg-brand-50 border-b border-brand-100 px-4 py-2 flex items-center justify-between text-xs">
            <span className="text-brand-900 font-bold">
              Evaluando compatibilidad para: <strong>{selectedLead.fullName}</strong>
            </span>
            <span className="text-[11px] font-mono text-brand-700">Presupuesto: {formatUSD(selectedLead.budgetUSD)}</span>
          </div>
        )}

        {/* Modal Body / Comparison Matrix */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {lotsToCompare.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Info className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No has seleccionado lotes para comparar.</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Toca el botón "Comparar" en la ficha o grilla de cualquier lote para agregarlo aquí.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-2 no-scrollbar">
              <div className="grid gap-3 min-w-[500px]" style={{ gridTemplateColumns: `repeat(${lotsToCompare.length}, minmax(220px, 1fr))` }}>
                {lotsToCompare.map((lot) => {
                  const statusInfo = LOT_STATUS_LABELS[lot.status];
                  const compat = calculateLotCompatibility(lot, selectedLead);
                  const pricePerM2 = Math.round(lot.priceUSD / lot.surfaceM2);
                  const minDown = Math.round(lot.priceUSD * ((lot.minimumDownPaymentPercentage || 30) / 100));
                  const estMonthly = Math.round((lot.priceUSD - minDown) / 36);

                  return (
                    <Card key={lot.id} padding="md" className="space-y-3 relative border-2 border-slate-200">
                      {/* Delete button */}
                      <button
                        onClick={() => onRemoveFromComparison(lot.id)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Quitar de comparación"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Header info */}
                      <div>
                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                        <h4 className="text-lg font-black text-slate-900 mt-1">
                          Lote {lot.block}-{lot.number}
                        </h4>
                        <span className="text-xs text-slate-500 font-medium">{lot.stage} • Cod: {lot.code || `AH-${lot.block}-${lot.number}`}</span>
                      </div>

                      {/* Compatibility Badge */}
                      {selectedLead && (
                        <div className={`p-2 rounded-xl border text-xs ${compat.badgeClass}`}>
                          <div className="font-bold flex items-center justify-between">
                            <span>{compat.label}</span>
                          </div>
                          {compat.reasons.length > 0 && (
                            <span className="text-[10px] block opacity-90 mt-0.5">• {compat.reasons[0]}</span>
                          )}
                        </div>
                      )}

                      {/* Financial Comparison */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Precio y Superficie</span>
                        <div className="text-xl font-black text-brand-700">{formatUSD(lot.priceUSD)}</div>
                        <div className="text-xs text-slate-700 font-medium">
                          <strong>{lot.surfaceM2} m²</strong> ({formatUSD(pricePerM2)} / m²)
                        </div>
                      </div>

                      {/* Dimensions & Orientation */}
                      <div className="space-y-1 text-xs bg-slate-50 p-2.5 rounded-xl text-slate-700 border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Medidas:</span>
                          <span className="font-bold">{lot.frontageM}m x {lot.depthM}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Orientación:</span>
                          <span className="font-bold">{lot.orientation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Posición:</span>
                          <span className="font-bold">{lot.position || (lot.cornerLot ? 'Esquina' : 'Interno')}</span>
                        </div>
                      </div>

                      {/* Simulation estimate */}
                      <div className="space-y-1 text-xs bg-brand-50/70 p-2.5 rounded-xl text-brand-900 border border-brand-100">
                        <div className="flex justify-between">
                          <span className="text-brand-700">Anticipo Mín ({lot.minimumDownPaymentPercentage || 30}%):</span>
                          <span className="font-black">{formatUSD(minDown)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-brand-700">Cuota Est. (36m):</span>
                          <span className="font-black">{formatUSD(estMonthly)}/mes</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {lot.features.map((feat, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {feat}
                          </span>
                        ))}
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          onClick={() => {
                            onSelectForQuote(lot);
                            onClose();
                          }}
                          className="text-xs"
                        >
                          <Calculator className="w-3.5 h-3.5" /> Cotizar Lote
                        </Button>

                        {lot.status === 'DISPONIBLE' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            fullWidth
                            onClick={() => {
                              onSelectForHold(lot);
                              onClose();
                            }}
                            className="text-xs"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-600" /> Iniciar Bloqueo
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => onAssociateWithLead(lot)}
                          className="text-xs"
                        >
                          <UserPlus className="w-3.5 h-3.5" /> Asociar a Lead
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Máximo 4 lotes simultáneos en comparativa.
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar Comparador
          </Button>
        </div>
      </div>
    </div>
  );
};
