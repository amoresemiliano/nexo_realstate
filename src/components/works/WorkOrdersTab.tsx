import React, { useState } from 'react';
import {
  WorkOrder,
  WorkMilestone,
  Incident,
  Warranty,
  Provider
} from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  HardHat,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Camera,
  ChevronRight
} from 'lucide-react';

interface WorkOrdersTabProps {
  workOrders: WorkOrder[];
  milestones: WorkMilestone[];
  incidents: Incident[];
  warranties: Warranty[];
  providers: Provider[];
  onUpdateProgress: (orderId: string, newProgress: number, milestoneId?: string) => void;
  onReportIncident: (orderId: string, description: string, severity: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA', type: any) => void;
  onResolveIncident: (incidentId: string) => void;
  onFinalizeWorkOrder: (orderId: string) => void;
}

export const WorkOrdersTab: React.FC<WorkOrdersTabProps> = ({
  workOrders,
  milestones,
  incidents,
  warranties,
  providers,
  onUpdateProgress,
  onReportIncident,
  onResolveIncident,
  onFinalizeWorkOrder,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(workOrders[0]?.id || '');
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  // New incident fields
  const [incidentType, setIncidentType] = useState<string>('DEMORA');
  const [incidentSeverity, setIncidentSeverity] = useState<'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'>('MEDIA');
  const [incidentDesc, setIncidentDesc] = useState('');

  const activeOrder = workOrders.find(o => o.id === selectedOrderId);
  const orderMilestones = milestones.filter(m => m.workOrderId === selectedOrderId);
  const orderIncidents = incidents.filter(i => i.workOrderId === selectedOrderId);
  const orderWarranty = warranties.find(w => w.workOrderId === selectedOrderId);

  const openCriticalIncidents = orderIncidents.filter(
    i => (i.status === 'ABIERTA' || i.status === 'EN_ANALISIS') && (i.severity === 'CRITICA' || i.severity === 'ALTA')
  );

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !incidentDesc) return;
    onReportIncident(selectedOrderId, incidentDesc, incidentSeverity, incidentType);
    setIncidentDesc('');
    setShowIncidentForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Work Order Selector */}
      <Card padding="sm" className="bg-slate-50 border border-slate-200">
        <label className="text-xs font-bold text-slate-700 block mb-1">
          Seleccionar Obra / Orden de Trabajo:
        </label>
        <select
          value={selectedOrderId}
          onChange={e => setSelectedOrderId(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {workOrders.map(work => (
            <option key={work.id} value={work.id}>
              Lote {work.lotNumber || work.lotId} — {work.title} ({work.status})
            </option>
          ))}
        </select>
      </Card>

      {activeOrder && (
        <div className="space-y-4">
          {/* Main Work Order Header Card */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">
                  Lote {activeOrder.lotNumber || activeOrder.lotId} • {activeOrder.customerName}
                </span>
                <h3 className="text-base font-black text-slate-900">{activeOrder.title}</h3>
                <p className="text-xs text-slate-500">
                  Proveedor: <strong className="text-slate-800">{activeOrder.providerName}</strong> • Coordinador:{' '}
                  <strong>{activeOrder.coordinatorName || 'Ing. Gonzalo Bunge'}</strong>
                </p>
              </div>
              <Badge
                variant={
                  activeOrder.status === 'FINALIZADA'
                    ? 'success'
                    : activeOrder.status === 'DEMORADA'
                    ? 'danger'
                    : 'brand'
                }
              >
                {activeOrder.status}
              </Badge>
            </div>

            {/* Progress Bar & Quick Controls */}
            <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">Avance Fisico Certificado:</span>
                <span className="text-brand-600 text-sm font-black">{activeOrder.progress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    activeOrder.progress === 100
                      ? 'bg-emerald-500'
                      : activeOrder.status === 'DEMORADA'
                      ? 'bg-amber-500'
                      : 'bg-brand-600'
                  }`}
                  style={{ width: `${activeOrder.progress}%` }}
                />
              </div>

              {/* Progress Quick Buttons */}
              {activeOrder.status !== 'FINALIZADA' && (
                <div className="flex items-center gap-1.5 pt-2">
                  <span className="text-[10px] font-bold text-slate-400">Actualizar:</span>
                  {[25, 50, 75, 100].map(val => (
                    <button
                      key={val}
                      onClick={() => onUpdateProgress(activeOrder.id, val)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-lg transition-colors ${
                        activeOrder.progress === val
                          ? 'bg-brand-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-slate-100">
              <div>
                <span className="text-slate-400 text-[10px] block">Monto Contratado:</span>
                <strong className="text-slate-900">${activeOrder.contractedAmount.toLocaleString()} USD</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Costo Proveedor:</span>
                <strong className="text-slate-700">${activeOrder.providerCost.toLocaleString()} USD</strong>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Margen Obra:</span>
                <strong className="text-emerald-600 font-black">${activeOrder.marginAmount.toLocaleString()} USD</strong>
              </div>
            </div>
          </Card>

          {/* Milestones Stepper */}
          <Card padding="md" className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600" /> Hitos Certificados de Obra
            </h4>

            {orderMilestones.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No hay hitos definidos para esta obra.</p>
            ) : (
              <div className="space-y-2">
                {orderMilestones.map(ms => (
                  <div
                    key={ms.id}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          ms.status === 'COMPLETADO'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {ms.status === 'COMPLETADO' ? '✓' : `${ms.percentage}%`}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{ms.title}</p>
                        {ms.description && <p className="text-[10px] text-slate-500">{ms.description}</p>}
                      </div>
                    </div>

                    <Badge
                      variant={ms.status === 'COMPLETADO' ? 'success' : 'default'}
                      className="text-[10px]"
                    >
                      {ms.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Incidents Section */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Incidencias & Observaciones
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowIncidentForm(!showIncidentForm)}
                className="text-xs py-1"
              >
                <Plus className="w-3 h-3" /> Reportar Incidencia
              </Button>
            </div>

            {showIncidentForm && (
              <form onSubmit={handleCreateIncident} className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Tipo:</label>
                    <select
                      value={incidentType}
                      onChange={e => setIncidentType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5"
                    >
                      <option value="DEMORA">Demora</option>
                      <option value="DANO">Daño de Material</option>
                      <option value="ACCESO">Acceso a Parcela</option>
                      <option value="CALIDAD">Calidad de Trabajo</option>
                      <option value="CLIMA">Factor Climatológico</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Severidad:</label>
                    <select
                      value={incidentSeverity}
                      onChange={e => setIncidentSeverity(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-1.5"
                    >
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                      <option value="CRITICA">Crítica</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Descripción del Incidente:</label>
                  <textarea
                    value={incidentDesc}
                    onChange={e => setIncidentDesc(e.target.value)}
                    rows={2}
                    placeholder="Detalle de la incidencia observada..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowIncidentForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Guardar Incidencia
                  </Button>
                </div>
              </form>
            )}

            {orderIncidents.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No hay incidencias reportadas para esta obra.</p>
            ) : (
              <div className="space-y-2">
                {orderIncidents.map(inc => (
                  <div
                    key={inc.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={
                            inc.severity === 'CRITICA' || inc.severity === 'ALTA'
                              ? 'danger'
                              : 'warning'
                          }
                          className="text-[10px]"
                        >
                          {inc.severity}
                        </Badge>
                        <span className="font-bold text-slate-900">{inc.type}</span>
                      </div>
                      <Badge variant={inc.status === 'RESUELTA' ? 'success' : 'brand'} className="text-[10px]">
                        {inc.status}
                      </Badge>
                    </div>

                    <p className="text-slate-600 text-[11px]">{inc.description}</p>

                    {inc.status !== 'RESUELTA' && (
                      <div className="pt-1 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onResolveIncident(inc.id)}
                          className="text-[11px] text-emerald-700 hover:bg-emerald-50 py-0.5"
                        >
                          Marcar Resuelta ✓
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Finalize & Warranty Status */}
          <Card padding="md" className="space-y-3 bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-black uppercase text-emerald-900">
                    Finalización de Obra & Garantía
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    Garantía otorgada: {activeOrder.warrantyMonths || 24} meses por escrito
                  </p>
                </div>
              </div>

              {activeOrder.status !== 'FINALIZADA' ? (
                <Button
                  variant="success"
                  size="sm"
                  disabled={openCriticalIncidents.length > 0}
                  onClick={() => onFinalizeWorkOrder(activeOrder.id)}
                  className="text-xs py-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Finalizar Obra & Emitir Acta Definitiva
                </Button>
              ) : (
                <Badge variant="success">✓ Obra Finalizada con Garantía Activa</Badge>
              )}
            </div>

            {openCriticalIncidents.length > 0 && (
              <p className="text-[11px] font-bold text-rose-700 bg-rose-100 p-2 rounded-lg">
                ⚠️ Bloqueo de finalización: Resuelva la incidencia crítica/alta abierta para finalizar.
              </p>
            )}

            {orderWarranty && (
              <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1">
                <div className="flex justify-between font-bold text-emerald-900">
                  <span>Garantía Vigente hasta: {orderWarranty.endDate}</span>
                  <Badge variant="success" className="text-[10px]">{orderWarranty.status}</Badge>
                </div>
                <p className="text-[10px] text-slate-500">{orderWarranty.coverageDetails}</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
