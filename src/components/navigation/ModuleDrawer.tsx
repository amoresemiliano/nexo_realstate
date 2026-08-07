import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Users,
  Target,
  Calculator,
  BookmarkCheck,
  FileCheck,
  Wallet,
  Scale,
  HardHat,
  Zap,
  Building,
  X,
  ChevronRight,
  ShieldAlert,
  BarChart3,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockAlerts } from '../../data/mockData';

interface ModuleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
  onResetDemo?: () => void;
}

export const ModuleDrawer: React.FC<ModuleDrawerProps> = ({
  isOpen,
  onClose,
  activeModule,
  onSelectModule,
  onResetDemo,
}) => {
  const modulesGrouped = [
    {
      group: 'Centro Operativo & Control',
      items: [
        { id: 'operational', name: 'Centro Operativo Multiactor', icon: ShieldAlert, badge: 'EN VIVO' },
        { id: 'dashboard', name: 'Dashboards por Rol', icon: LayoutDashboard, badge: null },
        { id: 'reports', name: 'Reportes & Exportaciones', icon: BarChart3, badge: 'PDF/CSV' },
      ]
    },
    {
      group: 'Gestión Comercial & Preventa',
      items: [
        { id: 'lots', name: 'Lotes & Masterplan', icon: MapPin, badge: '50 Lotes' },
        { id: 'leads', name: 'CRM Leads & Pipeline', icon: Users, badge: '64 Nuevos' },
        { id: 'campaigns', name: 'Campañas de MKT', icon: Target, badge: '3 Activas' },
        { id: 'quotes', name: 'Cotizador & Simulación', icon: Calculator, badge: null },
      ]
    },
    {
      group: 'Cierre, Reserva & Cobranzas',
      items: [
        { id: 'reservations', name: 'Bloqueos & Señas', icon: BookmarkCheck, badge: `${mockAlerts.length} Alertas` },
        { id: 'sales', name: 'Ventas & Contratos', icon: FileCheck, badge: null },
        { id: 'payments', name: 'Planes de Cuotas & Mora', icon: Wallet, badge: '1 Vencida' },
      ]
    },
    {
      group: 'Legales & Posventa',
      items: [
        { id: 'legal', name: 'Escrituración & Legales', icon: Scale, badge: null },
        { id: 'works', name: 'Avance de Obras', icon: HardHat, badge: '4 Obras' },
        { id: 'automations', name: 'Reglas de Automatización', icon: Zap, badge: 'Motor' },
        { id: 'developments', name: 'Ficha del Desarrollo', icon: Building, badge: null },
      ]
    }
  ];

  const handleSelect = (id: string) => {
    onSelectModule(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative z-10 w-4/5 max-w-sm bg-slate-900 text-white h-full flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-brand-400 uppercase">Nexo Desarrollos</span>
                <h2 className="text-base font-extrabold text-white">Navegación Integral</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
              {modulesGrouped.map((group, idx) => (
                <div key={idx}>
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                    {group.group}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeModule === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                            isActive
                              ? 'bg-brand-600 text-white font-bold shadow-md'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {item.badge && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                isActive ? 'bg-brand-800 text-white' : 'bg-slate-800 text-slate-300'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 opacity-40" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer user / project status */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-slate-300">DEMO MODE</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                  Datos Simulados
                </span>
              </div>

              {onResetDemo && (
                <button
                  onClick={() => {
                    if (window.confirm('¿Desea restablecer todos los datos de demostración del simulador MVP a su estado inicial?')) {
                      onResetDemo();
                      onClose();
                    }
                  }}
                  className="w-full py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Restablecer Demo MVP
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
