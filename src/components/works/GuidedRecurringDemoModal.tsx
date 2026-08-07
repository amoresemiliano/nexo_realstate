import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { X, Repeat, CheckCircle2, TrendingUp, Calendar, ShieldCheck } from 'lucide-react';

interface GuidedRecurringDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecurringDemo: () => void;
}

export const GuidedRecurringDemoModal: React.FC<GuidedRecurringDemoModalProps> = ({
  isOpen,
  onClose,
  onApplyRecurringDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-black text-slate-900">
              Caso Recurrente: Mantenimiento de Piscina & MRR
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 space-y-1">
            <div className="flex justify-between font-black text-sm">
              <span>Lote B-12 — Dr. Martín Benítez</span>
              <Badge variant="purple">MRR + $120 USD/mes</Badge>
            </div>
            <p className="text-[11px] text-purple-800">
              Tras la entrega de obra de piscina en Lote B-12, el comprador suscribe un abono semanal de mantenimiento de agua, limpieza de filtro y tratamiento de cloro.
            </p>
          </div>

          <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2">
            <span className="text-amber-400 font-bold uppercase text-[10px] block">
              Desglose Recurrente de Intermediación
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Cobro al Comprador:</span>
                <strong className="text-emerald-400 text-sm">$120 USD/mes</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Pago a Proveedor:</span>
                <strong className="text-slate-200">$90 USD/mes</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Margen Recurrente Nexo:</span>
                <strong className="text-amber-300 text-sm">$30 USD/mes</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Frecuencia Visita:</span>
                <strong className="text-purple-300">Semanal (Martes)</strong>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 space-y-1">
            <span className="font-bold block">Integración con Hoja de Ruta de Mantenimiento</span>
            <p className="text-[11px] text-slate-600">
              La cuadrilla de "Piscinas del Parque" recibe automáticamente la notificación de visita agendada en la ruta del desarrollo.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onApplyRecurringDemo();
              onClose();
            }}
          >
            <CheckCircle2 className="w-4 h-4" /> Activar Abono Recurrente Demo
          </Button>
        </div>
      </div>
    </div>
  );
};
