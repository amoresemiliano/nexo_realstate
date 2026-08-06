import React, { useState } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { Lot, Lead } from '../../types';
import { formatUSD } from '../../domain/rules';

interface NewHoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  lots: Lot[];
  leads: Lead[];
  preselectedLot?: Lot | null;
  onSubmitHold: (holdData: { lotId: string; leadId: string; agentName: string; notes: string }) => void;
}

export const NewHoldModal: React.FC<NewHoldModalProps> = ({
  isOpen,
  onClose,
  lots,
  leads,
  preselectedLot,
  onSubmitHold,
}) => {
  const availableLots = lots.filter(l => l.status === 'DISPONIBLE' || l.id === preselectedLot?.id);

  const [selectedLotId, setSelectedLotId] = useState(preselectedLot ? preselectedLot.id : availableLots[0]?.id || '');
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [agentName, setAgentName] = useState('Gonzalo Rossi');
  const [notes, setNotes] = useState('');

  const currentLot = lots.find(l => l.id === selectedLotId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLotId || !selectedLeadId) return;

    onSubmitHold({
      lotId: selectedLotId,
      leadId: selectedLeadId,
      agentName,
      notes: notes || 'Bloqueo temporal de 48hs asignado por asesor comercial.',
    });

    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Bloqueo Temporal de Lote" subtitle="Reserva de 48 horas sin seña obligatoria">
      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Lote a Bloquear *</label>
          <select
            value={selectedLotId}
            onChange={(e) => setSelectedLotId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {availableLots.map(l => (
              <option key={l.id} value={l.id}>
                Lote {l.block}-{l.number} ({l.stage}) — {formatUSD(l.priceUSD)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Lead / Comprador Asociado *</label>
          <select
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {leads.map(l => (
              <option key={l.id} value={l.id}>
                {l.fullName} ({l.phone})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Agente Responsable</label>
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Notas del Bloqueo</label>
          <textarea
            rows={2}
            placeholder="Motivo del bloqueo o compromiso de seña..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
          <strong>Regla:</strong> El bloqueo vencerá automáticamente en 48 horas si no se registra un comprobante de seña informada.
        </div>

        <div className="pt-2">
          <Button variant="secondary" fullWidth type="submit">
            Confirmar Bloqueo Temporal
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};
