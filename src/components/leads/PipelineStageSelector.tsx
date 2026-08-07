import React from 'react';
import { LeadStatus, Lead } from '../../types';
import { LEAD_STATUS_CONFIG } from '../../domain/rules';

interface PipelineStageSelectorProps {
  selectedStage: string;
  onSelectStage: (stage: string) => void;
  leads: Lead[];
}

export const PipelineStageSelector: React.FC<PipelineStageSelectorProps> = ({
  selectedStage,
  onSelectStage,
  leads
}) => {
  const mainStages: { key: string; label: string }[] = [
    { key: 'ALL', label: 'Todos los Activos' },
    { key: 'NUEVO', label: '1. Recibidos' },
    { key: 'PENDIENTE_PRIMER_CONTACTO', label: '2. Pend. Contacto' },
    { key: 'CONTACTADO', label: '3. Contactados' },
    { key: 'EN_CALIFICACION', label: '4. En Calificación' },
    { key: 'CALIFICADO', label: '5. Calificados' },
    { key: 'VISITA_AGENDADA', label: '6. Visita Agendada' },
    { key: 'LOTE_IDENTIFICADO', label: '7. Lote Elegido' },
    { key: 'COTIZACION_ENVIADA', label: '8. Cotización' },
    { key: 'NEGOCIACION', label: '9. Negociación' },
    { key: 'RESERVA_CONFIRMADA', label: '10. Reservados' },
    { key: 'CLOSED', label: '🚫 Cerrados / Perdidos' }
  ];

  const getStageCount = (stageKey: string) => {
    if (stageKey === 'ALL') {
      return leads.filter(l => !['OPORTUNIDAD_PERDIDA', 'NO_CALIFICADO', 'DUPLICADO', 'CONTACTO_INVALIDO'].includes(l.status)).length;
    }
    if (stageKey === 'CLOSED') {
      return leads.filter(l => ['OPORTUNIDAD_PERDIDA', 'NO_CALIFICADO', 'DUPLICADO', 'CONTACTO_INVALIDO'].includes(l.status)).length;
    }
    return leads.filter(l => l.status === stageKey).length;
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none my-1">
      {mainStages.map(st => {
        const count = getStageCount(st.key);
        const isActive = selectedStage === st.key;

        return (
          <button
            key={st.key}
            onClick={() => onSelectStage(st.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all shrink-0 border ${
              isActive
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs scale-102'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{st.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isActive ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
