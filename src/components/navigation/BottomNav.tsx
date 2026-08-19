import React from 'react';
import { LayoutDashboard, MapPin, Users, Target, BookmarkCheck, Calculator, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';
import { ModuleVisibilityConfig, PresetKey } from '../../config/moduleVisibility';

interface BottomNavProps {
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
  onOpenMenu: () => void;
  moduleVisibility?: ModuleVisibilityConfig;
  activePreset?: PresetKey;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  onSelectModule,
  onOpenMenu,
  moduleVisibility,
  activePreset,
}) => {
  const isCrmOperativo = activePreset === 'CRM_OPERATIVO';

  const isModuleEnabled = (id: string) => {
    if (!moduleVisibility) return true;
    return !!moduleVisibility[id as keyof ModuleVisibilityConfig];
  };

  const rawNavItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'campaigns', label: 'Campañas', icon: Target },
    { id: 'reservations', label: 'Reservas', icon: BookmarkCheck },
    { id: 'lots', label: 'Lotes', icon: MapPin },
    { id: 'quotes', label: 'Cotizar', icon: Calculator },
  ];

  // En CRM_OPERATIVO: el Dashboard Comercial sigue siendo el inicio pero no lleva botón propio en el Bottom Bar.
  // Se filtran los módulos según visibilidad activa.
  const mainNavItems = rawNavItems.filter((item) => {
    if (isCrmOperativo && item.id === 'dashboard') {
      return false;
    }
    return isModuleEnabled(item.id);
  });

  const showMoreButton = !isCrmOperativo;
  const totalCols = mainNavItems.length + (showMoreButton ? 1 : 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-2 pb-safe pt-1">
      <div
        className={clsx(
          'max-w-md mx-auto grid gap-1',
          totalCols === 3 && 'grid-cols-3',
          totalCols === 4 && 'grid-cols-4',
          totalCols === 5 && 'grid-cols-5',
          totalCols >= 6 && 'grid-cols-6'
        )}
        style={{ gridTemplateColumns: `repeat(${totalCols}, minmax(0, 1fr))` }}
      >
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={clsx(
                'flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 active:scale-90 select-none cursor-pointer',
                isActive
                  ? 'text-brand-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              )}
            >
              <div className={clsx(
                'p-1 rounded-xl transition-colors',
                isActive ? 'bg-brand-50 text-brand-600' : ''
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* El botón "Más" para abrir el drawer se muestra solo en presets extendidos fuera de CRM_OPERATIVO */}
        {showMoreButton && (
          <button
            onClick={onOpenMenu}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-500 hover:text-slate-800 font-medium transition-all duration-150 active:scale-90 select-none cursor-pointer"
          >
            <div className="p-1 rounded-xl">
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] leading-tight mt-0.5">Más</span>
          </button>
        )}
      </div>
    </nav>
  );
};
