import React from 'react';
import { mockDevelopment } from '../../data/mockData';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Building, MapPin, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';

export const DevelopmentsModule: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Ficha del Desarrollo</h2>
          <p className="text-xs text-slate-500">Información técnica y masterplan del proyecto</p>
        </div>
        <Building className="w-6 h-6 text-brand-600" />
      </div>

      <Card padding="md" className="space-y-3 bg-slate-900 text-white">
        <div className="flex items-center justify-between">
          <Badge variant="brand" className="bg-brand-500/20 text-brand-300">Barrio Abierto Residencial</Badge>
          <span className="text-xs font-mono text-slate-400">18.5 Hectáreas</span>
        </div>
        <h3 className="text-xl font-black text-white">{mockDevelopment.name}</h3>
        <p className="text-xs text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-brand-400" />
          {typeof mockDevelopment.location === 'string'
            ? mockDevelopment.location
            : `${mockDevelopment.location.address ? mockDevelopment.location.address + ', ' : ''}${mockDevelopment.location.city}, ${mockDevelopment.location.province}`}
        </p>
        <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
          {mockDevelopment.description}
        </p>
      </Card>

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Etapas de Desarrollo</span>
        {mockDevelopment.stages.map(stg => (
          <Card key={stg.id} padding="md" className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-900">{stg.name}</span>
              <Badge variant="brand">{stg.completionPercentage}% Obra</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2 rounded-xl">
              <div>Lotes Totales: <strong>{stg.totalLots}</strong></div>
              <div>Lotes Disponibles: <strong>{stg.availableLots}</strong></div>
            </div>
            <div className="text-[11px] text-slate-500">Entrega Estimada: <strong>{stg.estimatedDeliveryDate}</strong></div>
          </Card>
        ))}
      </div>
    </div>
  );
};
