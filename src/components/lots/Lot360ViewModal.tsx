import React, { useState } from 'react';
import {
  Lot,
  Sale,
  PaymentPlan,
  LotDocument,
  LegalProcess,
  Survey,
  Permit,
  NotaryOffice,
  DeedSigningAppointment,
  LotTimelineEvent,
  TaskItem,
  DocumentType,
  DocumentStatus
} from '../../types';
import {
  evaluateDeedEligibility,
  computeLotNextMilestone,
  LegalConfig,
  DEFAULT_LEGAL_CONFIG
} from '../../domain/legalDomain';
import { formatUSD } from '../../domain/rules';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  X,
  FileText,
  Scale,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  UserCheck,
  Building,
  Upload,
  Eye,
  Plus,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Check,
  FileCheck,
  Zap,
  HelpCircle,
  TrendingUp,
  MessageSquare,
  CheckSquare,
  HardHat,
  Sparkles,
  ShieldCheck,
  Repeat
} from 'lucide-react';

interface Lot360ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: Lot | null;
  sale?: Sale;
  paymentPlan?: PaymentPlan;
  documents?: LotDocument[];
  legalProcess?: LegalProcess;
  surveys?: Survey[];
  permits?: Permit[];
  notaryOffices?: NotaryOffice[];
  appointments?: DeedSigningAppointment[];
  timelineEvents?: LotTimelineEvent[];
  tasks?: TaskItem[];
  legalConfig?: LegalConfig;
  onUpdateDocumentStatus?: (docId: string, status: DocumentStatus, notes?: string) => void;
  onUploadDocument?: (doc: Partial<LotDocument>) => void;
  onUpdateLegalProcess?: (processId: string, updates: Partial<LegalProcess>) => void;
  onStartLegalProcess?: (lotId: string) => void;
  onScheduleSigning?: (params: Partial<DeedSigningAppointment>) => void;
  onCompleteSigning?: (appointmentId: string) => void;
  onRegisterInscription?: (processId: string, details: string) => void;
  onCreateTask?: (task: Partial<TaskItem>) => void;
  onAddTimelineEvent?: (event: Partial<LotTimelineEvent>) => void;
  onOpenPaymentsModule?: (planId: string) => void;
}

