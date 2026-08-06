import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Zap, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export const AutomationsModule: React.FC = () => {
  const rules = [
    {
      id: 'rule-01',
      title: 'Alertas por Vencimiento de Bloqueo Temporal (48hs)',
      description: 'Genera notificación de alta prioridad 2 horas antes de que un bloqueo temporal quede liberado automáticamente.',
      trigger: '48hs post asignación de bloqueo',
      requiresHumanIntervention: true,
      status: 'ACTIVO'
    },
    {
      id: 'rule-02',
      title: 'Recordatorio Automático de Cuota Vencida',
      description: 'Envía mensaje de recordatorio y link de pago al cumplirse 5 días de morosidad en plan de financiación.',
      trigger: '5 días post fecha de vencimiento',
      requiresHumanIntervention: false,
      status: 'ACTIVO'
    },
    {
      id: 'rule-03',
      title: 'Aprobación Human-in-the-Loop de Señas',
      description: 'Toda seña recibida por transferencia debe ser aprobada por el área de Tesorería antes de confirmar la reserva.',
      trigger: 'Carga de comprobante de seña',
      requiresHumanIntervention: true,
      status: 'ACTIVO'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Reglas & Automatizaciones</h2>
          <p className="text-xs text-slate-500">Motor de eventos y validación con intervención humana</p>
        </div>
        <Zap className="w-6 h-6 text-brand-600" />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-extrabold text-amber-950">Principio de Decisión Sensible</h3>
          <p className="text-[11px] text-amber-800 mt-0.5">
            Las decisiones contractuales o financieras sensibles no se ejecutan a ciegas. El sistema alerta y recomienda acciones, pero la decisión final requiere intervención humana.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {rules.map(r => (
          <Card key={r.id} padding="md" className="space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">{r.title}</h3>
                <span className="text-[11px] text-brand-600 font-semibold block mt-0.5">Disparador: {r.trigger}</span>
              </div>
              <Badge variant="success">{r.status}</Badge>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
              {r.description}
            </p>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Intervención humana:</span>
              <span className={`font-bold ${r.requiresHumanIntervention ? 'text-amber-700' : 'text-slate-700'}`}>
                {r.requiresHumanIntervention ? 'Obligatoria (Requerida)' : 'Automatizada'}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
