import React from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Lot, Lead } from '../../types';
import { LOT_STATUS_LABELS, formatUSD, calculateLotCompatibility } from '../../domain/rules';
import { MapPin, Calculator, Lock, BookmarkCheck, FileText, Compass, Sparkles, Star, Scale, UserPlus, CheckCircle2, DollarSign } from 'lucide-react';

interface LotDetailSheetProps {
  lot: Lot | null;
  isOpen: boolean;
  onClose: () => void;
  onSimulateQuote: (lot: Lot) => void;
  onHoldLot: (lot: Lot) => void;
  onReserveLot: (lot: Lot) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (lot: Lot) => void;
  isCompared?: boolean;
  onAddToComparison?: (lot: Lot) => void;
  onAssociateLead?: (lot: Lot) => void;
  onOpen360View?: (lot: Lot) => void;
  selectedLead?: Lead | null;
}

export const LotDetailSheet: React.FC<LotDetailSheetProps> = ({
  lot,
  isOpen,
  onClose,
  onSimulateQuote,
  onHoldLot,
  onReserveLot,
  isFavorite = false,
  onToggleFavorite,
  isCompared = false,
  onAddToComparison,
  onAssociateLead,
  onOpen360View,
  selectedLead,
}) => {
  if (!lot) return null;

  const statusInfo = LOT_STATUS_LABELS[lot.status];
  const compat = calculateLotCompatibility(lot, selectedLead);
  const minDown = Math.round(lot.priceUSD * ((lot.minimumDownPaymentPercentage || 30) / 100));
  const pricePerM2 = Math.round(lot.priceUSD / lot.surfaceM2);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Lote ${lot.block}-${lot.number}`}
      subtitle={`${lot.stage} • ${lot.code || `Cód. AH-${lot.block}-${lot.number}`}`}
    >
      <div className="space-y-4 pt-1">
        {/* Status & Price Header */}
        <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-md">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Precio de Lista</span>
              {lot.promotionalPrice && (
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">
                  PROMO
                </span>
              )}
            </div>
            <div className="text-2xl font-black text-white">{formatUSD(lot.promotionalPrice || lot.priceUSD)}</div>
            {lot.promotionalPrice && (
              <span className="text-xs text-slate-400 line-through">{formatUSD(lot.listPrice || lot.priceUSD)}</span>
            )}
          </div>
          <Badge className={`${statusInfo.color} ${statusInfo.bg} border-0 text-xs px-3 py-1 font-extrabold`}>
            {statusInfo.label}
          </Badge>
        </div>

        {/* Selected Lead Compatibility Widget */}
        {selectedLead && (
          <div className={`p-3 rounded-2xl border ${compat.badgeClass} space-y-1`}>
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Compatibilidad con {selectedLead.fullName}:</span>
              <span className="uppercase font-black">{compat.label}</span>
            </div>
            <div className="text-[11px] space-y-0.5 opacity-90">
              {compat.reasons.map((r, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Superficie Total</span>
            <span className="font-extrabold text-slate-900">{lot.surfaceM2} m²</span>
            <span className="text-[10px] text-slate-500 block font-mono">{formatUSD(pricePerM2)} / m²</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Medidas</span>
            <span className="font-extrabold text-slate-900">{lot.frontageM}m frente x {lot.depthM}m fondo</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Orientación</span>
            <span className="font-extrabold text-slate-900 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-brand-600" /> {lot.orientation}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Posición / Ubicación</span>
            <span className="font-extrabold text-slate-900">{lot.position || (lot.cornerLot ? 'Esquina' : 'Interno')}</span>
          </div>
        </div>

        {/* Financial Terms Brief */}
        <div className="bg-brand-50 p-3 rounded-2xl border border-brand-100 flex items-center justify-between text-xs text-brand-900">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-600 block">Anticipo Sugerido ({lot.minimumDownPaymentPercentage || 30}%)</span>
            <span className="text-base font-black">{formatUSD(minDown)}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-brand-600 block">Plazos Permitidos</span>
            <span className="text-xs font-extrabold">{(lot.allowedInstallmentOptions || [36, 48, 60]).join(' / ')} meses</span>
          </div>
        </div>

        {/* Features & Tags */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-700 block">Atributos e Infraestructura:</span>
          <div className="flex flex-wrap gap-1.5">
            {lot.features.map((feat, idx) => (
              <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-500" /> {feat}
              </span>
            ))}
            {lot.commercialTags?.map((tag, idx) => (
              <span key={idx} className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-bold border border-amber-200">
                🏷️ {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Secondary Commercial Toolbar: Favorites / Compare / Associate */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => onToggleFavorite && onToggleFavorite(lot)}
            className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              isFavorite
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>{isFavorite ? 'Favorito' : 'Guardar'}</span>
          </button>

          <button
            onClick={() => onAddToComparison && onAddToComparison(lot)}
            className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              isCompared
                ? 'bg-brand-100 text-brand-900 border border-brand-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-brand-600" />
            <span>{isCompared ? 'Comparando' : 'Comparar'}</span>
          </button>

          <button
            onClick={() => onAssociateLead && onAssociateLead(lot)}
            className="py-2 px-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-600" />
            <span>Asociar Lead</span>
          </button>
        </div>

        {/* Main Action Buttons */}
        <div className="space-y-2 pt-1">
          {onOpen360View && (
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                onClose();
                onOpen360View(lot);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <FileText className="w-4 h-4" /> Abrir Ficha 360° Completa del Lote
            </Button>
          )}

          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              onClose();
              onSimulateQuote(lot);
            }}
          >
            <Calculator className="w-4 h-4" /> Simular Cotización Comercialmente
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
                <Lock className="w-4 h-4 text-amber-500" /> Bloquear 48hs
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  onReserveLot(lot);
                }}
              >
                <BookmarkCheck className="w-4 h-4 text-brand-600" /> Iniciar Seña
              </Button>
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};
