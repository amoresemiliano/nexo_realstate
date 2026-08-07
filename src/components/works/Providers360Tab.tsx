import React, { useState } from 'react';
import { Provider, ProviderDocument } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Building2,
  Star,
  ShieldAlert,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Briefcase
} from 'lucide-react';

interface Providers360TabProps {
  providers: Provider[];
  onUpdateProviderStatus?: (providerId: string, newStatus: any) => void;
}

export const Providers360Tab: React.FC<Providers360TabProps> = ({
  providers,
  onUpdateProviderStatus,
}) => {
  const [selectedProviderId, setSelectedProviderId] = useState<string>(providers[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const selectedProvider = providers.find(p => p.id === selectedProviderId);

  const filteredProviders = providers.filter(p => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-black text-slate-900">Directorio 360° de Proveedores & Homologación</h3>
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700"
        >
          <option value="ALL">Todos los Estados ({providers.length})</option>
          <option value="ACTIVO">Activos</option>
          <option value="EN_EVALUACION">En Evaluación</option>
          <option value="DOCUMENTACION_VENCIDA">Doc Vencida</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Provider Master Cards List */}
        <div className="space-y-2 md:col-span-1">
          {filteredProviders.map(prov => {
            const isSelected = prov.id === selectedProviderId;

            return (
              <Card
                key={prov.id}
                padding="sm"
                onClick={() => setSelectedProviderId(prov.id)}
                className={`cursor-pointer transition-all space-y-1.5 ${
                  isSelected
                    ? 'border-2 border-brand-500 bg-brand-50/20 shadow-sm'
                    : 'hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-black text-slate-900">{prov.organizationName}</h4>
                  <Badge
                    variant={
                      prov.status === 'ACTIVO'
                        ? 'success'
                        : prov.status === 'DOCUMENTACION_VENCIDA'
                        ? 'danger'
                        : 'warning'
                    }
                    className="text-[9px]"
                  >
                    {prov.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Rating: <strong className="text-amber-600 font-bold">{prov.rating || 4.5} ★</strong></span>
                  <span>Obras: <strong>{prov.completedWorks} realizadas</strong></span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Selected Provider Detailed 360° View */}
        {selectedProvider ? (
          <div className="md:col-span-2 space-y-3">
            <Card padding="md" className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{selectedProvider.organizationName}</h3>
                    <Badge
                      variant={
                        selectedProvider.status === 'ACTIVO'
                          ? 'success'
                          : selectedProvider.status === 'DOCUMENTACION_VENCIDA'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {selectedProvider.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Contacto: <strong className="text-slate-800">{selectedProvider.contactName}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-amber-600 block">
                    {selectedProvider.rating} ★
                  </span>
                  <span className="text-[10px] text-slate-400">Respuesta: ~{selectedProvider.averageResponseHours}hs</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>{selectedProvider.phone || 'No registrado'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span className="truncate">{selectedProvider.email || 'No registrado'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 col-span-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>Zonas: {selectedProvider.coverageAreas.join(', ')}</span>
                </div>
              </div>

              {/* Commission Model Info */}
              <div className="p-2.5 bg-brand-50/50 border border-brand-100 rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-bold text-brand-900">
                  <span>Modelo Comercial de Comisión:</span>
                  <Badge variant="brand">{selectedProvider.commissionModel || 'PERCENTAGE'}</Badge>
                </div>
                <p className="text-[11px] text-brand-800">
                  Tasa predeterminada: <strong>{selectedProvider.defaultCommissionRate}% / Fee</strong> sobre costo contratado.
                </p>
              </div>

              {/* Documentation Audit Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-purple-600" /> Auditoría de Documentación & ART
                  </h4>
                  <Badge
                    variant={
                      selectedProvider.documentationStatus === 'COMPLETA'
                        ? 'success'
                        : selectedProvider.documentationStatus === 'VENCIDA'
                        ? 'danger'
                        : 'warning'
                    }
                    className="text-[10px]"
                  >
                    Doc {selectedProvider.documentationStatus}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {selectedProvider.documents?.map(doc => (
                    <div
                      key={doc.id}
                      className="p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{doc.title}</p>
                        <p className="text-[10px] text-slate-500">Tipo: {doc.type} • Vence: {doc.expiresAt}</p>
                      </div>
                      <Badge
                        variant={
                          doc.status === 'VIGENTE'
                            ? 'success'
                            : doc.status === 'VENCIDO'
                            ? 'danger'
                            : 'warning'
                        }
                        className="text-[10px]"
                      >
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="md:col-span-2 text-slate-400 text-xs py-8 text-center">
            Selecciona un proveedor para ver su ficha 360°
          </div>
        )}
      </div>
    </div>
  );
};
