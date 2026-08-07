import React from 'react';
import { FunnelStep } from '../../domain/analyticsEngine';
import { Card } from '../ui/Card';
import { ArrowDown, Filter } from 'lucide-react';

interface FunnelChartProps {
  steps: FunnelStep[];
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ steps }) => {
  const maxCount = steps[0]?.count || 1;

  return (
    <Card padding="md" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Funnel de Conversión Comercial</span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">De Lead a Venta CERRADA</span>
      </div>

      <div className="space-y-2 pt-1">
        {steps.map((step, idx) => {
          const widthPercent = Math.max(12, Math.round((step.count / maxCount) * 100));
          const isFinal = idx === steps.length - 1;

          return (
            <div key={step.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="truncate">{step.label}</span>
                <div className="flex items-center gap-2 text-[11px]">
                  <strong className="text-slate-900 font-extrabold">{step.count}</strong>
                  {idx > 0 && (
                    <span className="text-slate-500 font-mono">
                      ({step.conversionFromPrevPercent}% conv.)
                    </span>
                  )}
                </div>
              </div>

              {/* Bar container */}
              <div className="w-full bg-slate-100 h-6 rounded-lg overflow-hidden relative flex items-center px-2">
                <div
                  className={`h-full absolute left-0 top-0 transition-all duration-300 ${
                    isFinal
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                      : 'bg-gradient-to-r from-brand-500 to-sky-500'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                />
                <span className="relative z-10 text-[10px] font-bold text-white drop-shadow-xs">
                  {step.overallPercent}% del total
                </span>
              </div>

              {/* Drop-off note */}
              {step.dropOffCount > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-slate-400 pl-2">
                  <ArrowDown className="w-2.5 h-2.5 text-rose-400" />
                  <span>
                    Pérdida/Descarte en esta etapa: <strong className="text-rose-500">{step.dropOffCount} leads</strong>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
