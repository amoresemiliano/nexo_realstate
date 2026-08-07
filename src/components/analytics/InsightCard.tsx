import React from 'react';
import { QuickInsight } from '../../domain/analyticsEngine';
import { Card } from '../ui/Card';
import { AlertTriangle, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

interface InsightCardProps {
  insights: QuickInsight[];
  onNavigateModule?: (moduleId: string) => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insights, onNavigateModule }) => {
  const getIcon = (type: QuickInsight['type']) => {
    switch (type) {
      case 'ATENCION':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'OPORTUNIDAD':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'TENDENCIA':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getBorder = (type: QuickInsight['type']) => {
    switch (type) {
      case 'ATENCION':
        return 'border-rose-200 bg-rose-50/50';
      case 'OPORTUNIDAD':
        return 'border-amber-200 bg-amber-50/50';
      case 'TENDENCIA':
        return 'border-emerald-200 bg-emerald-50/50';
    }
  };

  return (
    <Card padding="md" className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Quick Insights & Detecciones Automáticas
        </span>
        <span className="text-[10px] bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-bold">
          Motor Analítico
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {insights.map(ins => (
          <div
            key={ins.id}
            className={`p-3 rounded-xl border ${getBorder(ins.type)} space-y-1.5 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                {getIcon(ins.type)}
                <span>{ins.title}</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">{ins.description}</p>
            </div>

            {ins.actionText && ins.moduleTarget && (
              <button
                onClick={() => onNavigateModule?.(ins.moduleTarget!)}
                className="mt-2 text-[11px] font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1 self-start underline"
              >
                <span>{ins.actionText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
