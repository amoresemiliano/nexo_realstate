import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  AutomationRule,
  AutomationExecution,
  DomainEventType,
  AutomationCategory,
  UserRole
} from '../../types';
import {
  Zap,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Plus,
  Play,
  Pause,
  Copy,
  Eye,
  Filter,
  RefreshCw,
  Search,
  CheckSquare,
  Bell,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AutomationsModuleProps {
  rules: AutomationRule[];
  executions: AutomationExecution[];
  onToggleRuleStatus: (ruleId: string) => void;
  onDuplicateRule: (ruleId: string) => void;
  onCreateRule: (rule: Partial<AutomationRule>) => void;
  onTriggerEvent: (type: DomainEventType, payload?: Record<string, unknown>) => void;
  onOpenMultiActorWalkthrough: () => void;
  onOpenEscalationWalkthrough: () => void;
}

export const AutomationsModule: React.FC<AutomationsModuleProps> = ({
  rules,
  executions,
  onToggleRuleStatus,
  onDuplicateRule,
  onCreateRule,
  onTriggerEvent,
  onOpenMultiActorWalkthrough,
  onOpenEscalationWalkthrough
}) => {
  const [activeTab, setActiveTab] = useState<'RULES' | 'EXECUTIONS' | 'SIMULATOR'>('RULES');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRuleDetail, setSelectedRuleDetail] = useState<AutomationRule | null>(null);
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);

  // New Rule Form State
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<AutomationCategory>('COMERCIAL');
  const [newRuleTrigger, setNewRuleTrigger] = useState<DomainEventType>('LeadCreated');
  const [newRuleRole, setNewRuleRole] = useState<UserRole>('VENDEDOR');
  const [newRuleHumanApproval, setNewRuleHumanApproval] = useState(false);

  // Filters
  const filteredRules = rules.filter(r => {
    const matchesCat = selectedCategory === 'TODAS' || r.category === selectedCategory;
    const matchesQuery =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleCreateNewRule = () => {
    if (!newRuleName.trim()) return;
    const ruleObj: Partial<AutomationRule> = {
      name: newRuleName,
      description: newRuleDesc || 'Regla personalizada de automatización.',
      category: newRuleCategory,
      triggerEvent: newRuleTrigger,
      conditions: [{ field: 'status', operator: 'EQUALS', value: 'ACTIVO', description: 'Regla activa por defecto' }],
      actions: [
        { type: 'CREATE_TASK', title: `Seguimiento de ${newRuleName}`, priority: 'MEDIA', targetRole: newRuleRole }
      ],
      status: 'ACTIVA',
      requiresHumanApproval: newRuleHumanApproval,
      priority: 'MEDIA',
      responsibleRole: newRuleRole
    };
    onCreateRule(ruleObj);
    setShowNewRuleModal(false);
    setNewRuleName('');
    setNewRuleDesc('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-xl">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Motor de Reglas & Automatizaciones</h2>
              <p className="text-xs text-slate-500">
                Orquestador de eventos de negocio, tareas automáticas y validación Human-in-the-Loop
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenMultiActorWalkthrough}
            className="text-xs border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" /> Demo Multiactor
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowNewRuleModal(true)}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold"
          >
            <Plus className="w-4 h-4 mr-1" /> Nueva Regla
          </Button>
        </div>
      </div>

      {/* SENSITIVE DECISION BANNER */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h3 className="font-black text-amber-950">Gobernanza & Decisiones Sensibles</h3>
          <p className="text-[11px] text-amber-900 leading-relaxed">
            Las decisiones comerciales, financieras o contractuales de alto impacto (rescisión, liberación de unidad, refinanciación) no se ejecutan automáticamente. Generan recomendaciones y requieren validación humana explícita.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('RULES')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'RULES'
              ? 'border-amber-600 text-amber-900 bg-amber-50/60 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Reglas Configurada ({rules.length})
        </button>

        <button
          onClick={() => setActiveTab('EXECUTIONS')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'EXECUTIONS'
              ? 'border-amber-600 text-amber-900 bg-amber-50/60 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Historial de Ejecuciones ({executions.length})
        </button>

        <button
          onClick={() => setActiveTab('SIMULATOR')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'SIMULATOR'
              ? 'border-amber-600 text-amber-900 bg-amber-50/60 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Play className="w-3.5 h-3.5 text-emerald-600" /> Simulador de Eventos
        </button>
      </div>

      {/* TAB 1: REGLAS DE AUTOMATIZACIÓN */}
      {activeTab === 'RULES' && (
        <div className="space-y-3">
          {/* SEARCH & CATEGORY FILTERS */}
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar reglas por nombre, disparador o descripción..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {['TODAS', 'COMERCIAL', 'PREVENTA', 'RESERVAS', 'COBRANZAS', 'LEGAL', 'OBRAS', 'POSTVENTA'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
                    selectedCategory === cat ? 'bg-amber-600 text-white font-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* RULES LIST */}
          <div className="space-y-3">
            {filteredRules.map(r => (
              <Card key={r.id} padding="md" className="space-y-3 hover:border-amber-300 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm" className="text-[10px] font-bold">
                        {r.category}
                      </Badge>
                      <Badge variant={r.status === 'ACTIVA' ? 'success' : 'default'} size="sm">
                        {r.status}
                      </Badge>
                      {r.requiresHumanApproval && (
                        <Badge variant="purple" size="sm" className="text-[10px]">
                          Requiere Aprobación Humana
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-sm font-black text-slate-900">{r.name}</h3>
                    <span className="text-xs text-amber-700 font-semibold block">
                      CUANDO ocurra: <strong>{r.triggerEvent}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleRuleStatus(r.id)}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                        r.status === 'ACTIVA' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                      title={r.status === 'ACTIVA' ? 'Pausar Regla' : 'Activar Regla'}
                    >
                      {r.status === 'ACTIVA' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onDuplicateRule(r.id)}
                      className="p-1.5 rounded-lg text-slate-500 bg-slate-100 hover:bg-slate-200"
                      title="Duplicar Regla"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedRuleDetail(r)}
                      className="p-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200"
                      title="Ver Estructura Lógica"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {r.description}
                </p>

                {/* DETALLE ESTRUCTURAL CUANDO / SI / ENTONCES */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] bg-slate-100/60 p-2.5 rounded-xl border border-slate-200/60">
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[9px]">SI (Condición)</span>
                    <span className="font-semibold text-slate-800">
                      {r.conditions?.[0]?.description || 'Sin restricción adicional'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[9px]">ENTONCES (Acción)</span>
                    <span className="font-semibold text-slate-800">
                      {r.actions?.[0]?.title || 'Generar Tarea / Notificación'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[9px]">RESPONSABLE</span>
                    <span className="font-semibold text-slate-800">{r.responsibleRole}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Ejecuciones acumuladas: <strong>{r.executionsCount}</strong></span>
                  <span>Última ejecución: {r.lastExecutedAt || 'Sin registros'}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HISTORIAL DE EJECUCIONES */}
      {activeTab === 'EXECUTIONS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" /> Log Inmutable de Ejecuciones del Motor
            </span>
            <Badge variant="outline" size="sm">{executions.length} Registradas</Badge>
          </div>

          <div className="space-y-2">
            {executions.map(ex => (
              <Card key={ex.id} padding="md" className="space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Badge
                        variant={ex.status === 'EJECUTADA' ? 'success' : ex.status === 'ESPERANDO_APROBACION' ? 'purple' : 'warning'}
                        size="sm"
                      >
                        {ex.status}
                      </Badge>
                      <span className="text-[10px] text-slate-500 font-bold">{ex.domainEventType}</span>
                    </div>
                    <h3 className="text-xs font-black text-slate-900">{ex.ruleName}</h3>
                  </div>
                  <span className="text-[10px] text-slate-400">{ex.startedAt}</span>
                </div>

                <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Resultados de Acción:</span>
                  {ex.actionResults.map((act, i) => (
                    <div key={i} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                      <ArrowRight className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{act.resultSummary}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SIMULADOR DE EVENTOS DE NEGOCIO */}
      {activeTab === 'SIMULATOR' && (
        <div className="space-y-4">
          <Card padding="md" className="bg-emerald-50/50 border-emerald-200 space-y-3">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-xs font-black text-emerald-950">Simulador Manual de Eventos de Dominio</h3>
                <p className="text-[11px] text-emerald-800">
                  Dispara eventos en tiempo real para verificar la reacción del motor, la generación de tareas, alertas y solicitudes de aprobación.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {[
                { type: 'LeadUncontacted' as DomainEventType, label: 'Lead Inactivo > 15m', role: 'VENDEDOR', desc: 'Dispara alerta comercial e ignición de tarea rápida' },
                { type: 'DepositReported' as DomainEventType, label: 'Comprobante de Seña Subido', role: 'TESORERIA', desc: 'Solicita aprobación de Tesorería' },
                { type: 'InstallmentOverdue' as DomainEventType, label: 'Cuota en Mora (5d)', role: 'ADMINISTRACION', desc: 'Crea tarea de contacto de cobranza' },
                { type: 'BalancePaidOff' as DomainEventType, label: 'Inmueble Cancelado (Saldo 0)', role: 'LEGAL', desc: 'Dispara checklist de Escrituración' },
                { type: 'LotDelivered' as DomainEventType, label: 'Lote Entregado Sin Cerco', role: 'POSTVENTA', desc: 'Crea oportunidad comercial de Cerramiento' },
                { type: 'WorkCompleted' as DomainEventType, label: 'Obra 100% Finalizada', role: 'OBRAS', desc: 'Activa garantía 24m y notifica propietario' }
              ].map(btn => (
                <button
                  key={btn.type}
                  onClick={() => onTriggerEvent(btn.type, { lotNumber: 'A-4', customerName: 'Martín Peralta', amountUSD: 1500 })}
                  className="p-3 bg-white hover:bg-emerald-100/50 border border-emerald-200 rounded-xl text-left space-y-1 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{btn.label}</span>
                    <Badge variant="outline" size="sm" className="text-[9px]">{btn.type}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">{btn.desc}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* RULE DETAIL MODAL */}
      {selectedRuleDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card padding="lg" className="w-full max-w-lg bg-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <Badge variant="outline" size="sm" className="mb-1">{selectedRuleDetail.category}</Badge>
                <h3 className="text-sm font-black text-slate-900">{selectedRuleDetail.name}</h3>
              </div>
              <button onClick={() => setSelectedRuleDetail(null)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/80 space-y-1">
                <span className="font-extrabold text-amber-950 uppercase text-[10px] block">CUANDO (Evento Disparador)</span>
                <span className="text-slate-800 font-bold">{selectedRuleDetail.triggerEvent}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-500 uppercase text-[10px] block">SI (Condiciones)</span>
                {selectedRuleDetail.conditions.map((c, i) => (
                  <div key={i} className="text-slate-800">
                    • {c.description || `${c.field} ${c.operator} ${c.value}`}
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-500 uppercase text-[10px] block">ENTONCES (Acciones Simuladas)</span>
                {selectedRuleDetail.actions.map((a, i) => (
                  <div key={i} className="text-slate-800">
                    • <strong>[{a.type}]</strong> {a.title} ({a.targetRole || 'Rol Generico'})
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl">
                <span>Intervención Humana:</span>
                <strong className={selectedRuleDetail.requiresHumanApproval ? 'text-purple-700' : 'text-slate-700'}>
                  {selectedRuleDetail.requiresHumanApproval ? 'OBLIGATORIA (Aprobación Requerida)' : 'AUTOMATIZADA'}
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedRuleDetail(null)}>
                Cerrar Ventana
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* NEW RULE MODAL */}
      {showNewRuleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card padding="lg" className="w-full max-w-md bg-white space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-slate-900">Crear Nueva Regla de Automatización</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre de la Regla</label>
                <input
                  type="text"
                  value={newRuleName}
                  onChange={e => setNewRuleName(e.target.value)}
                  placeholder="Ej: Alerta por Seña sin Comprobante en 24h"
                  className="w-full p-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                <select
                  value={newRuleCategory}
                  onChange={e => setNewRuleCategory(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                >
                  <option value="COMERCIAL">COMERCIAL</option>
                  <option value="PREVENTA">PREVENTA</option>
                  <option value="RESERVAS">RESERVAS</option>
                  <option value="COBRANZAS">COBRANZAS</option>
                  <option value="LEGAL">LEGAL</option>
                  <option value="DOCUMENTAL">DOCUMENTAL</option>
                  <option value="OBRAS">OBRAS</option>
                  <option value="POSTVENTA">POSTVENTA</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rol Responsable</label>
                <select
                  value={newRuleRole}
                  onChange={e => setNewRuleRole(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-xl"
                >
                  <option value="VENDEDOR">VENDEDOR (Comercial)</option>
                  <option value="ADMINISTRACION">ADMINISTRACION</option>
                  <option value="TESORERIA">TESORERIA</option>
                  <option value="LEGAL">LEGAL</option>
                  <option value="OBRAS">OBRAS</option>
                  <option value="GERENCIA">GERENCIA</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chkHuman"
                  checked={newRuleHumanApproval}
                  onChange={e => setNewRuleHumanApproval(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="chkHuman" className="font-bold text-slate-800">
                  ¿Requiere aprobación humana obligatoria?
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setShowNewRuleModal(false)}>
                Cancelar
              </Button>

              <Button variant="primary" size="sm" onClick={handleCreateNewRule} className="bg-amber-600 hover:bg-amber-700 text-white">
                Guardar Regla
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
