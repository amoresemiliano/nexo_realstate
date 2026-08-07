import React, { useState } from 'react';
import { Lot, Lead } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, UserCheck, Star, Search, Check } from 'lucide-react';

interface AssociateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: Lot | null;
  leads: Lead[];
  onAssociate: (lotId: string, leadId: string, isFavorite?: boolean, interestType?: 'PRIMARY' | 'SECONDARY' | 'DISCARDED') => void;
}

export const AssociateLeadModal: React.FC<AssociateLeadModalProps> = ({
  isOpen,
  onClose,
  lot,
  leads,
  onAssociate,
}) => {
  if (!isOpen || !lot) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(true);
  const [interestType, setInterestType] = useState<'PRIMARY' | 'SECONDARY' | 'DISCARDED'>('PRIMARY');

  const filteredLeads = leads.filter(l =>
    l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.phone.includes(searchTerm) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;
    onAssociate(lot.id, selectedLeadId, isFavorite, interestType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-base font-black text-white">Asociar Lote a Lead</h3>
              <p className="text-xs text-slate-400">Lote {lot.block}-{lot.number} ({lot.stage})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Search Lead */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Buscar Lead / Cliente Comercial:</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Nombre, teléfono o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Lead List Selector */}
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {filteredLeads.map((lead) => {
              const isSelected = selectedLeadId === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-extrabold block">{lead.fullName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{lead.phone} • {lead.qualification}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-brand-600" />}
                </div>
              );
            })}
          </div>

          {/* Interest Level Options */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Agregar a Favoritos del Lead:</span>
              </label>
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 accent-brand-600 rounded cursor-pointer"
              />
            </div>

            {isFavorite && (
              <div className="space-y-1 pl-1">
                <span className="text-[11px] font-semibold text-slate-500">Nivel de Interés:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setInterestType('PRIMARY')}
                    className={`py-1.5 rounded-lg text-[11px] font-bold ${
                      interestType === 'PRIMARY' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    ⭐ Principal
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterestType('SECONDARY')}
                    className={`py-1.5 rounded-lg text-[11px] font-bold ${
                      interestType === 'SECONDARY' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    🔹 Secundario
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterestType('DISCARDED')}
                    className={`py-1.5 rounded-lg text-[11px] font-bold ${
                      interestType === 'DISCARDED' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    🚫 Descartado
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!selectedLeadId}
            >
              Confirmar Asociación
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
