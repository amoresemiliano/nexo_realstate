export type ModuleKey =
  | 'dashboard'
  | 'operational'
  | 'reports'
  | 'lots'
  | 'leads'
  | 'campaigns'
  | 'quotes'
  | 'reservations'
  | 'sales'
  | 'payments'
  | 'legal'
  | 'works'
  | 'automations'
  | 'developments';

export type PresetKey = 'CRM_OPERATIVO' | 'ETAPA_1_CLIENTE' | 'COMERCIAL_ONLY' | 'COBRANZAS_ONLY' | 'FULL_MVP' | 'CUSTOM';

export interface ModuleDefinition {
  key: ModuleKey;
  name: string;
  category: 'core' | 'commercial' | 'collections' | 'operations' | 'management';
  description: string;
  iconName: string;
}

export const MODULE_CATALOG: ModuleDefinition[] = [
  {
    key: 'dashboard',
    name: 'Dashboard & KPIs',
    category: 'core',
    description: 'Vista principal con métricas clave y tableros por rol',
    iconName: 'LayoutDashboard',
  },
  {
    key: 'lots',
    name: 'Lotes & Masterplan',
    category: 'commercial',
    description: 'Plano interactivo, disponibilidad y ficha técnica de lotes',
    iconName: 'MapPin',
  },
  {
    key: 'leads',
    name: 'CRM Leads & Pipeline',
    category: 'commercial',
    description: 'Gestión de prospectos, embudo de ventas y seguimiento SLA',
    iconName: 'Users',
  },
  {
    key: 'campaigns',
    name: 'Campañas de MKT',
    category: 'commercial',
    description: 'Rendimiento de canales y presupuesto publicitario',
    iconName: 'Target',
  },
  {
    key: 'quotes',
    name: 'Cotizador & Simulación',
    category: 'commercial',
    description: 'Generación de propuestas y simulación de planes de pago',
    iconName: 'Calculator',
  },
  {
    key: 'reservations',
    name: 'Bloqueos & Señas',
    category: 'commercial',
    description: 'Control de temporizadores de reserva y validación de seña',
    iconName: 'BookmarkCheck',
  },
  {
    key: 'sales',
    name: 'Ventas & Contratos',
    category: 'collections',
    description: 'Preparación de operaciones, boletos y asignación comercial',
    iconName: 'FileCheck',
  },
  {
    key: 'payments',
    name: 'Cobranzas & Cuotas',
    category: 'collections',
    description: 'Planes de pago, vencimientos, cobranza y gestión de mora',
    iconName: 'Wallet',
  },
  {
    key: 'reports',
    name: 'Reportes & Exportaciones',
    category: 'management',
    description: 'Informes ejecutivos, auditoría y exportación PDF/CSV',
    iconName: 'BarChart3',
  },
  {
    key: 'legal',
    name: 'Escrituración & Legales',
    category: 'operations',
    description: 'Gestión de legajos, trámites con escribanías y firmas',
    iconName: 'Scale',
  },
  {
    key: 'works',
    name: 'Obras, Proveedores & Posventa',
    category: 'operations',
    description: 'Avance físico, contratistas, órdenes de trabajo y garantías',
    iconName: 'HardHat',
  },
  {
    key: 'automations',
    name: 'Reglas de Automatización',
    category: 'operations',
    description: 'Motor de eventos, reglas automáticas y tareas asignadas',
    iconName: 'Zap',
  },
  {
    key: 'operational',
    name: 'Centro Operativo Multiactor',
    category: 'operations',
    description: 'Consola unificada de alertas, aprobaciones y supervisión',
    iconName: 'ShieldAlert',
  },
  {
    key: 'developments',
    name: 'Ficha del Desarrollo',
    category: 'management',
    description: 'Datos maestros del emprendimiento, infraestructura y etapas',
    iconName: 'Building',
  },
];

export type ModuleVisibilityConfig = Record<ModuleKey, boolean>;

