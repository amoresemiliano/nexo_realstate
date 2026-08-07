import React from 'react';
import { UserPlus, FilterX, RefreshCw } from 'lucide-react';

interface EmptyLeadsStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onOpenCreate: () => void;
}

export const EmptyLeadsState: React.FC<EmptyLeadsStateProps> = ({
  hasFilters,
  onClearFilters,
  onOpenCreate
}) => {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3 my-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        {hasFilters ? <FilterX className="w-6 h-6" /> : <UserPlus className="w-6 h-6 text-brand-600" />}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-black text-slate-900">
          {hasFilters ? 'No se encontraron leads con los filtros seleccionados' : 'No hay leads registrados aún'}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {hasFilters
            ? 'Pruebe ajustar o limpiar los filtros de búsqueda para visualizar más contactos comercializables.'
            : 'Comience cargando el primer lead de preventa o importando desde campañas activas.'}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2">
        {hasFilters ? (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restablecer Filtros</span>
          </button>
        ) : (
          <button
            onClick={onOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 shadow-md transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cargar Primer Lead</span>
          </button>
        )}
      </div>
    </div>
  );
};
