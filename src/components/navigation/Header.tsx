import React from 'react';
import { Building2, Bell, Menu, ChevronDown, UserCheck, Zap, SlidersHorizontal, LogOut } from 'lucide-react';
import { mockDevelopment } from '../../data/mockData';
import { UserRole } from '../../types';
import { ModuleVisibilityConfig, PresetKey, ENFORCE_CLIENT_MODE } from '../../config/moduleVisibility';
import { ApiStatusBadge } from './ApiStatusBadge';

interface HeaderProps {
  activeModuleTitle: string;
  userRole?: UserRole;
  userName?: string;
  unreadCount?: number;
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  onOpenOperationalCenter?: () => void;
  onOpenPresenterConfig?: () => void;
  onResetDemo?: () => void;
  onLogout?: () => void;
  activePresetName?: string;
  activePreset?: PresetKey;
  moduleVisibility?: ModuleVisibilityConfig;
}

export const Header: React.FC<HeaderProps> = ({
  activeModuleTitle,
  userRole = 'VENDEDOR',
  userName,
  unreadCount = 0,
  onOpenMenu,
  onOpenNotifications,
  onOpenOperationalCenter,
  onOpenPresenterConfig,
  onResetDemo,
  onLogout,
  activePresetName,
  activePreset,
  moduleVisibility,
}) => {
  const isCrmOperativo = activePreset === 'CRM_OPERATIVO' || ENFORCE_CLIENT_MODE;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between">
        {/* Left Brand & Dev selector */}
        <div className="flex items-center gap-2">
          {/* El botón de menú lateral se deshabilita visualmente en el preset CRM_OPERATIVO para el cliente */}
          {!isCrmOperativo && (
            <button
              onClick={onOpenMenu}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95 transition-all cursor-pointer"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-amber-400 font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Nexo Desarrollos</span>
              
              {!isCrmOperativo && (
                onOpenPresenterConfig ? (
                  <button
                    onClick={onOpenPresenterConfig}
                    className="hidden sm:inline-flex items-center gap-1 text-[9px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-extrabold ml-1 cursor-pointer transition-all active:scale-95"
                    title="Configurar visibilidad de módulos para la presentación"
                  >
                    <SlidersHorizontal className="w-2.5 h-2.5" />
                    <span>DEMO MODE</span>
                  </button>
                ) : (
                  <span className="hidden md:inline-block text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-extrabold ml-1">
                    DEMO MODE
                  </span>
                )
              )}
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:opacity-90">
              <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white">{mockDevelopment.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Presenter Config Trigger Button (Oculto en CRM_OPERATIVO) */}
          {!isCrmOperativo && onOpenPresenterConfig && (
            <button
              onClick={onOpenPresenterConfig}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700/80 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              title="Configurar visibilidad de módulos"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Presentación</span>
            </button>
          )}

          {/* Operational Center Quick Button */}
          {onOpenOperationalCenter && (!moduleVisibility || moduleVisibility.operational !== false) && (
            <button
              onClick={onOpenOperationalCenter}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">Centro Operativo</span>
            </button>
          )}

          {/* Notifications button with counter */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95 transition-all cursor-pointer"
            aria-label="Notificaciones y alertas"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub-bar showing active view title, role and API status */}
      <div className="bg-slate-950/80 px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between border-t border-slate-800/60 text-xs gap-2">
        <div className="font-semibold text-slate-300 flex items-center gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="truncate">Vista: <strong className="text-white">{activeModuleTitle}</strong></span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <ApiStatusBadge />
          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{userName ? `${userName} (${userRole})` : userRole}</span>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Cerrar Sesión"
              className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
