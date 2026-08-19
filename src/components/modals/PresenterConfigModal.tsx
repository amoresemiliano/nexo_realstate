import React from 'react';
import {
  SlidersHorizontal,
  X,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  Layers,
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
  ShieldAlert,
  BarChart3,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ModuleKey,
  ModuleVisibilityConfig,
  PresetKey,
  MODULE_CATALOG,
  PRESETS,
} from '../../config/moduleVisibility';

interface PresenterConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ModuleVisibilityConfig;
  preset: PresetKey;
  onUpdateConfig: (newConfig: ModuleVisibilityConfig, newPreset: PresetKey) => void;
  onResetPresentation: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
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
  ShieldAlert,
  BarChart3,
};

export const PresenterConfigModal: React.FC<PresenterConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  preset,
  onUpdateConfig,
  onResetPresentation,
}) => {
  if (!isOpen) return null;

  const handleSelectPreset = (key: Exclude<PresetKey, 'CUSTOM'>) => {
    const selectedPreset = PRESETS[key];
    onUpdateConfig({ ...selectedPreset.config }, key);
  };

  const handleToggleModule = (moduleKey: ModuleKey) => {
    const updated = { ...config, [moduleKey]: !config[moduleKey] };
    onUpdateConfig(updated, 'CUSTOM');
  };

  const activeCount = Object.values(config).filter(Boolean).length;
  const totalCount = MODULE_CATALOG.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">Configuración de Presentación</h3>
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                    DEMO MODE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ajusta los módulos visibles en la interfaz para adaptar la demostración comercial.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
            {/* Active Status & Preset Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Presets de Demostración
                </label>
                <span className="text-xs font-mono text-slate-400">
                  <strong className="text-white">{activeCount}</strong> de {totalCount} módulos visibles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.keys(PRESETS) as Array<Exclude<PresetKey, 'CUSTOM'>>).map((key) => {
                  const item = PRESETS[key];
                  const isSelected = preset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectPreset(key)}
                      className={`text-left p-3 rounded-xl border transition-all relative ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-md'
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span>{item.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 ml-2" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.description}</p>
                    </button>
                  );
                })}
              </div>

              {preset === 'CUSTOM' && (
                <div className="p-2.5 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs text-amber-300">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>Configuración <strong>Personalizada (Custom)</strong> activa.</span>
                  </div>
                  <button
                    onClick={onResetPresentation}
                    className="text-amber-400 hover:underline font-bold text-[11px] flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Restablecer a CRM Operativo
                  </button>
                </div>
              )}
            </div>

            {/* Individual Switches Header */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" /> Control Individual de Módulos
                </label>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSelectPreset('FULL_MVP')}
                    className="text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3 text-emerald-400" /> Mostrar Todos
                  </button>
                  <button
                    onClick={onResetPresentation}
                    className="text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" /> Reset Presentación
                  </button>
                </div>
              </div>

              {/* Module List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MODULE_CATALOG.map((mod) => {
                  const Icon = ICON_MAP[mod.iconName] || Layers;
                  const isEnabled = !!config[mod.key];

                  return (
                    <div
                      key={mod.key}
                      onClick={() => handleToggleModule(mod.key)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                        isEnabled
                          ? 'bg-slate-800/80 border-slate-700 text-white'
                          : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-75'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isEnabled
                            ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                            : 'bg-slate-800 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs font-bold truncate ${isEnabled ? 'text-white' : 'text-slate-400'}`}>
                            {mod.name}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded shrink-0 ${
                              isEnabled
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isEnabled ? 'VISIBLE' : 'OCULTO'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{mod.description}</p>
                      </div>

                      {/* Custom Switch button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleModule(mod.key);
                        }}
                        className={`w-10 h-5 rounded-full transition-colors relative shrink-0 mt-1 ${
                          isEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            isEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanatory note */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200">Integridad Garantizada:</strong> Los módulos ocultos no alteran ni
                eliminan información del sistema. Toda la base de datos simulada y las reglas de negocio permanecen
                operativas en segundo plano.
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
            <div className="text-xs text-slate-400">
              Preset activo: <strong className="text-amber-400">{preset}</strong>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95"
            >
              Aplicar y Guardar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
