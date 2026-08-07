import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  ShieldAlert,
  AlertTriangle,
  Zap,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  X,
  Play
} from 'lucide-react';

interface EscalationWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteEscalationDemo: () => void;
}

export const EscalationWalkthroughModal: React.FC<EscalationWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onExecuteEscalationDemo
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Incurrimiento de Mora (5 días)',
      level: 'TAREA NORMAL',
      badgeVariant: 'warning' as const,
      description: 'Un comprador (Lote B-2) no abona la cuota al día #5. El motor genera una tarea normal para Cobranzas.',
      outcome: 'Tarea creada: Contacto por Mora Inicial (Prioridad MEDIA).'
    },
    {
      title: '2. Tarea Vencida Sin Gestión (24hs)',
      level: 'ELEVACIÓN DE PRIORIDAD',
      badgeVariant: 'danger' as const,
      description: 'La tarea de cobranza cumple 24 horas sin resolverse. La regla de escalamiento eleva automáticamente la prioridad.',
      outcome: 'Prioridad de tarea cambiada a ALTA. Notificación de alerta enviada al Supervisor de Cobranzas.'
    },
    {
      title: '3. Acumulación de 3 Cuotas / >90 días',
      level: 'ALERTA CRÍTICA Y SUGERENCIA LEGAL',
      badgeVariant: 'danger' as const,
      description: 'El plan alcanza 3 cuotas impagas. Se genera Alerta Crítica del sistema y se sugiere evaluación jurídica sin aplicar rescisiones automáticas.',
      outcome: 'Notificación a Área Legal para análisis de contrato.'
    },
    {
      title: '4. Intervención Human-in-the-Loop (Gerencia)',
      level: 'APROBACIÓN EXPLICITA REQUERIDA',
      badgeVariant: 'purple' as const,
      description: 'Legal recomienda rescisión o convenio de refinanciación. La decisión requiere autorización humana explícita.',
      outcome: 'Solicitud creada en Centro Operativo para aprobación de Gerencia.'
    }
  ];

  const activeStep = steps[currentStep];

  const handleFinish = () => {
    onExecuteEscalationDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <Card padding="lg" className="w-full max-w-lg bg-white space-y-4 shadow-2xl my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-black text-slate-900">Demostración de Escalamiento de Mora</h2>
            </div>
            <p className="text-xs text-slate-500">
              Mecanismo automatizado de elevación de prioridad y protección contra decisiones punitivas a ciegas
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex items-center justify-between gap-1 bg-slate-100 p-1.5 rounded-xl">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`flex-1 h-2 rounded-lg transition-all ${
                idx === currentStep
                  ? 'bg-rose-600 shadow-sm'
                  : idx < currentStep
                  ? 'bg-rose-400'
                  : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* STEP DISPLAY */}
        <div className="bg-rose-50/40 p-4 rounded-2xl border border-rose-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant={activeStep.badgeVariant} size="sm">
              {activeStep.level}
            </Badge>
            <span className="text-xs font-black text-slate-400">Paso {currentStep + 1} de {steps.length}</span>
          </div>

          <h3 className="text-sm font-black text-slate-900">{activeStep.title}</h3>
          <p className="text-xs text-slate-700 leading-relaxed">{activeStep.description}</p>

          <div className="bg-white p-2.5 rounded-xl border border-rose-200 text-xs text-rose-950 font-medium flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong>Acción del Motor:</strong>
              <p className="text-[11px] text-slate-600 mt-0.5">{activeStep.outcome}</p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
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
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              Siguiente Paso <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleFinish}
              className="text-xs bg-rose-700 hover:bg-rose-800 text-white font-black"
            >
              <Play className="w-3.5 h-3.5 mr-1" /> Simular Escalamiento Ahora
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
