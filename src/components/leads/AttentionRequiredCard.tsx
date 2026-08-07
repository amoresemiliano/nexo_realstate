import React from 'react';
import { Lead } from '../../types';
import { calculateSLA } from '../../domain/rules';
import { AlertCircle, Clock, UserX, PhoneCall, ArrowRight } from 'lucide-react';

interface AttentionRequiredCardProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export const AttentionRequiredCard: React.FC<AttentionRequiredCardProps> = ({
  leads,
  onSelectLead
}) => {
  // Find urgent leads:
  // 1. SLA overdue or critical (>60m)
  // 2. Unassigned leads
  const urgentLeads = leads.filter(l => {
    const sla = calculateSLA(l.createdAt, l.status);
    const isOverdue = sla.slaStatus === 'OVERDUE' || sla.slaStatus === 'CRITICAL';
    const isUnassigned = !l.assignedSellerId || l.assignedAgent === 'Sin Asignar';
    return (isOverdue || isUnassigned) && !['OPORTUNIDAD_PERDIDA', 'NO_CALIFICADO', 'DUPLICADO', 'CONTACTO_INVALIDO'].includes(l.status);
  });

  if (urgentLeads.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 rounded-2xl p-4 shadow-xs space-y-3 my-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-rose-600 text-white animate-pulse">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-rose-950 uppercase tracking-wider">
              Atención Comercial Requerida ({urgentLeads.length})
            </h3>
            <p className="text-[11px] text-rose-800">Leads con SLA excedido o sin vendedor asignado</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {urgentLeads.slice(0, 5).map(lead => {
          const sla = calculateSLA(lead.createdAt, lead.status);
          const isUnassigned = !lead.assignedSellerId || lead.assignedAgent === 'Sin Asignar';

          return (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead)}
              className="bg-white p-3 rounded-xl border border-rose-200 shrink-0 w-60 shadow-2xs hover:border-rose-400 cursor-pointer transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-900 truncate max-w-[120px]">
                  {lead.fullName}
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {isUnassigned ? 'Sin Asignar' : sla.ageText}
                </span>
              </div>

              <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                <PhoneCall className="w-3 h-3 text-slate-400" />
                <span>{lead.phone}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100">
                <span className="font-semibold text-slate-600">{lead.source}</span>
                <span className="font-bold text-rose-600 flex items-center gap-0.5">
                  <span>Atender</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
