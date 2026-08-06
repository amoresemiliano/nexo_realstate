import React from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Lot } from '../../types';
import { LOT_STATUS_LABELS, formatUSD } from '../../domain/rules';
import { MapPin, Calculator, Lock, BookmarkCheck, FileText, Compass, Sparkles } from 'lucide-react';

interface LotDetailSheetProps {
  lot: Lot | null;
  isOpen: boolean;
  onClose: () => void;
  onSimulateQuote: (lot: Lot) => void;
  onHoldLot: (lot: Lot) => void;
  onReserveLot: (lot: Lot) => void;
}

export const LotDetailSheet: React.FC<LotDetailSheetProps> = ({
  lot,
  isOpen,
  onClose,
  onSimulateQuote,
  onHoldLot,
  onReserveLot,
}) => {
  if (!lot) return null;

  const statusInfo = LOT_STATUS_LABELS[lot.status];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Lote ${lot.block}-${lot.number}`}
      subtitle={`${lot.stage} • ${lot.surfaceM2} m²`}
    >
      <div className="space-y-4 pt-1">
        {/* Status & Price Header */}
        <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Precio de Lista</span>
            <div className="text-2xl font-black text-white">{formatUSD(lot.priceUSD)}</div>
          </div>
          <Badge className={`${statusInfo.color} ${statusInfo.bg} border-0 text-xs px-3 py-1 font-extrabold`}>
            {statusInfo.label}
          </Badge>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Superficie Total</span>
            <span className="font-extrabold text-slate-900">{lot.surfaceM2} m²</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Medidas</span>
            <span className="font-extrabold text-slate-900">{lot.frontageM}m x {lot.depthM}m</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Orientación</span>
            <span className="font-extrabold text-slate-900 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-brand-600" /> {lot.orientation}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Manzana</span>
            <span className="font-extrabold text-slate-900">Manzana {lot.block}</span>
          </div>
        </div>

        {/* Features list */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-1.5">Atributos del Lote:</span>
          <div className="flex flex-wrap gap-1.5">
            {lot.features.map((feat, idx) => (
              <span key={idx} className="text-xs bg-brand-50 text-brand-800 px-2.5 py-1 rounded-lg font-medium border border-brand-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-500" /> {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons matching state */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              onClose();
              onSimulateQuote(lot);
            }}
          >
            <Calculator className="w-4 h-4 text-brand-600" /> Simular Plan de Financiación
          </Button>

          {lot.status === 'DISPONIBLE' && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  onClose();
                  onHoldLot(lot);
                }}
              >
                <Lock className="w-4 h-4 text-amber-400" /> Bloquear 48hs
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onReserveLot(lot);
                }}
              >
                <BookmarkCheck className="w-4 h-4" /> Registrar Seña
              </Button>
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
