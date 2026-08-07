import React from 'react';
import { LeadStatus, LeadTemperature, LeadPriority, LeadSource, Seller } from '../../types';
import { X, Filter, RotateCcw, Check } from 'lucide-react';

export interface LeadFilterOptions {
  searchQuery: string;
  status?: LeadStatus | 'ALL' | 'PIPELINE_ONLY' | 'CLOSED_ONLY';
  temperature?: LeadTemperature | 'ALL';
  priority?: LeadPriority | 'ALL';
  source?: LeadSource | 'ALL';
  sellerId?: string | 'ALL' | 'UNASSIGNED';
  overdueSlaOnly?: boolean;
}

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: LeadFilterOptions;
  sellers: Seller[];
  onApplyFilters: (newFilters: LeadFilterOptions) => void;
  onResetFilters: () => void;
}

export const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  isOpen,
  onClose,
  filters,
  sellers,
  onApplyFilters,
  onResetFilters
}) => {
  if (!isOpen) return null;

  const [localFilters, setLocalFilters] = React.useState<LeadFilterOptions>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    onResetFilters();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end justify-center">
      <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-black text-slate-900">Filtros Avanzados de Leads</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Overdue SLA Toggle */}
          <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between">
            <div>
              <div className="font-extrabold text-rose-900">SLA Atrasado / Crítico (&gt;60 min)</div>
              <div className="text-[10px] text-rose-700">Mostrar solo leads con tiempo de respuesta excedido</div>
            </div>
            <input
              type="checkbox"
              checked={localFilters.overdueSlaOnly || false}
              onChange={e => setLocalFilters({ ...localFilters, overdueSlaOnly: e.target.checked })}
              className="w-5 h-5 rounded text-rose-600"
            />
          </div>

          {/* Vendedor */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Vendedor Asignado</label>
            <select
              value={localFilters.sellerId || 'ALL'}
              onChange={e => setLocalFilters({ ...localFilters, sellerId: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
            >
              <option value="ALL">Todos los Vendedores</option>
              <option value="UNASSIGNED">⚠️ Sin Asignar</option>
              {sellers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status category */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Filtro por Grupo de Estado</label>
            <select
              value={localFilters.status || 'PIPELINE_ONLY'}
              onChange={e => setLocalFilters({ ...localFilters, status: e.target.value as any })}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
            >
              <option value="PIPELINE_ONLY">Solo Leads Activos (Pipeline Comercial)</option>
              <option value="CLOSED_ONLY">Solo Cerrados / Perdidos / Descarte</option>
              <option value="ALL">Todos (Activos + Cerrados)</option>
              <option value="NUEVO">Lead Recibido (NUEVO)</option>
              <option value="PENDIENTE_PRIMER_CONTACTO">Pendiente Primer Contacto</option>
              <option value="VISITA_AGENDADA">Visita Agendada</option>
              <option value="NEGOCIACION">En Negociación</option>
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Fuente / Canal de Ingesta</label>
            <select
              value={localFilters.source || 'ALL'}
              onChange={e => setLocalFilters({ ...localFilters, source: e.target.value as any })}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800"
            >
              <option value="ALL">Todas las Fuentes</option>
              <option value="Meta Ads">Meta Ads (Facebook/Instagram)</option>
              <option value="Google Ads">Google Ads</option>
              <option value="WhatsApp">WhatsApp Directo</option>
              <option value="Sitio Web">Sitio Web / Orgánico</option>
              <option value="Referido">Referidos</option>
              <option value="Inmobiliaria">Inmobiliarias Aliadas</option>
            </select>
          </div>

          {/* Temperature */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Calificación / Temperatura</label>
            <div className="grid grid-cols-2 gap-2">
              {['ALL', 'FRIO', 'TIBIO', 'CALIENTE', 'MUY_CALIENTE'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, temperature: t as any })}
                  className={`p-2 rounded-xl font-bold border transition-all text-center ${
                    (localFilters.temperature || 'ALL') === t
                      ? 'bg-brand-600 text-white border-brand-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t === 'ALL' ? 'Todas' : t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpiar</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 shadow-md flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Aplicar Filtros</span>
          </button>
        </div>
      </div>
    </div>
  );
};
