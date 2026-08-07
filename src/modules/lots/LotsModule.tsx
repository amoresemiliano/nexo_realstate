import React, { useState } from 'react';
import { Lot, LotStatus, Lead, Development } from '../../types';
import { LOT_STATUS_LABELS, formatUSD, calculateLotCompatibility } from '../../domain/rules';
import { Masterplan } from '../../components/masterplan/Masterplan';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LotComparisonModal } from '../../components/modals/LotComparisonModal';
import { AssociateLeadModal } from '../../components/modals/AssociateLeadModal';
import { MapPin, Grid, Search, Filter, Lock, Calculator, ArrowRight, Scale, Star, UserPlus, Check, SlidersHorizontal } from 'lucide-react';

interface LotsModuleProps {
  lots: Lot[];
  leads?: Lead[];
  developments?: Development[];
  onSelectLot: (lot: Lot) => void;
  onOpenHoldModalForLot?: (lot: Lot) => void;
  onOpenQuoteModalForLot?: (lot: Lot) => void;
  favoriteLotIds?: string[];
  onToggleFavorite?: (lot: Lot) => void;
  onAssociateLotWithLead?: (lotId: string, leadId: string, isFavorite?: boolean, interestType?: 'PRIMARY' | 'SECONDARY' | 'DISCARDED') => void;
  selectedLead?: Lead | null;
}

