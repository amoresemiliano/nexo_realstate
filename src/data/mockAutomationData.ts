import {
  AutomationRule,
  DomainEvent,
  AutomationExecution,
  NotificationItem,
  AlertItem,
  SystemTask,
  ApprovalRequest,
  AuditEvent
} from '../types';

export const mockAutomationRules: AutomationRule[] = [
  // 1. COMERCIAL
  {
    id: 'rule-com-01',
    name: 'Atención Temprana de Leads Nuevos',
    description: 'Si un lead recién creado no recibe contacto en 15 minutos, dispara alerta y asigna tarea de contacto inmediato al vendedor.',
    category: 'COMERCIAL',
    triggerEvent: 'LeadCreated',
    conditions: [
      { field: 'elapsedMinutes', operator: 'GREATER_THAN', value: 15, description: 'Más de 15 minutos sin primer contacto' }
    ],
    actions: [
      { type: 'CREATE_ALERT', title: 'Lead Inactivo > 15min', priority: 'ALTA', targetRole: 'VENDEDOR' },
      { type: 'CREATE_TASK', title: 'Contactar Lead Inmediato', priority: 'ALTA', targetRole: 'VENDEDOR' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: false,
    priority: 'ALTA',
    responsibleRole: 'VENDEDOR',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 18,
    lastExecutedAt: '2026-08-07 08:45'
  },
  {
    id: 'rule-com-02',
    name: 'Alerta de Lead Estancado (48hs)',
    description: 'Genera tarea de reactivación si un lead calificado no registra actividades en 48 horas.',
    category: 'COMERCIAL',
    triggerEvent: 'LeadUncontacted',
    conditions: [
      { field: 'elapsedHours', operator: 'GREATER_THAN', value: 48, description: 'Sin actividad en 48 horas' }
    ],
    actions: [
      { type: 'CREATE_TASK', title: 'Recontactar Lead Calificado', priority: 'MEDIA', targetRole: 'VENDEDOR' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: false,
    priority: 'MEDIA',
    responsibleRole: 'VENDEDOR',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 12,
    lastExecutedAt: '2026-08-06 14:20'
  },

  // 2. PREVENTA / COTIZACIONES
  {
    id: 'rule-prev-01',
    name: 'Seguimiento de Cotización Enviada (72hs)',
    description: 'Si una cotización enviada no recibe respuesta en 72 horas, genera tarea de llamada de consulta y feedback.',
    category: 'PREVENTA',
    triggerEvent: 'QuoteSent',
    conditions: [
      { field: 'elapsedHours', operator: 'GREATER_THAN', value: 72, description: 'Sin respuesta tras 72hs' }
    ],
    actions: [
      { type: 'CREATE_TASK', title: 'Seguimiento de Cotización Enviada', priority: 'MEDIA', targetRole: 'VENDEDOR' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: false,
    priority: 'MEDIA',
    responsibleRole: 'VENDEDOR',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 9,
    lastExecutedAt: '2026-08-05 16:10'
  },

  // 3. RESERVAS & BLOQUEOS
  {
    id: 'rule-res-01',
    name: 'Alerta por Vencimiento Inminente de Bloqueo (2hs antes)',
    description: 'Avisa al vendedor 2 horas antes de que venza un bloqueo temporal para solicitar seña o liberar la unidad.',
    category: 'RESERVAS',
    triggerEvent: 'HoldExpiring',
    conditions: [
      { field: 'remainingHours', operator: 'LESS_THAN', value: 2, description: 'Menos de 2hs para el vencimiento' }
    ],
    actions: [
      { type: 'CREATE_ALERT', title: 'Bloqueo a punto de vencer', priority: 'ALTA', targetRole: 'VENDEDOR' },
      { type: 'CREATE_NOTIFICATION', title: 'Notificación de Liberación Próxima', priority: 'ALTA', targetRole: 'VENDEDOR' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: true,
    priority: 'ALTA',
    responsibleRole: 'VENDEDOR',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 24,
    lastExecutedAt: '2026-08-07 07:30'
  },
  {
    id: 'rule-res-02',
    name: 'Validación Human-in-the-loop de Señas Ingresadas',
    description: 'Toda seña/depósito informado requiere aprobación explicita de Tesorería/Administración antes de confirmar la reserva.',
    category: 'RESERVAS',
    triggerEvent: 'DepositReported',
    conditions: [
      { field: 'status', operator: 'EQUALS', value: 'INFORMADO', description: 'Comprobante subido por comercial' }
    ],
    actions: [
      { type: 'REQUEST_APPROVAL', title: 'Aprobación de Comprobante de Seña', priority: 'ALTA', targetRole: 'TESORERIA', approvalType: 'SEÑA' },
      { type: 'CREATE_TASK', title: 'Validar Transferencia / Cobro en Banco', priority: 'ALTA', targetRole: 'TESORERIA' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: true,
    priority: 'CRITICA',
    responsibleRole: 'TESORERIA',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 15,
    lastExecutedAt: '2026-08-07 09:00'
  },

  // 4. COBRANZAS
  {
    id: 'rule-cob-01',
    name: 'Recordatorio Pre-Vencimiento de Cuota (5 días antes)',
    description: 'Prepara comunicación automática y alerta preventiva para el comprador 5 días antes del vencimiento.',
    category: 'COBRANZAS',
    triggerEvent: 'InstallmentDueSoon',
    conditions: [
      { field: 'daysUntilDue', operator: 'EQUALS', value: 5, description: 'Faltan 5 días para vencer' }
    ],
    actions: [
      { type: 'PREPARE_COMMUNICATION', title: 'Recordatorio Amigable de Cuota', priority: 'BAJA', targetRole: 'ADMINISTRACION' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: false,
    priority: 'BAJA',
    responsibleRole: 'ADMINISTRACION',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 42,
    lastExecutedAt: '2026-08-06 09:00'
  },
  {
    id: 'rule-cob-02',
    name: 'Gestión de Cuota Vencida (5 días de mora)',
    description: 'Al cumplirse 5 días de mora, asigna tarea de contacto directo para cobranza preventiva.',
    category: 'COBRANZAS',
    triggerEvent: 'InstallmentOverdue',
    conditions: [
      { field: 'daysOverdue', operator: 'GREATER_THAN', value: 5, description: '5 días de atraso en cuota' }
    ],
    actions: [
      { type: 'CREATE_TASK', title: 'Contacto por Mora Inicial (5d)', priority: 'MEDIA', targetRole: 'ADMINISTRACION' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: false,
    priority: 'MEDIA',
    responsibleRole: 'ADMINISTRACION',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 11,
    lastExecutedAt: '2026-08-06 11:30'
  },
  {
    id: 'rule-cob-03',
    name: 'Escalamiento por Mora Crítica (3 cuotas / >90 días)',
    description: 'Al superar 3 cuotas impagas o 90 días, eleva alerta crítica y sugiere evaluación legal sin aplicar decisiones punitivas automáticas.',
    category: 'COBRANZAS',
    triggerEvent: 'InstallmentOverdue',
    conditions: [
      { field: 'overdueCount', operator: 'GREATER_THAN', value: 2, description: '3 o más cuotas en mora' }
    ],
    actions: [
      { type: 'CREATE_ALERT', title: 'Mora Crítica — Evaluación Contractual', priority: 'CRITICA', targetRole: 'LEGAL' },
      { type: 'SUGGEST_STATUS_CHANGE', title: 'Sugerir Revisión Jurídica', priority: 'ALTA', targetRole: 'LEGAL' },
      { type: 'REQUEST_APPROVAL', title: 'Aprobación Human-in-the-Loop para Gestión Judicial', priority: 'CRITICA', targetRole: 'GERENCIA', approvalType: 'RESCISION' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: true,
    priority: 'CRITICA',
    responsibleRole: 'LEGAL',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 3,
    lastExecutedAt: '2026-08-04 15:00'
  },

  // 5. LEGAL Y DOCUMENTAL
  {
    id: 'rule-leg-01',
    name: 'Control Documental Incompleto pre-Boleto',
    description: 'Genera tarea al gestor legal si falta DNI o comprobante de domicilio a menos de 48hs de la firma.',
    category: 'DOCUMENTAL',
    triggerEvent: 'DocumentMissing',
    conditions: [
      { field: 'requiredFor', operator: 'EQUALS', value: 'BOLETO', description: 'Requerido para Boleto de Compraventa' }
    ],
    actions: [
      { type: 'CREATE_TASK', title: 'Reclamar Documento Faltante al Cliente', priority: 'ALTA', targetRole: 'LEGAL' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: false,
    priority: 'ALTA',
    responsibleRole: 'LEGAL',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 8,
    lastExecutedAt: '2026-08-07 08:10'
  },
  {
    id: 'rule-leg-02',
    name: 'Pase a Checklist de Escrituración tras Saldo Cero',
    description: 'Al registrarse la cancelación total de cuotas, inicia checklist automático de escrituración e informa al comprador.',
    category: 'LEGAL',
    triggerEvent: 'BalancePaidOff',
    conditions: [
      { field: 'outstandingBalance', operator: 'EQUALS', value: 0, description: 'Saldo impago igual a 0' }
    ],
    actions: [
      { type: 'CREATE_CHECKLIST', title: 'Checklist Apertura Legajo Escritura', priority: 'ALTA', targetRole: 'LEGAL' },
      { type: 'CREATE_NOTIFICATION', title: 'Inmueble Cancelado Económicamente', priority: 'INFO', targetRole: 'VENDEDOR' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: false,
    priority: 'ALTA',
    responsibleRole: 'LEGAL',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 5,
    lastExecutedAt: '2026-08-02 12:00'
  },

  // 6. OBRAS, PROVEEDORES & POSTVENTA
  {
    id: 'rule-obr-01',
    name: 'Detección Automática de Cerco Perimetral Post-Entrega',
    description: 'Si un lote es entregado y no posee obra de cerramiento registrada, crea oportunidad comercial de postventa.',
    category: 'POSTVENTA',
    triggerEvent: 'LotDelivered',
    conditions: [
      { field: 'hasFence', operator: 'EQUALS', value: false, description: 'Lote entregado sin cerco olímpico' }
    ],
    actions: [
      { type: 'CREATE_OPPORTUNITY', title: 'Ofrecer Cerco Perimetral Olímpico', priority: 'MEDIA', targetRole: 'VENDEDOR' },
      { type: 'CREATE_TASK', title: 'Presentar Catálogo de Cerramientos a Propietario', priority: 'MEDIA', targetRole: 'VENDEDOR' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: false,
    priority: 'MEDIA',
    responsibleRole: 'VENDEDOR',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 7,
    lastExecutedAt: '2026-08-05 10:00'
  },
  {
    id: 'rule-obr-02',
    name: 'Activación Automática de Garantía 24 Meses',
    description: 'Al completarse el acta de entrega final de obra, activa la garantía escrita por 24 meses y notifica al propietario.',
    category: 'OBRAS',
    triggerEvent: 'WorkCompleted',
    conditions: [
      { field: 'progress', operator: 'EQUALS', value: 100, description: 'Obra 100% finalizada y certificada' }
    ],
    actions: [
      { type: 'CREATE_NOTIFICATION', title: 'Acta Emitida & Garantía Activa (24m)', priority: 'INFO', targetRole: 'OBRAS' },
      { type: 'CREATE_OPPORTUNITY', title: 'Ofrecer Plan Recurrente de Mantenimiento', priority: 'BAJA', targetRole: 'VENDEDOR' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: false,
    priority: 'MEDIA',
    responsibleRole: 'OBRAS',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 4,
    lastExecutedAt: '2026-08-06 17:00'
  },
  {
    id: 'rule-obr-03',
    name: 'Escalamiento por Incidencia Técnica Crítica',
    description: 'Ante el reporte de una incidencia severa/crítica en obra, notifica inmediatamente al Administrador de Barrio e Ingenería.',
    category: 'OBRAS',
    triggerEvent: 'CriticalIncidentOpened',
    conditions: [
      { field: 'severity', operator: 'EQUALS', value: 'CRITICA', description: 'Incidencia de alta gravedad' }
    ],
    actions: [
      { type: 'CREATE_ALERT', title: 'Incidencia Crítica en Obra', priority: 'CRITICA', targetRole: 'OBRAS' },
      { type: 'CREATE_TASK', title: 'Inspección de Emergencia en Terreno', priority: 'CRITICA', targetRole: 'OBRAS' }
    ],
    status: 'ACTIVA',
    requiresHumanApproval: true,
    priority: 'CRITICA',
    responsibleRole: 'OBRAS',
    createdAt: '2026-08-01 08:00',
    updatedAt: '2026-08-01 08:00',
    executionsCount: 2,
    lastExecutedAt: '2026-08-03 14:00'
  }
];

export const mockDomainEvents: DomainEvent[] = [
  {
    id: 'evt-101',
    type: 'LeadUncontacted',
    entityType: 'LEAD',
    entityId: 'lead-01',
    occurredAt: '2026-08-07 08:30',
    actorUserId: 'usr-com-1',
    actorUserName: 'Gonzalo Rossi',
    actorRole: 'VENDEDOR',
    payload: { leadName: 'Carolina Varela', phone: '+54 9 11 1234 5678', elapsedMinutes: 25 },
    processedAt: '2026-08-07 08:31'
  },
  {
    id: 'evt-102',
    type: 'DepositReported',
    entityType: 'RESERVATION',
    entityId: 'dep-901',
    occurredAt: '2026-08-07 09:00',
    actorUserId: 'usr-com-2',
    actorUserName: 'Valentín Paz',
    actorRole: 'VENDEDOR',
    payload: { lotNumber: 'A-4', amountUSD: 1500, customerName: 'Martín Peralta', receiptRef: 'TRF-98214' },
    processedAt: '2026-08-07 09:01'
  },
  {
    id: 'evt-103',
    type: 'InstallmentOverdue',
    entityType: 'INSTALLMENT',
    entityId: 'inst-302',
    occurredAt: '2026-08-06 11:00',
    actorUserId: 'system',
    actorUserName: 'Motor de Automatización',
    actorRole: 'ADMINISTRACION',
    payload: { lotNumber: 'B-2', customerName: 'Jorge Albarracín', daysOverdue: 12, amountUSD: 450 },
    processedAt: '2026-08-06 11:01'
  },
  {
    id: 'evt-104',
    type: 'WorkCompleted',
    entityType: 'WORK_ORDER',
    entityId: 'wo-01',
    occurredAt: '2026-08-05 16:00',
    actorUserId: 'usr-obr-1',
    actorUserName: 'Ing. Gonzalo Bunge',
    actorRole: 'OBRAS',
    payload: { lotNumber: 'A-4', workTitle: 'Cerco Perimetral Olímpico', providerName: 'Cerramientos & Rejas del Valle' },
    processedAt: '2026-08-05 16:05'
  }
];

export const mockAutomationExecutions: AutomationExecution[] = [
  {
    id: 'exec-501',
    automationRuleId: 'rule-com-01',
    ruleName: 'Atención Temprana de Leads Nuevos',
    domainEventId: 'evt-101',
    domainEventType: 'LeadUncontacted',
    status: 'EJECUTADA',
    startedAt: '2026-08-07 08:31',
    completedAt: '2026-08-07 08:31',
    actionResults: [
      { actionType: 'CREATE_ALERT', resultSummary: 'Alerta generada para Gonzalo Rossi (Vendedor)', targetId: 'alt-801' },
      { actionType: 'CREATE_TASK', resultSummary: 'Tarea creada: Contactar urgente a Carolina Varela', targetId: 'tsk-201' }
    ]
  },
  {
    id: 'exec-502',
    automationRuleId: 'rule-res-02',
    ruleName: 'Validación Human-in-the-loop de Señas Ingresadas',
    domainEventId: 'evt-102',
    domainEventType: 'DepositReported',
    status: 'ESPERANDO_APROBACION',
    startedAt: '2026-08-07 09:01',
    approvalId: 'app-301',
    requiresApproval: true,
    actionResults: [
      { actionType: 'REQUEST_APPROVAL', resultSummary: 'Solicitud de Aprobación #app-301 enviada a Tesorería', targetId: 'app-301' }
    ]
  },
  {
    id: 'exec-503',
    automationRuleId: 'rule-cob-02',
    ruleName: 'Gestión de Cuota Vencida (5 días de mora)',
    domainEventId: 'evt-103',
    domainEventType: 'InstallmentOverdue',
    status: 'EJECUTADA',
    startedAt: '2026-08-06 11:01',
    completedAt: '2026-08-06 11:01',
    actionResults: [
      { actionType: 'CREATE_TASK', resultSummary: 'Tarea de Cobranza preventiva asignada a Administración', targetId: 'tsk-202' }
    ]
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-01',
    role: 'VENDEDOR',
    title: 'NUEVO LEAD SIN ATENCIÓN',
    message: 'El lead Carolina Varela lleva más de 20 minutos sin contacto.',
    category: 'COMERCIAL',
    severity: 'ALTA',
    entityType: 'LEAD',
    entityId: 'lead-01',
    actionLabel: 'Ver Lead',
    actionModule: 'leads',
    createdAt: '2026-08-07 08:31'
  },
  {
    id: 'notif-02',
    role: 'TESORERIA',
    title: 'COMPROBANTE DE SEÑA INGRESADO',
    message: 'Nevo comprobante de $1.500 USD subido para Lote A-4 (Martín Peralta). Requiere validación bancaria.',
    category: 'ADMINISTRACION',
    severity: 'ALTA',
    entityType: 'RESERVATION',
    entityId: 'dep-901',
    lotId: 'lot-a4',
    lotNumber: 'A-4',
    actionLabel: 'Validar Seña',
    actionModule: 'reservations',
    createdAt: '2026-08-07 09:01'
  },
  {
    id: 'notif-03',
    role: 'LEGAL',
    title: 'DOCUMENTACIÓN COMPLETA PARA ESCRITURA',
    message: 'El legajo de Lote A-1 (Gonzalo Rossi) completó todos los certificados requeridos.',
    category: 'LEGAL',
    severity: 'INFO',
    entityType: 'LOT',
    entityId: 'lot-a1',
    lotId: 'lot-a1',
    lotNumber: 'A-1',
    actionLabel: 'Revisar Legajo',
    actionModule: 'legal',
    createdAt: '2026-08-06 15:30'
  },
  {
    id: 'notif-04',
    role: 'OBRAS',
    title: 'OBRA FINALIZADA Y ACTA EMITIDA',
    message: 'Cerramientos & Rejas del Valle finalizó la obra de cerramiento en Lote A-4. Se activó garantía de 24 meses.',
    category: 'OBRAS',
    severity: 'INFO',
    entityType: 'WORK_ORDER',
    entityId: 'wo-01',
    lotId: 'lot-a4',
    lotNumber: 'A-4',
    actionLabel: 'Ver Obra',
    actionModule: 'works',
    createdAt: '2026-08-05 16:05'
  }
];

export const mockAlerts: AlertItem[] = [
  {
    id: 'alt-101',
    title: 'Lead Caliente sin Contactar (>20m)',
    description: 'El lead Carolina Varela (Presupuesto $35k USD) no ha sido contactado.',
    category: 'COMERCIAL',
    severity: 'ALTA',
    status: 'NUEVA',
    entityType: 'LEAD',
    entityId: 'lead-01',
    customerName: 'Carolina Varela',
    responsibleRole: 'VENDEDOR',
    createdAt: '2026-08-07 08:31'
  },
  {
    id: 'alt-102',
    title: 'Bloqueo Temporal A-2 por Vencer en 1 hora',
    description: 'El bloqueo para Lucía Fernández vence a las 10:30 hs. Debe cargarse seña o se liberará.',
    category: 'COMERCIAL',
    severity: 'ALTA',
    status: 'EN_GESTION',
    lotId: 'lot-a2',
    lotNumber: 'A-2',
    customerName: 'Lucía Fernández',
    responsibleRole: 'VENDEDOR',
    createdAt: '2026-08-07 07:30'
  },
  {
    id: 'alt-103',
    title: 'Mora en Plan de Financiación (12d)',
    description: 'Lote B-2 (Jorge Albarracín) registra 12 días de mora en la Cuota #4.',
    category: 'FINANCIERO',
    severity: 'ATENCION',
    status: 'NUEVA',
    lotId: 'lot-b2',
    lotNumber: 'B-2',
    customerName: 'Jorge Albarracín',
    responsibleRole: 'ADMINISTRACION',
    createdAt: '2026-08-06 11:00'
  },
  {
    id: 'alt-104',
    title: 'Escritura Demorada — Falta Certificado Inhibición',
    description: 'Trámite de escritura Lote A-4 demorado por retraso en el Registro de la Propiedad.',
    category: 'LEGAL',
    severity: 'ATENCION',
    status: 'EN_GESTION',
    lotId: 'lot-a4',
    lotNumber: 'A-4',
    customerName: 'Martín Peralta',
    responsibleRole: 'LEGAL',
    createdAt: '2026-08-04 10:00'
  }
];

export const mockSystemTasks: SystemTask[] = [
  {
    id: 'tsk-201',
    title: 'Llamada de Primer Contacto — Lead Carolina Varela',
    description: 'Inquirió por Lote A-1 vía Google Search. Preferencia llamado telefónico.',
    category: 'COMERCIAL',
    status: 'PENDIENTE',
    priority: 'ALTA',
    assignedRole: 'VENDEDOR',
    assignedUserName: 'Gonzalo Rossi',
    entityType: 'LEAD',
    entityId: 'lead-01',
    customerName: 'Carolina Varela',
    dueAt: '2026-08-07 10:00',
    createdByAutomationRuleId: 'rule-com-01'
  },
  {
    id: 'tsk-202',
    title: 'Validar Transferencia de Seña $1.500 USD (Lote A-4)',
    description: 'Verificar en homebanking crédito de transferencia ref TRF-98214.',
    category: 'ADMINISTRACION',
    status: 'PENDIENTE',
    priority: 'CRITICA',
    assignedRole: 'TESORERIA',
    assignedUserName: 'María Marta Castro',
    lotId: 'lot-a4',
    lotNumber: 'A-4',
    customerName: 'Martín Peralta',
    entityType: 'RESERVATION',
    entityId: 'dep-901',
    dueAt: '2026-08-07 12:00',
    createdByAutomationRuleId: 'rule-res-02'
  },
  {
    id: 'tsk-203',
    title: 'Gestión Telefónica de Mora Cuota #4 (Jorge Albarracín)',
    description: 'Acordar fecha de pago o evaluar propuesta de promesa de pago.',
    category: 'COBRANZAS',
    status: 'EN_CURSO',
    priority: 'MEDIA',
    assignedRole: 'ADMINISTRACION',
    assignedUserName: 'Esteban Busto',
    lotId: 'lot-b2',
    lotNumber: 'B-2',
    customerName: 'Jorge Albarracín',
    entityType: 'INSTALLMENT',
    entityId: 'inst-302',
    dueAt: '2026-08-07 18:00',
    createdByAutomationRuleId: 'rule-cob-02'
  },
  {
    id: 'tsk-204',
    title: 'Coordinar Turno de Firma en Escribanía (Lote A-1)',
    description: 'Contactar al comprador para definir hora de firma presencial del Boleto.',
    category: 'LEGAL',
    status: 'PENDIENTE',
    priority: 'ALTA',
    assignedRole: 'LEGAL',
    assignedUserName: 'Dra. María Elena San Martín',
    lotId: 'lot-a1',
    lotNumber: 'A-1',
    customerName: 'Gonzalo Rossi',
    entityType: 'LEGAL_PROCESS',
    entityId: 'leg-01',
    dueAt: '2026-08-08 11:00'
  },
  {
    id: 'tsk-205',
    title: 'Inspección Final de Cerco Perimetral (Lote A-4)',
    description: 'Verificar tensión de malla olímpica y colocación de postes de hormigón.',
    category: 'OBRAS',
    status: 'COMPLETADA',
    priority: 'MEDIA',
    assignedRole: 'OBRAS',
    assignedUserName: 'Ing. Gonzalo Bunge',
    lotId: 'lot-a4',
    lotNumber: 'A-4',
    customerName: 'Martín Peralta',
    entityType: 'WORK_ORDER',
    entityId: 'wo-01',
    dueAt: '2026-08-05 17:00',
    completedAt: '2026-08-05 16:00'
  }
];

export const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: 'app-301',
    title: 'Validación de Seña $1.500 USD en Banco — Lote A-4',
    description: 'Comercial ingresó comprobante de transferencia bancaria de $1.500 USD para la Reserva de Lote A-4.',
    type: 'SEÑA',
    requestedByUserId: 'usr-com-2',
    requestedByUserName: 'Valentín Paz',
    requestedRole: 'VENDEDOR',
    assignedRole: 'TESORERIA',
    lotId: 'lot-a4',
    lotNumber: 'A-4',
    customerName: 'Martín Peralta',
    impact: 'Al aprobar, se confirma formalmente la Reserva y el lote cambia a estado RESERVADO.',
    status: 'PENDIENTE',
    createdAt: '2026-08-07 09:01',
    automationRuleId: 'rule-res-02',
    domainEventId: 'evt-102'
  },
  {
    id: 'app-302',
    title: 'Refinanciación de Plan en Mora 60 días — Lote B-2',
    description: 'Solicitud de reestructuración de deuda en 6 cuotas adicionales con actualización por índice CAC.',
    type: 'REFINANCIACION',
    requestedByUserId: 'usr-adm-1',
    requestedByUserName: 'Esteban Busto',
    requestedRole: 'ADMINISTRACION',
    assignedRole: 'GERENCIA',
    lotId: 'lot-b2',
    lotNumber: 'B-2',
    customerName: 'Jorge Albarracín',
    impact: 'Modifica condiciones contractuales sin rescindir contrato.',
    status: 'PENDIENTE',
    createdAt: '2026-08-06 16:20'
  },
  {
    id: 'app-303',
    title: 'Liberación Extraordinaria de Bloqueo — Lote B-1',
    description: 'Solicitud para extender por 24hs adicionales el bloqueo vencido para cierre de operación.',
    type: 'LIBERACION_EXTRAORDINARIA',
    requestedByUserId: 'usr-com-1',
    requestedByUserName: 'Gonzalo Rossi',
    requestedRole: 'VENDEDOR',
    assignedRole: 'GERENCIA',
    lotId: 'lot-b1',
    lotNumber: 'B-1',
    customerName: 'Martina Ríos',
    impact: 'Retiene el lote bloqueado impidiendo reservarlo a otro interesado.',
    status: 'APROBADO',
    createdAt: '2026-08-05 10:00',
    resolvedAt: '2026-08-05 10:15',
    resolvedByUserId: 'usr-ger-1',
    resolvedByUserName: 'Lic. Matías Bunge',
    resolutionNotes: 'Aprobado por ser cliente referida premium con anticipo en mano.'
  }
];

export const mockAuditEvents: AuditEvent[] = [
  {
    id: 'aud-001',
    timestamp: '2026-08-07 09:01',
    userId: 'usr-com-2',
    userName: 'Valentín Paz',
    userRole: 'VENDEDOR',
    action: 'REGISTRO_SEÑA',
    entityType: 'RESERVATION',
    entityId: 'dep-901',
    previousState: 'SEÑA_PROMETIDA',
    newState: 'INFORMADO',
    reason: 'Comprobante de transferencia bancaria adjuntado por comercial.'
  },
  {
    id: 'aud-002',
    timestamp: '2026-08-06 11:01',
    userId: 'system',
    userName: 'Motor de Automatización',
    userRole: 'ADMINISTRACION',
    action: 'MORA_DETECTADA',
    entityType: 'INSTALLMENT',
    entityId: 'inst-302',
    previousState: 'AL_DIA',
    newState: 'EN_MORA',
    reason: 'Cumplido plazo de vencimiento de 5 días.'
  },
  {
    id: 'aud-003',
    timestamp: '2026-08-05 16:05',
    userId: 'usr-obr-1',
    userName: 'Ing. Gonzalo Bunge',
    userRole: 'OBRAS',
    action: 'FINALIZACION_OBRA',
    entityType: 'WORK_ORDER',
    entityId: 'wo-01',
    previousState: 'EN_EJECUCION',
    newState: 'FINALIZADA',
    reason: 'Inspección aprobada y acta firmada.'
  }
];
