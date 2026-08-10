import React from 'react';
import { LayoutDashboard, MapPin, Users, BookmarkCheck, Calculator, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';
import { ModuleVisibilityConfig } from '../../config/moduleVisibility';

interface BottomNavProps {
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
  onOpenMenu: () => void;
  moduleVisibility?: ModuleVisibilityConfig;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  onSelectModule,
  onOpenMenu,
  moduleVisibility,
}) => {
  const isModuleEnabled = (id: string) => {
    if (!moduleVisibility) return true;
    return !!moduleVisibility[id as keyof ModuleVisibilityConfig];
  };

  const rawNavItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'lots', label: 'Lotes', icon: MapPin },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'reservations', label: 'Reservas', icon: BookmarkCheck },
    { id: 'quotes', label: 'Cotizar', icon: Calculator },
  ];

  const mainNavItems = rawNavItems.filter((item) => isModuleEnabled(item.id));
  const totalCols = mainNavItems.length + 1;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg px-2 pb-safe pt-1">
      <div
        className="max-w-md mx-auto grid gap-0.5"
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
                'flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 active:scale-90 select-none',
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

        {/* More button to trigger full module menu */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-500 hover:text-slate-800 font-medium transition-all duration-150 active:scale-90 select-none"
        >
          <div className="p-1 rounded-xl">
            <MoreHorizontal className="w-5 h-5" />
          </div>
          <span className="text-[10px] leading-tight mt-0.5">Más</span>
        </button>
      </div>
    </nav>
  );
};

