import React, { useState } from 'react';
import { Lot, LotStatus } from '../../types';
import { LOT_STATUS_LABELS, formatUSD } from '../../domain/rules';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MapPin, Filter, Layers, Eye, Star, SlidersHorizontal, DollarSign } from 'lucide-react';

interface MasterplanProps {
  lots: Lot[];
  onSelectLot: (lot: Lot) => void;
  favoriteLotIds?: string[];
  onToggleFavorite?: (lot: Lot) => void;
}

export const Masterplan: React.FC<MasterplanProps> = ({
  lots,
  onSelectLot,
  favoriteLotIds = [],
  onToggleFavorite,
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('TODAS');
  const [selectedBlock, setSelectedBlock] = useState<string>('TODAS');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [maxPrice, setMaxPrice] = useState<number>(50000);

  const stages = ['TODAS', 'Etapa 1', 'Etapa 2', 'Etapa 3', 'Etapa 4'];
  const blocks = ['TODAS', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const statuses: string[] = [
    'TODOS',
    'DISPONIBLE',
    'BLOQUEADO',
    'SENADO',
    'RESERVADO',
    'VENDIDO',
    'EN_MORA',
    'ESCRITURADO'
  ];

  const filteredLots = lots.filter(lot => {
    const matchesStage = selectedStage === 'TODAS' || lot.stage === selectedStage;
    const matchesBlock = selectedBlock === 'TODAS' || lot.block === selectedBlock;
    const matchesStatus = statusFilter === 'TODOS' || lot.status === statusFilter;
    const matchesPrice = lot.priceUSD <= maxPrice;
    return matchesStage && matchesBlock && matchesStatus && matchesPrice;
  });

  // Group lots by Block for structured visual grid
  const allBlocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const blocksMap = allBlocks.reduce((acc, blockName) => {
    acc[blockName] = filteredLots.filter(l => l.block === blockName);
    return acc;
  }, {} as Record<string, Lot[]>);

  return (
    <div className="space-y-4">
      {/* Interactive Masterplan Controls */}
      <Card padding="sm" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Filtros de Navegación Masterplan</span>
          </div>
          <span className="text-xs text-brand-700 font-extrabold">{filteredLots.length} lotes visibles</span>
        </div>

        {/* Stage Selector */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Etapa de Desarrollo:</span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {stages.map(st => (
              <button
                key={st}
                onClick={() => setSelectedStage(st)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                  selectedStage === st
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Block Selector */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Manzana:</span>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {blocks.map(b => (
              <button
                key={b}
                onClick={() => setSelectedBlock(b)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedBlock === b
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b === 'TODAS' ? 'Todas' : `Mza ${b}`}
              </button>
            ))}
          </div>
        </div>

        {/* Status Pills */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Estado Comercial:</span>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {statuses.map(st => {
              const label = st === 'TODOS' ? 'Todos' : LOT_STATUS_LABELS[st as LotStatus]?.label || st;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Max Price Filter */}
        <div className="pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-slate-600">Precio Máximo USD:</span>
            <span className="font-black text-brand-600">{formatUSD(maxPrice)}</span>
          </div>
          <input
            type="range"
            min={20000}
            max={50000}
            step={2500}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-brand-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
          />
        </div>
      </Card>

      {/* Map Legend */}
      <div className="flex flex-wrap gap-2 text-[10px] bg-slate-100 p-2.5 rounded-xl border border-slate-200/80">
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-brand-600" /> Referencias:
        </span>
        <span className="inline-flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Disponible</span>
        <span className="inline-flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Bloqueado</span>
        <span className="inline-flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Seña</span>
        <span className="inline-flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Reservado</span>
        <span className="inline-flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Vendido</span>
      </div>

      {/* Visual Masterplan Block Grids */}
      <div className="space-y-4">
        {allBlocks.map(blockName => {
          const blockLots = blocksMap[blockName];
          if (selectedBlock !== 'TODAS' && selectedBlock !== blockName) return null;
          if (!blockLots || blockLots.length === 0) return null;

          return (
            <div key={blockName} className="bg-slate-100/90 rounded-2xl p-3 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 font-extrabold text-sm text-slate-800">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>Manzana {blockName}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">{blockLots.length} Lotes</span>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {blockLots.map(lot => {
                  const statusInfo = LOT_STATUS_LABELS[lot.status];
                  const isFav = favoriteLotIds.includes(lot.id);

                  return (
                    <div
                      key={lot.id}
                      onClick={() => onSelectLot(lot)}
                      className={`p-2.5 rounded-xl border ${statusInfo.border} ${statusInfo.bg} cursor-pointer touch-card flex flex-col justify-between h-28 relative overflow-hidden group hover:shadow-md transition-all`}
                    >
                      {/* Top bar */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-black text-slate-900">
                            Lote {lot.block}-{lot.number}
                          </span>
                          {isFav && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                        </div>
                        <Badge size="sm" className={`${statusInfo.color} font-bold text-[9px]`}>
                          {statusInfo.label}
                        </Badge>
                      </div>

                      {/* Middle price & features */}
                      <div className="my-0.5">
                        <div className="text-sm font-black text-slate-900">{formatUSD(lot.priceUSD)}</div>
                        <div className="text-[10px] text-slate-600 font-medium">{lot.surfaceM2} m² • {lot.orientation}</div>
                      </div>

                      {/* Bottom Footer */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200/50 pt-1">
                        <span className="truncate max-w-[80px]">{lot.stage}</span>
                        <span className="flex items-center gap-0.5 text-brand-700 font-bold group-hover:underline">
                          <Eye className="w-3 h-3" /> Ficha
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
