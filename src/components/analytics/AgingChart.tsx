import React from 'react';
import { AgingBucket } from '../../domain/analyticsEngine';
import { Card } from '../ui/Card';
import { Wallet, AlertCircle } from 'lucide-react';
import { formatUSD } from '../../domain/rules';

interface AgingChartProps {
  buckets: AgingBucket[];
}

export const AgingChart: React.FC<AgingChartProps> = ({ buckets }) => {
  const totalAmountUSD = buckets.reduce((acc, b) => acc + b.amountUSD, 0);

  return (
    <Card padding="md" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Wallet className="w-4 h-4 text-emerald-600" />
          <span>Aging de Cartera & Mora Agregada</span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">Total: {formatUSD(totalAmountUSD)}</span>
      </div>

      {/* Stacked Progress Bar */}
      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
        {buckets.map(b => (
          <div
            key={b.rangeKey}
            className={`h-full ${b.colorClass} transition-all`}
            style={{ width: `${b.percentOfTotal}%` }}
            title={`${b.label}: ${formatUSD(b.amountUSD)} (${b.percentOfTotal}%)`}
          />
        ))}
      </div>

      {/* Breakdown Cards Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-1">
        {buckets.map(b => (
          <div
            key={b.rangeKey}
            className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 flex flex-col justify-between space-y-1"
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${b.colorClass} shrink-0`} />
              <span className="text-[11px] font-bold text-slate-700 truncate">{b.label}</span>
            </div>

            <div>
              <div className="text-sm font-black text-slate-900">{formatUSD(b.amountUSD)}</div>
              <div className="text-[10px] text-slate-500 font-medium flex justify-between mt-0.5">
                <span>{b.clientsCount} clientes</span>
                <strong className="text-slate-700">{b.percentOfTotal}%</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Warning note for overdue mora */}
      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900 font-medium">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Atención:</strong> Las cuotas en tramos +61 días tienen disparada regla de intimación legal automática.
        </span>
      </div>
    </Card>
  );
};
