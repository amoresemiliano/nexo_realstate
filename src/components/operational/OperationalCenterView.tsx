import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  UserRole,
  SystemTask,
  AlertItem,
  ApprovalRequest,
  NotificationItem,
  AuditEvent,
  AutomationRule
} from '../../types';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  Zap,
  AlertTriangle,
  UserCheck,
  Building,
  CheckSquare,
  FileText,
  Scale,
  DollarSign,
  HardHat,
  ChevronRight,
  Filter,
  Check,
  X,
  Eye,
  RefreshCw,
  Bell,
  Sparkles
} from 'lucide-react';

interface OperationalCenterViewProps {
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  tasks: SystemTask[];
  alerts: AlertItem[];
  approvals: ApprovalRequest[];
  notifications: NotificationItem[];
  auditEvents: AuditEvent[];
  rules: AutomationRule[];
  onCompleteTask: (taskId: string) => void;
  onResolveAlert: (alertId: string, note: string) => void;
  onApproveDecision: (approvalId: string, note: string) => void;
  onRejectDecision: (approvalId: string, note: string) => void;
  onNavigateModule: (moduleKey: string) => void;
  onTriggerDemoWalkthrough: () => void;
  onTriggerEscalationDemo: () => void;
  onResetDemoData: () => void;
}

