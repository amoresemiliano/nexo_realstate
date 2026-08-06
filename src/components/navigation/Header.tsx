import React from 'react';
import { Building2, Bell, Menu, ChevronDown } from 'lucide-react';
import { mockDevelopment, mockAlerts } from '../../data/mockData';

interface HeaderProps {
  activeModuleTitle: string;
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModuleTitle,
  onOpenMenu,
  onOpenNotifications,
}) => {
  const alertCount = mockAlerts.length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left Brand & Dev selector */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenMenu}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95 transition-all"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-brand-400 font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Nexo Desarrollos</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:opacity-90">
              <span className="text-sm font-extrabold tracking-tight text-white">{mockDevelopment.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications button with counter */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95 transition-all"
            aria-label="Notificaciones y alertas"
          >
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                {alertCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-bar showing active view title */}
      <div className="bg-slate-950/70 px-4 py-1.5 flex items-center justify-between border-t border-slate-800/60 text-xs">
        <div className="font-semibold text-slate-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Módulo actual: <strong className="text-white">{activeModuleTitle}</strong></span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">MVP Mobile v1.0</span>
      </div>
    </header>
  );
};
