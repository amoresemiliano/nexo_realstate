import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Zap,
  ArrowRight,
  Building,
  Scale,
  HardHat,
  ShieldAlert,
  X,
  Play,
  RotateCcw
} from 'lucide-react';
import { UserRole } from '../../types';

interface MultiActorWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteFullLifecycleDemo: () => void;
}

export const MultiActorWalkthroughModal: React.FC<MultiActorWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onExecuteFullLifecycleDemo
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      role: 'VENDEDOR' as UserRole,
      roleName: 'Comercial & Preventa',
      title: '1. Ingesta de Lead & Cotización Aceptada',
      description: 'Ingresa lead por Meta Ads. Tras 15 minutos sin atención, el motor dispara alerta comercial. El vendedor atiende, envía cotización y el cliente acepta.',
      actionSummary: 'Evento: LeadCreated -> QuoteAccepted -> Dispara creación de Bloqueo Temporal Lote A-4.',
      badgeVariant: 'warning' as const
    },
    {
      role: 'VENDEDOR' as UserRole,
      roleName: 'Comercial',
      title: '2. Bloqueo & Carga de Seña Bancaria',
      description: 'El bloqueo vence en 2 horas. El vendedor sube el comprobante de transferencia bancaria de $1.500 USD y notifica a Tesorería.',
      actionSummary: 'Evento: DepositReported -> Genera solicitud de aprobación Human-in-the-Loop para Tesorería.',
      badgeVariant: 'warning' as const
    },
    {
      role: 'TESORERIA' as UserRole,
      roleName: 'Tesorería & Administración',
      title: '3. Aprobación Human-in-the-Loop de Seña',
      description: 'Tesorería verifica los $1.500 USD acreditados en el homebanking y aprueba manualmente el comprobante. El estado cambia a RESERVADO.',
      actionSummary: 'Decisión Humana Aprobada -> Emite Boleto de Compraventa y Plan de 24 Cuotas.',
      badgeVariant: 'purple' as const
    },
    {
      role: 'ADMINISTRACION' as UserRole,
      roleName: 'Cobranzas',
      title: '4. Detección de Mora & Pago Cancelatorio Total',
      description: 'Se detecta 10 días de mora en la cuota. Se asigna tarea de gestión telefónica. El cliente opta por cancelar el saldo total adeudado.',
      actionSummary: 'Evento: BalancePaidOff (Saldo Cero) -> Inicia automáticamente checklist de Escrituración.',
      badgeVariant: 'info' as const
    },
    {
      role: 'LEGAL' as UserRole,
      roleName: 'Legal & Escribanía',
      title: '5. Proceso de Escrituración & Firma',
      description: 'El área Legal reúne el legajo completo, solicita certificado de inhibición y coordina turno de firma con Escribanía Bunge.',
      actionSummary: 'Evento: DeedRegistered -> Transición de inmueble a Estado Listo para Entrega.',
      badgeVariant: 'default' as const
    },
    {
      role: 'OBRAS' as UserRole,
      roleName: 'Obras & Postventa',
      title: '6. Entrega de Lote, Detección de Cerco & Mantenimiento',
      description: 'Se firma acta de entrega. El sistema detecta que el lote no posee cerco olímpico y genera una oportunidad comercial. Se contrata la obra, se activa garantía de 24 meses y se ofrece plan recurrente de mantenimiento.',
      actionSummary: 'Ecosistema completo articulado sin fisuras de información.',
      badgeVariant: 'success' as const
    }
  ];

  const activeStep = steps[currentStep];

  const handleFinish = () => {
    onExecuteFullLifecycleDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <Card padding="lg" className="w-full max-w-xl bg-white space-y-4 shadow-2xl my-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-black text-slate-900">Demostración Multiactor Transversal</h2>
            </div>
            <p className="text-xs text-slate-500">
              Recorrido interactivo que muestra el cambio continuo del "responsable natural"
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="flex items-center justify-between gap-1 bg-slate-100 p-1.5 rounded-xl">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`flex-1 h-2 rounded-lg transition-all ${
                idx === currentStep
                  ? 'bg-amber-600 shadow-sm'
                  : idx < currentStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-300'
              }`}
              title={`Paso ${idx + 1}`}
            />
          ))}
        </div>

        {/* CURRENT STEP CARD */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant={activeStep.badgeVariant} size="sm" className="font-extrabold text-[11px]">
              {activeStep.roleName}
            </Badge>
            <span className="text-xs font-black text-slate-400">Paso {currentStep + 1} de {steps.length}</span>
          </div>

          <h3 className="text-sm font-black text-slate-900">{activeStep.title}</h3>
          <p className="text-xs text-slate-700 leading-relaxed">{activeStep.description}</p>

          <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs text-amber-950 font-medium flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Motor de Eventos:</strong>
              <p className="text-[11px] text-slate-600 mt-0.5">{activeStep.actionSummary}</p>
            </div>
          </div>
        </div>

        {/* FOOTER CONTROLS */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="text-xs"
          >
            Anterior
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white"
            >
              Siguiente Paso <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleFinish}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-black"
            >
              <Play className="w-3.5 h-3.5 mr-1" /> Ejecutar Eventos en Tiempo Real
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
