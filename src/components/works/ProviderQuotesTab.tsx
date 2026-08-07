import React, { useState } from 'react';
import {
  WorkQuoteRequest,
  SupplierQuote,
  ClientProposal,
  WorkRequest,
  Provider,
  Lot
} from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  FileCheck2,
  DollarSign,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Scale,
  Plus
} from 'lucide-react';

interface ProviderQuotesTabProps {
  quoteRequests: WorkQuoteRequest[];
  supplierQuotes: SupplierQuote[];
  clientProposals: ClientProposal[];
  workRequests: WorkRequest[];
  providers: Provider[];
  lots: Lot[];
  onCompareQuotes: (workRequestId: string) => void;
  onCreateProposal: (supplierQuote: SupplierQuote, workRequest: WorkRequest) => void;
  onApproveProposal: (proposal: ClientProposal) => void;
}

export const ProviderQuotesTab: React.FC<ProviderQuotesTabProps> = ({
  quoteRequests,
  supplierQuotes,
  clientProposals,
  workRequests,
  providers,
  lots,
  onCompareQuotes,
  onCreateProposal,
  onApproveProposal,
}) => {
  const [selectedWorkRequestId, setSelectedWorkRequestId] = useState<string>(
    workRequests[0]?.id || ''
  );

  const activeWorkRequest = workRequests.find(r => r.id === selectedWorkRequestId);
  const activeQuoteRequest = quoteRequests.find(q => q.workRequestId === selectedWorkRequestId);
  const activeQuotes = supplierQuotes.filter(s => s.workRequestId === selectedWorkRequestId);
  const activeProposals = clientProposals.filter(p => p.workRequestId === selectedWorkRequestId);

  // Identify lowest cost, lowest days, max warranty
  const minCostQuote = activeQuotes.reduce(
    (min, q) => (q.amount < (min?.amount || Infinity) ? q : min),
    null as SupplierQuote | null
  );

  const minDaysQuote = activeQuotes.reduce(
    (min, q) => ((q.estimatedDays || Infinity) < (min?.estimatedDays || Infinity) ? q : min),
    null as SupplierQuote | null
  );

  const maxWarrantyQuote = activeQuotes.reduce(
    (max, q) => ((q.warrantyMonths || 0) > (max?.warrantyMonths || 0) ? q : max),
    null as SupplierQuote | null
  );

  return (
    <div className="space-y-4">
      {/* Selector de Solicitud de Servicio a Cotizar */}
      <Card padding="sm" className="bg-slate-50 border border-slate-200">
        <label className="text-xs font-bold text-slate-700 block mb-1">
          Seleccionar Trabajo / Solicitud a Cotizar:
        </label>
        <select
          value={selectedWorkRequestId}
          onChange={e => setSelectedWorkRequestId(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {workRequests.map(req => (
            <option key={req.id} value={req.id}>
              Lote {req.lotNumber || req.lotId} — {req.title} ({req.customerName})
            </option>
          ))}
        </select>
      </Card>

      {/* Selected Request Header */}
      {activeWorkRequest && (
        <Card padding="md" className="space-y-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                Lote {activeWorkRequest.lotNumber || activeWorkRequest.lotId} • {activeWorkRequest.customerName}
              </span>
              <h3 className="text-sm font-black text-white">{activeWorkRequest.title}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{activeWorkRequest.description}</p>
            </div>
            <Badge variant="brand">{activeWorkRequest.status.replace('_', ' ')}</Badge>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700 text-slate-300">
            <span>Presupuesto Estimado: <strong>${activeWorkRequest.budgetExpectation?.toLocaleString()} USD</strong></span>
            <span>Cotizaciones Recibidas: <strong className="text-amber-300">{activeQuotes.length} proveedores</strong></span>
          </div>
        </Card>
      )}

      {/* COMPARADOR DE PROVEEDORES MOBILE-FIRST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-black text-slate-900">Comparativa de Cotizaciones de Proveedores</h3>
          </div>
          {activeWorkRequest && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCompareQuotes(activeWorkRequest.id)}
              className="text-xs"
            >
              Ver Comparador Completo
            </Button>
          )}
        </div>

        {activeQuotes.length === 0 ? (
          <Card padding="md" className="text-center py-8 text-slate-400 space-y-2">
            <DollarSign className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">No hay cotizaciones de proveedores registradas para este trabajo.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeQuotes.map(quote => {
              const provider = providers.find(p => p.id === quote.providerId);
              const isLowestCost = minCostQuote?.id === quote.id;
              const isFastest = minDaysQuote?.id === quote.id;
              const isBestWarranty = maxWarrantyQuote?.id === quote.id;

              return (
                <Card
                  key={quote.id}
                  padding="md"
                  className={`space-y-3 relative overflow-hidden transition-all ${
                    quote.status === 'SELECCIONADA'
                      ? 'border-2 border-emerald-500 bg-emerald-50/20'
                      : 'border border-slate-200'
                  }`}
                >
                  {/* Status & Highlights Badges */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {isLowestCost && (
                      <Badge variant="success" className="text-[10px]">
                        ★ Menor Costo
                      </Badge>
                    )}
                    {isFastest && (
                      <Badge variant="brand" className="text-[10px]">
                        ★ Menor Plazo ({quote.estimatedDays} días)
                      </Badge>
                    )}
                    {isBestWarranty && (
                      <Badge variant="purple" className="text-[10px]">
                        ★ Mayor Garantía ({quote.warrantyMonths}m)
                      </Badge>
                    )}
                    {provider?.rating && (
                      <Badge variant="neutral" className="text-[10px]">
                        Rating {provider.rating} ★
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      {quote.providerName || provider?.organizationName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Doc: <span className="font-bold text-slate-700">{provider?.documentationStatus || 'COMPLETA'}</span>
                    </p>
                  </div>

                  {/* Financial & Time Breakdown */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Costo Proveedor:</span>
                      <strong className="text-slate-900 font-black text-sm">
                        ${quote.amount.toLocaleString()} {quote.currency}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Plazo Estimado:</span>
                      <strong className="text-slate-900 font-bold">{quote.estimatedDays} días corridos</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Materiales / Mano Obra:</span>
                      <span className="text-slate-700 font-medium">
                        ${quote.materialCost?.toLocaleString()} / ${quote.laborCost?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Garantía:</span>
                      <span className="text-slate-700 font-medium">{quote.warrantyMonths || 12} meses</span>
                    </div>
                  </div>

                  {quote.notes && (
                    <p className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-100">
                      "{quote.notes}"
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Válida hasta: {quote.validUntil || '2026-08-30'}</span>
                    <Button
                      variant={quote.status === 'SELECCIONADA' ? 'success' : 'primary'}
                      size="sm"
                      onClick={() => activeWorkRequest && onCreateProposal(quote, activeWorkRequest)}
                      className="text-xs py-1.5"
                    >
                      {quote.status === 'SELECCIONADA' ? '✓ Generada' : 'Crear Propuesta Comercial'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* PROPUESTAS COMERCIALES AL CLIENTE (VERSIONADO) */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-900">Propuestas Comerciales para Cliente</h3>
          </div>
          <Badge variant="neutral">Versionado V1 / V2</Badge>
        </div>

        {activeProposals.length === 0 ? (
          <Card padding="md" className="text-center py-6 text-slate-400 text-xs">
            No se han generado propuestas comerciales al comprador para esta solicitud.
          </Card>
        ) : (
          <div className="space-y-3">
            {activeProposals.map(prop => (
              <Card key={prop.id} padding="md" className="space-y-3 bg-white border-2 border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="brand" className="text-[10px]">
                        Versión {prop.version}
                      </Badge>
                      <span className="text-xs font-bold text-slate-500">
                        Proveedor: {prop.providerName}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mt-0.5">{prop.title}</h4>
                  </div>
                  <Badge variant={prop.status === 'APROBADA' ? 'success' : 'warning'}>
                    {prop.status}
                  </Badge>
                </div>

                {/* DESGLOSE COMERCIAL INTERNO (ROL INTERNO / ADMIN) */}
                <div className="p-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-slate-700 pb-1.5">
                    <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                      Desglose Comercial Interno Nexo
                    </span>
                    <span className="text-slate-400 text-[10px]">Vista Confidencial</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Costo Proveedor:</span>
                      <strong className="text-slate-200">${prop.providerCost.toLocaleString()} USD</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Precio Cliente:</span>
                      <strong className="text-emerald-400 text-sm font-black">${prop.clientPrice.toLocaleString()} USD</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Comisión / Intermediación:</span>
                      <strong className="text-amber-300">${prop.commissionAmount.toLocaleString()} USD</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Margen Neto:</span>
                      <strong className="text-teal-300">${prop.marginAmount.toLocaleString()} USD</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="text-slate-500">
                    Duración: <strong>{prop.estimatedDurationDays} días</strong> • Garantía: <strong>{prop.warrantyMonths} meses</strong>
                  </div>

                  {prop.status !== 'APROBADA' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onApproveProposal(prop)}
                      className="text-xs py-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Registrar Aprobación del Cliente
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