export const Lot360ViewModal: React.FC<Lot360ViewModalProps> = ({
  isOpen,
  onClose,
  lot,
  sale,
  paymentPlan,
  documents = [],
  legalProcess,
  surveys = [],
  permits = [],
  notaryOffices = [],
  appointments = [],
  timelineEvents = [],
  tasks = [],
  legalConfig = DEFAULT_LEGAL_CONFIG,
  onUpdateDocumentStatus,
  onUploadDocument,
  onUpdateLegalProcess,
  onStartLegalProcess,
  onScheduleSigning,
  onCompleteSigning,
  onRegisterInscription,
  onCreateTask,
  onAddTimelineEvent,
  onOpenPaymentsModule,
}) => {
  if (!isOpen || !lot) return null;

  const [activeTab, setActiveTab] = useState<'RESUMEN' | 'DOCUMENTOS' | 'LEGAL' | 'TECNICO' | 'OBRAS_POSTVENTA' | 'TIMELINE' | 'TAREAS'>('RESUMEN');
  const [docFilterCategory, setDocFilterCategory] = useState<string>('TODOS');

  // Modals inside 360
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [newDocType, setNewDocType] = useState<DocumentType>('DNI');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocFileName, setNewDocFileName] = useState('');

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('2026-08-25');
  const [scheduleTime, setScheduleTime] = useState('11:00');
  const [scheduleNotaryId, setScheduleNotaryId] = useState(notaryOffices[0]?.id || '');
  const [scheduleLocation, setScheduleLocation] = useState('Escribanía San Martín');

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskArea, setNewTaskArea] = useState('LEGAL');

  const [inscriptionDetails, setInscriptionDetails] = useState('');

  // Domain Calculations
  const lotDocs = documents.filter(d => d.lotId === lot.id || d.ownerId === lot.id);
  const lotSurvey = surveys.find(s => s.lotId === lot.id);
  const eligibility = evaluateDeedEligibility(lot, sale, paymentPlan, lotDocs, legalProcess, lotSurvey, legalConfig);
  const nextMilestone = computeLotNextMilestone(lot, legalProcess, lotDocs, lotSurvey);

  // Computed Statuses
  const financialStatus = lot.financialStatus || (paymentPlan ? (paymentPlan.status === 'AL_DIA' ? 'AL_DIA' : 'EN_MORA') : 'SIN_PLAN');
  const documentStatus = lot.documentStatus || (lotDocs.some(d => d.status === 'OBSERVADO') ? 'OBSERVADO' : lotDocs.filter(d => d.status === 'APROBADO').length >= 4 ? 'COMPLETO' : 'INCOMPLETO');
  const legalStatus = lot.legalStatus || (legalProcess ? (legalProcess.status === 'FINALIZADA' ? 'INSCRIPTO' : legalProcess.status === 'FIRMADA' ? 'FIRMADO' : legalProcess.status === 'LISTA_PARA_FIRMA' ? 'LISTO_PARA_FIRMA' : 'EN_TRAMITE') : 'SIN_INICIAR');
  const technicalStatus = lot.technicalStatus || (lotSurvey?.status === 'FINALIZADO' ? 'VALIDADO' : 'MENSURA_PENDIENTE');
  const deliveryStatus = lot.deliveryStatus || 'PENDIENTE';

  // Handlers
  const handleCreateNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;
    if (onUploadDocument) {
      onUploadDocument({
        lotId: lot.id,
        lotNumber: lot.number,
        type: newDocType,
        title: newDocTitle,
        fileName: newDocFileName || `${newDocType}_${lot.number}.pdf`,
        status: 'EN_REVISION',
        ownerType: 'LOT',
        ownerId: lot.id,
        createdAt: new Date().toISOString(),
      });
    }
    setIsUploadDocOpen(false);
    setNewDocTitle('');
    setNewDocFileName('');
  };

  const handleCreateSigningSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const notary = notaryOffices.find(n => n.id === scheduleNotaryId) || notaryOffices[0];
    if (onScheduleSigning) {
      onScheduleSigning({
        legalProcessId: legalProcess?.id || `leg-${Date.now()}`,
        lotId: lot.id,
        lotNumber: lot.number,
        customerName: sale?.customerName || 'Cliente',
        notaryOfficeId: notary?.id || 'n-1',
        notaryName: notary?.name || 'Escribanía Asignada',
        scheduledDate: scheduleDate,
        scheduledTime: scheduleTime,
        location: scheduleLocation,
        status: 'CONFIRMADA',
        representatives: ['Escribano Titular', 'Representante Nexo'],
        requiredDocuments: ['DNI Original', 'Boleto Original', 'Libre Deuda'],
      });
    }
    setIsScheduleModalOpen(false);
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    if (onCreateTask) {
      onCreateTask({
        leadName: sale?.customerName || 'Cliente Lote',
        type: 'NOTA_INTERNA',
        dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        priority: 'ALTA',
        completed: false,
        contextText: `[Área: ${newTaskArea}] [Lote ${lot.block}-${lot.number}] ${newTaskTitle}`,
      });
    }
    setIsNewTaskOpen(false);
    setNewTaskTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header 360° */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-8">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="brand" className="bg-brand-500/30 text-brand-300 font-black text-xs border border-brand-400/20">
                  Ficha 360° del Lote
                </Badge>
                <span className="text-xs text-slate-400 font-mono">{lot.code || `AH-E1-MZA-${lot.block}-L${lot.number}`}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Lote {lot.block}-{lot.number} <span className="text-slate-400 font-normal text-base">({lot.stage})</span>
              </h2>
              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2 font-medium">
                <span>{lot.surfaceM2} m² ({lot.frontageM}m x {lot.depthM}m)</span>
                <span>•</span>
                <span>{lot.orientation}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{formatUSD(lot.priceUSD)}</span>
              </div>
            </div>

            {/* Buyer Quick Card */}
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 min-w-[200px]">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Titular / Comprador</span>
              <span className="text-sm font-black text-white block truncate">
                {sale?.customerName || 'Lote Disponible / Sin Venta'}
              </span>
              {sale && (
                <div className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-2">
                  <span>Boleto: <strong className="text-emerald-400">{sale.saleNumber}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* 6 Sub-Domain States Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px]">
            <div className="bg-slate-800/60 p-2 rounded-xl">
              <span className="text-[9px] text-slate-400 block font-bold">1. COMERCIAL</span>
              <span className="font-extrabold text-emerald-400">{lot.status}</span>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-xl">
              <span className="text-[9px] text-slate-400 block font-bold">2. FINANCIERO</span>
              <span className={`font-extrabold ${financialStatus === 'CANCELADO_ECONOMICAMENTE' ? 'text-emerald-400' : financialStatus === 'AL_DIA' ? 'text-blue-400' : 'text-amber-400'}`}>
                {financialStatus.replace('_', ' ')}
              </span>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-xl">
              <span className="text-[9px] text-slate-400 block font-bold">3. DOCUMENTAL</span>
              <span className={`font-extrabold ${documentStatus === 'COMPLETO' ? 'text-emerald-400' : documentStatus === 'OBSERVADO' ? 'text-rose-400' : 'text-amber-400'}`}>
                {documentStatus}
              </span>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-xl">
              <span className="text-[9px] text-slate-400 block font-bold">4. LEGAL / ESCRITURA</span>
              <span className={`font-extrabold ${legalStatus === 'INSCRIPTO' || legalStatus === 'FIRMADO' ? 'text-emerald-400' : 'text-purple-300'}`}>
                {legalStatus.replace('_', ' ')}
              </span>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-xl">
              <span className="text-[9px] text-slate-400 block font-bold">5. TÉCNICO</span>
              <span className={`font-extrabold ${technicalStatus === 'VALIDADO' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {technicalStatus.replace('_', ' ')}
              </span>
            </div>
            <div className="bg-slate-800/60 p-2 rounded-xl">
              <span className="text-[9px] text-slate-400 block font-bold">6. ENTREGA</span>
              <span className={`font-extrabold ${deliveryStatus === 'ENTREGADO' ? 'text-emerald-400' : 'text-slate-300'}`}>
                {deliveryStatus}
              </span>
            </div>
          </div>

          {/* Banner Próximo Hito */}
          <div className="mt-3 bg-brand-950/80 border border-brand-500/30 p-2.5 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-400 shrink-0" />
              <div>
                <span className="text-[10px] text-brand-300 font-bold block uppercase">Próximo Hito Sugerido</span>
                <span className="font-extrabold text-white">{nextMilestone.milestone}</span>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="text-xs px-3 py-1 bg-brand-500 hover:bg-brand-600 shrink-0"
              onClick={() => {
                if (lot.status === 'VENDIDO') setActiveTab('LEGAL');
                else if (lot.status === 'RESERVADO') setActiveTab('DOCUMENTOS');
              }}
            >
              {nextMilestone.action}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 pt-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'RESUMEN', label: 'Resumen 360°', icon: MapPin },
            { id: 'DOCUMENTOS', label: `Checklist Docs (${lotDocs.filter(d=>d.status==='APROBADO').length}/${lotDocs.length})`, icon: FileText },
            { id: 'LEGAL', label: 'Escrituración & Legal', icon: Scale },
            { id: 'TECNICO', label: 'Agrimensura & Permisos', icon: Building },
            { id: 'OBRAS_POSTVENTA', label: 'Obras & Postventa', icon: HardHat },
            { id: 'TIMELINE', label: 'Timeline Unificada', icon: Clock },
            { id: 'TAREAS', label: 'Tareas & Notas', icon: CheckSquare },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-t-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border-t border-x ${
                  isActive
                    ? 'bg-white text-slate-900 border-slate-200 border-b-white -mb-px shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 bg-slate-50">
          {/* TAB 1: RESUMEN 360° */}
          {activeTab === 'RESUMEN' && (
            <div className="space-y-4">
              {/* Financial & Commercial Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card padding="md" className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-brand-600" />
                      Estado Comercial & Financiero
                    </h3>
                    <Badge variant={lot.status === 'VENDIDO' ? 'success' : 'default'}>{lot.status}</Badge>
                  </div>

                  {sale ? (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Boleto de Venta:</span>
                        <span className="font-bold text-slate-900">{sale.saleNumber} ({sale.saleDate})</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Precio Acordado:</span>
                        <span className="font-bold text-slate-900">{formatUSD(sale.agreedPrice)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Anticipo Integrado:</span>
                        <span className="font-bold text-emerald-700">{formatUSD(sale.downPaymentUSD)}</span>
                      </div>
                      {paymentPlan && (
                        <>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-500 font-medium">Plan Financiado:</span>
                            <span className="font-bold text-slate-900">
                              {paymentPlan.paidInstallmentsCount} de {paymentPlan.totalInstallments} cuotas pagas
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-500 font-medium">Estado del Plan:</span>
                            <Badge variant={paymentPlan.status === 'AL_DIA' ? 'success' : 'warning'}>
                              {paymentPlan.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          {onOpenPaymentsModule && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onOpenPaymentsModule(paymentPlan.id)}
                              className="w-full text-xs mt-2"
                            >
                              Ver Estado de Cuenta Completo
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500 space-y-2">
                      <p>El lote no registra venta formalizada. Disponible para cotización y reserva.</p>
                      <Button variant="primary" size="sm" className="text-xs" onClick={() => setActiveTab('DOCUMENTOS')}>
                        Cargar Reservas / Cotizaciones
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Eligibility Summary Widget */}
                <Card padding="md" className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-purple-600" />
                      Elegibilidad de Escrituración
                    </h3>
                    <Badge variant={eligibility.statusBadge.variant as any}>
                      {eligibility.statusBadge.label}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">Progreso Global:</span>
                      <span className="font-black text-slate-900">{eligibility.scorePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          eligibility.isEligible ? 'bg-emerald-500' : 'bg-brand-500'
                        }`}
                        style={{ width: `${eligibility.scorePercent}%` }}
                      />
                    </div>

                    <div className="space-y-1 pt-2">
                      <span className="text-[11px] font-bold text-slate-600 block">Requisitos Clave:</span>
                      {eligibility.completedRequirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{req}</span>
                        </div>
                      ))}
                      {eligibility.missingRequirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-rose-800 bg-rose-50 p-1.5 rounded-lg">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveTab('LEGAL')}
                      className="w-full text-xs mt-2"
                    >
                      Ir a Gestión Escrituraria
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Technical & Cadastral Specs */}
              <Card padding="md" className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
                  Ficha Técnica & Catastral
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Nomenclatura</span>
                    <span className="font-bold text-slate-900">{lot.cadastralReference || 'Circ. I, Secc. A, Mza. A'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Medidas</span>
                    <span className="font-bold text-slate-900">{lot.frontageM}m de frente x {lot.depthM}m fondo</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Orientación</span>
                    <span className="font-bold text-slate-900">{lot.orientation}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Agrimensura</span>
                    <span className="font-bold text-slate-900">{lotSurvey?.status || 'Aprobado'}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: DOCUMENTOS */}
          {activeTab === 'DOCUMENTOS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Checklist Documental 360°</h3>
                  <p className="text-xs text-slate-500">Documentación del comprador, venta, lote y escrituración</p>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsUploadDocOpen(true)} className="text-xs">
                  <Upload className="w-3.5 h-3.5" /> Informar Documento
                </Button>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    title: '1. Documentación Comprador',
                    types: ['DNI', 'CUIT_CUIL', 'ESTADO_CIVIL', 'DOMICILIO', 'JUSTIFICACION_FONDOS'],
                  },
                  {
                    title: '2. Documentación Venta',
                    types: ['RESERVA', 'COTIZACION_ACEPTADA', 'BOLETO', 'CONTRATO', 'RECIBO'],
                  },
                  {
                    title: '3. Documentación Lote & Obra',
                    types: ['PLANO', 'NOMENCLATURA_CATASTRAL', 'MENSURA', 'AMOJONAMIENTO', 'FACTIBILIDADES'],
                  },
                  {
                    title: '4. Documentación Legal & Registral',
                    types: ['INFORME_DOMINIO', 'CERTIFICADO_INHIBICION', 'LIBRE_DEUDA', 'MINUTA', 'ESCRITURA'],
                  },
                ].map((cat, idx) => {
                  const catDocs = lotDocs.filter(d => cat.types.includes(d.type));
                  return (
                    <Card key={idx} padding="md" className="space-y-2.5">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1.5">
                        {cat.title}
                      </h4>
                      <div className="space-y-2">
                        {cat.types.map(type => {
                          const doc = catDocs.find(d => d.type === type);
                          return (
                            <div key={type} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <div>
                                  <span className="font-bold text-slate-900 block">{type.replace('_', ' ')}</span>
                                  <span className="text-[10px] text-slate-400">{doc ? doc.fileName : 'No presentado'}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {doc ? (
                                  <Badge
                                    variant={
                                      doc.status === 'APROBADO'
                                        ? 'success'
                                        : doc.status === 'OBSERVADO' || doc.status === 'RECHAZADO'
                                        ? 'danger'
                                        : 'warning'
                                    }
                                    className="text-[10px]"
                                  >
                                    {doc.status}
                                  </Badge>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-bold bg-slate-200 px-2 py-0.5 rounded-md">
                                    PENDIENTE
                                  </span>
                                )}

                                {doc && onUpdateDocumentStatus && (
                                  <button
                                    onClick={() => onUpdateDocumentStatus(doc.id, 'APROBADO')}
                                    className="p-1 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold"
                                    title="Aprobar Documento"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LEGAL & ESCRITURACIÓN */}
          {activeTab === 'LEGAL' && (
            <div className="space-y-4">
              <Card padding="md" className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Expediente de Escrituración</h3>
                    <p className="text-xs text-slate-500">Recorrido completo desde la venta hasta la inscripción registral</p>
                  </div>
                  <Badge variant={legalProcess?.status === 'FINALIZADA' ? 'success' : 'brand'}>
                    {legalProcess?.status || 'NO INICIADO'}
                  </Badge>
                </div>

                {/* Visual Steps Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] font-bold">
                  {[
                    { label: '1. Elegibilidad', done: eligibility.isEligible },
                    { label: '2. Expediente Completo', done: legalProcess?.status === 'EXPEDIENTE_COMPLETO' || legalProcess?.status === 'LISTA_PARA_FIRMA' || legalProcess?.status === 'FIRMADA' },
                    { label: '3. Escribanía', done: !!legalProcess?.notaryOfficeName },
                    { label: '4. Firma', done: legalProcess?.status === 'FIRMADA' || legalProcess?.status === 'INSCRIPTA' || legalProcess?.status === 'FINALIZADA' },
                    { label: '5. Inscripción', done: legalProcess?.status === 'INSCRIPTA' || legalProcess?.status === 'FINALIZADA' },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border ${
                        step.done ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {step.done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                      <span>{step.label}</span>
                    </div>
                  ))}
                </div>

                {/* Notary Assignment & Schedule Actions */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Escribanía Asignada:</span>
                    <span className="font-black text-slate-900">{legalProcess?.notaryOfficeName || 'Sin Escribanía'}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                    {!legalProcess && onStartLegalProcess && (
                      <Button variant="primary" size="sm" onClick={() => onStartLegalProcess(lot.id)} className="text-xs">
                        Iniciar Tramitación Legal
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="text-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Agendar Fecha de Firma
                    </Button>

                    {legalProcess && onUpdateLegalProcess && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onUpdateLegalProcess(legalProcess.id, { status: 'EXPEDIENTE_COMPLETO' })}
                        className="text-xs"
                      >
                        Marcar Expediente Completo
                      </Button>
                    )}
                  </div>
                </div>

                {/* Scheduled Signing Appointments Card */}
                {appointments.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase">Citas de Firma Agendadas:</h4>
                    {appointments.map(app => (
                      <div key={app.id} className="p-3 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-brand-600" />
                            <span className="font-black text-slate-900">{app.scheduledDate} a las {app.scheduledTime}</span>
                            <Badge variant="brand">{app.status}</Badge>
                          </div>
                          <span className="text-slate-600 block mt-1">Lugar: {app.location} ({app.notaryName})</span>
                        </div>

                        {app.status === 'CONFIRMADA' && onCompleteSigning && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onCompleteSigning(app.id)}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmar Firma Realizada
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB 4: TECNICO & PERMISOS */}
          {activeTab === 'TECNICO' && (
            <div className="space-y-4">
              <Card padding="md" className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
                  Agrimensura & Amojonamiento
                </h3>
                {lotSurvey ? (
                  <div className="p-3 bg-slate-50 rounded-2xl space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Agrimensor Asignado:</span>
                      <span className="font-bold text-slate-900">{lotSurvey.surveyorName || 'Carlos Rossi'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estado de Amojonamiento:</span>
                      <Badge variant="success">{lotSurvey.status}</Badge>
                    </div>
                    <p className="text-slate-600 bg-white p-2 rounded-xl border border-slate-100 italic">
                      "{lotSurvey.result || 'Plano de mensura y amojonamiento en regla con 4 mojones de hormigón.'}"
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Sin tareas de agrimensura pendientes para este lote.</p>
                )}
              </Card>

              <Card padding="md" className="space-y-3">
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
                  Factibilidades & Permisos Generales del Desarrollo
                </h3>
                <div className="space-y-2">
                  {permits.map(perm => (
                    <div key={perm.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{perm.type.replace('_', ' ')}</span>
                        <span className="text-[10px] text-slate-400">{perm.authority}</span>
                      </div>
                      <Badge variant="success">{perm.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* TAB: OBRAS & POSTVENTA */}
          {activeTab === 'OBRAS_POSTVENTA' && (
            <div className="space-y-4">
              <Card padding="md" className="space-y-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardHat className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="text-sm font-black text-white">Trazabilidad Postventa & Servicios del Lote {lot.block}-{lot.number}</h3>
                      <p className="text-xs text-slate-300">Obras contratadas, garantías vigentes y abonos de mantenimiento</p>
                    </div>
                  </div>
                  <Badge variant="brand">Nexo Postventa</Badge>
                </div>
              </Card>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card padding="md" className="space-y-2">
                  <span className="text-xs font-black text-slate-700 uppercase flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Oportunidades Detectadas
                  </span>
                  <p className="text-xs text-slate-600">
                    Cerco Perimetral Olímpico, Movimiento de suelos, Parquización.
                  </p>
                  <Badge variant="warning" className="text-[10px]">1 Oportunidad Activa</Badge>
                </Card>

                <Card padding="md" className="space-y-2">
                  <span className="text-xs font-black text-slate-700 uppercase flex items-center gap-1">
                    <HardHat className="w-3.5 h-3.5 text-blue-500" /> Obras en Ejecución
                  </span>
                  <p className="text-xs text-slate-600">
                    Orden de Trabajo #WO-701 — Cerco Perimetral (Avance 100%).
                  </p>
                  <Badge variant="success" className="text-[10px]">Finalizada con Éxito</Badge>
                </Card>

                <Card padding="md" className="space-y-2">
                  <span className="text-xs font-black text-slate-700 uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Garantía Oficial
                  </span>
                  <p className="text-xs text-slate-600">
                    Garantía por escrito de 24 meses vigente hasta Agosto 2028.
                  </p>
                  <Badge variant="success" className="text-[10px]">Garantía Vigente</Badge>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 5: TIMELINE UNIFICADA */}
          {activeTab === 'TIMELINE' && (
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900">Historial de Eventos del Lote</h3>
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                {timelineEvents.map(evt => (
                  <div key={evt.id} className="relative pl-8 space-y-1">
                    <div className="absolute left-1 top-1.5 w-4 h-4 rounded-full bg-brand-500 ring-4 ring-white" />
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-slate-900">{evt.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600">{evt.description}</p>
                      <span className="text-[10px] text-slate-400 font-bold block">Por: {evt.authorName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TAREAS Y NOTAS */}
          {activeTab === 'TAREAS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">Tareas del Lote</h3>
                <Button variant="primary" size="sm" onClick={() => setIsNewTaskOpen(true)} className="text-xs">
                  <Plus className="w-3.5 h-3.5" /> Nueva Tarea
                </Button>
              </div>

              <div className="space-y-2">
                {tasks.map(t => (
                  <div key={t.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{t.contextText}</span>
                      <span className="text-[10px] text-slate-400">Asignado: {t.assignedSellerName || 'General'}</span>
                    </div>
                    <Badge variant={t.completed ? 'success' : 'warning'}>
                      {t.completed ? 'Completada' : 'Pendiente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Nexo Desarrollos — Ficha 360° Consolidada</span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cerrar Ficha 360°
          </Button>
        </div>

      </div>

      {/* Internal Modal: Informar Documento */}
      {isUploadDocOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900">Informar / Cargar Documento</h3>
            <form onSubmit={handleCreateNewDoc} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tipo de Documento</label>
                <select
                  value={newDocType}
                  onChange={e => setNewDocType(e.target.value as DocumentType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                >
                  <option value="DNI">DNI Frente y Dorso</option>
                  <option value="CUIT_CUIL">Constancia CUIT / CUIL</option>
                  <option value="BOLETO">Boleto de Compraventa</option>
                  <option value="INFORME_DOMINIO">Informe de Dominio</option>
                  <option value="LIBRE_DEUDA">Libre Deuda ARBA/Municipal</option>
                  <option value="MENSURA">Plano de Mensura</option>
                  <option value="ESCRITURA">Escritura Registrada</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Título / Descripción</label>
                <input
                  type="text"
                  placeholder="Ej. DNI Frente y Dorso Aprobado"
                  value={newDocTitle}
                  onChange={e => setNewDocTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre del Archivo Simulado</label>
                <input
                  type="text"
                  placeholder="ej. DNI_Peralta.pdf"
                  value={newDocFileName}
                  onChange={e => setNewDocFileName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1 text-xs" onClick={() => setIsUploadDocOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1 text-xs">
                  Guardar Documento
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Internal Modal: Agendar Firma */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900">Agendar Turno de Firma de Escritura</h3>
            <form onSubmit={handleCreateSigningSchedule} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Fecha de Firma</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={e => setScheduleDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Horario</label>
                <input
                  type="text"
                  placeholder="ej. 11:00 hs"
                  value={scheduleTime}
                  onChange={e => setScheduleTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Escribanía</label>
                <select
                  value={scheduleNotaryId}
                  onChange={e => setScheduleNotaryId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                >
                  {notaryOffices.map(n => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lugar de Firma</label>
                <input
                  type="text"
                  placeholder="ej. Sede Escribanía San Martín"
                  value={scheduleLocation}
                  onChange={e => setScheduleLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1 text-xs" onClick={() => setIsScheduleModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1 text-xs">
                  Confirmar Agendamiento
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Internal Modal: Nueva Tarea */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900">Crear Tarea para Lote</h3>
            <form onSubmit={handleCreateTaskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Área Responsable</label>
                <select
                  value={newTaskArea}
                  onChange={e => setNewTaskArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                >
                  <option value="COMERCIAL">Comercial</option>
                  <option value="ADMINISTRACION">Administración</option>
                  <option value="COBRANZAS">Cobranzas</option>
                  <option value="LEGAL">Legal / Escrituración</option>
                  <option value="AGRIMENSURA">Agrimensura</option>
                  <option value="ESCRIBANIA">Escribanía</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción de la Tarea</label>
                <textarea
                  rows={3}
                  placeholder="ej. Solicitar libre deuda de ARBA actualizado antes de la firma..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1 text-xs" onClick={() => setIsNewTaskOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1 text-xs">
                  Crear Tarea
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
