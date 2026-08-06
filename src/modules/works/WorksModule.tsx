import React from 'react';
import { mockWorkItems } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { HardHat, CheckCircle2, Clock, Wrench } from 'lucide-react';

export const WorksModule: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Avance de Obras</h2>
          <p className="text-xs text-slate-500">Estado de infraestructura de servicios en el predio</p>
        </div>
        <HardHat className="w-6 h-6 text-amber-600" />
      </div>

      <div className="space-y-3">
        {mockWorkItems.map(work => (
          <Card key={work.id} padding="md" className="space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{work.category}</span>
                <h3 className="text-sm font-black text-slate-900">{work.title}</h3>
              </div>
              <Badge variant={work.status === 'FINALIZADO' ? 'success' : 'brand'}>
                {work.status}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600">Avance Fisico:</span>
                <span className="text-brand-600">{work.progressPercentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    work.progressPercentage === 100 ? 'bg-emerald-500' : 'bg-brand-600'
                  }`}
                  style={{ width: `${work.progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span>Contratista: <strong>{work.contractor}</strong></span>
              <span>Entrega: <strong>{work.targetDate}</strong></span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