export const OperationalCenterView: React.FC<OperationalCenterViewProps> = ({
  userRole,
  onSelectRole,
  tasks,
  alerts,
  approvals,
  notifications,
  auditEvents,
  rules,
  onCompleteTask,
  onResolveAlert,
  onApproveDecision,
  onRejectDecision,
  onNavigateModule,
  onTriggerDemoWalkthrough,
  onTriggerEscalationDemo,
  onResetDemoData
}) => {
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<string>('TODAS');
  const [alertFilterSeverity, setAlertFilterSeverity] = useState<string>('TODAS');
  const [activeTab, setActiveTab] = useState<'PRIORITARIO' | 'TAREAS' | 'ALERTAS' | 'APROBACIONES' | 'AUDITORIA'>('PRIORITARIO');
  const [resolutionNotesModal, setResolutionNotesModal] = useState<{ id: string; type: 'ALERT' | 'APPROVE' | 'REJECT' } | null>(null);
  const [noteText, setNoteText] = useState('');

  // Role Mappings
  const roleLabels: Record<UserRole, string> = {
    COMERCIAL: 'Comercial & Ventas',
    VENDEDOR: 'Vendedor Comercial',
    ADMINISTRACION: 'Administración & Cobranzas',
    ADMIN: 'Administrador Sistema',
    GERENTE_COMERCIAL: 'Gerencia Comercial',
    SUPERVISOR: 'Supervisión Comercial',
    TESORERIA: 'Tesorería & Pagos',
    LEGAL: 'Legal & Escribanía',
    OBRAS: 'Obras & Proveedores',
    GERENCIA: 'Gerencia General',
    CLIENTE: 'Cliente / Propietario'
  };

  // Role Filtering
  const filterByRole = <T extends { assignedRole?: UserRole; responsibleRole?: UserRole; role?: UserRole }>(items: T[]) => {
    if (userRole === 'GERENCIA') return items;
    return items.filter(
      item =>
        item.assignedRole === userRole ||
        item.responsibleRole === userRole ||
        item.role === userRole ||
        !item.assignedRole
    );
  };

  const roleTasks = filterByRole(tasks);
  const roleAlerts = filterByRole(alerts);
  const roleApprovals = filterByRole(approvals);
  const roleNotifications = filterByRole(notifications);

  // Critical urgent items for Priority 1
  const criticalAlerts = roleAlerts.filter(a => a.severity === 'CRITICA' && a.status !== 'RESUELTA');
  const urgentTasks = roleTasks.filter(t => t.priority === 'CRITICA' && t.status !== 'COMPLETADA');
  const pendingApprovals = roleApprovals.filter(ap => ap.status === 'PENDIENTE');

  // Handle modal submit
  const handleConfirmAction = () => {
    if (!resolutionNotesModal) return;
    if (resolutionNotesModal.type === 'ALERT') {
      onResolveAlert(resolutionNotesModal.id, noteText || 'Resuelta desde Centro Operativo');
    } else if (resolutionNotesModal.type === 'APPROVE') {
      onApproveDecision(resolutionNotesModal.id, noteText || 'Aprobado en Centro Operativo');
    } else if (resolutionNotesModal.type === 'REJECT') {
      onRejectDecision(resolutionNotesModal.id, noteText || 'Rechazado en Centro Operativo');
    }
    setResolutionNotesModal(null);
    setNoteText('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* HEADER OPERATIVO MOBILE-FIRST */}
      <Card padding="md" className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <h1 className="text-base font-black tracking-tight text-white">Centro Operativo Multiactor</h1>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Panel unificado de control de eventos, alertas, tareas y decisiones humanas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onTriggerDemoWalkthrough}
              className="bg-amber-500/20 text-amber-200 border-amber-500/40 hover:bg-amber-500/30 text-xs py-1"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300" />
              Demo Multiactor
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onTriggerEscalationDemo}
              className="bg-rose-500/20 text-rose-200 border-rose-500/40 hover:bg-rose-500/30 text-xs py-1"
            >
              <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-300" />
              Demo Escalamiento
            </Button>
          </div>
        </div>

        {/* ROLE SELECTOR */}
        <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" /> Vista Activa por Rol:
          </span>

          <div className="flex flex-wrap gap-1">
            {(['VENDEDOR', 'ADMINISTRACION', 'TESORERIA', 'LEGAL', 'OBRAS', 'GERENCIA'] as UserRole[]).map(r => (
              <button
                key={r}
                onClick={() => onSelectRole(r)}
                className={`text-[10px] font-extrabold px-2 py-1 rounded-lg transition-all ${
                  userRole === r
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {roleLabels[r]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* QUICK SUMMARY METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Card padding="sm" className="bg-rose-50/70 border-rose-200 space-y-1">
          <span className="text-[10px] font-black uppercase text-rose-700 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Requieren Atención
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-black text-rose-950">{criticalAlerts.length + pendingApprovals.length}</span>
            <Badge variant="danger" size="sm" className="text-[9px]">Urgente</Badge>
          </div>
        </Card>

        <Card padding="sm" className="bg-amber-50/70 border-amber-200 space-y-1">
          <span className="text-[10px] font-black uppercase text-amber-800 flex items-center gap-1">
            <CheckSquare className="w-3.5 h-3.5 text-amber-600" /> Mis Tareas
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-black text-amber-950">{roleTasks.filter(t => t.status !== 'COMPLETADA').length}</span>
            <Badge variant="warning" size="sm" className="text-[9px]">{urgentTasks.length} Críticas</Badge>
          </div>
        </Card>

        <Card padding="sm" className="bg-purple-50/70 border-purple-200 space-y-1">
          <span className="text-[10px] font-black uppercase text-purple-800 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-purple-600" /> Aprobaciones
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-black text-purple-950">{pendingApprovals.length}</span>
            <Badge variant="purple" size="sm" className="text-[9px]">Human Decision</Badge>
          </div>
        </Card>

        <Card padding="sm" className="bg-sky-50/70 border-sky-200 space-y-1">
          <span className="text-[10px] font-black uppercase text-sky-800 flex items-center gap-1">
            <Bell className="w-3.5 h-3.5 text-sky-600" /> Alertas
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-black text-sky-950">{roleAlerts.filter(a => a.status !== 'RESUELTA').length}</span>
            <Badge variant="info" size="sm" className="text-[9px]">Activas</Badge>
          </div>
        </Card>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {[
          { id: 'PRIORITARIO', label: '¿Qué Requiere Atención?', icon: ShieldAlert, badge: criticalAlerts.length + pendingApprovals.length },
          { id: 'TAREAS', label: 'Mis Tareas', icon: CheckSquare, badge: roleTasks.filter(t => t.status !== 'COMPLETADA').length },
          { id: 'ALERTAS', label: 'Centro de Alertas', icon: Bell, badge: roleAlerts.filter(a => a.status !== 'RESUELTA').length },
          { id: 'APROBACIONES', label: 'Aprobaciones', icon: Zap, badge: pendingApprovals.length },
          { id: 'AUDITORIA', label: 'Auditoría & Trazabilidad', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold whitespace-nowrap rounded-t-xl transition-all border-b-2 ${
                isActive
                  ? 'border-amber-600 text-amber-900 bg-amber-50/50 font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {!!tab.badge && tab.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRIORITARIO — ¿QUÉ REQUIERE ATENCIÓN AHORA? */}
      {activeTab === 'PRIORITARIO' && (
        <div className="space-y-4">
          {/* PRIORIDAD 1: APROBACIONES PENDIENTES */}
          {pendingApprovals.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-purple-900 tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-600" /> Decisiones Sensibles Pendientes de Aprobación ({pendingApprovals.length})
                </span>
                <Badge variant="purple" size="sm">Human-in-the-Loop</Badge>
              </div>

              <div className="space-y-2">
                {pendingApprovals.map(app => (
                  <Card key={app.id} padding="md" className="bg-purple-50/40 border-purple-200 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant="purple" size="sm" className="text-[10px] mb-1">{app.type}</Badge>
                        <h3 className="text-xs font-black text-slate-900">{app.title}</h3>
                        <p className="text-xs text-slate-600 mt-0.5">{app.description}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{app.createdAt}</span>
                    </div>

                    <div className="bg-purple-100/60 p-2 rounded-lg text-[11px] text-purple-950 font-medium border border-purple-200">
                      <strong>Impacto de la decisión:</strong> {app.impact}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[10px] text-slate-500">
                        Solicitado por: <strong>{app.requestedByUserName}</strong> ({app.requestedRole})
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setResolutionNotesModal({ id: app.id, type: 'REJECT' })}
                          className="text-xs py-1 px-2.5 bg-rose-100 text-rose-800 hover:bg-rose-200"
                        >
                          <X className="w-3.5 h-3.5 mr-1 text-rose-600" />
                          Rechazar
                        </Button>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setResolutionNotesModal({ id: app.id, type: 'APPROVE' })}
                          className="text-xs py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Aprobar Decision
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* PRIORIDAD 2: ALERTAS CRÍTICAS */}
          {criticalAlerts.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-rose-900 tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> Alertas Críticas e Incidencias Grave ({criticalAlerts.length})
              </span>

              <div className="space-y-2">
                {criticalAlerts.map(alt => (
                  <Card key={alt.id} padding="md" className="bg-rose-50/50 border-rose-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="danger" size="sm">CRÍTICA</Badge>
                        <span className="text-xs font-black text-rose-950">{alt.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{alt.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-700">{alt.description}</p>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-500 font-medium">Responsable: <strong>{alt.responsibleRole}</strong></span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setResolutionNotesModal({ id: alt.id, type: 'ALERT' })}
                        className="text-xs py-1 bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        Resolver Alerta
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* PRIORIDAD 3: TAREAS URGENTES DEL ROL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-amber-600" /> Mis Tareas Prioritarias
              </span>
              <button onClick={() => setActiveTab('TAREAS')} className="text-xs font-bold text-amber-700 hover:underline">
                Ver todas ({roleTasks.length}) &rarr;
              </button>
            </div>

            {roleTasks.filter(t => t.status !== 'COMPLETADA').length === 0 ? (
              <Card padding="md" className="text-center py-6 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                ¡Al día! No tienes tareas pendientes prioritarias en tu área.
              </Card>
            ) : (
              <div className="space-y-2">
                {roleTasks
                  .filter(t => t.status !== 'COMPLETADA')
                  .slice(0, 4)
                  .map(tsk => (
                    <Card key={tsk.id} padding="sm" className="flex items-center justify-between gap-2 hover:border-amber-300">
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => onCompleteTask(tsk.id)}
                          className="mt-0.5 text-slate-300 hover:text-emerald-600 transition-colors"
                          title="Marcar como completada"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">{tsk.title}</span>
                            <Badge variant={tsk.priority === 'CRITICA' ? 'danger' : tsk.priority === 'ALTA' ? 'warning' : 'default'} size="sm">
                              {tsk.priority}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{tsk.description}</p>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {tsk.dueAt || 'Hoy'}
                      </span>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TAREAS MULTIACTOR */}
      {activeTab === 'TAREAS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filtrar por Área:
            </span>
            <div className="flex gap-1">
              {['TODAS', 'COMERCIAL', 'ADMINISTRACION', 'COBRANZAS', 'LEGAL', 'OBRAS', 'POSTVENTA'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedTaskCategory(cat)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                    selectedTaskCategory === cat ? 'bg-amber-600 text-white font-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {roleTasks
              .filter(t => selectedTaskCategory === 'TODAS' || t.category === selectedTaskCategory)
              .map(tsk => (
                <Card key={tsk.id} padding="md" className={`space-y-2 border-l-4 ${
                  tsk.status === 'COMPLETADA' ? 'border-l-emerald-500 bg-slate-50/50' : tsk.priority === 'CRITICA' ? 'border-l-rose-500' : 'border-l-amber-500'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => onCompleteTask(tsk.id)}
                        className={`mt-0.5 transition-colors ${tsk.status === 'COMPLETADA' ? 'text-emerald-600' : 'text-slate-300 hover:text-emerald-600'}`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <div>
                        <h3 className={`text-xs font-black ${tsk.status === 'COMPLETADA' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {tsk.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">{tsk.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={tsk.status === 'COMPLETADA' ? 'success' : tsk.priority === 'CRITICA' ? 'danger' : 'warning'} size="sm">
                        {tsk.status === 'COMPLETADA' ? 'COMPLETADA' : tsk.priority}
                      </Badge>
                      <span className="text-[10px] text-slate-400">{tsk.dueAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Asignado a: <strong>{tsk.assignedUserName || tsk.assignedRole || 'Rol'}</strong></span>
                    {tsk.status !== 'COMPLETADA' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onCompleteTask(tsk.id)}
                        className="text-[11px] py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200"
                      >
                        <Check className="w-3 h-3 mr-1" /> Marcar Realizada
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: CENTRO DE ALERTAS */}
      {activeTab === 'ALERTAS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-sky-600" /> Alertas del Sistema ({roleAlerts.length})
            </span>

            <div className="flex gap-1 text-[10px]">
              {['TODAS', 'CRITICA', 'ALTA', 'ATENCION', 'INFO'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setAlertFilterSeverity(sev)}
                  className={`px-2 py-0.5 rounded font-bold ${
                    alertFilterSeverity === sev ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {roleAlerts
              .filter(a => alertFilterSeverity === 'TODAS' || a.severity === alertFilterSeverity)
              .map(alt => (
                <Card key={alt.id} padding="md" className={`space-y-2 border-l-4 ${
                  alt.severity === 'CRITICA' ? 'border-l-rose-500 bg-rose-50/20' : alt.severity === 'ALTA' ? 'border-l-amber-500' : 'border-l-sky-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge variant={alt.severity === 'CRITICA' ? 'danger' : alt.severity === 'ALTA' ? 'warning' : 'info'} size="sm">
                          {alt.severity}
                        </Badge>
                        <Badge variant="outline" size="sm" className="text-[10px]">{alt.category}</Badge>
                      </div>
                      <h3 className="text-xs font-black text-slate-900">{alt.title}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">{alt.description}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">{alt.createdAt}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-500">Estado: <strong className="text-slate-800">{alt.status}</strong></span>
                    {alt.status !== 'RESUELTA' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setResolutionNotesModal({ id: alt.id, type: 'ALERT' })}
                        className="text-[11px] py-1 bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Gestionar / Resolver
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: APROBACIONES SENSIBLES */}
      {activeTab === 'APROBACIONES' && (
        <div className="space-y-3">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-950 flex items-start gap-2">
            <Zap className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-purple-950">Principio Human-in-the-Loop</h3>
              <p className="text-[11px] text-purple-800 mt-0.5">
                Las decisiones financieras, comerciales o legales críticas (como rescisión de contratos, devolución de señas, o liberación extraordinaria de unidades) no se ejecutan automáticamente. Requieren validación humana explícita.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {roleApprovals.map(app => (
              <Card key={app.id} padding="md" className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Badge variant={app.status === 'PENDIENTE' ? 'purple' : app.status === 'APROBADO' ? 'success' : 'danger'} size="sm">
                        {app.status}
                      </Badge>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{app.type}</span>
                    </div>
                    <h3 className="text-xs font-black text-slate-900">{app.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{app.description}</p>
                  </div>
                  <span className="text-[10px] text-slate-400">{app.createdAt}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-800 font-medium">
                  <strong>Efecto e Impacto:</strong> {app.impact}
                </div>

                {app.status === 'PENDIENTE' ? (
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setResolutionNotesModal({ id: app.id, type: 'REJECT' })}
                      className="text-xs py-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200"
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Rechazar
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setResolutionNotesModal({ id: app.id, type: 'APPROVE' })}
                      className="text-xs py-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Aprobar Solicitud
                    </Button>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 bg-slate-100 p-2 rounded-lg">
                    Resuelto por <strong>{app.resolvedByUserName}</strong> el {app.resolvedAt}: "{app.resolutionNotes}"
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDITORÍA & LOG DE TRAZABILIDAD */}
      {activeTab === 'AUDITORIA' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-700" /> Registro Inmutable de Auditoría
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onResetDemoData}
              className="text-[11px] py-1 border-rose-200 text-rose-700 hover:bg-rose-50"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Resetear Demostración
            </Button>
          </div>

          <div className="space-y-2">
            {auditEvents.map(evt => (
              <Card key={evt.id} padding="sm" className="text-xs space-y-1 bg-slate-50/80 border-slate-200">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-black text-slate-900">{evt.action}</span>
                  <span className="text-slate-400 text-[10px]">{evt.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-600">{evt.reason}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>Usuario: <strong>{evt.userName}</strong> ({evt.userRole})</span>
                  <span>Entidad: {evt.entityType} #{evt.entityId}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* RESOLUTION / ACTION MODAL */}
      {resolutionNotesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card padding="lg" className="w-full max-w-md bg-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                {resolutionNotesModal.type === 'ALERT' && <Bell className="w-4 h-4 text-amber-600" />}
                {resolutionNotesModal.type === 'APPROVE' && <Check className="w-4 h-4 text-emerald-600" />}
                {resolutionNotesModal.type === 'REJECT' && <X className="w-4 h-4 text-rose-600" />}
                {resolutionNotesModal.type === 'ALERT' ? 'Resolver Alerta del Sistema' : resolutionNotesModal.type === 'APPROVE' ? 'Aprobar Decisión Sensible' : 'Rechazar Solicitud'}
              </h3>
              <button onClick={() => setResolutionNotesModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Observaciones y Justificación de Auditoría</label>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Ingresa la nota o justificación requerida para el registro..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 h-24"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setResolutionNotesModal(null)}>
                Cancelar
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmAction}
                className={resolutionNotesModal.type === 'REJECT' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}
              >
                Confirmar Registro
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
