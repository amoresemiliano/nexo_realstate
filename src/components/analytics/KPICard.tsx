import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../ui/Card';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  badgeText?: string;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtext,
  badgeText,
  badgeVariant = 'neutral',
  icon: Icon,
  iconColor = 'text-brand-600',
  trend,
  onClick
}) => {
  const badgeClasses = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <Card
      padding="sm"
      className={`space-y-1.5 transition-all ${onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-xs' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-xs font-semibold truncate text-slate-600">{title}</span>
        {Icon && <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />}
      </div>

      <div className="flex items-baseline justify-between gap-1">
        <div className="text-2xl font-black text-slate-900 tracking-tight truncate">{value}</div>
        {badgeText && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${badgeClasses[badgeVariant]}`}>
            {badgeText}
          </span>
        )}
      </div>

      {(subtext || trend) && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          {subtext && <span className="truncate">{subtext}</span>}
          {trend && (
            <span
              className={`font-bold flex items-center gap-0.5 shrink-0 ${
                trend.isNeutral
                  ? 'text-slate-500'
                  : trend.isPositive
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}
            >
              {trend.isNeutral ? (
                <Minus className="w-3 h-3" />
              ) : trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
