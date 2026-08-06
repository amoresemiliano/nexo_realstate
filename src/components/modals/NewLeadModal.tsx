import React, { useState } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { Lead } from '../../types';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLead: (newLead: Partial<Lead>) => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmitLead,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [channel, setChannel] = useState<'Meta Ads' | 'Google Ads' | 'Instagram' | 'Referido' | 'Sitio Web' | 'Cartel Obra'>('Meta Ads');
  const [budgetUSD, setBudgetUSD] = useState<number>(30000);
  const [interestedBlock, setInterestedBlock] = useState('A');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    onSubmitLead({
      fullName,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      channel,
      budgetUSD,
      interestedBlock,
      notes: notes || 'Lead ingresado vía formulario móvil.',
      status: 'NUEVO',
      assignedAgent: 'Gonzalo Rossi',
      qualificationScore: 7,
      createdAt: new Date().toISOString().split('T')[0],
      lastInteractionAt: new Date().toISOString().split('T')[0],
    });

    setFullName('');
    setPhone('');
    setEmail('');
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Capturar Nuevo Lead" subtitle="Ingreso rápido de oportunidad comercial">
      <form onSubmit={handleSubmit} className="space-y-3 pt-1">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Nombre Completo *</label>
          <input
            type="text"
            required
            placeholder="Ej: Carlos Gutiérrez"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Teléfono WhatsApp *</label>
            <input
              type="text"
              required
              placeholder="+54 11..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Canal de Origen</label>
            <select
              value={channel}
              onChange={(e: any) => setChannel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
            >
              <option value="Meta Ads">Meta Ads (FB/IG)</option>
              <option value="Google Ads">Google Search</option>
              <option value="Instagram">Instagram Direct</option>
              <option value="Referido">Referido</option>
              <option value="Sitio Web">Sitio Web</option>
              <option value="Cartel Obra">Cartel de Obra</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Correo Electrónico</label>
          <input
            type="email"
            placeholder="cliente@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Presupuesto Aprox (USD)</label>
            <input
              type="number"
              value={budgetUSD}
              onChange={(e) => setBudgetUSD(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Manzana Interés</label>
            <select
              value={interestedBlock}
              onChange={(e) => setInterestedBlock(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              <option value="A">Manzana A</option>
              <option value="B">Manzana B</option>
              <option value="C">Manzana C</option>
              <option value="D">Manzana D</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Notas / Requerimientos</label>
          <textarea
            rows={2}
            placeholder="Detalles sobre preferencia de terreno..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="pt-2">
          <Button variant="primary" fullWidth type="submit">
            Guardar Lead en CRM
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};
