import React, { useState } from 'react';
import { Lead, LeadLossReason } from '../../types';
import { X, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';

interface LossModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmLoss: (leadId: string, lossReason: LeadLossReason, lossNote: string, recontactDate?: string) => void;
}

export const LossModal: React.FC<LossModalProps> = ({
  lead,
  isOpen,
  onClose,
  onConfirmLoss
}) => {
  if (!isOpen || !lead) return null;

  const [lossReason, setLossReason] = useState<LeadLossReason>('NO_RESPONDE');
  const [lossNote, setLossNote] = useState('');
  const [scheduleRecontact, setScheduleRecontact] = useState(false);
  const [recontactDate, setRecontactDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmLoss(
      lead.id,
      lossReason,
      lossNote.trim(),
      scheduleRecontact && recontactDate ? recontactDate : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-rose-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-300" />
            <div>
              <h3 className="text-base font-black">Marcar Lead como Perdido / Descarte</h3>
              <p className="text-xs text-rose-200">{lead.fullName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-rose-800 text-rose-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Motivo Principal de Pérdida / Descarte *</label>
            <select
              value={lossReason}
              onChange={e => setLossReason(e.target.value as LeadLossReason)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800"
            >
              <option value="NO_RESPONDE">Sin respuesta tras múltiples contactos</option>
              <option value="DATOS_INCORRECTOS">Datos de contacto incorrectos</option>
              <option value="CONTACTO_INVALIDO">Contacto inválido / Spammer</option>
              <option value="PRESUPUESTO_INSUFICIENTE">Presupuesto insuficiente</option>
              <option value="CUOTA_FUERA_ALCANCE">Cuota mensual fuera de alcance</option>
              <option value="SIN_ANTICIPO">Sin anticipo mínimo requerido</option>
              <option value="UBICACION_NO_ADECUADA">Ubicación / Zona no adecuada</option>
              <option value="PLAZO_LEJANO">Plazo de compra lejano (&gt; 1 año)</option>
              <option value="ELIGIO_OTRO_DESARROLLO">Eligió otro desarrollo competidor</option>
              <option value="PERDIO_INTERES">Perdió interés en el proyecto</option>
              <option value="NO_ACORDO_CONDICIONES">No acordó condiciones comerciales</option>
              <option value="NO_AVANZO_POST_VISITA">No avanzó posterior a la visita</option>
              <option value="DUPLICADO">Lead duplicado</option>
              <option value="OTRO">Otro motivo</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Notas de Cierre Comercial</label>
            <textarea
              rows={3}
              placeholder="Explicación detallada del motivo de pérdida..."
              value={lossNote}
              onChange={e => setLossNote(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
            />
          </div>

          {/* Optional Recontact */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="recontact"
                checked={scheduleRecontact}
                onChange={e => setScheduleRecontact(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600"
              />
              <label htmlFor="recontact" className="font-bold text-slate-800">
                Programar Recontacto Futuro (Pasar a Nurturing)
              </label>
            </div>

            {scheduleRecontact && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700">Fecha Tentativa de Recontacto</label>
                <input
                  type="date"
                  value={recontactDate}
                  onChange={e => setRecontactDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                />
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
              className="px-5 py-2.5 rounded-xl bg-rose-700 text-white font-bold hover:bg-rose-800 shadow-md flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Confirmar Pérdida</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
