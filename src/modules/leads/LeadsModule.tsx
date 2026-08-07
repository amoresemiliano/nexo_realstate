import React, { useState } from 'react';
import {
  Lead,
  Lot,
  Campaign,
  Seller,
  ActivityItem,
  TaskItem,
  VisitItem,
  LeadLossReason,
  LeadStatus
} from '../../types';
import { calculateSLA, formatUSD } from '../../domain/rules';
import { LeadCard } from '../../components/leads/LeadCard';
import { LeadFichaModal } from '../../components/leads/LeadFichaModal';
import { QuickCreateLeadModal } from '../../components/modals/QuickCreateLeadModal';
import { LeadQualificationModal } from '../../components/modals/LeadQualificationModal';
import { LogActivityModal } from '../../components/modals/LogActivityModal';
import { ScheduleVisitModal } from '../../components/modals/ScheduleVisitModal';
import { LossModal } from '../../components/modals/LossModal';
import { MobileFilterSheet, LeadFilterOptions } from '../../components/leads/MobileFilterSheet';
import { AttentionRequiredCard } from '../../components/leads/AttentionRequiredCard';
import { CampaignPerformanceCard } from '../../components/leads/CampaignPerformanceCard';
import { PipelineStageSelector } from '../../components/leads/PipelineStageSelector';
import { EmptyLeadsState } from '../../components/leads/EmptyLeadsState';

import {
  Users,
  Plus,
  Search,
  Filter,
  Calendar,
  PhoneCall,
  Megaphone,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  MessageCircle,
  FileText
} from 'lucide-react';

interface LeadsModuleProps {
  leads: Lead[];
  lots: Lot[];
  campaigns: Campaign[];
  sellers: Seller[];
  activities: ActivityItem[];
  tasks: TaskItem[];
  visits: VisitItem[];
  onAddLead: (newLead: Lead) => void;
  onUpdateLead: (updatedLead: Lead) => void;
  onAddActivity: (activity: ActivityItem, updatedLead?: Partial<Lead>, newTask?: TaskItem) => void;
  onAddVisit: (visit: VisitItem, updatedLead?: Partial<Lead>) => void;
  onMarkLoss: (leadId: string, lossReason: LeadLossReason, lossNote: string, recontactDate?: string) => void;
  onOpenNewLeadModal?: () => void;
}

