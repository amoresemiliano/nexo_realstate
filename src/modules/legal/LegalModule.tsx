import React, { useState } from 'react';
import {
  Lot,
  Sale,
  PaymentPlan,
  LotDocument,
  LegalProcess,
  NotaryOffice,
  Surveyor,
  Survey,
  Permit,
  DeedSigningAppointment,
  DocumentStatus,
  TaskItem,
  LotTimelineEvent
} from '../../types';
import {
  evaluateDeedEligibility,
  LegalConfig,
  DEFAULT_LEGAL_CONFIG
} from '../../domain/legalDomain';
import { formatUSD } from '../../domain/rules';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Lot360ViewModal } from '../../components/lots/Lot360ViewModal';
import {
  Scale,
  FileText,
  CheckCircle2,
  Clock,
  Building,
  UserCheck,
  Calendar,
  AlertTriangle,
  Eye,
  Plus,
  Search,
  SlidersHorizontal,
  FileCheck,
  Zap,
  MapPin,
  Check
} from 'lucide-react';

interface LegalModuleProps {
  lots?: Lot[];
  sales?: Sale[];
  paymentPlans?: PaymentPlan[];
  documents?: LotDocument[];
  legalProcesses?: LegalProcess[];
  notaryOffices?: NotaryOffice[];
  surveyors?: Surveyor[];
  surveys?: Survey[];
  permits?: Permit[];
  appointments?: DeedSigningAppointment[];
  tasks?: TaskItem[];
  timelineEvents?: LotTimelineEvent[];
  legalConfig?: LegalConfig;
  onUpdateLegalProcess?: (processId: string, updates: Partial<LegalProcess>) => void;
  onStartLegalProcess?: (lotId: string) => void;
  onUpdateDocumentStatus?: (docId: string, status: DocumentStatus) => void;
  onScheduleSigning?: (params: Partial<DeedSigningAppointment>) => void;
  onCompleteSigning?: (appointmentId: string) => void;
  onCreateTask?: (task: Partial<TaskItem>) => void;
  onOpenPaymentsModule?: (planId: string) => void;
}

