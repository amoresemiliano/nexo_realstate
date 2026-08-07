import React from 'react';
import { Lead } from '../../types';
import { Phone, MessageCircle, FileText, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface LeadQuickActionsProps {
  lead: Lead;
  onLogActivity: (lead: Lead) => void;
  onQualify: (lead: Lead) => void;
  onChangeStatus: (lead: Lead) => void;
  onMarkLost: (lead: Lead) => void;
  className?: string;
  size?: 'compact' | 'full';
}

export const LeadQuickActions: React.FC<LeadQuickActionsProps> = ({
  lead,
  onLogActivity,
  onQualify,
  onChangeStatus,
  onMarkLost,
  className = '',
  size = 'compact'
}) => {
  const sanitizePhone = (phone: string) => phone.replace(/[^\d+]/g, '');

  const phoneClean = sanitizePhone(lead.phone);
  const waUrl = `https://wa.me/${phoneClean.replace('+', '')}?text=Hola%20${encodeURIComponent(
    lead.firstName
  )},%20te%20contacto%20de%20Nexo%20Desarrollos%20por%20tu%20consulta.`;

  if (size === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`} onClick={e => e.stopPropagation()}>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-95 transition-all border border-emerald-200"
          title="WhatsApp directo"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
        <a
          href={`tel:${phoneClean}`}
          className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95 transition-all border border-blue-200"
          title="Llamada telefónica"
        >
          <Phone className="w-4 h-4" />
        </a>
        <button
          onClick={() => onLogActivity(lead)}
          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all border border-slate-200"
          title="Registrar actividad"
        >
          <FileText className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 active:scale-98 transition-all"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Enviar WhatsApp</span>
      </a>

      <a
        href={`tel:${phoneClean}`}
        className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 text-white font-bold text-xs shadow-xs hover:bg-slate-900 active:scale-98 transition-all"
      >
        <Phone className="w-4 h-4" />
        <span>Llamar Directo</span>
      </a>

      <button
        onClick={() => onLogActivity(lead)}
        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs hover:bg-slate-50 transition-all"
      >
        <FileText className="w-4 h-4 text-brand-600" />
        <span>Registrar Gestión</span>
      </button>

      <button
        onClick={() => onQualify(lead)}
        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-brand-50 border border-brand-200 text-brand-800 font-bold text-xs shadow-2xs hover:bg-brand-100 transition-all"
      >
        <CheckCircle2 className="w-4 h-4 text-brand-600" />
        <span>Calificar Lead</span>
      </button>

      <button
        onClick={() => onChangeStatus(lead)}
        className="col-span-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 font-bold text-xs shadow-2xs hover:bg-purple-100 transition-all"
      >
        <ArrowRight className="w-4 h-4 text-purple-600" />
        <span>Avanzar Estado</span>
      </button>

      <button
        onClick={() => onMarkLost(lead)}
        className="col-span-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs shadow-2xs hover:bg-rose-100 transition-all"
      >
        <XCircle className="w-4 h-4 text-rose-600" />
        <span>Perdido / Descarte</span>
      </button>
    </div>
  );
};
