import React from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { HardHat, Clock, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

interface ProviderDashboardViewProps {
  onNavigateModule: (mod: string) => void;
}

export const ProviderDashboardView: React.FC<ProviderDashboardViewProps> = ({ onNavigateModule }) => {
  return (
    <div className="space-y-4">
      {/* Provider Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-950 text-white p-4 rounded-2xl shadow-md border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="brand" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
            Portal Proveedores
          </Badge>
          <span className="text-[11px] text-slate-300 font-medium">VialSur Infraestructura S.A.</span>
        </div>
        <h2 className="text-xl font-black tracking-tight">Panel de Trabajos y Contrataciones</h2>
        <p className="text-xs text-slate-300 mt-1">
          Desarrollo: Altos del Horizonte • Rubro: Movimiento de Suelos y Pavimentación
        </p>
      </div>

      {/* Provider KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <Card padding="sm" className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Trabajos Asignados</span>
          <div className="text-2xl font-black text-slate-900">4 Obras</div>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block">
            3 en progreso
          </span>
        </Card>

        <Card padding="sm" className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Cotizaciones Solicitadas</span>
          <div className="text-2xl font-black text-amber-600">2 Pendientes</div>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md inline-block">
            Responder &lt;48hs
          </span>
        </Card>

        <Card padding="sm" className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Nivel de Cumplimiento</span>
          <div className="text-2xl font-black text-emerald-600">92%</div>
          <span className="text-[10px] text-slate-500 font-medium inline-block">
            Rating promedio: 4.8 / 5.0
          </span>
        </Card>

        <Card padding="sm" className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Incidencias Reportadas</span>
          <div className="text-2xl font-black text-rose-600">1 Abierta</div>
          <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded-md inline-block">
            En resolución
          </span>
        </Card>
      </div>

      {/* Assigned Work Orders List */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Órdenes de Trabajo Asignadas
          </span>
          <button
            onClick={() => onNavigateModule('works')}
            className="text-xs font-bold text-brand-600 hover:underline"
          >
            Ver Módulo de Obras
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900">OT-2026-88 • Cordon Rigola Etapa 2</span>
                <Badge variant="brand">EN PROGRESO (85%)</Badge>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Fecha Límite: 15/09/2026</span>
            </div>
            <button className="px-2.5 py-1.5 bg-brand-600 text-white font-bold text-[11px] rounded-lg">
              Cargar Hito
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900">OT-2026-92 • Nivelación Terrenos Manzana C</span>
                <Badge variant="warning">PENDIENTE COTIZACION</Badge>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Apertura de pliego enviada</span>
            </div>
            <button className="px-2.5 py-1.5 bg-amber-500 text-slate-950 font-bold text-[11px] rounded-lg">
              Enviar Presupuesto
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
