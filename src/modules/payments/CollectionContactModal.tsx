import React, { useState } from 'react';
import { PaymentPlan, CollectionCommunication, PaymentPromise } from '../../types';
import { formatUSD } from '../../domain/rules';
import { Button } from '../../components/ui/Button';
import { X, PhoneCall, MessageSquare, Mail, Calendar, CheckCircle, Clock } from 'lucide-react';

interface CollectionContactModalProps {
  plan: PaymentPlan;
  isOpen: boolean;
  onClose: () => void;
  onSaveCommunication: (comm: CollectionCommunication) => void;
  onSavePromise?: (promise: PaymentPromise) => void;
}

export const CollectionContactModal: React.FC<CollectionContactModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSaveCommunication,
  onSavePromise,
}) => {
  if (!isOpen) return null;

  const [contactType, setContactType] = useState<'LLAMADA' | 'WHATSAPP' | 'CORREO' | 'NOTA'>('LLAMADA');
  const [result, setResult] = useState('');
  const [nextAction, setNextAction] = useState('');
  
  // Promise options
  const [hasPromise, setHasPromise] = useState(false);
  const [promisedAmount, setPromisedAmount] = useState<number>(plan.monthlyAmountUSD || 400);
  const [promisedDate, setPromisedDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const comm: CollectionCommunication = {
      id: `comm-${Date.now()}`,
      customerId: plan.customerId || 'cust-101',
      customerName: plan.customerName,
      saleId: plan.saleId,
      lotNumber: plan.lotNumber,
      type: contactType,
      agentName: 'Gonzalo Rossi',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      result: result || 'Contacto registrado por gestor de cobranzas.',
      nextAction: nextAction || undefined,
    };

    onSaveCommunication(comm);

    if (hasPromise && onSavePromise) {
      const promise: PaymentPromise = {
        id: `prom-${Date.now()}`,
        customerId: plan.customerId || 'cust-101',
        customerName: plan.customerName,
        lotNumber: plan.lotNumber,
        promisedAmount,
        promisedDate,
        installmentNumbers: [1],
        agentName: 'Gonzalo Rossi',
        status: 'VIGENTE',
        notes: result,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      onSavePromise(promise);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Registrar Gestión de Cobranza</h3>
              <p className="text-[11px] text-slate-300">
                {plan.customerName} — Lote {plan.lotNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Contact type selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Canal de Comunicación *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'LLAMADA', label: 'Llamada', icon: PhoneCall },
                { type: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare },
                { type: 'CORREO', label: 'Correo', icon: Mail },
                { type: 'NOTA', label: 'Nota', icon: Clock },
              ].map(({ type, label, icon: Icon }) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setContactType(type as any)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    contactType === type
                      ? 'bg-slate-900 text-white font-black border-slate-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[10px] block">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Resultado / Detalle de la Conversación *
            </label>
            <textarea
              rows={3}
              value={result}
              onChange={e => setResult(e.target.value)}
              placeholder="Ej: Se conversó con el cliente sobre el saldo adeudado. Indica que realizará transferencia el viernes."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Próxima Acción / Seguimiento
            </label>
            <input
              type="text"
              value={nextAction}
              onChange={e => setNextAction(e.target.value)}
              placeholder="Ej: Verificar transferencia el día viernes 12/08"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Optional Promesa de Pago */}
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-sky-950">
              <input
                type="checkbox"
                checked={hasPromise}
                onChange={e => setHasPromise(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
              <span>Registrar Promesa de Pago Formal</span>
            </label>

            {hasPromise && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sky-200/80">
                <div>
                  <label className="text-[10px] font-bold text-sky-900 block mb-1">Monto Prometido (USD)</label>
                  <input
                    type="number"
                    value={promisedAmount}
                    onChange={e => setPromisedAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-white border border-sky-300 rounded-lg text-xs font-mono font-bold text-sky-950"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-sky-900 block mb-1">Fecha Compromiso</label>
                  <input
                    type="date"
                    value={promisedDate}
                    onChange={e => setPromisedDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-sky-300 rounded-lg text-xs font-bold text-sky-950"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button variant="outline" type="button" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" size="sm" className="gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Guardar Gestión
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
