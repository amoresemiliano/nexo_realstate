import {
  DomainEvent,
  AutomationRule,
  AutomationExecution,
  NotificationItem,
  AlertItem,
  SystemTask,
  ApprovalRequest,
  AuditEvent,
  UserRole
} from '../types';

export interface AutomationEngineState {
  rules: AutomationRule[];
  executions: AutomationExecution[];
  notifications: NotificationItem[];
  alerts: AlertItem[];
  tasks: SystemTask[];
  approvals: ApprovalRequest[];
  auditEvents: AuditEvent[];
}

// In-memory set for loop & deduplication protection
const processedEventIds = new Set<string>();

/**
 * Process a Domain Event through active automation rules
 */
export function processDomainEvent(
  event: DomainEvent,
  state: AutomationEngineState,
  currentActor: { userId: string; userName: string; userRole: UserRole }
): {
  state: AutomationEngineState;
  executedRuleNames: string[];
} {
  // Loop & Deduplication Protection
  if (processedEventIds.has(event.id)) {
    return { state, executedRuleNames: [] };
  }
  processedEventIds.add(event.id);

  const activeRules = state.rules.filter(
    r => r.status === 'ACTIVA' && r.triggerEvent === event.type
  );

  const updatedExecutions = [...state.executions];
  const updatedNotifications = [...state.notifications];
  const updatedAlerts = [...state.alerts];
  const updatedTasks = [...state.tasks];
  const updatedApprovals = [...state.approvals];
  const updatedAuditEvents = [...state.auditEvents];
  const updatedRules = [...state.rules];

  const executedRuleNames: string[] = [];

  for (const rule of activeRules) {
    // Check rule condition matching
    const matchesConditions = checkRuleConditions(rule, event);
    if (!matchesConditions) continue;

    const executionId = `exec-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const actionResults: { actionType: any; resultSummary: string; targetId?: string }[] = [];

    // Check if human approval is required
    const requiresApproval = rule.requiresHumanApproval;
    let approvalId: string | undefined = undefined;

    if (requiresApproval) {
      approvalId = `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newApproval: ApprovalRequest = {
        id: approvalId,
        title: `Revisión Humana Requerida: ${rule.name}`,
        description: `Regla de automatización '${rule.name}' requiere autorización para ejecutar decisiones sobre ${event.entityType} #${event.entityId}.`,
        type: rule.actions[0]?.approvalType || 'CAMBIO_COMERCIAL',
        requestedByUserId: currentActor.userId,
        requestedByUserName: currentActor.userName,
        requestedRole: currentActor.userRole,
        assignedRole: rule.responsibleRole,
        lotId: (event.payload?.lotId as string) || undefined,
        lotNumber: (event.payload?.lotNumber as string) || undefined,
        customerName: (event.payload?.customerName as string) || 'Cliente',
        impact: `Ejecución de ${rule.actions.length} acción(es) clave.`,
        status: 'PENDIENTE',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        automationRuleId: rule.id,
        domainEventId: event.id
      };

      updatedApprovals.unshift(newApproval);
      actionResults.push({
        actionType: 'REQUEST_APPROVAL',
        resultSummary: `Solicitud de Aprobación ${approvalId} enviada a ${rule.responsibleRole}`,
        targetId: approvalId
      });
    }

    // Execute actions if approval is NOT required (or queued for human approval)
    for (const act of rule.actions) {
      if (act.type === 'CREATE_TASK') {
        const taskId = `tsk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newTask: SystemTask = {
          id: taskId,
          title: act.title,
          description: act.description || `Generada automáticamente por regla: ${rule.name}`,
          category: mapCategoryToTaskCategory(rule.category),
          status: 'PENDIENTE',
          priority: act.priority || rule.priority,
          assignedRole: act.targetRole || rule.responsibleRole,
          lotId: (event.payload?.lotId as string) || undefined,
          lotNumber: (event.payload?.lotNumber as string) || undefined,
          customerName: (event.payload?.customerName as string) || undefined,
          entityType: event.entityType,
          entityId: event.entityId,
          dueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString().replace('T', ' ').slice(0, 16),
          createdByAutomationRuleId: rule.id
        };
        updatedTasks.unshift(newTask);
        actionResults.push({ actionType: 'CREATE_TASK', resultSummary: `Tarea ${taskId} asignada a ${newTask.assignedRole}`, targetId: taskId });
      }

      if (act.type === 'CREATE_ALERT') {
        const alertId = `alt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newAlert: AlertItem = {
          id: alertId,
          title: act.title,
          description: act.description || `Generada por evento ${event.type}`,
          category: mapCategoryToAlertCategory(rule.category),
          severity: mapPriorityToSeverity(act.priority || rule.priority),
          status: 'NUEVA',
          lotId: (event.payload?.lotId as string) || undefined,
          lotNumber: (event.payload?.lotNumber as string) || undefined,
          customerName: (event.payload?.customerName as string) || undefined,
          entityType: event.entityType,
          entityId: event.entityId,
          responsibleRole: act.targetRole || rule.responsibleRole,
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
        updatedAlerts.unshift(newAlert);
        actionResults.push({ actionType: 'CREATE_ALERT', resultSummary: `Alerta ${alertId} creada para ${newAlert.responsibleRole}`, targetId: alertId });
      }

      if (act.type === 'CREATE_NOTIFICATION') {
        const notifId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newNotif: NotificationItem = {
          id: notifId,
          role: act.targetRole || rule.responsibleRole,
          title: act.title,
          message: act.description || `Novedad sobre ${event.entityType} #${event.entityId}`,
          category: mapCategoryToNotificationCategory(rule.category),
          severity: mapPriorityToSeverity(act.priority || rule.priority),
          entityType: event.entityType,
          entityId: event.entityId,
          lotId: (event.payload?.lotId as string) || undefined,
          lotNumber: (event.payload?.lotNumber as string) || undefined,
          actionLabel: 'Ver Detalle',
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
        updatedNotifications.unshift(newNotif);
        actionResults.push({ actionType: 'CREATE_NOTIFICATION', resultSummary: `Notificación enviada a ${newNotif.role}`, targetId: notifId });
      }
    }

    // Record execution
    const execution: AutomationExecution = {
      id: executionId,
      automationRuleId: rule.id,
      ruleName: rule.name,
      domainEventId: event.id,
      domainEventType: event.type,
      status: requiresApproval ? 'ESPERANDO_APROBACION' : 'EJECUTADA',
      startedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      completedAt: requiresApproval ? undefined : new Date().toISOString().replace('T', ' ').slice(0, 16),
      actionResults,
      requiresApproval,
      approvalId
    };

    updatedExecutions.unshift(execution);

    // Update rule counters
    const ruleIdx = updatedRules.findIndex(r => r.id === rule.id);
    if (ruleIdx >= 0) {
      updatedRules[ruleIdx] = {
        ...updatedRules[ruleIdx],
        executionsCount: updatedRules[ruleIdx].executionsCount + 1,
        lastExecutedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    }

    // Register Audit Event
    updatedAuditEvents.unshift({
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userId: currentActor.userId,
      userName: currentActor.userName,
      userRole: currentActor.userRole,
      action: `EJECUCION_AUTOMATIZACION: ${rule.name}`,
      entityType: event.entityType,
      entityId: event.entityId,
      newState: execution.status,
      reason: `Disparado por evento ${event.type}`
    });

    executedRuleNames.push(rule.name);
  }

  return {
    state: {
      rules: updatedRules,
      executions: updatedExecutions,
      notifications: updatedNotifications,
      alerts: updatedAlerts,
      tasks: updatedTasks,
      approvals: updatedApprovals,
      auditEvents: updatedAuditEvents
    },
    executedRuleNames
  };
}

/**
 * Helper to check rule conditions against event payload
 */
function checkRuleConditions(rule: AutomationRule, event: DomainEvent): boolean {
  if (!rule.conditions || rule.conditions.length === 0) return true;

  for (const cond of rule.conditions) {
    const payloadValue = event.payload ? event.payload[cond.field] : undefined;
    if (payloadValue === undefined) continue;

    if (cond.operator === 'EQUALS' && payloadValue !== cond.value) return false;
    if (cond.operator === 'NOT_EQUALS' && payloadValue === cond.value) return false;
    if (cond.operator === 'GREATER_THAN' && Number(payloadValue) <= Number(cond.value)) return false;
    if (cond.operator === 'LESS_THAN' && Number(payloadValue) >= Number(cond.value)) return false;
  }

  return true;
}

/**
 * Helper to map priorities to Alert/Notification Severities
 */
function mapPriorityToSeverity(priority?: string): 'INFO' | 'ATENCION' | 'ALTA' | 'CRITICA' {
  switch (priority) {
    case 'CRITICA': return 'CRITICA';
    case 'ALTA': return 'ALTA';
    case 'MEDIA': return 'ATENCION';
    default: return 'INFO';
  }
}

/**
 * Approve a sensitive decision request
 */
export function approveHumanDecision(
  approvalId: string,
  param2: any,
  param3: any,
  param4: any,
  param5?: any,
  param6?: any
): AutomationEngineState {
  let actor = { userId: 'user-1', userName: 'Usuario', userRole: 'GERENCIA' as UserRole };
  let notes = '';
  let state: AutomationEngineState;

  if (typeof param2 === 'object' && param2 !== null && 'userId' in param2) {
    actor = param2;
    notes = param3 || '';
    state = param4;
  } else {
    actor = {
      userId: param2 || 'user-1',
      userName: param3 || 'Usuario',
      userRole: (param4 as UserRole) || 'GERENCIA'
    };
    notes = param5 || '';
    state = param6;
  }

  if (!state) return { rules: [], executions: [], notifications: [], alerts: [], tasks: [], approvals: [], auditEvents: [] };

  const approvalIdx = state.approvals.findIndex(a => a.id === approvalId);
  if (approvalIdx < 0) return state;

  const appObj = state.approvals[approvalIdx];
  const updatedApprovals = [...state.approvals];
  updatedApprovals[approvalIdx] = {
    ...appObj,
    status: 'APROBADO',
    resolvedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    resolvedByUserId: actor.userId,
    resolvedByUserName: actor.userName,
    resolutionNotes: notes || 'Aprobado mediante decisión humana explícita.'
  };

  // Update linked execution if present
  const updatedExecutions = state.executions.map(ex => {
    if (ex.approvalId === approvalId) {
      return {
        ...ex,
        status: 'EJECUTADA' as const,
        completedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        approvedByUserId: actor.userId,
        approvedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    }
    return ex;
  });

  // Audit event
  const updatedAuditEvents = [
    {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userId: actor.userId,
      userName: actor.userName,
      userRole: actor.userRole,
      action: `APROBACION_HUMANA: ${appObj.title}`,
      entityType: 'APPROVAL' as const,
      entityId: approvalId,
      previousState: 'PENDIENTE',
      newState: 'APROBADO',
      reason: notes || 'Decisión aprobada en Centro Operativo'
    },
    ...state.auditEvents
  ];

  return {
    ...state,
    approvals: updatedApprovals,
    executions: updatedExecutions,
    auditEvents: updatedAuditEvents
  };
}

/**
 * Reject a sensitive decision request
 */
export function rejectHumanDecision(
  approvalId: string,
  param2: any,
  param3: any,
  param4: any,
  param5?: any,
  param6?: any
): AutomationEngineState {
  let actor = { userId: 'user-1', userName: 'Usuario', userRole: 'GERENCIA' as UserRole };
  let notes = '';
  let state: AutomationEngineState;

  if (typeof param2 === 'object' && param2 !== null && 'userId' in param2) {
    actor = param2;
    notes = param3 || '';
    state = param4;
  } else {
    actor = {
      userId: param2 || 'user-1',
      userName: param3 || 'Usuario',
      userRole: (param4 as UserRole) || 'GERENCIA'
    };
    notes = param5 || '';
    state = param6;
  }

  if (!state) return { rules: [], executions: [], notifications: [], alerts: [], tasks: [], approvals: [], auditEvents: [] };

  const approvalIdx = state.approvals.findIndex(a => a.id === approvalId);
  if (approvalIdx < 0) return state;

  const appObj = state.approvals[approvalIdx];
  const updatedApprovals = [...state.approvals];
  updatedApprovals[approvalIdx] = {
    ...appObj,
    status: 'RECHAZADO',
    resolvedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    resolvedByUserId: actor.userId,
    resolvedByUserName: actor.userName,
    resolutionNotes: notes || 'Rechazado por decisión humana.'
  };

  const updatedExecutions = state.executions.map(ex => {
    if (ex.approvalId === approvalId) {
      return {
        ...ex,
        status: 'OMITIDA' as const,
        completedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    }
    return ex;
  });

  const updatedAuditEvents = [
    {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userId: actor.userId,
      userName: actor.userName,
      userRole: actor.userRole,
      action: `RECHAZO_HUMANO: ${appObj.title}`,
      entityType: 'APPROVAL' as const,
      entityId: approvalId,
      previousState: 'PENDIENTE',
      newState: 'RECHAZADO',
      reason: notes || 'Rechazado'
    },
    ...state.auditEvents
  ];

  return {
    ...state,
    approvals: updatedApprovals,
    executions: updatedExecutions,
    auditEvents: updatedAuditEvents
  };
}

// Category Mappers
function mapCategoryToTaskCategory(cat: string): any {
  switch (cat) {
    case 'COMERCIAL': case 'PREVENTA': return 'COMERCIAL';
    case 'COBRANZAS': return 'COBRANZAS';
    case 'LEGAL': case 'DOCUMENTAL': return 'LEGAL';
    case 'OBRAS': case 'TECNICO': return 'OBRAS';
    case 'PROVEEDORES': return 'PROVEEDORES';
    case 'POSTVENTA': case 'MANTENIMIENTO': return 'POSTVENTA';
    default: return 'ADMINISTRACION';
  }
}

function mapCategoryToAlertCategory(cat: string): any {
  switch (cat) {
    case 'COMERCIAL': case 'PREVENTA': return 'COMERCIAL';
    case 'COBRANZAS': return 'FINANCIERO';
    case 'LEGAL': case 'DOCUMENTAL': return 'LEGAL';
    case 'OBRAS': case 'TECNICO': return 'OBRAS';
    case 'PROVEEDORES': return 'PROVEEDORES';
    default: return 'SISTEMA';
  }
}

function mapCategoryToNotificationCategory(cat: string): any {
  switch (cat) {
    case 'COMERCIAL': case 'PREVENTA': return 'COMERCIAL';
    case 'COBRANZAS': return 'COBRANZAS';
    case 'LEGAL': case 'DOCUMENTAL': return 'LEGAL';
    case 'OBRAS': case 'TECNICO': case 'PROVEEDORES': return 'OBRAS';
    case 'RESERVAS': return 'RESERVAS';
    default: return 'ADMINISTRACION';
  }
}