export const LeadsModule: React.FC<LeadsModuleProps> = ({
  leads,
  lots,
  campaigns,
  sellers,
  activities,
  tasks,
  visits,
  onAddLead,
  onUpdateLead,
  onAddActivity,
  onAddVisit,
  onMarkLoss,
  onOpenNewLeadModal
}) => {
  // Main view navigation inside Leads module
  const [subTab, setSubTab] = useState<'pipeline' | 'tasks' | 'visits' | 'performance'>('pipeline');

  // Stage filter pill
  const [selectedStage, setSelectedStage] = useState<string>('ALL');

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLeadForFicha, setSelectedLeadForFicha] = useState<Lead | null>(null);
  const [selectedLeadForQualification, setSelectedLeadForQualification] = useState<Lead | null>(null);
  const [selectedLeadForActivity, setSelectedLeadForActivity] = useState<Lead | null>(null);
  const [selectedLeadForVisit, setSelectedLeadForVisit] = useState<Lead | null>(null);
  const [selectedLeadForLoss, setSelectedLeadForLoss] = useState<Lead | null>(null);

  // Advanced filters
  const [filters, setFilters] = useState<LeadFilterOptions>({
    searchQuery: '',
    status: 'PIPELINE_ONLY',
    temperature: 'ALL',
    priority: 'ALL',
    source: 'ALL',
    sellerId: 'ALL',
    overdueSlaOnly: false
  });

  // Handle stage change dropdown or quick status shift
  const handleQuickAdvanceStatus = (lead: Lead) => {
    const statusOrder: LeadStatus[] = [
      'NUEVO',
      'PENDIENTE_PRIMER_CONTACTO',
      'CONTACTADO',
      'EN_CALIFICACION',
      'CALIFICADO',
      'VISITA_AGENDADA',
      'LOTE_IDENTIFICATED' as any,
      'COTIZACION_ENVIADA',
      'NEGOCIACION',
      'RESERVA_CONFIRMADA'
    ];

    const currIdx = statusOrder.indexOf(lead.status);
    const nextStatus = currIdx >= 0 && currIdx < statusOrder.length - 1 ? statusOrder[currIdx + 1] : lead.status;

    onUpdateLead({
      ...lead,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    });
  };

  // Filter leads based on stage pills, search, and advanced filters
  const filteredLeads = leads.filter(l => {
    // Search text
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = l.fullName.toLowerCase().includes(q);
      const matchPhone = l.phone.includes(q);
      const matchCity = l.city ? l.city.toLowerCase().includes(q) : false;
      if (!matchName && !matchPhone && !matchCity) return false;
    }

    // Stage pills
    if (selectedStage === 'CLOSED') {
      if (!['OPORTUNIDAD_PERDIDA', 'NO_CALIFICADO', 'DUPLICADO', 'CONTACTO_INVALIDO'].includes(l.status)) {
        return false;
      }
    } else if (selectedStage !== 'ALL') {
      if (l.status !== selectedStage) return false;
    } else {
      // ALL selected -> filter out closed unless explicitly requested
      if (filters.status === 'PIPELINE_ONLY') {
        if (['OPORTUNIDAD_PERDIDA', 'NO_CALIFICADO', 'DUPLICADO', 'CONTACTO_INVALIDO'].includes(l.status)) {
          return false;
        }
      }
    }

    // Status filter from sheet
    if (filters.status === 'CLOSED_ONLY') {
      if (!['OPORTUNIDAD_PERDIDA', 'NO_CALIFICADO', 'DUPLICADO', 'CONTACTO_INVALIDO'].includes(l.status)) {
        return false;
      }
    }

    // Seller filter
    if (filters.sellerId === 'UNASSIGNED') {
      if (l.assignedSellerId || l.assignedAgent !== 'Sin Asignar') return false;
    } else if (filters.sellerId && filters.sellerId !== 'ALL') {
      if (l.assignedSellerId !== filters.sellerId) return false;
    }

    // Source filter
    if (filters.source && filters.source !== 'ALL') {
      if (l.source !== filters.source) return false;
    }

    // Temperature
    if (filters.temperature && filters.temperature !== 'ALL') {
      if (l.qualification !== filters.temperature) return false;
    }

    // Overdue SLA
    if (filters.overdueSlaOnly) {
      const sla = calculateSLA(l.createdAt, l.status);
      if (sla.slaStatus !== 'OVERDUE' && sla.slaStatus !== 'CRITICAL') return false;
    }

    return true;
  });

  const hasActiveFilters = Boolean(
    searchTerm !== '' ||
    selectedStage !== 'ALL' ||
    filters.sellerId !== 'ALL' ||
    filters.source !== 'ALL' ||
    filters.temperature !== 'ALL' ||
    filters.overdueSlaOnly
  );

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
            <Users className="w-5 h-5 text-brand-600" />
            <span>Preventa Comercial CRM</span>
          </h2>
          <p className="text-xs text-slate-500">Gestión mobile-first de leads y oportunidades</p>
        </div>

        <button
          onClick={() => (onOpenNewLeadModal ? onOpenNewLeadModal() : setIsCreateModalOpen(true))}
          className="px-3.5 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md hover:bg-brand-700 active:scale-98 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Lead</span>
        </button>
      </div>

      {/* Module Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setSubTab('pipeline')}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
            subTab === 'pipeline' ? 'bg-white text-brand-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Pipeline</span>
        </button>

        <button
          onClick={() => setSubTab('tasks')}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 relative ${
            subTab === 'tasks' ? 'bg-white text-brand-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Agenda</span>
          {tasks.filter(t => !t.completed).length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-2" />
          )}
        </button>

        <button
          onClick={() => setSubTab('visits')}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
            subTab === 'visits' ? 'bg-white text-brand-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Visitas</span>
        </button>

        <button
          onClick={() => setSubTab('performance')}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
            subTab === 'performance' ? 'bg-white text-brand-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Campañas</span>
        </button>
      </div>

      {/* SUBTAB 1: PIPELINE */}
      {subTab === 'pipeline' && (
        <div className="space-y-3">
          {/* Attention Banner for SLA breaches & unassigned */}
          <AttentionRequiredCard leads={leads} onSelectLead={setSelectedLeadForFicha} />

          {/* Search & Filter Trigger Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por nombre, teléfono o ciudad..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setIsFilterOpen(true)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                filters.overdueSlaOnly || filters.sellerId !== 'ALL' || filters.source !== 'ALL'
                  ? 'bg-brand-50 text-brand-700 border-brand-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>

          {/* Horizontal Stage Pills Selector */}
          <PipelineStageSelector
            selectedStage={selectedStage}
            onSelectStage={setSelectedStage}
            leads={leads}
          />

          {/* Filter summary if active */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between text-xs bg-slate-100 px-3 py-1.5 rounded-xl text-slate-600">
              <span>
                Mostrando <strong>{filteredLeads.length}</strong> de <strong>{leads.length}</strong> leads
              </span>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStage('ALL');
                  setFilters({
                    searchQuery: '',
                    status: 'PIPELINE_ONLY',
                    temperature: 'ALL',
                    priority: 'ALL',
                    source: 'ALL',
                    sellerId: 'ALL',
                    overdueSlaOnly: false
                  });
                }}
                className="text-brand-700 font-bold hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Leads Cards Feed */}
          {filteredLeads.length === 0 ? (
            <EmptyLeadsState
              hasFilters={hasActiveFilters}
              onClearFilters={() => {
                setSearchTerm('');
                setSelectedStage('ALL');
                setFilters({
                  searchQuery: '',
                  status: 'PIPELINE_ONLY',
                  temperature: 'ALL',
                  priority: 'ALL',
                  source: 'ALL',
                  sellerId: 'ALL',
                  overdueSlaOnly: false
                });
              }}
              onOpenCreate={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <div className="space-y-3">
              {filteredLeads.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onSelect={setSelectedLeadForFicha}
                  onLogActivity={setSelectedLeadForActivity}
                  onQualify={setSelectedLeadForQualification}
                  onChangeStatus={handleQuickAdvanceStatus}
                  onMarkLost={setSelectedLeadForLoss}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: AGENDA COMERCIAL */}
      {subTab === 'tasks' && (
        <div className="space-y-3">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Tareas & Seguimientos Pendientes ({tasks.filter(t => !t.completed).length})
              </h3>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">No hay tareas programadas.</div>
            ) : (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border text-xs space-y-1.5 transition-all ${
                      task.completed
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 hover:border-brand-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-slate-900">{task.leadName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-800 font-extrabold text-[10px]">
                        {task.type}
                      </span>
                    </div>

                    <p className="text-slate-600">{task.contextText}</p>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                      <span className="text-slate-400 font-medium">
                        Vencimiento: {new Date(task.dueDate).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${task.leadPhone.replace(/[^\d]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: VISITAS AL PREDIO */}
      {subTab === 'visits' && (
        <div className="space-y-3">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Agenda de Visitas al Predio
                </h3>
                <p className="text-[11px] text-slate-500">Coordinación presencial en Altos del Horizonte</p>
              </div>
            </div>

            {visits.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">No hay visitas registradas aún.</div>
            ) : (
              <div className="space-y-3">
                {visits.map(vis => (
                  <div key={vis.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm">{vis.leadName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-extrabold text-[10px]">
                        {vis.status}
                      </span>
                    </div>

                    <div className="text-slate-600 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      <span>{new Date(vis.scheduledAt).toLocaleString()}</span>
                    </div>

                    <div className="text-slate-600 flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Asesor: <strong>{vis.assignedSellerName}</strong> ({vis.participantsCount} personas)
                      </span>
                    </div>

                    {vis.notes && (
                      <p className="text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200">
                        "{vis.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 4: RENDIMIENTO Y CAMPAÑAS */}
      {subTab === 'performance' && (
        <div className="space-y-3">
          <CampaignPerformanceCard campaigns={campaigns} leads={leads} />
        </div>
      )}

      {/* MODALS */}
      <QuickCreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        sellers={sellers}
        campaigns={campaigns}
        onCreateLead={onAddLead}
      />

      <LeadFichaModal
        lead={selectedLeadForFicha}
        isOpen={!!selectedLeadForFicha}
        onClose={() => setSelectedLeadForFicha(null)}
        sellers={sellers}
        activities={activities}
        tasks={tasks}
        visits={visits}
        lots={lots}
        onUpdateLead={onUpdateLead}
        onLogActivity={lead => {
          setSelectedLeadForActivity(lead);
        }}
        onQualify={lead => {
          setSelectedLeadForQualification(lead);
        }}
        onChangeStatus={handleQuickAdvanceStatus}
        onMarkLost={lead => {
          setSelectedLeadForLoss(lead);
        }}
        onScheduleVisit={lead => {
          setSelectedLeadForVisit(lead);
        }}
      />

      <LeadQualificationModal
        lead={selectedLeadForQualification}
        isOpen={!!selectedLeadForQualification}
        onClose={() => setSelectedLeadForQualification(null)}
        onSave={onUpdateLead}
      />

      <LogActivityModal
        lead={selectedLeadForActivity}
        isOpen={!!selectedLeadForActivity}
        onClose={() => setSelectedLeadForActivity(null)}
        onSaveActivity={onAddActivity}
      />

      <ScheduleVisitModal
        lead={selectedLeadForVisit}
        isOpen={!!selectedLeadForVisit}
        onClose={() => setSelectedLeadForVisit(null)}
        sellers={sellers}
        onSaveVisit={onAddVisit}
      />

      <LossModal
        lead={selectedLeadForLoss}
        isOpen={!!selectedLeadForLoss}
        onClose={() => setSelectedLeadForLoss(null)}
        onConfirmLoss={onMarkLoss}
      />

      <MobileFilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        sellers={sellers}
        onApplyFilters={setFilters}
        onResetFilters={() =>
          setFilters({
            searchQuery: '',
            status: 'PIPELINE_ONLY',
            temperature: 'ALL',
            priority: 'ALL',
            source: 'ALL',
            sellerId: 'ALL',
            overdueSlaOnly: false
          })
        }
      />
    </div>
  );
};
