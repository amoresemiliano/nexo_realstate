import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Play,
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  HardHat,
  DollarSign,
  ShieldCheck,
  Scale,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface GuidedMainDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteFullFlow: () => void;
}

export const GuidedMainDemoModal: React.FC<GuidedMainDemoModalProps> = ({
  isOpen,
  onClose,
  onExecuteFullFlow,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);

  const totalSteps = 7;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black">
              {step}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Caso Principal Postventa: Cerco Perimetral Lote A-4
              </h3>
              <p className="text-xs text-slate-500">Paso {step} de {totalSteps} — Flujo End-to-End Trazable</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Detección Oportunidad */}
        {step === 1 && (
          <div className="space-y-3 text-xs">
            <Badge variant="warning">Paso 1: Detección Automática de Oportunidad</Badge>
            <h4 className="text-sm font-black text-slate-900">
              Lote A-4 Entregado a Comprador (Familia Rossi)
            </h4>
            <p className="text-slate-600">
              El motor de reglas postventa detecta que el lote fue posesionado hace 14 días y carece de delimitación perimetral. Genera automáticamente la oportunidad: <strong>"Cerco Perimetral Olímpico Lote A-4"</strong>.
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-bold">
              Valor Potencial Estimado: $3,500 USD • Disparador: Posesión Confirmada
            </div>
          </div>
        )}

        {/* STEP 2: Relevamiento Técnico */}
        {step === 2 && (
          <div className="space-y-3 text-xs">
            <Badge variant="brand">Paso 2: Relevamiento Técnico & Medición en Terreno</Badge>
            <h4 className="text-sm font-black text-slate-900">
              Coordinador Técnico en Sitio (Ing. Gonzalo Bunge)
            </h4>
            <p className="text-slate-600">
              Se realiza la visita técnica. Medición verificada: 124 metros lineales de cerco. Suelo firme con cota uniforme.
            </p>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 space-y-1">
              <span className="font-bold block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Relevamiento #SURV-101 Completado
              </span>
              <p className="text-[11px] text-purple-800">
                Se adjuntan 2 fotografías del perímetro e informe de aptitud logística para materiales.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Cotización Proveedores */}
        {step === 3 && (
          <div className="space-y-3 text-xs">
            <Badge variant="purple">Paso 3: Solicitud de Presupuestos a Proveedores</Badge>
            <h4 className="text-sm font-black text-slate-900">
              Convocatoria a 3 Proveedores Homologados
            </h4>
            <p className="text-slate-600">
              Nexo convoca a Cercos Luján, Mallas Olimpo y Estructuras Oeste con las especificaciones técnicas del relevamiento.
            </p>
            <div className="space-y-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between font-bold">
                <span>Cercos Luján S.A.</span>
                <span className="text-slate-900">$3,100 USD (10 días)</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Mallas Olimpo SRL</span>
                <span className="text-slate-900">$3,400 USD (7 días - Mención Rápida)</span>
              </div>
              <div className="flex justify-between font-bold text-slate-400">
                <span>Estructuras Oeste</span>
                <span>$3,600 USD (14 días)</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Comparación & Propuesta Comercial */}
        {step === 4 && (
          <div className="space-y-3 text-xs">
            <Badge variant="success">Paso 4: Comparativa & Propuesta al Comprador</Badge>
            <h4 className="text-sm font-black text-slate-900">
              Selección de Proveedor Ganador & Cálculo Comercial
            </h4>
            <p className="text-slate-600">
              Se selecciona la cotización de <strong>Cercos Luján S.A.</strong> ($3,100 USD). Nexo calcula el sobreprecio (markup) para el comprador.
            </p>

            <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Costo Proveedor:</span>
                <span>$3,100 USD</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Precio Final Cliente:</span>
                <span>$3,800 USD</span>
              </div>
              <div className="flex justify-between text-amber-300 font-bold">
                <span>Comisión / Margen Nexo:</span>
                <span>$700 USD (18.4% Neto)</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Aprobación & Orden de Trabajo */}
        {step === 5 && (
          <div className="space-y-3 text-xs">
            <Badge variant="brand">Paso 5: Aprobación del Cliente & Emisión Orden de Trabajo</Badge>
            <h4 className="text-sm font-black text-slate-900">
              Familia Rossi Aprueba Propuesta V1
            </h4>
            <p className="text-slate-600">
              Se aprueba la propuesta comercial. El sistema genera automáticamente la <strong>Orden de Trabajo #WO-701</strong> y devenga la comisión de $700 USD en el módulo financiero.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold flex items-center justify-between">
              <span>Orden de Trabajo #WO-701 En Preparación</span>
              <Badge variant="success">Comisión Devengada $700 USD</Badge>
            </div>
          </div>
        )}

        {/* STEP 6: Avance & Incidencia */}
        {step === 6 && (
          <div className="space-y-3 text-xs">
            <Badge variant="danger">Paso 6: Certificación de Hitos & Gestión de Incidencias</Badge>
            <h4 className="text-sm font-black text-slate-900">
              Ejecución de Obra (100% Avance) & Incidencia Resuelta
            </h4>
            <p className="text-slate-600">
              Durante la obra se reportó un bloqueo de paso por acopio de materiales vecinos (Incidencia Media), resuelto en 24hs por el coordinador de barrio.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold">
                <span>Hito 1 (Replanteo): 100% ✓</span>
                <span>Hito 2 (Postes): 100% ✓</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Hito 3 (Malla): 100% ✓</span>
                <span>Hito 4 (Portón): 100% ✓</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Finalización & Garantía */}
        {step === 7 && (
          <div className="space-y-3 text-xs">
            <Badge variant="purple">Paso 7: Finalización Definitiva & Activación de Garantía</Badge>
            <h4 className="text-sm font-black text-slate-900">
              Acta de Entrega Definitiva #ACTA-901
            </h4>
            <p className="text-slate-600">
              La obra se declara finalizada. Se emite el acta de entrega y se activa la garantía oficial de 24 meses por escrito para la Familia Rossi.
            </p>

            <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-black text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Garantía Vigente hasta Agosto 2028</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Cubre defectos estructurales de postes, corrosión de mallas y nivelación de portón.
              </p>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(prev => Math.max(1, prev - 1))}
            disabled={step === 1}
          >
            Anterior
          </Button>

          {step < totalSteps ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setStep(prev => prev + 1)}
            >
              Siguiente Paso <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <Button
              variant="success"
              size="sm"
              onClick={() => {
                onExecuteFullFlow();
                onClose();
              }}
            >
              <CheckCircle2 className="w-4 h-4" /> Aplicar Demo Completa en Datos
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