export const PRESETS: Record<Exclude<PresetKey, 'CUSTOM'>, { name: string; description: string; config: ModuleVisibilityConfig }> = {
  CRM_OPERATIVO: {
    name: 'CRM Operativo (Fase P1D - Por Defecto DEV)',
    description: 'Alcance comercial consolidado: Dashboard Comercial, Leads, CRM Preventa, Campañas de MKT y Bloqueos/Señas.',
    config: {
      dashboard: true,
      leads: true,
      campaigns: true,
      reservations: true,
      quotes: false,
      lots: false,
      sales: false,
      payments: false,
      reports: false,
      legal: false,
      works: false,
      automations: false,
      operational: false,
      developments: false,
    },
  },
  ETAPA_1_CLIENTE: {
    name: 'Etapa 1 Cliente (Demo Extendida)',
    description: 'Enfoque Comercial + Cobranzas. Oculta Legales, Obras, Automatizaciones y Centro Operativo.',
    config: {
      dashboard: true,
      lots: true,
      leads: true,
      campaigns: true,
      quotes: true,
      reservations: true,
      sales: true,
      payments: true,
      reports: false,
      legal: false,
      works: false,
      automations: false,
      operational: false,
      developments: false,
    },
  },
  COMERCIAL_ONLY: {
    name: 'Solo Módulo Comercial Extendida',
    description: 'Muestra únicamente Captación, CRM, Masterplan, Cotizaciones y Señas.',
    config: {
      dashboard: true,
      lots: true,
      leads: true,
      campaigns: true,
      quotes: true,
      reservations: true,
      sales: false,
      payments: false,
      reports: false,
      legal: false,
      works: false,
      automations: false,
      operational: false,
      developments: false,
    },
  },
  COBRANZAS_ONLY: {
    name: 'Solo Módulo Cobranzas',
    description: 'Muestra únicamente Dashboard, Ventas y Planes de Cuotas & Mora.',
    config: {
      dashboard: true,
      lots: false,
      leads: false,
      campaigns: false,
      quotes: false,
      reservations: false,
      sales: true,
      payments: true,
      reports: false,
      legal: false,
      works: false,
      automations: false,
      operational: false,
      developments: false,
    },
  },
  FULL_MVP: {
    name: 'MVP Completo (Todos los Módulos)',
    description: 'Habilita la totalidad de las 14 áreas del sistema Nexo Desarrollos.',
    config: {
      dashboard: true,
      lots: true,
      leads: true,
      campaigns: true,
      quotes: true,
      reservations: true,
      sales: true,
      payments: true,
      reports: true,
      legal: true,
      works: true,
      automations: true,
      operational: true,
      developments: true,
    },
  },
};

/**
 * Flag centralizado para forzar el modo cliente estricto (CRM_OPERATIVO).
 * Prevalece sobre cualquier configuración previa o histórica en localStorage.
 * Para deshabilitar en el futuro y volver a permitir presets dinámicos, cambiar a false.
 */
export const ENFORCE_CLIENT_MODE = true;

const STORAGE_KEY_VISIBILITY = 'nexo-demo-module-visibility';
const STORAGE_KEY_PRESET = 'nexo-demo-module-preset';

export const getStoredVisibilityConfig = (): { config: ModuleVisibilityConfig; preset: PresetKey } => {
  if (ENFORCE_CLIENT_MODE) {
    return {
      config: { ...PRESETS.CRM_OPERATIVO.config },
      preset: 'CRM_OPERATIVO',
    };
  }

  try {
    const storedConfig = localStorage.getItem(STORAGE_KEY_VISIBILITY);
    const storedPreset = localStorage.getItem(STORAGE_KEY_PRESET) as PresetKey | null;

    if (storedConfig) {
      const parsed = JSON.parse(storedConfig) as ModuleVisibilityConfig;
      // Ensure all keys exist
      const fullConfig = { ...PRESETS.CRM_OPERATIVO.config, ...parsed };
      return {
        config: fullConfig,
        preset: storedPreset || 'CUSTOM',
      };
    }
  } catch (e) {
    console.warn('Error loading module visibility config from localStorage:', e);
  }

  return {
    config: { ...PRESETS.CRM_OPERATIVO.config },
    preset: 'CRM_OPERATIVO',
  };
};

export const saveVisibilityConfig = (config: ModuleVisibilityConfig, preset: PresetKey) => {
  if (ENFORCE_CLIENT_MODE) {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY_VISIBILITY, JSON.stringify(config));
    localStorage.setItem(STORAGE_KEY_PRESET, preset);
  } catch (e) {
    console.warn('Error saving module visibility config to localStorage:', e);
  }
};
