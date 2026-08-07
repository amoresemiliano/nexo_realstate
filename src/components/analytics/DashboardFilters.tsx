import React from 'react';
import { Filter, Calendar, Building2, User, DollarSign, RotateCcw } from 'lucide-react';
import { AnalyticsFilter, defaultAnalyticsFilter } from '../../domain/analyticsEngine';
import { Development, Seller } from '../../types';

interface DashboardFiltersProps {
  filter: AnalyticsFilter;
  onChangeFilter: (updated: AnalyticsFilter) => void;
  developments: Development[];
  sellers: Seller[];
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  filter,
  onChangeFilter,
  developments,
  sellers
}) => {
  const isCustomized =
    filter.developmentId !== defaultAnalyticsFilter.developmentId ||
    filter.dateRange !== defaultAnalyticsFilter.dateRange ||
    filter.sellerId !== defaultAnalyticsFilter.sellerId ||
    filter.currency !== defaultAnalyticsFilter.currency;

  return (
    <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-brand-600" />
          <span>Filtros Analíticos Consolidados</span>
        </div>
        {isCustomized && (
          <button
            onClick={() => onChangeFilter(defaultAnalyticsFilter)}
            className="text-[11px] text-brand-600 hover:text-brand-800 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {/* Development Selector */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            <Building2 className="w-3 h-3 inline mr-1 text-slate-400" />
            Desarrollo
          </label>
          <select
            value={filter.developmentId}
            onChange={e => onChangeFilter({ ...filter, developmentId: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">Todos los Desarrollos</option>
            {developments.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Selector */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            <Calendar className="w-3 h-3 inline mr-1 text-slate-400" />
            Período
          </label>
          <select
            value={filter.dateRange}
            onChange={e => onChangeFilter({ ...filter, dateRange: e.target.value as any })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="TODAY">Hoy</option>
            <option value="7D">Últimos 7 días</option>
            <option value="30D">Últimos 30 días</option>
            <option value="90D">Últimos 90 días</option>
            <option value="THIS_YEAR">Este Año (2026)</option>
            <option value="ALL">Histórico Total</option>
          </select>
        </div>

        {/* Seller Selector */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            <User className="w-3 h-3 inline mr-1 text-slate-400" />
            Vendedor / Agente
          </label>
          <select
            value={filter.sellerId}
            onChange={e => onChangeFilter({ ...filter, sellerId: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">Todos los Vendedores</option>
            {sellers.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Selector */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            <DollarSign className="w-3 h-3 inline mr-1 text-slate-400" />
            Moneda
          </label>
          <select
            value={filter.currency}
            onChange={e => onChangeFilter({ ...filter, currency: e.target.value as any })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">USD + ARS (Separado)</option>
            <option value="USD">Dólares USD</option>
            <option value="ARS">Pesos ARS</option>
          </select>
        </div>
      </div>
    </div>
  );
};
