import React from 'react';
import { DevelopmentPortfolioItem } from '../../domain/analyticsEngine';
import { Card } from '../ui/Card';
import { Building2, MapPin, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatUSD } from '../../domain/rules';

interface PortfolioCardProps {
  portfolio: DevelopmentPortfolioItem[];
  onSelectDevelopment?: (devId: string) => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio, onSelectDevelopment }) => {
  return (
    <Card padding="md" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Building2 className="w-4 h-4 text-brand-600" />
          <span>Portfolio Consolidado de Desarrollos</span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">{portfolio.length} Proyectos Activos</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {portfolio.map(dev => (
          <div
            key={dev.developmentId}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-900">{dev.name}</h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{dev.location}</span>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                {dev.occupancyPercent}% Comercializado
              </span>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-3 gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-150">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Disponibles</span>
                <span className="font-extrabold text-slate-800">{dev.availableLots} / {dev.totalLots}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Vendido Acum.</span>
                <span className="font-extrabold text-emerald-700">{formatUSD(dev.totalSalesUSD)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Mora Registrada</span>
                <span className="font-extrabold text-rose-600">{dev.moraPercent}%</span>
              </div>
            </div>

            {/* Infrastructure & works */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
              <div className="flex items-center gap-1 text-[11px] text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Obra Infraestructura: <strong>{dev.infrastructureProgressPercent}%</strong></span>
              </div>
              {onSelectDevelopment && (
                <button
                  onClick={() => onSelectDevelopment(dev.developmentId)}
                  className="text-[11px] font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <span>Ver Ficha</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
