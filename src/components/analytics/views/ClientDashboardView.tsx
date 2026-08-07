import React from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { MapPin, FileCheck, HardHat, ShieldCheck, Wallet, Download, Clock } from 'lucide-react';
import { formatUSD } from '../../../domain/rules';

interface ClientDashboardViewProps {
  onNavigateModule: (mod: string) => void;
}

export const ClientDashboardView: React.FC<ClientDashboardViewProps> = ({ onNavigateModule }) => {
  return (
    <div className="space-y-4">
      {/* Client Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-950 text-white p-4 rounded-2xl shadow-md border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="brand" className="bg-brand-500/20 text-brand-300 border-brand-500/30">
            Portal Mi Lote
          </Badge>
          <span className="text-[11px] text-slate-300 font-medium">Cliente: Roberto Martínez</span>
        </div>
        <h2 className="text-xl font-black tracking-tight">Lote B-2 • Altos del Horizonte</h2>
        <p className="text-xs text-slate-300 mt-1">
          Etapa 1 - Los Pinos • Superficie: 510 m² • Estado: Posición posesión garantizada
        </p>
      </div>

      {/* Primary Account & Installment Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <Card padding="md" className="space-y-1.5 bg-emerald-50/50 border-emerald-200">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Estado de Cuenta</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900">Al Día</div>
          <span className="text-[11px] text-emerald-700 font-medium block">
            12 de 36 cuotas abonadas (33% del plan)
          </span>
        </Card>

        <Card padding="md" className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Próxima Cuota</span>
            <Clock className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">$933 USD</div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Vence el 15/08/2026 (Cuota 13/36)
          </span>
        </Card>

        <Card padding="md" className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Escrituración</span>
            <FileCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-700">60% Avance</div>
          <span className="text-[11px] text-slate-500 font-medium block">
            Estudio de títulos completado
          </span>
        </Card>
      </div>

      {/* Progress Cards: Infrastructure & Deeds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Work progress for lot */}
        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <HardHat className="w-4 h-4 text-amber-600" />
              <span>Avance de Obras en mi Sector</span>
            </div>
            <span className="text-xs font-extrabold text-amber-700">90% Completado</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Red Subterránea de Agua Potable</span>
                <span className="text-emerald-700 font-bold">100%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Pavimentación y Cordon Rigola</span>
                <span className="text-emerald-700 font-bold">85%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%]" />
              </div>
            </div>
          </div>
        </Card>

        {/* Client Documents */}
        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <FileCheck className="w-4 h-4 text-brand-600" />
              <span>Mis Documentos Registrados</span>
            </div>
            <span className="text-[10px] text-slate-400">Descarga digital</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Boleto de Compraventa.pdf</span>
                <span className="text-[10px] text-slate-500">Firmado digitalmente el 12/01/2026</span>
              </div>
              <button className="p-1.5 bg-white border rounded-lg text-brand-600 hover:bg-slate-100">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Comprobante Seña $3.600 USD</span>
                <span className="text-[10px] text-slate-500">Validado por Tesorería Nexo</span>
              </div>
              <button className="p-1.5 bg-white border rounded-lg text-brand-600 hover:bg-slate-100">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Services & Guarantees */}
      <Card padding="md" className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Garantías y Servicios Recurrentes Activos</span>
        </div>
        <p className="text-xs text-slate-600">
          Tu lote dispone de cobertura de garantía de infraestructura de suelo por 24 meses y servicio de mantenimiento de espacios verdes comunitarios activo ($120 USD/mes).
        </p>
      </Card>
    </div>
  );
};
