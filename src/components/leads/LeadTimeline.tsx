import React from 'react';
import { ActivityItem } from '../../types';
import { MessageCircle, Phone, Mail, FileText, Calendar, CheckCircle, RefreshCw, UserCheck } from 'lucide-react';

export const LeadTimeline: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
        No hay interacciones registradas aún.
      </div>
    );
  }

  const sorted = [...activities].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'WHATSAPP':
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case 'LLAMADA':
      case 'LLAMADA_SIN_RESPUESTA':
        return <Phone className="w-3.5 h-3.5 text-blue-600" />;
      case 'CORREO':
        return <Mail className="w-3.5 h-3.5 text-red-500" />;
      case 'VISITA_AGENDADA':
      case 'VISITA_REALIZADA':
        return <Calendar className="w-3.5 h-3.5 text-purple-600" />;
      case 'CAMBIO_ESTADO':
        return <RefreshCw className="w-3.5 h-3.5 text-amber-600" />;
      case 'CAMBIO_VENDEDOR':
        return <UserCheck className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {sorted.map(act => (
        <div key={act.id} className="relative group">
          <div className="absolute -left-6 top-0.5 p-1 rounded-full bg-white border border-slate-200 shadow-2xs group-hover:scale-110 transition-transform">
            {getActivityIcon(act.type)}
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs shadow-2xs space-y-1">
            <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 font-bold">
              <span className="text-slate-800 uppercase tracking-wider">{act.type.replace('_', ' ')}</span>
              <span>{new Date(act.timestamp).toLocaleString()}</span>
            </div>

            <p className="text-slate-700 font-medium">{act.description}</p>

            {act.result && (
              <div className="text-[11px] text-emerald-800 bg-emerald-50/60 p-1.5 rounded-lg border border-emerald-100 font-semibold">
                Resultado: {act.result}
              </div>
            )}

            <div className="text-[10px] text-slate-400 text-right font-medium">Por {act.authorName}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
