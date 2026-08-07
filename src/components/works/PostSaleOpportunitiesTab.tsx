import React, { useState } from 'react';
import {
  PostSaleOpportunity,
  WorkRequest,
  TechnicalSurvey,
  Lot,
  ServiceCategory,
  PostSaleOpportunityStatus
} from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Sparkles,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ClipboardList,
  Calendar,
  UserCheck,
  FileText
} from 'lucide-react';

interface PostSaleOpportunitiesTabProps {
  opportunities: PostSaleOpportunity[];
  workRequests: WorkRequest[];
  technicalSurveys: TechnicalSurvey[];
  lots: Lot[];
  onOpenNewRequestModal: (opportunity?: PostSaleOpportunity) => void;
  onOpenSurveyModal: (request: WorkRequest) => void;
  onRequestQuotes: (request: WorkRequest) => void;
  onRunAutoDetection: () => void;
}

export const PostSaleOpportunitiesTab: React.FC<PostSaleOpportunitiesTabProps> = ({
  opportunities,
  workRequests,
  technicalSurveys,
  lots,
  onOpenNewRequestModal,
  onOpenSurveyModal,
  onRequestQuotes,
  onRunAutoDetection,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeView, setActiveView] = useState<'OPPORTUNITIES' | 'REQUESTS'>('OPPORTUNITIES');

  const filteredOpportunities = opportunities.filter(op => {
    if (selectedCategory !== 'ALL' && op.category !== selectedCategory) return false;
    return true;
  });

  const filteredRequests = workRequests.filter(req => {
    if (selectedCategory !== 'ALL' && req.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('OPPORTUNITIES')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeView === 'OPPORTUNITIES'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Oportunidades ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveView('REQUESTS')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeView === 'REQUESTS'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Solicitudes de Servicio ({workRequests.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRunAutoDetection}
            className="text-xs border-amber-300 bg-amber-50 text-amber-800"
          >
            <Sparkles className="w-3.5 h-3.5" /> Detección Automática
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onOpenNewRequestModal()}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Solicitud
          </Button>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
          <Filter className="w-3 h-3" /> Categoría:
        </span>
        {[
          { key: 'ALL', label: 'Todas' },
          { key: 'CERRAMIENTOS_LIMITES', label: 'Cerramientos' },
          { key: 'PREPARACION_TERRENO', label: 'Terreno' },
          { key: 'EXTERIOR_PAISAJISMO', label: 'Piscina & Exterior' },
          { key: 'CONSTRUCCION_PROYECTO', label: 'Construcción' },
          { key: 'SERVICIOS_RECURRENTES', label: 'Abonos Recurrentes' },
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
              selectedCategory === cat.key
                ? 'bg-brand-600 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* OPPORTUNITIES VIEW */}
      {activeView === 'OPPORTUNITIES' && (
        <div className="space-y-3">
          {filteredOpportunities.length === 0 ? (
            <Card padding="md" className="text-center py-8 text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No hay oportunidades postventa registradas para este filtro.</p>
            </Card>
          ) : (
            filteredOpportunities.map(op => (
              <Card key={op.id} padding="md" className="space-y-2.5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-700 uppercase">
                        Lote {op.lotNumber || op.lotId} — {op.customerName}
                      </span>
                      <Badge variant="outline" className="text-[10px] text-slate-500">
                        {op.source}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-black text-slate-900">{op.title}</h3>
                  </div>
                  <Badge
                    variant={
                      op.status === 'DETECTADA'
                        ? 'warning'
                        : op.status === 'CONVERTIDA' || op.status === 'APROBADA'
                        ? 'success'
                        : 'brand'
                    }
                  >
                    {op.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600">{op.description}</p>

                {op.triggerReason && (
                  <div className="p-2 bg-amber-50/70 border border-amber-100 rounded-lg text-[11px] text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span><strong>Motivo de Generación:</strong> {op.triggerReason}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500">Valor Estimado: </span>
                    <strong className="text-slate-900 font-black">
                      ${op.estimatedValue?.toLocaleString()} {op.currency || 'USD'}
                    </strong>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onOpenNewRequestModal(op)}
                    className="text-xs py-1.5"
                  >
                    Convertir a Solicitud <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* WORK REQUESTS VIEW */}
      {activeView === 'REQUESTS' && (
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <Card padding="md" className="text-center py-8 text-slate-400 space-y-2">
              <ClipboardList className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No hay solicitudes de servicio registradas.</p>
            </Card>
          ) : (
            filteredRequests.map(req => {
              const survey = technicalSurveys.find(s => s.workRequestId === req.id);

              return (
                <Card key={req.id} padding="md" className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">
                          Lote {req.lotNumber || req.lotId} • {req.customerName}
                        </span>
                        <Badge
                          variant={
                            req.priority === 'URGENTE'
                              ? 'danger'
                              : req.priority === 'ALTA'
                              ? 'warning'
                              : 'default'
                          }
                          className="text-[10px]"
                        >
                          Prioridad {req.priority}
                        </Badge>
                      </div>
                      <h3 className="text-sm font-black text-slate-900">{req.title}</h3>
                    </div>
                    <Badge variant={req.status === 'APROBADA' ? 'success' : 'brand'}>
                      {req.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600">{req.description}</p>

                  {/* Technical Survey Status Widget */}
                  {req.siteVisitRequired && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-purple-600" />
                          Relevamiento Técnico
                        </span>
                        <Badge
                          variant={
                            survey?.status === 'REALIZADO' || survey?.status === 'APROBADO'
                              ? 'success'
                              : survey?.status === 'AGENDADO'
                              ? 'brand'
                              : 'warning'
                          }
                          className="text-[10px]"
                        >
                          {survey ? survey.status : 'PENDIENTE DE AGENDAR'}
                        </Badge>
                      </div>

                      {survey ? (
                        <div className="text-[11px] text-slate-600 space-y-1">
                          <p>
                            <strong>Responsable:</strong> {survey.assignedUserName || 'Ing. Técnico'} •{' '}
                            <strong>Fecha:</strong> {survey.scheduledAt}
                          </p>
                          {survey.measurements && (
                            <p className="bg-white p-1.5 rounded border border-slate-100 text-[10px]">
                              <strong>Medidas:</strong> {survey.measurements}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onOpenSurveyModal(req)}
                          className="w-full text-xs py-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          Agendar / Completar Relevamiento
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-500">Presupuesto Estimado: </span>
                      <strong className="text-slate-900 font-bold">
                        ${req.budgetExpectation?.toLocaleString()} {req.currency || 'USD'}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onRequestQuotes(req)}
                        className="text-xs py-1.5"
                      >
                        Solicitar Cotizaciones Proveedores <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
