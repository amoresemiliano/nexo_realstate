import React, { useState } from 'react';
import { Lot, LotStatus } from '../../types';
import { LOT_STATUS_LABELS, formatUSD } from '../../domain/rules';
import { Masterplan } from '../../components/masterplan/Masterplan';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Grid, Search, Filter, Lock, Calculator, ArrowRight, ShieldCheck } from 'lucide-react';

interface LotsModuleProps {
  lots: Lot[];
  onSelectLot: (lot: Lot) => void;
  onOpenHoldModalForLot?: (lot: Lot) => void;
  onOpenQuoteModalForLot?: (lot: Lot) => void;
}

export const LotsModule: React.FC<LotsModuleProps> = ({
  lots,
  onSelectLot,
  onOpenHoldModalForLot,
  onOpenQuoteModalForLot,
}) => {
  const [viewMode, setViewMode] = useState<'MASTERPLAN' | 'GRILLA'>('MASTERPLAN');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('TODAS');

  const filteredLots = lots.filter(l => {
    const matchesSearch = l.number.includes(searchTerm) || l.block.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = selectedBlock === 'TODAS' || l.block === selectedBlock;
    return matchesSearch && matchesBlock;
  });

  return (
    <div className="space-y-4">
      {/* Top Controls: Masterplan vs Grid Switch */}
      <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('MASTERPLAN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'MASTERPLAN' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Masterplan</span>
          </button>
          <button
            onClick={() => setViewMode('GRILLA')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'GRILLA' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grilla Lotes</span>
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-500 pr-2">
          {lots.length} Lotes Totales
        </span>
      </div>

      {/* Main View Area */}
      {viewMode === 'MASTERPLAN' ? (
        <Masterplan lots={lots} onSelectLot={onSelectLot} />
      ) : (
        <div className="space-y-3">
          {/* Search & Block Filter */}
          <Card padding="sm" className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar lote (ej: A-1, B-3)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {['TODAS', 'A', 'B', 'C', 'D'].map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBlock(b)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                    selectedBlock === b ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {b === 'TODAS' ? 'Todas las Manzanas' : `Manzana ${b}`}
                </button>
              ))}
            </div>
          </Card>

          {/* Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredLots.map(lot => {
              const statusInfo = LOT_STATUS_LABELS[lot.status];
              return (
                <Card key={lot.id} padding="md" className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-black text-slate-900">
                          Lote {lot.block}-{lot.number}
                        </span>
                        <span className="text-xs text-slate-400">({lot.stage})</span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{lot.surfaceM2} m² • Frente {lot.frontageM}m x Fondo {lot.depthM}m</div>
                    </div>
                    <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Precio Lista</span>
                      <span className="text-lg font-black text-slate-900">{formatUSD(lot.priceUSD)}</span>
                    </div>
                    <span className="text-xs text-slate-500">{lot.orientation}</span>
                  </div>

                  {/* Lot Features Pills */}
                  <div className="flex flex-wrap gap-1">
                    {lot.features.map((feat, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenQuoteModalForLot && onOpenQuoteModalForLot(lot)}
                      className="text-[11px]"
                    >
                      <Calculator className="w-3 h-3" /> Cotizar
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onSelectLot(lot)}
                      className="text-[11px]"
                    >
                      Ver Detalle
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
