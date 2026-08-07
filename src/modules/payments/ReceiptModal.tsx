import React from 'react';
import { ReceiptInternal } from '../../types';
import { formatUSD, formatARS } from '../../domain/rules';
import { Button } from '../../components/ui/Button';
import { X, Printer, Download, CheckCircle, Shield, Building2 } from 'lucide-react';

interface ReceiptModalProps {
  receipt: ReceiptInternal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, isOpen, onClose }) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Controls */}
        <div className="bg-slate-900 text-white p-3 px-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Recibo Interno Generado
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Printable Card */}
        <div className="p-6 space-y-5 bg-gradient-to-b from-slate-50 to-white print:p-0 print:bg-white" id="printable-receipt">
          
          {/* Company Branding */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-brand-400 font-black flex items-center justify-center text-xs">
                  NX
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    NEXO DESARROLLOS S.A.
                  </h2>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Desarrollos e Inversiones Inmobiliarias
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">
                RECIBO N°
              </span>
              <span className="text-sm font-black text-brand-600 font-mono">
                {receipt.number}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs">
            <div className="bg-slate-100/80 p-3 rounded-xl space-y-1.5 border border-slate-200/80">
              <div className="flex justify-between text-slate-600">
                <span>Fecha de Emisión:</span>
                <strong className="text-slate-900">{receipt.issuedAt}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cliente:</span>
                <strong className="text-slate-900">{receipt.customerName}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Unidad / Lote:</span>
                <strong className="text-slate-900">Lote {receipt.lotNumber}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Medio de Pago:</span>
                <strong className="text-slate-900">{receipt.paymentMethod}</strong>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Concepto de Pago
              </span>
              <p className="text-xs font-semibold text-slate-800">
                {receipt.concept}
              </p>
            </div>

            {/* Total Highlight */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-emerald-800 tracking-wider block">
                Monto Recibido
              </span>
              <div className="text-2xl font-black text-emerald-900 font-mono">
                {receipt.currency === 'USD' ? formatUSD(receipt.amount) : formatARS(receipt.amount)}
              </div>
              <p className="text-[10px] text-emerald-700">
                Equivalente aprox: {formatARS(receipt.amount * 1180)}
              </p>
            </div>

            <div className="pt-2 flex justify-between text-[11px] text-slate-500 border-t border-slate-200">
              <span>Operador: {receipt.agentName}</span>
              <span>Estado: <strong className="text-emerald-700">Acreditado</strong></span>
            </div>

            {/* Legal Disclaimer */}
            <div className="p-2.5 bg-slate-50 rounded-lg text-[9px] text-slate-400 text-center leading-tight border border-slate-200/60">
              <strong>DOCUMENTO NO VÁLIDO COMO FACTURA.</strong>
              <br />
              Comprobante de pago interno emitido por Nexo Desarrollos S.A. Sujeto a posterior conciliación bancaria definitiva.
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 no-print">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1 text-xs">
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </Button>
            <Button variant="primary" size="sm" onClick={onClose} className="gap-1 text-xs">
              <CheckCircle className="w-3.5 h-3.5" />
              Aceptar
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};