export const LotsModule: React.FC<LotsModuleProps> = ({
  lots,
  leads = [],
  developments = [],
  onSelectLot,
  onOpenHoldModalForLot,
  onOpenQuoteModalForLot,
  favoriteLotIds = [],
  onToggleFavorite,
  onAssociateLotWithLead,
  selectedLead,
}) => {
  const [viewMode, setViewMode] = useState<'MASTERPLAN' | 'GRILLA' | 'FAVORITOS'>('MASTERPLAN');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('TODAS');
  const [selectedStage, setSelectedStage] = useState('TODAS');
  const [selectedStatus, setSelectedStatus] = useState('TODOS');

  // Comparison State
  const [comparedLotIds, setComparedLotIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Lead Association Modal State
  const [associatingLot, setAssociatingLot] = useState<Lot | null>(null);

  const toggleCompareLot = (lotId: string) => {
    setComparedLotIds(prev => {
      if (prev.includes(lotId)) {
        return prev.filter(id => id !== lotId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, lotId];
    });
  };

  const filteredLots = lots.filter(l => {
    const matchesSearch =
      l.number.includes(searchTerm) ||
      l.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.code && l.code.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBlock = selectedBlock === 'TODAS' || l.block === selectedBlock;
    const matchesStage = selectedStage === 'TODAS' || l.stage === selectedStage;
    const matchesStatus = selectedStatus === 'TODOS' || l.status === selectedStatus;
    const matchesFav = viewMode !== 'FAVORITOS' || favoriteLotIds.includes(l.id);
    return matchesSearch && matchesBlock && matchesStage && matchesStatus && matchesFav;
  });

  const comparedLots = lots.filter(l => comparedLotIds.includes(l.id));

  return (
    <div className="space-y-4">
      {/* Top Navigation Switcher */}
      <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setViewMode('MASTERPLAN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'MASTERPLAN' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Masterplan</span>
          </button>
          <button
            onClick={() => setViewMode('GRILLA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'GRILLA' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grilla</span>
          </button>
          <button
            onClick={() => setViewMode('FAVORITOS')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === 'FAVORITOS' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>Favoritos ({favoriteLotIds.length})</span>
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-500 pr-1 shrink-0">
          {filteredLots.length}
        </span>
      </div>

      {/* Floating Comparison Bar when items selected */}
      {comparedLotIds.length > 0 && (
        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl flex items-center justify-between animate-in slide-in-from-bottom duration-300 border border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <Scale className="w-4 h-4 text-brand-400" />
            <span className="font-bold">
              {comparedLotIds.length} lote{comparedLotIds.length > 1 ? 's' : ''} en comparador
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setComparedLotIds([])}
              className="text-[11px] text-slate-400 hover:text-white px-2 py-1"
            >
              Limpiar
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsComparisonOpen(true)}
              className="text-xs px-3"
            >
              Comparar Ahora
            </Button>
          </div>
        </div>
      )}

      {/* Main View Render */}
      {viewMode === 'MASTERPLAN' ? (
        <Masterplan
          lots={lots}
          onSelectLot={onSelectLot}
          favoriteLotIds={favoriteLotIds}
          onToggleFavorite={onToggleFavorite}
        />
      ) : (
        <div className="space-y-3">
          {/* Filters Card */}
          <Card padding="sm" className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar lote (A-1, código, manzana)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Mza:</span>
              {['TODAS', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBlock(b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                    selectedBlock === b ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {b === 'TODAS' ? 'Todas' : b}
                </button>
              ))}
            </div>
          </Card>

          {/* Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredLots.map(lot => {
              const statusInfo = LOT_STATUS_LABELS[lot.status];
              const isFav = favoriteLotIds.includes(lot.id);
              const isComp = comparedLotIds.includes(lot.id);
              const compat = calculateLotCompatibility(lot, selectedLead);

              return (
                <Card key={lot.id} padding="md" className="space-y-2.5 relative hover:border-brand-300 transition-all">
                  {/* Top Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-black text-slate-900">
                          Lote {lot.block}-{lot.number}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">({lot.stage})</span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {lot.surfaceM2} m² • {lot.frontageM}m x {lot.depthM}m
                      </div>
                    </div>
                    <Badge className={`${statusInfo.color} font-bold text-[10px]`}>{statusInfo.label}</Badge>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Precio Lista</span>
                      <span className="text-lg font-black text-slate-900">{formatUSD(lot.priceUSD)}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{lot.orientation}</span>
                  </div>

                  {/* Compatibility Badge if Lead selected */}
                  {selectedLead && (
                    <div className={`p-1.5 rounded-lg text-[11px] ${compat.badgeClass} flex items-center justify-between`}>
                      <span>Compatibilidad: <strong>{compat.label}</strong></span>
                    </div>
                  )}

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-1">
                    {lot.features.map((feat, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Interactive Quick Toolbar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-1 text-xs">
                    <button
                      onClick={() => onToggleFavorite && onToggleFavorite(lot)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isFav ? 'bg-amber-50 text-amber-600 border-amber-200' : 'text-slate-400 hover:text-slate-600 border-slate-200'
                      }`}
                      title="Favorito"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => toggleCompareLot(lot.id)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isComp ? 'bg-brand-50 text-brand-600 border-brand-200 font-bold' : 'text-slate-400 hover:text-slate-600 border-slate-200'
                      }`}
                      title="Comparar"
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setAssociatingLot(lot)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 border border-slate-200"
                      title="Asociar a Lead"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex gap-1.5 ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenQuoteModalForLot && onOpenQuoteModalForLot(lot)}
                        className="text-[11px] px-2.5 py-1"
                      >
                        <Calculator className="w-3 h-3" /> Cotizar
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onSelectLot(lot)}
                        className="text-[11px] px-2.5 py-1"
                      >
                        Ver Detalle
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Lot Comparison Modal */}
      <LotComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        lotsToCompare={comparedLots}
        onRemoveFromComparison={(id) => setComparedLotIds(prev => prev.filter(i => i !== id))}
        onSelectForQuote={(lot) => onOpenQuoteModalForLot && onOpenQuoteModalForLot(lot)}
        onSelectForHold={(lot) => onOpenHoldModalForLot && onOpenHoldModalForLot(lot)}
        onAssociateWithLead={(lot) => setAssociatingLot(lot)}
        selectedLead={selectedLead}
      />

      {/* Associate Lead Modal */}
      <AssociateLeadModal
        isOpen={!!associatingLot}
        onClose={() => setAssociatingLot(null)}
        lot={associatingLot}
        leads={leads}
        onAssociate={(lotId, leadId, isFav, intType) => {
          if (onAssociateLotWithLead) {
            onAssociateLotWithLead(lotId, leadId, isFav, intType);
          }
        }}
      />
    </div>
  );
};
