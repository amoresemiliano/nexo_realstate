import {
  Lot,
  Sale,
  WorkOrder,
  ServiceSubscription,
  PostSaleOpportunity,
  CommissionModel,
  Provider,
  WorkRequest,
  Incident,
  WorkMilestone,
  ServiceCategory
} from '../types';

/**
 * Motor de Oportunidades Postventa Simulado
 * Detecta automáticamente necesidades en lotes entregados u obras finalizadas.
 */
export function detectPostSaleOpportunities(
  lots: Lot[],
  sales: Sale[],
  workOrders: WorkOrder[],
  subscriptions: ServiceSubscription[],
  existingOpportunities: PostSaleOpportunity[]
): PostSaleOpportunity[] {
  const newOps: PostSaleOpportunity[] = [];
  const existingKeys = new Set(
    existingOpportunities.map(o => `${o.lotId}_${o.category}_${o.title}`)
  );

  const todayStr = new Date().toISOString().split('T')[0];

  lots.forEach(lot => {
    // Find sale or customer info
    const sale = sales.find(s => s.lotId === lot.id);
    const customerId = sale?.customerId || 'cust-1';
    const customerName = sale?.customerName || 'Titular de Lote';

    const lotWorks = workOrders.filter(w => w.lotId === lot.id);
    const lotSubs = subscriptions.filter(s => s.lotId === lot.id);

    // Rule 1: Delivered Lot without Fence -> Fence Opportunity
    const isDelivered = lot.status === 'ENTREGADO' || lot.status === 'VENDIDO';
    const hasFence = lotWorks.some(
      w => w.category === 'CERRAMIENTOS_LIMITES' || w.title.toLowerCase().includes('cerco')
    );

    if (isDelivered && !hasFence) {
      const key = `${lot.id}_CERRAMIENTOS_LIMITES_Cerco Perimetral y Portón`;
      if (!existingKeys.has(key)) {
        newOps.push({
          id: `op-auto-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          lotId: lot.id,
          lotNumber: lot.number,
          customerId,
          customerName,
          category: 'CERRAMIENTOS_LIMITES',
          title: 'Cerco Perimetral y Portón de Acceso',
          description: 'Lote entregado sin cerramiento detectado. Recomendado para delimitar la propiedad.',
          source: 'SISTEMA',
          status: 'DETECTADA',
          estimatedValue: 3500,
          currency: 'USD',
          detectedAt: todayStr,
          triggerReason: 'Lote marcado como entregado sin cerco perimetral registrado.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Rule 2: Delivered Lot without Terrain Clearing -> Clearing Opportunity
    const hasClearing = lotWorks.some(
      w => w.category === 'PREPARACION_TERRENO' || w.title.toLowerCase().includes('limpieza')
    );

    if (isDelivered && !hasClearing) {
      const key = `${lot.id}_PREPARACION_TERRENO_Limpieza y Nivelación de Terreno`;
      if (!existingKeys.has(key)) {
        newOps.push({
          id: `op-auto-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          lotId: lot.id,
          lotNumber: lot.number,
          customerId,
          customerName,
          category: 'PREPARACION_TERRENO',
          title: 'Limpieza, Desmonte y Nivelación de Terreno',
          description: 'Acondicionamiento inicial del terreno pre-construcción.',
          source: 'SISTEMA',
          status: 'DETECTADA',
          estimatedValue: 1800,
          currency: 'USD',
          detectedAt: todayStr,
          triggerReason: 'Lote entregado sin trabajos de movimiento de suelo realizados.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Rule 3: Finished Pool -> Pool Maintenance Recurring Subscription
    const finishedPoolWork = lotWorks.find(
      w => (w.category === 'EXTERIOR_PAISAJISMO' || w.title.toLowerCase().includes('piscina')) &&
        w.status === 'FINALIZADA'
    );
    const hasPoolSub = lotSubs.some(s => s.title.toLowerCase().includes('piscina'));

    if (finishedPoolWork && !hasPoolSub) {
      const key = `${lot.id}_SERVICIOS_RECURRENTES_Mantenimiento Mensual de Piscina`;
      if (!existingKeys.has(key)) {
        newOps.push({
          id: `op-auto-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          lotId: lot.id,
          lotNumber: lot.number,
          customerId,
          customerName,
          category: 'SERVICIOS_RECURRENTES',
          title: 'Mantenimiento Mensual de Piscina & Filtrado',
          description: 'Abono semanal/quincenal para tratamiento químico y limpieza de pileta.',
          source: 'SISTEMA',
          status: 'DETECTADA',
          estimatedValue: 180,
          currency: 'USD',
          detectedAt: todayStr,
          triggerReason: 'Obra de construcción de piscina finalizada con exito.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Rule 4: Finished Landscaping -> Gardening Subscription
    const finishedGardenWork = lotWorks.find(
      w => w.title.toLowerCase().includes('parquización') || w.title.toLowerCase().includes('césped')
    );
    const hasGardenSub = lotSubs.some(s => s.title.toLowerCase().includes('jardinería') || s.title.toLowerCase().includes('césped'));

    if (finishedGardenWork && !hasGardenSub) {
      const key = `${lot.id}_SERVICIOS_RECURRENTES_Jardinería Recurrente y Mantenimiento de Riego`;
      if (!existingKeys.has(key)) {
        newOps.push({
          id: `op-auto-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          lotId: lot.id,
          lotNumber: lot.number,
          customerId,
          customerName,
          category: 'SERVICIOS_RECURRENTES',
          title: 'Jardinería Recurrente y Mantenimiento de Riego',
          description: 'Corte de césped quincenal y calibración de sistema de riego automático.',
          source: 'SISTEMA',
          status: 'DETECTADA',
          estimatedValue: 120,
          currency: 'USD',
          detectedAt: todayStr,
          triggerReason: 'Parquización de terreno terminada.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  });

  return newOps;
}

/**
 * Calculador de Modelo Comercial y Margen
 */
export function calculateCommercialPricing(
  providerCost: number,
  model: CommissionModel = 'PERCENTAGE',
  rateOrFee: number = 10,
  overrideClientPrice?: number
) {
  let clientPrice = providerCost;
  let commissionAmount = 0;
  let marginAmount = 0;

  if (overrideClientPrice && overrideClientPrice > 0) {
    clientPrice = overrideClientPrice;
    marginAmount = clientPrice - providerCost;
    commissionAmount = marginAmount;
  } else {
    switch (model) {
      case 'PERCENTAGE':
        // Standard markup percentage e.g. 10%
        commissionAmount = Math.round(providerCost * (rateOrFee / 100));
        clientPrice = providerCost + commissionAmount;
        marginAmount = commissionAmount;
        break;
      case 'MARKUP':
        commissionAmount = Math.round(providerCost * (rateOrFee / 100));
        clientPrice = providerCost + commissionAmount;
        marginAmount = commissionAmount;
        break;
      case 'FIXED_FEE':
      case 'MANAGEMENT_FEE':
        commissionAmount = rateOrFee;
        clientPrice = providerCost + rateOrFee;
        marginAmount = rateOrFee;
        break;
      case 'NONE':
      default:
        clientPrice = providerCost;
        commissionAmount = 0;
        marginAmount = 0;
        break;
    }
  }

  return {
    providerCost,
    clientPrice,
    commissionAmount,
    marginAmount,
    model,
  };
}

/**
 * Reglas de Validación de Integridad Operativa
 */
export function validateWorkOrderStart(
  workRequest: WorkRequest,
  provider: Provider,
  existingOrders: WorkOrder[]
): { isValid: boolean; error?: string } {
  if (provider.status === 'SUSPENDIDO' || provider.status === 'INACTIVO') {
    return {
      isValid: false,
      error: `El proveedor ${provider.organizationName} se encuentra suspendido o inactivo.`,
    };
  }

  if (provider.documentationStatus === 'VENCIDA') {
    return {
      isValid: false,
      error: `El proveedor ${provider.organizationName} posee documentación requerida vencida (ART/Seguros).`,
    };
  }

  const hasDuplicate = existingOrders.some(
    o => o.workRequestId === workRequest.id && o.status !== 'CANCELADA' && o.status !== 'FINALIZADA'
  );

  if (hasDuplicate) {
    return {
      isValid: false,
      error: 'Ya existe una orden de trabajo activa para esta solicitud de servicio.',
    };
  }

  return { isValid: true };
}

export function validateWorkOrderCompletion(
  workOrder: WorkOrder,
  milestones: WorkMilestone[],
  incidents: Incident[]
): { canFinalize: boolean; blockReason?: string } {
  // Check open critical/high incidents
  const openCriticalIncidents = incidents.filter(
    i => i.workOrderId === workOrder.id &&
      (i.status === 'ABIERTA' || i.status === 'EN_ANALISIS' || i.status === 'EN_RESOLUCION') &&
      (i.severity === 'CRITICA' || i.severity === 'ALTA')
  );

  if (openCriticalIncidents.length > 0) {
    return {
      canFinalize: false,
      blockReason: `Imposible finalizar la obra: existen ${openCriticalIncidents.length} incidencia(s) críticas/altas pendientes de resolución.`,
    };
  }

  // Check milestones
  const orderMilestones = milestones.filter(m => m.workOrderId === workOrder.id);
  const incompleteMilestones = orderMilestones.filter(m => m.status !== 'COMPLETADO');

  if (orderMilestones.length > 0 && incompleteMilestones.length > 0) {
    return {
      canFinalize: false,
      blockReason: `Existen ${incompleteMilestones.length} hito(s) incompletos de la obra.`,
    };
  }

  return { canFinalize: true };
}
