import React from 'react';
import { mockLegalProcesses } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Scale, FileText, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export const LegalModule: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Escrituración & Legales</h2>
          <p className="text-xs text-slate-500">Seguimiento de planos de mensura, fideicomisos y escrituras</p>
        </div>
        <Scale className="w-6 h-6 text-brand-600" />
      </div>

      <div className="space-y-3">
        {mockLegalProcesses.map(proc => (
          <Card key={proc.id} padding="md" className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-black text-slate-900">Lote {proc.lotNumber} — {proc.customerName}</span>
                <span className="text-xs text-slate-500 block">Etapa Actual: <strong>{proc.stage}</strong></span>
              </div>
              <Badge variant={proc.status === 'COMPLETADO' ? 'success' : 'brand'}>
                {proc.status}
              </Badge>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
              <div>Escribanía Asignada: <strong>{proc.assignedNotary}</strong></div>
              <div>Estimación Finalización: <strong>{proc.estimatedCompletion}</strong></div>
            </div>

            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-700 block">Documentación Asociada:</span>
              {proc.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-1.5 bg-slate-100/70 rounded-lg">
                  <span className="flex items-center gap-1.5 font-medium text-slate-800">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    {doc.name}
                  </span>
                  {doc.verified ? (
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verificado
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" /> En Revisión
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
