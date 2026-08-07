import React, { useState } from 'react';
import { WorkRequest, TechnicalSurvey, Provider } from '../../types';
import { Button } from '../ui/Button';
import { X, Calendar, Camera, CheckCircle2, MapPin } from 'lucide-react';

interface TechnicalSurveyModalProps {
  isOpen: boolean;
  request: WorkRequest;
  providers: Provider[];
  onClose: () => void;
  onSubmit: (survey: Partial<TechnicalSurvey>) => void;
}

export const TechnicalSurveyModal: React.FC<TechnicalSurveyModalProps> = ({
  isOpen,
  request,
  providers,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [scheduledAt, setScheduledAt] = useState('2026-08-10 11:00');
  const [measurements, setMeasurements] = useState('124m lineales. Frente 20m, Fondo 20m, Laterales 42m.');
  const [terrainStatus, setTerrainStatus] = useState('Suelo firme sin agua estancada. Desmalezado adecuado.');
  const [accessInfo, setAccessInfo] = useState('Acceso directo liberado para camión con materiales.');
  const [restrictions, setRestrictions] = useState('Respetar retiro de 3m de línea municipal.');
  const [recommendations, setRecommendations] = useState('Utilizar postes reforzados en esquina sur.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      workRequestId: request.id,
      lotId: request.lotId,
      lotNumber: request.lotNumber,
      assignedUserId: 'usr-coord-1',
      assignedUserName: 'Ing. Gonzalo Bunge',
      scheduledAt,
      completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'REALIZADO',
      measurements,
      terrainStatus,
      accessInfo,
      restrictions,
      recommendations,
      simulatedPhotos: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=400&auto=format&fit=crop&q=80'
      ]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-black text-slate-900">Relevamiento Técnico de Obra</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
          <p className="font-bold text-slate-900">Lote {request.lotNumber || request.lotId} — {request.title}</p>
          <p className="text-slate-500">Cliente: {request.customerName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Fecha & Hora de Visita:</label>
            <input
              type="text"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-900"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Medidas Verificadas:</label>
            <input
              type="text"
              value={measurements}
              onChange={e => setMeasurements(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Estado del Terreno / Cota:</label>
            <input
              type="text"
              value={terrainStatus}
              onChange={e => setTerrainStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Accesos & Logística:</label>
            <input
              type="text"
              value={accessInfo}
              onChange={e => setAccessInfo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Recomendaciones del Inspector:</label>
            <textarea
              value={recommendations}
              onChange={e => setRecommendations(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900"
            />
          </div>

          <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl space-y-1">
            <span className="font-bold text-purple-900 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" /> Evidencia Fotográfica Simulada (2 Fotos)
            </span>
            <p className="text-[10px] text-purple-700">Se adjuntaron capturas del perímetro y suelo al informe técnico.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              <CheckCircle2 className="w-4 h-4" /> Finalizar Relevamiento Técnico
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
