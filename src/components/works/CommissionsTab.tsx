import React from 'react';
import { Commission } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DollarSign, TrendingUp, CheckCircle2, Clock, Building2, Filter } from 'lucide-react';

interface CommissionsTabProps {
  commissions: Commission[];
}

export const CommissionsTab: React.FC<CommissionsTabProps> = ({ commissions }) => {
  const totalEarned = commissions
    .filter(c => c.status === 'DEVENGADA' || c.status === 'PAGADA')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const totalPaid = commissions
    .filter(c => c.status === 'PAGADA')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const totalPending = commissions
    .filter(c => c.status === 'PENDIENTE' || c.status === 'DEVENGADA')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card padding="md" className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-200">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold mb-1">
            <span>Comisiones Devengadas</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">${totalEarned.toLocaleString()} USD</div>
          <p className="text-[10px] text-emerald-800 font-medium">Ingresos generados por obras & abonos</p>
        </Card>

        <Card padding="md" className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-200">
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold mb-1">
            <span>Comisiones Cobradas</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">${totalPaid.toLocaleString()} USD</div>
          <p className="text-[10px] text-blue-800 font-medium">Liquidaciones efectivamente percibidas</p>
        </Card>

        <Card padding="md" className="bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold mb-1">
            <span>Pendiente de Liquidar</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">${totalPending.toLocaleString()} USD</div>
          <p className="text-[10px] text-amber-800 font-medium">A la espera de cierre de hito u obra</p>
        </Card>
      </div>

      {/* Commissions Detailed List */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-900">Trazabilidad Financiera de Comisiones</h3>
          </div>
          <Badge variant="neutral">Postventa Nexo</Badge>
        </div>

        <div className="space-y-2">
          {commissions.map(com => (
            <div
              key={com.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="brand" className="text-[10px]">
                    {com.sourceType}
                  </Badge>
                  <span className="font-black text-slate-900">
                    Lote {com.lotNumber || com.lotId} — {com.customerName}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Proveedor: <strong>{com.providerName}</strong> • Modelo: <strong>{com.model}</strong>
                </p>
                {com.notes && <p className="text-[10px] text-slate-400">{com.notes}</p>}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-200">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Comisión:</span>
                  <strong className="text-sm font-black text-emerald-600">
                    ${com.commissionAmount.toLocaleString()} {com.currency}
                  </strong>
                </div>

                <Badge
                  variant={
                    com.status === 'PAGADA'
                      ? 'success'
                      : com.status === 'DEVENGADA'
                      ? 'brand'
                      : 'warning'
                  }
                >
                  {com.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
