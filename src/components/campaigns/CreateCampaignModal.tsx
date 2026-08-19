import React, { useState } from 'react';
import { Target, X, AlertCircle } from 'lucide-react';
import { Campaign } from '../../types';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCampaign: (campaign: Campaign) => void;
}

const CANALES = [
  'Meta Ads',
  'Google Ads',
  'Instagram',
  'Facebook',
  'WhatsApp',
  'Email',
  'Evento',
  'Referidos',
  'Portal inmobiliario',
  'Otro',
];

const ESTADOS = [
  { value: 'ACTIVA', label: 'Activa' },
  { value: 'BORRADOR', label: 'Borrador' },
  { value: 'PAUSADA', label: 'Pausada' },
  { value: 'FINALIZADA', label: 'Finalizada' },
];

const OBJETIVOS = [
  'Generación de leads',
  'Visitas',
  'Consultas',
  'Reservas',
  'Reconocimiento',
];

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onCreateCampaign,
}) => {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('Meta Ads');
  const [status, setStatus] = useState<'ACTIVA' | 'PAUSADA' | 'FINALIZADA' | 'BORRADOR'>('ACTIVA');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [responsible, setResponsible] = useState('');
  const [budgetUSD, setBudgetUSD] = useState<number | ''>(1000);
  const [dailyBudgetUSD, setDailyBudgetUSD] = useState<number | ''>(50);
  const [objective, setObjective] = useState('Generación de leads');
  const [targetAudience, setTargetAudience] = useState('');
  const [zone, setZone] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre de la campaña es obligatorio.';
    }
    if (!platform) {
      newErrors.platform = 'El canal es obligatorio.';
    }
    if (!startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: name.trim(),
      platform,
      status: status === 'BORRADOR' ? 'PAUSADA' : status,
      budgetUSD: Number(budgetUSD) || 0,
      spentUSD: 0,
      leadsGenerated: 0,
      conversions: 0,
      startDate,
      endDate: endDate || '2026-12-31',
    };

    onCreateCampaign(newCampaign);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Nueva Campaña de Marketing</h3>
              <p className="text-[11px] text-slate-400">Captación comercial y pauta publicitaria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Identificación */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-150 pb-1">
              1. Identificación
            </h4>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre de Campaña *</label>
              <input
                type="text"
                placeholder="Ej. Lanzamiento Etapa 2 - Meta Ads"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                className={`w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold ${
                  errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-250'
                }`}
              />
              {errors.name && (
                <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Canal / Plataforma *</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                >
                  {CANALES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estado *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                >
                  {ESTADOS.map((e) => (
                    <option key={e.value} value={e.value}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Fecha Inicio *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fecha Fin (Opcional)</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Responsable Comercial</label>
              <input
                type="text"
                placeholder="Ej. Martín Gómez / Agencia MKT"
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
              />
            </div>
          </div>

          {/* Inversión y Objetivos */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-150 pb-1">
              2. Presupuesto y Objetivo
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Presupuesto Total (USD)</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={budgetUSD}
                  onChange={(e) => setBudgetUSD(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Presupuesto Diario (USD)</label>
                <input
                  type="number"
                  placeholder="50"
                  value={dailyBudgetUSD}
                  onChange={(e) => setDailyBudgetUSD(e.target.value ? Number(e.target.value) : '')}
                  className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Objetivo Principal</label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
              >
                {OBJETIVOS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Segmentación y Descripción */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-150 pb-1">
              3. Segmentación y Notas
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Público Objetivo</label>
                <input
                  type="text"
                  placeholder="Ej. Inversores 30-55 años"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Zona Geográfica</label>
                <input
                  type="text"
                  placeholder="Ej. GBA Norte / Pilar / CABA"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Notas / Descripción</label>
              <textarea
                rows={2}
                placeholder="Observaciones de la pauta publicitaria..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold resize-none"
              />
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Crear Campaña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