export const LegalModule: React.FC<LegalModuleProps> = ({
  lots = [],
  sales = [],
  paymentPlans = [],
  documents = [],
  legalProcesses = [],
  notaryOffices = [],
  surveyors = [],
  surveys = [],
  permits = [],
  appointments = [],
  tasks = [],
  timelineEvents = [],
  legalConfig = DEFAULT_LEGAL_CONFIG,
  onUpdateLegalProcess,
  onStartLegalProcess,
  onUpdateDocumentStatus,
  onScheduleSigning,
  onCompleteSigning,
  onCreateTask,
  onOpenPaymentsModule,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ELEGIBILIDAD' | 'EXPEDIENTES' | 'ESCRIBANIAS' | 'AGRIMENSURA' | 'CONFIG'>('ELEGIBILIDAD');
  const [selectedLotFor360, setSelectedLotFor360] = useState<Lot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Local state for legal config
  const [config, setConfig] = useState<LegalConfig>(legalConfig);

  // Filtered lots for eligibility table
  const soldLots = lots.filter(l => l.status === 'VENDIDO' || l.status === 'RESERVADO');
  const filteredSoldLots = soldLots.filter(l =>
    l.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Computations
  const eligibleCount = soldLots.filter(l => {
    const sale = sales.find(s => s.lotId === l.id);
    const plan = paymentPlans.find(p => p.lotId === l.id);
    const docs = documents.filter(d => d.lotId === l.id);
    const proc = legalProcesses.find(p => p.lotId === l.id);
    const surv = surveys.find(s => s.lotId === l.id);
    const el = evaluateDeedEligibility(l, sale, plan, docs, proc, surv, config);
    return el.isEligible;
  }).length;

  const inTransitCount = legalProcesses.filter(p => p.status !== 'FINALIZADA').length;
  const scheduledSigningsCount = appointments.filter(a => a.status === 'CONFIRMADA').length;
  const completedDeedsCount = legalProcesses.filter(p => p.status === 'FINALIZADA' || p.status === 'INSCRIPTA').length;

  return (
    <div className="space-y-4">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-black text-slate-900">Módulo Legal & Escrituración 360°</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestión integral de elegibilidad, legajos documentales, escribanías, agrimensura y firmas de escrituras
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setActiveSubTab('CONFIG')} className="text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Config. Reglas
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card padding="md" className="space-y-1 border-l-4 border-l-emerald-500">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Aptos para Escriturar</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">{eligibleCount}</span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">100% Saldo</span>
          </div>
        </Card>

        <Card padding="md" className="space-y-1 border-l-4 border-l-purple-500">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Expedientes en Trámite</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">{inTransitCount}</span>
            <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded-md">En Escribanía</span>
          </div>
        </Card>

        <Card padding="md" className="space-y-1 border-l-4 border-l-brand-500">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Firmas Agendadas</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">{scheduledSigningsCount}</span>
            <span className="text-[10px] text-brand-700 font-bold bg-brand-50 px-1.5 py-0.5 rounded-md">Agosto 2026</span>
          </div>
        </Card>

        <Card padding="md" className="space-y-1 border-l-4 border-l-blue-500">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Escrituras Inscriptas</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">{completedDeedsCount}</span>
            <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded-md">Finalizados</span>
          </div>
        </Card>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'ELEGIBILIDAD', label: `Matriz Elegibilidad (${soldLots.length})` },
          { id: 'EXPEDIENTES', label: `Expedientes Activos (${legalProcesses.length})` },
          { id: 'ESCRIBANIAS', label: `Escribanías (${notaryOffices.length})` },
          { id: 'AGRIMENSURA', label: `Agrimensura (${surveys.length})` },
          { id: 'CONFIG', label: 'Parámetros de Regla' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeSubTab === tab.id ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: MATRIZ DE ELEGIBILIDAD */}
      {activeSubTab === 'ELEGIBILIDAD' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por lote o manzana..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Evaluando contra reglas configuradas (Financiera, Documental, Mensura, Impuestos)
            </span>
          </div>

          <div className="space-y-2">
            {filteredSoldLots.map(lotItem => {
              const sale = sales.find(s => s.lotId === lotItem.id);
              const plan = paymentPlans.find(p => p.lotId === lotItem.id);
              const docs = documents.filter(d => d.lotId === lotItem.id);
              const proc = legalProcesses.find(p => p.lotId === lotItem.id);
              const surv = surveys.find(s => s.lotId === lotItem.id);
              const eligibility = evaluateDeedEligibility(lotItem, sale, plan, docs, proc, surv, config);

              return (
                <Card key={lotItem.id} padding="md" className="space-y-3 hover:border-purple-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">Lote {lotItem.block}-{lotItem.number}</span>
                        <Badge variant={eligibility.statusBadge.variant as any}>
                          {eligibility.statusBadge.label}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        Titular: <strong>{sale?.customerName || 'Cliente'}</strong> | Superficie: {lotItem.surfaceM2} m²
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLotFor360(lotItem)}
                        className="text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver Ficha 360°
                      </Button>

                      {eligibility.isEligible && !proc && onStartLegalProcess && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onStartLegalProcess(lotItem.id)}
                          className="text-xs bg-purple-600 hover:bg-purple-700"
                        >
                          <Zap className="w-3.5 h-3.5" /> Iniciar Escritura
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Requirements Progress Bar */}
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>Puntaje Elegibilidad: {eligibility.scorePercent}%</span>
                      <span>{eligibility.completedRequirements.length} de {eligibility.completedRequirements.length + eligibility.missingRequirements.length} requisitos</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          eligibility.isEligible ? 'bg-emerald-500' : 'bg-brand-500'
                        }`}
                        style={{ width: `${eligibility.scorePercent}%` }}
                      />
                    </div>

                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                      {eligibility.completedRequirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{req}</span>
                        </div>
                      ))}
                      {eligibility.missingRequirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-rose-800">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: EXPEDIENTES Y PROCESOS */}
      {activeSubTab === 'EXPEDIENTES' && (
        <div className="space-y-3">
          {legalProcesses.map(proc => {
            const lotObj = lots.find(l => l.id === proc.lotId || l.number === proc.lotNumber);

            return (
              <Card key={proc.id} padding="md" className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">Lote {proc.lotNumber} — {proc.customerName}</span>
                      <Badge variant={proc.status === 'FINALIZADA' ? 'success' : 'brand'}>
                        {proc.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Paso Actual: <strong>{proc.currentStep || proc.stage}</strong>
                    </span>
                  </div>

                  {lotObj && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLotFor360(lotObj)}
                      className="text-xs shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ficha 360° del Lote
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">ESCRIBANÍA</span>
                    <span className="font-bold text-slate-900">{proc.notaryOfficeName || proc.assignedNotary}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">ABOGADO/A RESPONSABLE</span>
                    <span className="font-bold text-slate-900">{proc.assignedLegalUserName || 'Dra. María Elena San Martín'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">FECHA ESTIMADA</span>
                    <span className="font-bold text-slate-900">{proc.targetDate || proc.estimatedCompletion}</span>
                  </div>
                </div>

                {proc.notes && (
                  <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                    "{proc.notes}"
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 3: ESCRIBANÍAS */}
      {activeSubTab === 'ESCRIBANIAS' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {notaryOffices.map(notary => (
              <Card key={notary.id} padding="md" className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-purple-600" />
                    {notary.name}
                  </h3>
                  <Badge variant="success">{notary.status}</Badge>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div>Contacto: <strong>{notary.contactName}</strong></div>
                  <div>Email: <strong>{notary.email}</strong></div>
                  <div>Teléfono: <strong>{notary.phone}</strong></div>
                  <div>Dirección: <strong>{notary.address}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Expedientes Asignados:</span>
                  <span className="font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    {notary.assignedLegalProcessIds?.length || 2} casos
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: AGRIMENSURA */}
      {activeSubTab === 'AGRIMENSURA' && (
        <div className="space-y-3">
          <Card padding="md" className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
              Agrimensores Habilitados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {surveyors.map(surv => (
                <div key={surv.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-900">{surv.name}</span>
                    <Badge variant="brand">{surv.licenseNumber}</Badge>
                  </div>
                  <div>Teléfono: <strong>{surv.phone}</strong></div>
                  <div>Email: <strong>{surv.email}</strong></div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="md" className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
              Relevamientos y Mensuras
            </h3>
            <div className="space-y-2">
              {surveys.map(s => (
                <div key={s.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Lote {s.lotNumber} — {s.type}</span>
                    <span className="text-[10px] text-slate-400">Por: {s.surveyorName}</span>
                  </div>
                  <Badge variant={s.status === 'FINALIZADO' ? 'success' : 'warning'}>
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* SUB-TAB 5: CONFIGURACIÓN DE REGLAS */}
      {activeSubTab === 'CONFIG' && (
        <Card padding="md" className="space-y-4 max-w-xl">
          <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
            Parámetros de Elegibilidad para Escrituración
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Avance Mínimo Documental Requerido (%)
              </label>
              <input
                type="number"
                value={config.minDocumentProgressPercent}
                onChange={e => setConfig({ ...config, minDocumentProgressPercent: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Default: 80% (DNI, CUIT, Boleto, etc.)
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="font-bold text-slate-700 block">Restricciones de Pago</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.requiresFullPayment}
                  onChange={e => setConfig({ ...config, requiresFullPayment: e.target.checked })}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="font-medium text-slate-800">Requerir Cancelación Económica Total (Saldo 0)</span>
              </label>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => alert('Parámetros guardados correctamente en memoria local.')}
              className="w-full text-xs mt-2"
            >
              Guardar Parámetros Legal
            </Button>
          </div>
        </Card>
      )}

      {/* Lot 360 View Modal */}
      <Lot360ViewModal
        isOpen={!!selectedLotFor360}
        onClose={() => setSelectedLotFor360(null)}
        lot={selectedLotFor360}
        sale={sales.find(s => s.lotId === selectedLotFor360?.id)}
        paymentPlan={paymentPlans.find(p => p.lotId === selectedLotFor360?.id)}
        documents={documents.filter(d => d.lotId === selectedLotFor360?.id)}
        legalProcess={legalProcesses.find(p => p.lotId === selectedLotFor360?.id)}
        surveys={surveys.filter(s => s.lotId === selectedLotFor360?.id)}
        permits={permits}
        notaryOffices={notaryOffices}
        appointments={appointments.filter(a => a.lotId === selectedLotFor360?.id)}
        timelineEvents={timelineEvents.filter(t => t.lotId === selectedLotFor360?.id)}
        tasks={tasks}
        legalConfig={config}
        onUpdateDocumentStatus={onUpdateDocumentStatus}
        onUpdateLegalProcess={onUpdateLegalProcess}
        onStartLegalProcess={onStartLegalProcess}
        onScheduleSigning={onScheduleSigning}
        onCompleteSigning={onCompleteSigning}
        onCreateTask={onCreateTask}
        onOpenPaymentsModule={onOpenPaymentsModule}
      />
    </div>
  );
};
