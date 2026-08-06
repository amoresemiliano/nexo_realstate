import React from 'react';
import { Sale } from '../../types';
import { mockSales } from '../../data/mockData';
import { formatUSD } from '../../domain/rules';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FileCheck, UserCheck, Calendar, DollarSign, Download } from 'lucide-react';

export const SalesModule: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Ventas & Contratos</h2>
          <p className="text-xs text-slate-500">Registro de boletos de compraventa y contratos</p>
        </div>
        <FileCheck className="w-6 h-6 text-brand-600" />
      </div>

      <div className="space-y-3">
        {mockSales.map(sale => (
          <Card key={sale.id} padding="md" className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-black text-slate-900">Lote {sale.lotNumber} ({sale.block})</span>
                <span className="text-xs text-slate-500 block">Comprador: {sale.customerName}</span>
              </div>
              <Badge variant="brand">{sale.contractStatus}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Monto Total</span>
                <span className="font-extrabold text-slate-900">{formatUSD(sale.totalAmountUSD)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-bold">Anticipo Integrado</span>
                <span className="font-extrabold text-brand-700">{formatUSD(sale.downPaymentUSD)}</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
              <div>DNI: <strong>{sale.customerDni}</strong> | Tel: <strong>{sale.customerPhone}</strong></div>
              <div>Fecha Venta: <strong>{sale.saleDate}</strong> | Agente: <strong>{sale.agentName}</strong></div>
            </div>

            <button
              onClick={() => alert('Descargando contrato de Boleto de Compraventa...')}
              className="w-full text-xs font-bold text-brand-600 hover:bg-brand-50 py-2 rounded-xl border border-brand-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Descargar Boleto Digital (PDF)
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};
