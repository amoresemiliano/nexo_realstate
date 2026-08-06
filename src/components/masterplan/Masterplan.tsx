import React, { useState } from 'react';
import { Lot, LotStatus } from '../../types';
import { LOT_STATUS_LABELS, formatUSD } from '../../domain/rules';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MapPin, Filter, Layers, Eye } from 'lucide-react';

interface MasterplanProps {
  lots: Lot[];
  onSelectLot: (lot: Lot) => void;
}

export const Masterplan: React.FC<MasterplanProps> = ({
  lots,
  onSelectLot,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<string>('TODAS');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');

  const blocks = ['TODAS', 'A', 'B', 'C', 'D'];
  const statuses = ['TODOS', 'DISPONIBLE', 'BLOQUEADO', 'SENADO', 'RESERVADO', 'VENDIDO'];

  const filteredLots = lots.filter(lot => {
    const matchesBlock = selectedBlock === 'TODAS' || lot.block === selectedBlock;
    const matchesStatus = statusFilter === 'TODOS' || lot.status === statusFilter;
    return matchesBlock && matchesStatus;
  });

  // Group lots by Block for structured rendering
  const blocksMap = ['A', 'B', 'C', 'D'].reduce((acc, blockName) => {
    acc[blockName] = filteredLots.filter(l => l.block === blockName);
    return acc;
  }, {} as Record<string, Lot[]>);

  return (
    <div className="space-y-4">
      {/* Interactive Controls & Filters */}
      <Card padding="sm" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Filter className="w-4 h-4 text-brand-600" />
            <span>Filtros de Masterplan</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">{filteredLots.length} lotes listados</span>
        </div>

        {/* Block selector pill tabs */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Manzana:</span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {blocks.map(b => (
              <button
                key={b}
                onClick={() => setSelectedBlock(b)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedBlock === b
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b === 'TODAS' ? 'Todas' : `Manzana ${b}`}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter pill tabs */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Estado:</span>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {statuses.map(st => {
              const label = st === 'TODOS' ? 'Todos' : LOT_STATUS_LABELS[st as LotStatus]?.label || st;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    statusFilter === st
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-[11px] bg-slate-100 p-2.5 rounded-xl border border-slate-200/80">
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> Referencias:
        </span>
        <span className="inline-flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Disponible</span>
        <span className="inline-flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Bloqueado</span>
        <span className="inline-flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Seña</span>
        <span className="inline-flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Reservado</span>
        <span className="inline-flex items-center gap-1 font-medium"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Vendido</span>
      </div>

      {/* Masterplan Map Canvas Simulation */}
      <div className="space-y-4">
        {['A', 'B', 'C', 'D'].map(blockName => {
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

              {/* Grid Layout of Lots */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {blockLots.map(lot => {
                  const statusInfo = LOT_STATUS_LABELS[lot.status];
                  return (
                    <div
                      key={lot.id}
                      onClick={() => onSelectLot(lot)}
                      className={`p-2.5 rounded-xl border ${statusInfo.border} ${statusInfo.bg} cursor-pointer touch-card flex flex-col justify-between h-24 relative overflow-hidden group`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-black text-slate-900">
                          Lote {lot.block}-{lot.number}
                        </span>
                        <Badge size="sm" className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </div>

                      <div className="my-1">
                        <div className="text-sm font-extrabold text-slate-900">{formatUSD(lot.priceUSD)}</div>
                        <div className="text-[11px] text-slate-600 font-medium">{lot.surfaceM2} m² • {lot.orientation}</div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200/50 pt-1">
                        <span>{lot.stage}</span>
                        <span className="flex items-center gap-0.5 text-brand-600 font-bold group-hover:underline">
                          <Eye className="w-3 h-3" /> Ver
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
