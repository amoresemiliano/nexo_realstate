import React, { useState } from 'react';
import { Lead, ActivityType, ActivityItem, TaskItem } from '../../types';
import { X, FileText, Phone, MessageCircle, Mail, Calendar, CheckCircle, Clock } from 'lucide-react';

interface LogActivityModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveActivity: (activity: ActivityItem, updatedLead?: Partial<Lead>, newTask?: TaskItem) => void;
}

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSaveActivity
}) => {
  if (!isOpen || !lead) return null;

  const [type, setType] = useState<ActivityType>('WHATSAPP');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [scheduleNextAction, setScheduleNextAction] = useState(false);
  const [nextActionType, setNextActionType] = useState<ActivityType>('LLAMADA');
  const [nextActionDate, setNextActionDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const now = new Date().toISOString();

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      leadId: lead.id,
      type,
      timestamp: now,
      authorName: lead.assignedAgent || 'Asesor Comercial',
      description: description.trim(),
      result: result.trim() || undefined,
      nextActionType: scheduleNextAction ? nextActionType : undefined,
      nextActionAt: scheduleNextAction && nextActionDate ? new Date(nextActionDate).toISOString() : undefined
    };

    let newTask: TaskItem | undefined = undefined;
    if (scheduleNextAction && nextActionDate) {
      newTask = {
        id: `task-${Date.now()}`,
        leadId: lead.id,
        leadName: lead.fullName,
        leadPhone: lead.phone,
        type: nextActionType,
        dueDate: new Date(nextActionDate).toISOString(),
        priority: 'ALTA',
        assignedSellerId: lead.assignedSellerId || 'seller-1',
        assignedSellerName: lead.assignedAgent || 'Gonzalo Rossi',
        completed: false,
        contextText: `Seguimiento agendado: ${description.substring(0, 50)}...`
      };
    }

    const updatedLeadPartial: Partial<Lead> = {
      lastActivityAt: now,
      nextActionAt: scheduleNextAction && nextActionDate ? new Date(nextActionDate).toISOString() : lead.nextActionAt,
      nextActionType: scheduleNextAction ? nextActionType : lead.nextActionType
    };

    onSaveActivity(newActivity, updatedLeadPartial, newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-400" />
            <div>
              <h3 className="text-base font-black">Registrar Gestión Comercial</h3>
              <p className="text-xs text-slate-300">{lead.fullName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-800 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tipo de Interacción</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as ActivityType)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
            >
              <option value="WHATSAPP">💬 Mensaje de WhatsApp</option>
              <option value="LLAMADA">📞 Llamada Efectiva</option>
              <option value="LLAMADA_SIN_RESPUESTA">📵 Llamada Sin Respuesta</option>
              <option value="CORREO">✉️ Correo Electrónico</option>
              <option value="NOTA_INTERNA">📝 Nota Interna de Gestión</option>
              <option value="REUNION">🤝 Reunión Presencial / Virtual</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Detalle de lo conversado *</label>
            <textarea
              rows={3}
              required
              placeholder="Ej: Se envió cotización del Lote A-2 por WhatsApp. El cliente consultó por descuento por pago contado..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Resultado / Feedback del Cliente</label>
            <input
              type="text"
              placeholder="Ej: Interesado, solicita llamada el jueves..."
              value={result}
              onChange={e => setResult(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300"
            />
          </div>

          {/* Schedule Next Action Toggle */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="schedNext"
                checked={scheduleNextAction}
                onChange={e => setScheduleNextAction(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600"
              />
              <label htmlFor="schedNext" className="font-bold text-slate-800">
                Agendar Próxima Acción Comercial
              </label>
            </div>

            {scheduleNextAction && (
              <div className="p-3 bg-brand-50/50 rounded-2xl border border-brand-200 space-y-3 animate-in fade-in">
                <div>
                  <label className="block font-bold text-brand-900 mb-1">Próxima Acción</label>
                  <select
                    value={nextActionType}
                    onChange={e => setNextActionType(e.target.value as ActivityType)}
                    className="w-full p-2 rounded-xl border border-brand-300 bg-white font-bold"
                  >
                    <option value="LLAMADA">📞 Volver a Llamar</option>
                    <option value="WHATSAPP">💬 Enviar WhatsApp</option>
                    <option value="COTIZACION">📄 Preparar / Enviar Cotización</option>
                    <option value="VISITA_AGENDADA">🗓️ Agendar Visita al Predio</option>
                    <option value="SEGUIMIENTO_REPROGRAMADO">⏳ Seguimiento Futuro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-brand-900 mb-1">Fecha y Hora Programada</label>
                  <input
                    type="datetime-local"
                    value={nextActionDate}
                    onChange={e => setNextActionDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-brand-300 bg-white font-medium"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold hover:bg-brand-700 shadow-md flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Guardar Gestión</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
