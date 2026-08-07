import React, { useState } from 'react';
import { Lead, LeadTemperature, LeadPriority } from '../../types';
import { calculateLeadScore } from '../../domain/rules';
import { X, CheckCircle2, ChevronRight, ChevronLeft, Flame, DollarSign, Calendar, Target, Shield } from 'lucide-react';

interface LeadQualificationModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedLead: Lead) => void;
}

export const LeadQualificationModal: React.FC<LeadQualificationModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen || !lead) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State initialized from lead
  const [budgetUSD, setBudgetUSD] = useState<number>(lead.budgetUSD || 30000);
  const [availableDownPayment, setAvailableDownPayment] = useState<number>(lead.availableDownPayment || 10000);
  const [maximumMonthlyPayment, setMaximumMonthlyPayment] = useState<number>(lead.maximumMonthlyPayment || 600);
  const [needsToSellProperty, setNeedsToSellProperty] = useState<boolean>(lead.needsToSellProperty || false);

  const [expectedPurchaseDate, setExpectedPurchaseDate] = useState<string>(lead.expectedPurchaseDate || '30 días');
  const [motivation, setMotivation] = useState<any>(lead.motivation || 'VIVIENDA_PERMANENTE');
  const [decisionMaker, setDecisionMaker] = useState<any>(lead.decisionMaker || 'EN_PAREJA');

  const [interestedBlock, setInterestedBlock] = useState<string>(lead.interestedBlock || 'A');
  const [hasVisited, setHasVisited] = useState<boolean>(lead.hasVisited || false);

  const [qualification, setQualification] = useState<LeadTemperature>(lead.qualification || 'TIBIO');
  const [priority, setPriority] = useState<LeadPriority>(lead.priority || 'MEDIA');
  const [notes, setNotes] = useState<string>(lead.notes || '');

  const handleNext = () => {
    if (step < 5) setStep((step + 1) as any);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as any);
  };

  const handleFinish = () => {
    const updatedPartial: Partial<Lead> = {
      budgetUSD,
      budgetMin: Math.round(budgetUSD * 0.8),
      budgetMax: Math.round(budgetUSD * 1.2),
      availableDownPayment,
      maximumMonthlyPayment,
      expectedPurchaseDate,
      hasVisited,
      lotInterestIds: lead.lotInterestIds
    };

    const { score, scoreReasons } = calculateLeadScore(updatedPartial);

    const updatedLead: Lead = {
      ...lead,
      budgetUSD,
      budgetMin: Math.round(budgetUSD * 0.8),
      budgetMax: Math.round(budgetUSD * 1.2),
      availableDownPayment,
      maximumMonthlyPayment,
      needsToSellProperty,
      expectedPurchaseDate,
      motivation,
      decisionMaker,
      interestedBlock,
      hasVisited,
      qualification,
      priority,
      score,
      scoreReasons,
      notes,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-brand-400 tracking-wider">
              Calificación Progresiva • Paso {step} de 5
            </span>
            <h3 className="text-base font-black text-white">{lead.fullName}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-800 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-brand-600 h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* STEP 1: General Info */}
          {step === 1 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-600" />
                <span>Paso 1: Datos de Contacto y Ubicación</span>
              </h4>
              <p className="text-slate-500">Verifique los datos básicos del lead recopilados.</p>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div>
                  <span className="text-slate-400 font-bold">Teléfono:</span>{' '}
                  <span className="font-extrabold text-slate-800">{lead.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold">Email:</span>{' '}
                  <span className="font-extrabold text-slate-800">{lead.email || 'Sin email'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold">Ciudad:</span>{' '}
                  <span className="font-extrabold text-slate-800">{lead.city || 'No declarada'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold">Origen:</span>{' '}
                  <span className="font-extrabold text-brand-700">{lead.source}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Presupuesto & Financiación */}
          {step === 2 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Paso 2: Capacidad Financiera</span>
              </h4>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Presupuesto Total Estimado (USD)</label>
                <input
                  type="number"
                  value={budgetUSD}
                  onChange={e => setBudgetUSD(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Anticipo Líquido Disponible (USD)</label>
                <input
                  type="number"
                  value={availableDownPayment}
                  onChange={e => setAvailableDownPayment(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cuota Mensual Máxima (USD)</label>
                <input
                  type="number"
                  value={maximumMonthlyPayment}
                  onChange={e => setMaximumMonthlyPayment(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="needsToSell"
                  checked={needsToSellProperty}
                  onChange={e => setNeedsToSellProperty(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <label htmlFor="needsToSell" className="font-bold text-slate-800">
                  Necesita vender propiedad actual para comprar
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Urgencia & Decisión */}
          {step === 3 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Paso 3: Plazos y Toma de Decisión</span>
              </h4>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Plazo de Compra Previsto</label>
                <select
                  value={expectedPurchaseDate}
                  onChange={e => setExpectedPurchaseDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                >
                  <option value="Inmediata">Inmediata (&lt; 15 días)</option>
                  <option value="30 días">30 días</option>
                  <option value="60 días">60 días</option>
                  <option value="90 días">90 días</option>
                  <option value="6 meses">6 meses o más</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Motivo / Finalidad de la Compra</label>
                <select
                  value={motivation}
                  onChange={e => setMotivation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                >
                  <option value="VIVIENDA_PERMANENTE">Vivienda Permanente / Familiar</option>
                  <option value="SEGUNDA_VIVIENDA">Segunda Vivienda / Fin de semana</option>
                  <option value="INVERSION">Inversión / Renta</option>
                  <option value="CONSTRUCCION_FUTURA">Construcción Futura</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quién Toma la Decisión</label>
                <select
                  value={decisionMaker}
                  onChange={e => setDecisionMaker(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                >
                  <option value="SOLO">Comprador Individual</option>
                  <option value="EN_PAREJA">En Pareja</option>
                  <option value="FAMILIA">Grupo Familiar</option>
                  <option value="SOCIEDAD">Socios / Inversores</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: Lote de Preferencia & Visita */}
          {step === 4 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Paso 4: Preferencia de Lote y Visita</span>
              </h4>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Manzana o Sector de Interés</label>
                <select
                  value={interestedBlock}
                  onChange={e => setInterestedBlock(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                >
                  <option value="A">Manzana A (Etapa 1 - Los Pinos)</option>
                  <option value="B">Manzana B (Etapa 1 - Los Pinos)</option>
                  <option value="C">Manzana C (Etapa 2 - Las Acacias)</option>
                  <option value="D">Manzana D (Etapa 2 - Las Acacias)</option>
                </select>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-purple-900">¿Realizó Visita Presencial al Predio?</div>
                  <div className="text-[10px] text-purple-700">Las visitas aumentan un +40% la conversión</div>
                </div>
                <input
                  type="checkbox"
                  checked={hasVisited}
                  onChange={e => setHasVisited(e.target.checked)}
                  className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Score & Final Qualification */}
          {step === 5 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>Paso 5: Temperatura & Cierre de Calificación</span>
              </h4>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Temperatura Asignada</label>
                <select
                  value={qualification}
                  onChange={e => setQualification(e.target.value as LeadTemperature)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                >
                  <option value="FRIO">❄️ Frío (Seguimiento lejano)</option>
                  <option value="TIBIO">🌤️ Tibio (En evaluación)</option>
                  <option value="CALIENTE">🔥 Caliente (Alta probabilidad &lt; 30d)</option>
                  <option value="MUY_CALIENTE">💥 Muy Caliente (Cierre inminente)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Prioridad Comercial</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as LeadPriority)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
                >
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                  <option value="URGENTE">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas Resumen de Calificación</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Detalles sobre predisposición, objeciones y próximos pasos..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 flex items-center gap-1 shadow-md"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finalizar Calificación</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
