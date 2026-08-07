import React, { useState } from 'react';
import { Lead, Seller, ActivityItem, TaskItem, VisitItem, Lot } from '../../types';
import { calculateSLA, formatUSD } from '../../domain/rules';
import { LeadStatusBadge, LeadTemperatureBadge, LeadSourceBadge, LeadPriorityBadge, SellerAvatar } from './LeadBadges';
import { LeadQuickActions } from './LeadQuickActions';
import { LeadTimeline } from './LeadTimeline';
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
  Building,
  ChevronRight
} from 'lucide-react';

interface LeadFichaModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  sellers: Seller[];
  activities: ActivityItem[];
  tasks: TaskItem[];
  visits: VisitItem[];
  lots: Lot[];
  onUpdateLead: (updatedLead: Lead) => void;
  onLogActivity: (lead: Lead) => void;
  onQualify: (lead: Lead) => void;
  onChangeStatus: (lead: Lead) => void;
  onMarkLost: (lead: Lead) => void;
  onScheduleVisit: (lead: Lead) => void;
}

export const LeadFichaModal: React.FC<LeadFichaModalProps> = ({
  lead,
  isOpen,
  onClose,
  sellers,
  activities,
  tasks,
  visits,
  lots,
  onUpdateLead,
  onLogActivity,
  onQualify,
  onChangeStatus,
  onMarkLost,
  onScheduleVisit
}) => {
  if (!isOpen || !lead) return null;

  const [activeTab, setActiveTab] = useState<'360' | 'qualification' | 'timeline' | 'visits'>('360');

  const sla = calculateSLA(lead.createdAt, lead.status);

  const leadActivities = activities.filter(a => a.leadId === lead.id);
  const leadTasks = tasks.filter(t => t.leadId === lead.id);
  const leadVisits = visits.filter(v => v.leadId === lead.id);

  const handleSellerChange = (sellerId: string) => {
    const seller = sellers.find(s => s.id === sellerId);
    onUpdateLead({
      ...lead,
      assignedSellerId: sellerId,
      assignedAgent: seller ? seller.name : 'Sin Asignar',
      updatedAt: new Date().toISOString()
    });
  };

  // Known vs Missing Qualification Checklist
  const qualificationItems = [
    { label: 'Presupuesto total verificado', value: lead.budgetUSD ? formatUSD(lead.budgetUSD) : null, isKnown: !!lead.budgetUSD },
    { label: 'Anticipo líquido disponible', value: lead.availableDownPayment ? formatUSD(lead.availableDownPayment) : null, isKnown: !!lead.availableDownPayment },
    { label: 'Cuota mensual máxima', value: lead.maximumMonthlyPayment ? formatUSD(lead.maximumMonthlyPayment) : null, isKnown: !!lead.maximumMonthlyPayment },
    { label: 'Plazo estimado de compra', value: lead.expectedPurchaseDate, isKnown: !!lead.expectedPurchaseDate },
    { label: 'Motivo / Uso del lote', value: lead.motivation, isKnown: !!lead.motivation },
    { label: 'Toma de decisión (Solo/Pareja)', value: lead.decisionMaker, isKnown: !!lead.decisionMaker },
    { label: 'Visita presencial al predio', value: lead.hasVisited ? 'Realizada' : 'Pendiente', isKnown: !!lead.hasVisited },
    { label: 'Lote de interés identificado', value: lead.interestedBlock ? `Manzana ${lead.interestedBlock}` : null, isKnown: !!lead.interestedBlock }
  ];

  const knownCount = qualificationItems.filter(i => i.isKnown).length;
  const missingCount = qualificationItems.length - knownCount;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Top Sticky Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-start justify-between gap-3 relative">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <LeadStatusBadge status={lead.status} />
              <LeadTemperatureBadge temp={lead.qualification} />
              <LeadSourceBadge source={lead.source} />
            </div>

            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>{lead.fullName}</span>
            </h2>

            <p className="text-xs text-slate-300 flex items-center gap-3 mt-1">
              <span>{lead.phone}</span>
              {lead.city && <span>• {lead.city}</span>}
              {lead.email && <span>• {lead.email}</span>}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar (WhatsApp, Call, Qualify, Change Status) */}
        <div className="p-3 bg-slate-100 border-b border-slate-200">
          <LeadQuickActions
            lead={lead}
            size="full"
            onLogActivity={onLogActivity}
            onQualify={onQualify}
            onChangeStatus={onChangeStatus}
            onMarkLost={onMarkLost}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-white px-4">
          <button
            onClick={() => setActiveTab('360')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === '360'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Ficha 360°
          </button>
          <button
            onClick={() => setActiveTab('qualification')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1 ${
              activeTab === 'qualification'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Calificación</span>
            <span className="px-1.5 py-0.2 rounded-full bg-brand-100 text-brand-800 text-[10px]">
              {knownCount}/{qualificationItems.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1 ${
              activeTab === 'timeline'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Actividad</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">
              {leadActivities.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1 ${
              activeTab === 'visits'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Visitas</span>
            <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px]">
              {leadVisits.length}
            </span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: 360 overview */}
          {activeTab === '360' && (
            <div className="space-y-4">
              {/* SLA & Attention Box */}
              <div className={`p-3.5 rounded-2xl border ${sla.badgeClass} flex items-start gap-3`}>
                <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-extrabold text-slate-900">{sla.badgeText}</div>
                  <div className="text-slate-700 mt-0.5">{sla.suggestedAction}</div>
                </div>
              </div>

              {/* Commercial Assignment & Seller Selector */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Vendedor Asignado</span>
                  <span className="text-xs text-slate-500">Campaña: {lead.campaignName || 'Orgánico'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <SellerAvatar sellerName={lead.assignedAgent} size="md" />
                  <select
                    value={lead.assignedSellerId || ''}
                    onChange={e => handleSellerChange(e.target.value)}
                    className="flex-1 text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">-- Sin Asignar --</option>
                    {sellers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lead Score & Qualification reasons */}
              <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-200/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-brand-900 uppercase">Score Comercial</div>
                    <div className="text-2xl font-black text-brand-700">
                      {lead.score || lead.qualificationScore || 50}/100
                    </div>
                  </div>
                  <button
                    onClick={() => onQualify(lead)}
                    className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-2xs hover:bg-brand-700 transition-all flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Editar Calificación</span>
                  </button>
                </div>

                {lead.scoreReasons && lead.scoreReasons.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-brand-800 uppercase">Factores del Score:</div>
                    <ul className="text-xs text-brand-900 space-y-0.5">
                      {lead.scoreReasons.map((r, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Initial Message & Internal Notes */}
              {lead.initialMessage && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs">
                  <div className="font-extrabold text-amber-900 mb-1">Consulta Inicial del Lead:</div>
                  <p className="text-amber-950 italic">"{lead.initialMessage}"</p>
                </div>
              )}

              {lead.notes && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1">
                  <div className="font-extrabold text-slate-800">Notas de Gestión Comercial:</div>
                  <p className="text-slate-600">{lead.notes}</p>
                </div>
              )}

              {/* Schedule Visit Quick Banner */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-purple-900">¿Coordinar Visita al Predio?</div>
                  <div className="text-[11px] text-purple-700">Agendar cita presencial para cerrar operación</div>
                </div>
                <button
                  onClick={() => onScheduleVisit(lead)}
                  className="px-3 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-all shadow-xs flex items-center gap-1 shrink-0"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Visita</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Qualification Known vs Missing */}
          {activeTab === 'qualification' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-slate-900 uppercase">Estado de Calificación</div>
                  <div className="text-xs text-slate-600">
                    Se han validado {knownCount} de {qualificationItems.length} variables clave.
                  </div>
                </div>
                <button
                  onClick={() => onQualify(lead)}
                  className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-2xs hover:bg-brand-700"
                >
                  Completar
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Información Relevante Comercial
                </h4>

                {qualificationItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      item.isKnown
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.isKnown ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span className="font-semibold">{item.label}</span>
                    </div>

                    <span className="font-extrabold text-slate-900">
                      {item.isKnown ? item.value : 'Por calificar'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Timeline & Activities */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Historial de Interacciones
                </h4>
                <button
                  onClick={() => onLogActivity(lead)}
                  className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-2xs hover:bg-brand-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Registrar Gestión</span>
                </button>
              </div>

              <LeadTimeline activities={leadActivities} />
            </div>
          )}

          {/* TAB 4: Visits */}
          {activeTab === 'visits' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Visitas al Predio</h4>
                <button
                  onClick={() => onScheduleVisit(lead)}
                  className="px-3 py-1.5 rounded-xl bg-purple-700 text-white font-bold text-xs shadow-2xs hover:bg-purple-800 flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agendar Visita</span>
                </button>
              </div>

              {leadVisits.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                  No hay visitas agendadas para este lead todavía.
                </div>
              ) : (
                <div className="space-y-3">
                  {leadVisits.map(v => (
                    <div key={v.id} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900">{v.developmentName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-extrabold text-[10px]">
                          {v.status}
                        </span>
                      </div>
                      <div className="text-slate-600 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(v.scheduledAt).toLocaleString()}</span>
                      </div>
                      <div className="text-slate-600 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{v.meetingPoint}</span>
                      </div>
                      {v.clientImpression && (
                        <p className="p-2 rounded-lg bg-slate-50 text-slate-700 italic border border-slate-200">
                          "{v.clientImpression}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
