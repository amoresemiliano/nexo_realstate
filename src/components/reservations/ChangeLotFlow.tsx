import React, { useState } from 'react';
import { Lot, LotHold, Reservation } from '../../types';
import { formatUSD } from '../../domain/rules';
import { Button } from '../ui/Button';
import { X, RefreshCw, MapPin, Check } from 'lucide-react';

interface ChangeLotFlowProps {
  isOpen: boolean;
  onClose: () => void;
  entity: LotHold | Reservation | null;
  lots: Lot[];
  onConfirmChangeLot: (params: {
    entityId: string;
    entityType: 'HOLD' | 'RESERVATION';
    newLotId: string;
    notes?: string;
  }) => void;
}

export const ChangeLotFlow: React.FC<ChangeLotFlowProps> = ({
  isOpen,
  onClose,
  entity,
  lots,
  onConfirmChangeLot,
}) => {
  const [selectedNewLotId, setSelectedNewLotId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen || !entity) return null;

  const entityType = 'reservationNumber' in entity || 'agreedPrice' in entity ? 'RESERVATION' : 'HOLD';
  const currentLotNumber = entity.lotNumber;
  const availableLots = lots.filter((l) => l.status === 'DISPONIBLE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNewLotId) return;

    onConfirmChangeLot({
      entityId: entity.id,
      entityType,
      newLotId: selectedNewLotId,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-purple-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">Cambio de Lote</h2>
              <p className="text-xs text-purple-300">Lote Origen: Lote {currentLotNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-purple-900 text-purple-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-purple-950 leading-relaxed">
            Se transferirá la seña y/o bloqueo del Lote <strong>{currentLotNumber}</strong> al nuevo lote seleccionado. El Lote {currentLotNumber} quedará libre.
          </div>

          <div className="space-y-1.5">
            <label className="font-black text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> Nuevo Lote de Destino <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedNewLotId}
              onChange={(e) => setSelectedNewLotId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900"
            >
              <option value="">-- Seleccionar Nuevo Lote Disponible --</option>
              {availableLots.map((l) => (
                <option key={l.id} value={l.id}>
                  Lote {l.number} (Manzana {l.block}) — {formatUSD(l.priceUSD)} — {l.surfaceM2}m²
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-black text-slate-800 block">Observaciones del Cambio</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. El cliente prefirió un lote con mejor orientación Norte..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <Button type="button" variant="outline" size="md" fullWidth onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="md" fullWidth className="bg-purple-700 hover:bg-purple-800 text-white font-extrabold">
              <Check className="w-4 h-4" /> Transferir a Nuevo Lote
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
