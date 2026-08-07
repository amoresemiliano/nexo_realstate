import React, { useState } from 'react';
import { Lead, VisitItem, Seller } from '../../types';
import { X, Calendar, MapPin, Users, Clock, CheckCircle } from 'lucide-react';

interface ScheduleVisitModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  sellers: Seller[];
  onSaveVisit: (visit: VisitItem, updatedLead?: Partial<Lead>) => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  lead,
  isOpen,
  onClose,
  sellers,
  onSaveVisit
}) => {
  if (!isOpen || !lead) return null;

  const [scheduledAt, setScheduledAt] = useState('');
  const [meetingPoint, setMeetingPoint] = useState('Portal de Acceso Principal (Garita 1)');
  const [participantsCount, setParticipantsCount] = useState(2);
  const [assignedSellerId, setAssignedSellerId] = useState(lead.assignedSellerId || sellers[0]?.id || '');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledAt) return;

    const seller = sellers.find(s => s.id === assignedSellerId);

    const newVisit: VisitItem = {
      id: `vis-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.fullName,
      leadPhone: lead.phone,
      developmentId: 'dev-001',
      developmentName: 'Altos del Horizonte',
      scheduledAt: new Date(scheduledAt).toISOString(),
      meetingPoint,
      assignedSellerId: assignedSellerId || 'seller-1',
      assignedSellerName: seller ? seller.name : lead.assignedAgent || 'Gonzalo Rossi',
      participantsCount,
      status: 'PROGRAMADA',
      notes: notes.trim() || undefined
    };

    const updatedLeadPartial: Partial<Lead> = {
      status: 'VISITA_AGENDADA',
      nextActionAt: new Date(scheduledAt).toISOString(),
      nextActionType: 'VISITA_AGENDADA',
      updatedAt: new Date().toISOString()
    };

    onSaveVisit(newVisit, updatedLeadPartial);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-purple-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-300" />
            <div>
              <h3 className="text-base font-black">Agendar Visita al Predio</h3>
              <p className="text-xs text-purple-200">{lead.fullName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-purple-800 text-purple-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Fecha y Hora Programada *</label>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Punto de Encuentro</label>
            <select
              value={meetingPoint}
              onChange={e => setMeetingPoint(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
            >
              <option value="Portal de Acceso Principal (Garita 1)">Portal de Acceso Principal (Garita 1)</option>
              <option value="Club House / Oficina de Ventas">Club House / Oficina de Ventas</option>
              <option value="Sector Manzana A (Etapa 1)">Sector Manzana A (Etapa 1)</option>
              <option value="Sector Manzana C (Etapa 2)">Sector Manzana C (Etapa 2)</option>
              <option value="Ubicación Externa / Estación Luján">Ubicación Externa / Estación Luján</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Acompañantes</label>
              <input
                type="number"
                min={1}
                max={10}
                value={participantsCount}
                onChange={e => setParticipantsCount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Asesor Acompañante</label>
              <select
                value={assignedSellerId}
                onChange={e => setAssignedSellerId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
              >
                {sellers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notas de Coordinación</label>
            <textarea
              rows={3}
              placeholder="Instrucciones para la visita, preferencias de horario, etc..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-700 text-white font-bold hover:bg-purple-800 shadow-md flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirmar Visita</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
