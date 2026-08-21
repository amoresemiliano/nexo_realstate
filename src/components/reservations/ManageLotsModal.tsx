import React, { useState } from 'react';
import { Building, MapPin, X, PlusCircle, AlertCircle, CheckCircle2, Layers } from 'lucide-react';
import { Lot, Development } from '../../types';
import {
  isLotCodeDuplicated,
  buildDevelopmentEntity,
  buildLotEntity,
} from '../../services/lotService';

interface ManageLotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lots: Lot[];
  developments: Development[];
  onCreateLot: (lot: Lot) => void;
  onCreateDevelopment: (dev: Development) => void;
}

export const ManageLotsModal: React.FC<ManageLotsModalProps> = ({
  isOpen,
  onClose,
  lots,
  developments,
  onCreateLot,
  onCreateDevelopment,
}) => {
  const [activeTab, setActiveTab] = useState<'LOT' | 'DEVELOPMENT' | 'LIST'>('LOT');

  // Form Nuevo Barrio
  const [devName, setDevName] = useState('');
  const [devCity, setDevCity] = useState('');
  const [devProvince, setDevProvince] = useState('');
  const [devAddress, setDevAddress] = useState('');
  const [devDescription, setDevDescription] = useState('');
  const [devStatus, setDevStatus] = useState<'COMERCIALIZACION_ACTIVA' | 'EN_PREVENTA' | 'PROXIMAMENTE' | 'CERRADO'>('COMERCIALIZACION_ACTIVA');

  // Form Nuevo Lote
  const [selectedDevId, setSelectedDevId] = useState<string>(developments[0]?.id || '');
  const [lotNumber, setLotNumber] = useState('');
  const [lotBlock, setLotBlock] = useState('A');
  const [surfaceM2, setSurfaceM2] = useState<number | ''>(500);
  const [priceUSD, setPriceUSD] = useState<number | ''>(35000);
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const [lotStatus, setLotStatus] = useState<Lot['status']>('DISPONIBLE');
  const [orientation, setOrientation] = useState<'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Esquina'>('Norte');
  const [observations, setObservations] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Barrio Submit
  const handleDevSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!devName.trim()) {
      newErrors.devName = 'El nombre del barrio/desarrollo es obligatorio.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newDev = buildDevelopmentEntity({
      name: devName,
      city: devCity,
      province: devProvince,
      address: devAddress,
      description: devDescription,
      status: devStatus,
    });

    try {
      await onCreateDevelopment(newDev);
      setDevName('');
      setDevCity('');
      setDevProvince('');
      setDevAddress('');
      setDevDescription('');
      setErrors({});
      setSuccessMsg(`Barrio "${newDev.name}" creado correctamente.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      setActiveTab('LOT');
    } catch (err: any) {
      setErrors({ devName: err.message || 'Ocurrió un error al crear el barrio.' });
    }
  };

  // Handle Lote Submit
  const handleLotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!selectedDevId) {
      newErrors.selectedDevId = 'Debe seleccionar o crear un barrio previamente.';
    }
    if (!lotNumber.trim()) {
      newErrors.lotNumber = 'El código/número de lote es obligatorio.';
    } else if (selectedDevId && isLotCodeDuplicated(lots, selectedDevId, lotNumber)) {
      newErrors.lotNumber = `El código de lote "${lotNumber.trim()}" ya existe en este barrio. Por favor ingrese un número distinto.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const currentDev = developments.find((d) => d.id === selectedDevId);
    const newLot = buildLotEntity(
      {
        developmentId: selectedDevId,
        number: lotNumber,
        block: lotBlock,
        surfaceM2: Number(surfaceM2) || 0,
        priceUSD: Number(priceUSD) || 0,
        currency,
        status: lotStatus,
        orientation,
        observations,
      },
      currentDev?.name
    );

    try {
      await onCreateLot(newLot);
      setLotNumber('');
      setObservations('');
      setErrors({});
      setSuccessMsg(`Lote #${newLot.number} (Manzana ${newLot.block}) agregado y disponible para reservas.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrors({ lotNumber: err.message || 'Ya existe un lote con ese código en el barrio seleccionado.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Gestión de Barrios y Lotes</h3>
              <p className="text-[11px] text-slate-400">Inventario comercial interno para reservas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 p-1.5 border-b border-slate-200 flex items-center justify-between gap-1 shrink-0">
          <button
            onClick={() => {
              setActiveTab('LOT');
              setErrors({});
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'LOT'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            + Cargar Lote
          </button>

          <button
            onClick={() => {
              setActiveTab('DEVELOPMENT');
              setErrors({});
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'DEVELOPMENT'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            + Nuevo Barrio
          </button>

          <button
            onClick={() => {
              setActiveTab('LIST');
              setErrors({});
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'LIST'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ver Lotes ({lots.length})
          </button>
        </div>

        {/* Success Alert Notice */}
        {successMsg && (
          <div className="mx-4 mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs">
          {/* TAB 1: FORM CARGAR LOTE */}
          {activeTab === 'LOT' && (
            <form onSubmit={handleLotSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Barrio / Emprendimiento *</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('DEVELOPMENT')}
                    className="text-[10px] font-bold text-brand-600 hover:underline"
                  >
                    + Nuevo Barrio
                  </button>
                </div>
                <select
                  value={selectedDevId}
                  onChange={(e) => {
                    setSelectedDevId(e.target.value);
                    if (errors.selectedDevId) setErrors((prev) => ({ ...prev, selectedDevId: '' }));
                  }}
                  className={`w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold ${
                    errors.selectedDevId ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-250'
                  }`}
                >
                  {developments.length === 0 && <option value="">Sin barrios disponibles</option>}
                  {developments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({typeof d.location === 'string' ? d.location : d.location.city})
                    </option>
                  ))}
                </select>
                {errors.selectedDevId && (
                  <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.selectedDevId}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Número / Código de Lote *</label>
                  <input
                    type="text"
                    placeholder="Ej. 12B o Lote-45"
                    value={lotNumber}
                    onChange={(e) => {
                      setLotNumber(e.target.value);
                      if (errors.lotNumber) setErrors((prev) => ({ ...prev, lotNumber: '' }));
                    }}
                    className={`w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold ${
                      errors.lotNumber ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-250'
                    }`}
                  />
                  {errors.lotNumber && (
                    <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.lotNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manzana / Bloque</label>
                  <input
                    type="text"
                    placeholder="Ej. Manzana A"
                    value={lotBlock}
                    onChange={(e) => setLotBlock(e.target.value)}
                    className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Superficie (m²)</label>
                  <input
                    type="number"
                    placeholder="500"
                    value={surfaceM2}
                    onChange={(e) => setSurfaceM2(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Precio *</label>
                  <input
                    type="number"
                    placeholder="35000"
                    value={priceUSD}
                    onChange={(e) => setPriceUSD(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Moneda</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="ARS">ARS ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estado del Lote *</label>
                  <select
                    value={lotStatus}
                    onChange={(e) => setLotStatus(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                  >
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="BLOQUEADO">Bloqueado (48hs)</option>
                    <option value="RESERVADO">Reservado</option>
                    <option value="VENDIDO">Vendido</option>
                    <option value="NO_COMERCIALIZABLE">No Disponible</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Orientación</label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                  >
                    <option value="Norte">Norte</option>
                    <option value="Sur">Sur</option>
                    <option value="Este">Este</option>
                    <option value="Oeste">Oeste</option>
                    <option value="Esquina">Esquina</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Detalles particulares del lote..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Cargar Lote
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: FORM NUEVO BARRIO */}
          {activeTab === 'DEVELOPMENT' && (
            <form onSubmit={handleDevSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre del Barrio / Desarrollo *</label>
                <input
                  type="text"
                  placeholder="Ej. Barrio Privado Los Aromos"
                  value={devName}
                  onChange={(e) => {
                    setDevName(e.target.value);
                    if (errors.devName) setErrors((prev) => ({ ...prev, devName: '' }));
                  }}
                  className={`w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold ${
                    errors.devName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-250'
                  }`}
                />
                {errors.devName && (
                  <p className="text-[10px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.devName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Localidad</label>
                  <input
                    type="text"
                    placeholder="Ej. Pilar"
                    value={devCity}
                    onChange={(e) => setDevCity(e.target.value)}
                    className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Provincia</label>
                  <input
                    type="text"
                    placeholder="Ej. Buenos Aires"
                    value={devProvince}
                    onChange={(e) => setDevProvince(e.target.value)}
                    className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dirección / Zona</label>
                <input
                  type="text"
                  placeholder="Ej. Ruta 28 Km 4.5"
                  value={devAddress}
                  onChange={(e) => setDevAddress(e.target.value)}
                  className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estado de Comercialización</label>
                <select
                  value={devStatus}
                  onChange={(e) => setDevStatus(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold"
                >
                  <option value="COMERCIALIZACION_ACTIVA">Activo (Comercialización Activa)</option>
                  <option value="EN_PREVENTA">Próximamente / En Preventa</option>
                  <option value="CERRADO">Cerrado</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Características principales del desarrollo..."
                  value={devDescription}
                  onChange={(e) => setDevDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-250 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('LOT')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Volver a Lotes
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Crear Barrio
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: LISTADO DE LOTES EXISTENTES */}
          {activeTab === 'LIST' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase">Inventario Disponible para Reserva</h4>
                <span className="text-[10px] text-slate-500 font-bold">{lots.length} Lotes Cargar</span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {lots.map((l) => {
                  const dev = developments.find((d) => d.id === l.developmentId);
                  return (
                    <div
                      key={l.id}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span>Lote #{l.number}</span>
                          <span className="text-[10px] text-slate-500">(Mz. {l.block})</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {dev?.name || 'Desarrollo Principal'} • {l.surfaceM2} m²
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 block">${l.priceUSD} USD</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                          {l.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
