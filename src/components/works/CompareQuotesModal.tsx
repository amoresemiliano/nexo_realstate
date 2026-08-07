import React from 'react';
import { SupplierQuote, WorkRequest, Provider } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { X, Scale, DollarSign, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CompareQuotesModalProps {
  isOpen: boolean;
  workRequest: WorkRequest;
  quotes: SupplierQuote[];
  providers: Provider[];
  onClose: () => void;
  onSelectQuoteForProposal: (quote: SupplierQuote) => void;
}

export const CompareQuotesModal: React.FC<CompareQuotesModalProps> = ({
  isOpen,
  workRequest,
  quotes,
  providers,
  onClose,
  onSelectQuoteForProposal,
}) => {
  if (!isOpen) return null;

  const minCost = quotes.reduce(
    (min, q) => (q.amount < (min?.amount || Infinity) ? q : min),
    null as SupplierQuote | null
  );

  const minDays = quotes.reduce(
    (min, q) => ((q.estimatedDays || Infinity) < (min?.estimatedDays || Infinity) ? q : min),
    null as SupplierQuote | null
  );

  const maxWarranty = quotes.reduce(
    (max, q) => ((q.warrantyMonths || 0) > (max?.warrantyMonths || 0) ? q : max),
    null as SupplierQuote | null
  );

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="text-base font-black text-slate-900">
                Comparador Comercial de Proveedores
              </h3>
              <p className="text-xs text-slate-500">
                Lote {workRequest.lotNumber || workRequest.lotId} — {workRequest.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side by side comparison cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quotes.map(quote => {
            const provider = providers.find(p => p.id === quote.providerId);
            const isMinCost = minCost?.id === quote.id;
            const isMinDays = minDays?.id === quote.id;
            const isMaxWarranty = maxWarranty?.id === quote.id;

            return (
              <Card
                key={quote.id}
                padding="md"
                className={`space-y-3 relative transition-all ${
                  quote.status === 'SELECCIONADA'
                    ? 'border-2 border-emerald-500 bg-emerald-50/10 shadow-md'
                    : 'border border-slate-200'
                }`}
              >
                <div className="flex flex-wrap gap-1">
                  {isMinCost && (
                    <Badge variant="success" className="text-[9px]">
                      ★ Menor Costo
                    </Badge>
                  )}
                  {isMinDays && (
                    <Badge variant="brand" className="text-[9px]">
                      ★ Menor Plazo
                    </Badge>
                  )}
                  {isMaxWarranty && (
                    <Badge variant="purple" className="text-[9px]">
                      ★ Mayor Garantía
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    {quote.providerName || provider?.organizationName}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Rating: <strong className="text-amber-600">{provider?.rating || 4.8} ★</strong> • Doc:{' '}
                    <strong className="text-slate-700">{provider?.documentationStatus || 'COMPLETA'}</strong>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Costo Proveedor:</span>
                    <strong className="text-slate-900 font-black text-sm">
                      ${quote.amount.toLocaleString()} {quote.currency}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Plazo de Obra:</span>
                    <strong className="text-slate-800">{quote.estimatedDays} días</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Garantía:</span>
                    <strong className="text-slate-800">{quote.warrantyMonths || 12} meses</strong>
                  </div>
                </div>

                {quote.notes && (
                  <p className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100">
                    "{quote.notes}"
                  </p>
                )}

                <Button
                  variant={quote.status === 'SELECCIONADA' ? 'success' : 'primary'}
                  size="sm"
                  onClick={() => {
                    onSelectQuoteForProposal(quote);
                    onClose();
                  }}
                  className="w-full text-xs py-2 mt-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Seleccionar para Propuesta
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
