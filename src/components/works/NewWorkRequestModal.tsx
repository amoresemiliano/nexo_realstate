import React, { useState } from 'react';
import {
  PostSaleOpportunity,
  WorkRequest,
  Lot,
  ServiceCategory
} from '../../types';
import { Button } from '../ui/Button';
import { X, Sparkles, ClipboardList, CheckCircle2 } from 'lucide-react';

interface NewWorkRequestModalProps {
  isOpen: boolean;
  opportunity?: PostSaleOpportunity;
  lots: Lot[];
  customers: { id: string; name: string }[];
  onClose: () => void;
  onSubmit: (request: Partial<WorkRequest>) => void;
}

export const NewWorkRequestModal: React.FC<NewWorkRequestModalProps> = ({
  isOpen,
  opportunity,
  lots,
  customers,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<ServiceCategory>(
    opportunity?.category || 'CERRAMIENTOS_LIMITES'
  );
  const [lotId, setLotId] = useState<string>(opportunity?.lotId || lots[0]?.id || '');
  const [customerId, setCustomerId] = useState<string>(
    opportunity?.customerId || customers[0]?.id || 'cust-1'
  );
  const [title, setTitle] = useState<string>(opportunity?.title || '');
  const [description, setDescription] = useState<string>(
    opportunity?.description || ''
  );
  const [priority, setPriority] = useState<'ALTA' | 'MEDIA' | 'BAJA' | 'URGENTE'>('ALTA');
  const [budget, setBudget] = useState<number>(opportunity?.estimatedValue || 3500);
  const [siteVisitRequired, setSiteVisitRequired] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLot = lots.find(l => l.id === lotId);
    const selectedCustomer = customers.find(c => c.id === customerId);

    onSubmit({
      opportunityId: opportunity?.id,
      lotId,
      lotNumber: selectedLot?.number || lotId,
      customerId,
      customerName: selectedCustomer ? selectedCustomer.name : opportunity?.customerName || 'Cliente',
      category,
      title,
      description,
      status: 'NUEVA',
      priority,
      requestedAt: new Date().toISOString().split('T')[0],
      requestedBy: 'CLIENTE',
      budgetExpectation: budget,
      currency: 'USD',
      siteVisitRequired,
      assignedCoordinatorName: 'Ing. Gonzalo Bunge',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-black text-slate-900">Nueva Solicitud de Servicio</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {opportunity && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Generando solicitud a partir de la oportunidad: <strong>{opportunity.title}</strong></span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Categoría de Servicio:</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as ServiceCategory)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-900"
            >
              <option value="CERRAMIENTOS_LIMITES">Cerramientos y Límites</option>
              <option value="PREPARACION_TERRENO">Preparación de Terreno y Movimiento de Suelos</option>
              <option value="EXTERIOR_PAISAJISMO">Piscina, Solárium y Paisajismo</option>
              <option value="AGUA_RIEGO">Agua, Bomba y Riego</option>
              <option value="CONSTRUCCION_PROYECTO">Proyecto Arquitectónico y Construcción</option>
              <option value="ENERGIA_SOLAR">Energía Eléctrica y Solar</option>
              <option value="SERVICIOS_RECURRENTES">Servicios Recurrentes y Abonos</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Lote:</label>
              <select
                value={lotId}
                onChange={e => setLotId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-bold"
              >
                {lots.map(l => (
                  <option key={l.id} value={l.id}>
                    Lote {l.number} ({l.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Prioridad:</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-bold"
              >
                <option value="URGENTE">Urgente</option>
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Título de la Solicitud:</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej: Instalación de Cerco Perimetral Olímpico"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-900"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Descripción / Alcance Requerido:</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Detalle de trabajos solicitados por el comprador..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2 items-center">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Presupuesto Estimado (USD):</label>
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-900"
              />
            </div>

            <div className="pt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="siteVisit"
                checked={siteVisitRequired}
                onChange={e => setSiteVisitRequired(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="siteVisit" className="font-bold text-slate-800">
                Requiere Relevamiento Técnico en Terreno
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              <CheckCircle2 className="w-4 h-4" /> Crear Solicitud de Servicio
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
