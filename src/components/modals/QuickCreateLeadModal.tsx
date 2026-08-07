import React, { useState } from 'react';
import { Lead, LeadSource, Seller, Campaign } from '../../types';
import { calculateLeadScore } from '../../domain/rules';
import { X, UserPlus, Phone, Mail, MapPin, Tag, MessageSquare, ShieldCheck } from 'lucide-react';

interface QuickCreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellers: Seller[];
  campaigns: Campaign[];
  onCreateLead: (newLead: Lead) => void;
}

export const QuickCreateLeadModal: React.FC<QuickCreateLeadModalProps> = ({
  isOpen,
  onClose,
  sellers,
  campaigns,
  onCreateLead
}) => {
  if (!isOpen) return null;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [source, setSource] = useState<LeadSource>('Meta Ads');
  const [campaignId, setCampaignId] = useState('');
  const [assignedSellerId, setAssignedSellerId] = useState(sellers[0]?.id || '');
  const [initialMessage, setInitialMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [budgetUSD, setBudgetUSD] = useState<number | undefined>(30000);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'El nombre es obligatorio';
    if (!lastName.trim()) errs.lastName = 'El apellido es obligatorio';
    if (!phone.trim()) errs.phone = 'El teléfono de contacto es obligatorio';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const seller = sellers.find(s => s.id === assignedSellerId);
    const campaign = campaigns.find(c => c.id === campaignId);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const now = new Date().toISOString();

    const partialLead: Partial<Lead> = {
      budgetUSD,
      budgetMin: budgetUSD ? Math.round(budgetUSD * 0.8) : undefined,
      budgetMax: budgetUSD ? Math.round(budgetUSD * 1.2) : undefined,
    };

    const { score, scoreReasons } = calculateLeadScore(partialLead);

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName,
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim(),
      source,
      channel: source,
      campaignId: campaignId || undefined,
      campaignName: campaign ? campaign.name : undefined,
      developmentInterestIds: ['dev-001'],
      lotInterestIds: [],
      assignedSellerId: assignedSellerId || undefined,
      assignedAgent: seller ? seller.name : 'Sin Asignar',
      status: 'NUEVO',
      qualification: 'TIBIO',
      qualificationScore: Math.round(score / 10),
      priority: 'ALTA',
      score,
      scoreReasons,
      initialMessage: initialMessage.trim() || undefined,
      notes: notes.trim(),
      budgetUSD: budgetUSD || 0,
      lastActivityAt: now,
      createdAt: now,
      updatedAt: now,
      tags: [source, 'Carga Rápida']
    };

    onCreateLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-black">Nuevo Lead Comercial</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-800 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre *</label>
              <input
                type="text"
                placeholder="Ej: Mateo"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.firstName ? 'border-rose-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
              {errors.firstName && <span className="text-[10px] text-rose-600 font-bold">{errors.firstName}</span>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Apellido *</label>
              <input
                type="text"
                placeholder="Ej: Ferrari"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.lastName ? 'border-rose-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
              {errors.lastName && <span className="text-[10px] text-rose-600 font-bold">{errors.lastName}</span>}
            </div>
          </div>

          {/* Contact details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Teléfono (WhatsApp) *</label>
              <input
                type="text"
                placeholder="+54 9 11 1234 5678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${
                  errors.phone ? 'border-rose-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
              {errors.phone && <span className="text-[10px] text-rose-600 font-bold">{errors.phone}</span>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ciudad / Localidad</label>
              <input
                type="text"
                placeholder="Ej: Luján, Pilar"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Presupuesto Estimado (USD)</label>
              <input
                type="number"
                placeholder="30000"
                value={budgetUSD || ''}
                onChange={e => setBudgetUSD(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Source & Campaign */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Fuente de Ingesta</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as LeadSource)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              >
                <option value="Meta Ads">Meta Ads</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Facebook Orgánico">Facebook Orgánico</option>
                <option value="Instagram Orgánico">Instagram Orgánico</option>
                <option value="WhatsApp">WhatsApp Directo</option>
                <option value="Sitio Web">Sitio Web / Formulario</option>
                <option value="Referido">Referido</option>
                <option value="Inmobiliaria">Inmobiliaria Aliada</option>
                <option value="Contacto Directo">Contacto Directo / Obra</option>
                <option value="Carga Manual">Carga Manual</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Campaña de Origen</label>
              <select
                value={campaignId}
                onChange={e => setCampaignId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              >
                <option value="">-- Sin Campaña Específica --</option>
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seller Assignment */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Asignar Vendedor</label>
            <select
              value={assignedSellerId}
              onChange={e => setAssignedSellerId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-slate-800"
            >
              <option value="">-- Dejar Sin Asignar --</option>
              {sellers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.activeLeadsCount} leads activos)
                </option>
              ))}
            </select>
          </div>

          {/* Initial Message & Internal Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mensaje Inicial del Lead</label>
            <textarea
              rows={2}
              placeholder="Ej: Consulta por financiación de 24 cuotas..."
              value={initialMessage}
              onChange={e => setInitialMessage(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notas Internas</label>
            <textarea
              rows={2}
              placeholder="Comentarios adicionales para el equipo comercial..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 shadow-md transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Guardar Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
