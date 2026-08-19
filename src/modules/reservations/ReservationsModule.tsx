import React, { useState } from 'react';
import {
  LotHold,
  Reservation,
  Lot,
  Lead,
  Quote,
  Deposit,
  ReservationIntent,
  UserRole,
  LotHoldReason,
  LotHoldReleaseReason,
  PaymentMethod,
  DepositRejectionReason,
  ReservationCancellationReason,
  Development,
} from '../../types';
import {
  canBlockLot,
  getHoldCountdown,
  HOLD_REASON_LABELS,
  DEPOSIT_STATUS_LABELS,
  RESERVATION_NEXT_STEP_LABELS,
} from '../../domain/reservationDomain';
import { formatUSD } from '../../domain/rules';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

import { HoldStatusBadge } from '../../components/reservations/HoldStatusBadge';
import { LotHoldCountdown } from '../../components/reservations/LotHoldCountdown';
import { CreateHoldModal } from '../../components/reservations/CreateHoldModal';
import { DepositPromiseForm } from '../../components/reservations/DepositPromiseForm';
import { DepositReportForm } from '../../components/reservations/DepositReportForm';
import { DepositValidationCard } from '../../components/reservations/DepositValidationCard';
import { ReservationCard } from '../../components/reservations/ReservationCard';
import { ReservationDetailDrawer } from '../../components/reservations/ReservationDetailDrawer';
import { ReleaseLotDialog } from '../../components/reservations/ReleaseLotDialog';
import { CancelReservationDialog } from '../../components/reservations/CancelReservationDialog';
import { ChangeLotFlow } from '../../components/reservations/ChangeLotFlow';
import { ManageLotsModal } from '../../components/reservations/ManageLotsModal';

import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  ShieldCheck,
  XCircle,
  Search,
  Filter,
  Plus,
  ArrowRight,
  TrendingUp,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Eye,
  X,
  Upload,
  ChevronRight,
  User,
  MapPin,
} from 'lucide-react';

interface ReservationsModuleProps {
  holds: LotHold[];
  reservations: Reservation[];
  deposits: Deposit[];
  intents: ReservationIntent[];
  lots: Lot[];
  leads: Lead[];
  quotes: Quote[];
  developments?: Development[];
  userRole?: UserRole;
  onChangeUserRole?: (role: UserRole) => void;
  onCreateLot?: (lot: Lot) => void;
  onCreateDevelopment?: (dev: Development) => void;

  // Domain state action handlers from App.tsx
  onCreateHold: (params: {
    lotId: string;
    leadId: string;
    quoteId?: string;
    quoteOptionId?: string;
    durationHours: number;
    reason: LotHoldReason;
    notes?: string;
  }) => void;

  onRegisterPromise: (params: {
    holdId?: string;
    intentId?: string;
    promisedAmount: number;
    currency: 'USD' | 'ARS';
    paymentMethod: PaymentMethod;
    promisedDateIso: string;
    notes?: string;
  }) => void;

  onReportDeposit: (params: {
    holdId?: string;
    intentId?: string;
    amount: number;
    currency: 'USD' | 'ARS';
    paymentMethod: PaymentMethod;
    receiptReference: string;
    receiptFileName: string;
    receiptPreviewUrl?: string;
    paidAtIso: string;
    notes?: string;
  }) => void;

  onValidateDeposit: (depositId: string) => void;
  onObserveDeposit: (depositId: string, note: string) => void;
  onRejectDeposit: (
    depositId: string,
    reason: DepositRejectionReason,
    note: string,
    releaseHold: boolean
  ) => void;

  onReleaseHold: (
    holdId: string,
    releaseReason: LotHoldReleaseReason,
    notes?: string
  ) => void;

  onToggleChecklist: (resId: string, itemId: string) => void;

  onCancelReservation: (params: {
    reservationId: string;
    reason: ReservationCancellationReason;
    refundDeposit: boolean;
    notes?: string;
  }) => void;

  onChangeLot: (params: {
    entityId: string;
    entityType: 'HOLD' | 'RESERVATION';
    newLotId: string;
    notes?: string;
  }) => void;

  onPrepareSale?: (res: Reservation) => void;
}

export const ReservationsModule: React.FC<ReservationsModuleProps> = ({
  holds,
  reservations,
  deposits,
  intents,
  lots,
  leads,
  quotes,
  developments,
  userRole = 'VENDEDOR',
  onChangeUserRole,
  onCreateHold,
  onRegisterPromise,
  onReportDeposit,
  onValidateDeposit,
  onObserveDeposit,
  onRejectDeposit,
  onReleaseHold,
  onToggleChecklist,
  onCancelReservation,
  onChangeLot,
  onCreateLot,
  onCreateDevelopment,
  onPrepareSale,
}) => {
  // Navigation Sub-tabs
  const [activeTab, setActiveTab] = useState<
    'TODOS' | 'HOLDS' | 'VALIDACION' | 'CONFIRMADAS' | 'EXPIRACIONES' | 'HISTORIAL'
  >('HOLDS');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [blockFilter, setBlockFilter] = useState<string>('ALL');

  // Modal & Drawer State
  const [isCreateHoldOpen, setIsCreateHoldOpen] = useState(false);
  const [isManageLotsOpen, setIsManageLotsOpen] = useState(false);
  const [isPromiseFormOpen, setIsPromiseFormOpen] = useState(false);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [selectedHoldForPromise, setSelectedHoldForPromise] = useState<LotHold | null>(null);
  const [selectedHoldForReport, setSelectedHoldForReport] = useState<LotHold | null>(null);

  const [selectedReservationDetail, setSelectedReservationDetail] = useState<Reservation | null>(null);
  const [selectedHoldToRelease, setSelectedHoldToRelease] = useState<LotHold | null>(null);
  const [selectedResToCancel, setSelectedResToCancel] = useState<Reservation | null>(null);
  const [selectedEntityToChangeLot, setSelectedEntityToChangeLot] = useState<LotHold | Reservation | null>(null);

  // Receipt Modal Lightbox
  const [receiptLightboxUrl, setReceiptLightboxUrl] = useState<string | null>(null);
  const [receiptLightboxTitle, setReceiptLightboxTitle] = useState<string>('');

  // Filtering Logic
  const filteredHolds = holds.filter((h) => {
    const matchesQuery =
      h.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.block.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlock = blockFilter === 'ALL' || h.block === blockFilter;
    return matchesQuery && matchesBlock;
  });

  const filteredDeposits = deposits.filter((d) => {
    const matchesQuery =
      (d.lotNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.leadName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.receiptReference || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  const filteredReservations = reservations.filter((r) => {
    const matchesQuery =
      r.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.reservationNumber && r.reservationNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesQuery;
  });

  // KPI Metrics Calculation
  const activeHoldsCount = holds.filter((h) => h.status === 'ACTIVO' || h.status === 'PROXIMO_A_VENCER').length;
  const pendingDepositsCount = deposits.filter((d) => d.status === 'EN_VALIDACION').length;
  const confirmedReservationsCount = reservations.filter((r) => ['CONFIRMADA', 'SENA_VALIDADA'].includes(r.status)).length;
  const totalVolumeUSD = reservations
    .filter((r) => ['CONFIRMADA', 'SENA_VALIDADA'].includes(r.status))
    .reduce((acc, r) => acc + (r.agreedPrice || r.agreedPriceUSD || 0), 0);

  const expiringHolds = holds.filter((h) => {
    const countdown = getHoldCountdown(h.expiresAtIso || h.expiresAt || h.expiryDate);
    return countdown.isCritical && h.status === 'ACTIVO';
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Header & Role Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs">FASE 4</span>
              <h1 className="text-lg font-black tracking-tight">Gestión de Señas & Reservas</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Control de bloqueos temporales, promesas, recepción de comprobantes y validación de Tesorería.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsManageLotsOpen(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 text-xs"
            >
              <MapPin className="w-4 h-4 text-amber-400" /> Gestionar Barrios y Lotes
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => setIsCreateHoldOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold shadow-md text-xs"
            >
              <Clock className="w-4 h-4" /> Nuevo Bloqueo
            </Button>
          </div>
        </div>

        {/* Role Selector Simulation */}
        {onChangeUserRole && (
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] font-bold flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-400" /> Simular Rol Comercial / Admin:
            </span>
            <div className="flex gap-1 overflow-x-auto">
              {[
                { role: 'VENDEDOR', label: 'Vendedor' },
                { role: 'GERENTE_COMERCIAL', label: 'Gerente' },
                { role: 'ADMINISTRACION', label: 'Tesorería' },
                { role: 'ADMIN', label: 'Director' },
              ].map((r) => (
                <button
                  key={r.role}
                  onClick={() => onChangeUserRole(r.role as UserRole)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-colors ${
                    userRole === r.role
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Domain Core Rule Banner */}
      <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3 text-indigo-950">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-extrabold text-indigo-950">Regla Indefectible de Reserva</p>
          <p className="text-[11px] text-indigo-800 mt-0.5 leading-relaxed">
            Un lote pasa a estado <strong>RESERVADO</strong> únicamente tras la aprobación y acreditación de la seña por parte de <strong>Tesorería / Administración</strong>. Manifestaciones verbales no constituyen reserva firme.
          </p>
        </div>
      </div>

      {/* KPI Dashboard Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <Card padding="sm" className="space-y-1 bg-amber-50/50 border-amber-200">
          <div className="flex items-center justify-between text-amber-800 font-bold text-[10px]">
            <span>Bloqueos Activos</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-xl font-black text-amber-950">{activeHoldsCount}</p>
          <span className="text-[10px] text-amber-700 font-medium">Lotes con reserva temporal</span>
        </Card>

        <Card padding="sm" className="space-y-1 bg-indigo-50/50 border-indigo-200">
          <div className="flex items-center justify-between text-indigo-800 font-bold text-[10px]">
            <span>En Validación (Tesorería)</span>
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <p className="text-xl font-black text-indigo-950">{pendingDepositsCount}</p>
          <span className="text-[10px] text-indigo-700 font-medium">Comprobantes por auditar</span>
        </Card>

        <Card padding="sm" className="space-y-1 bg-emerald-50/50 border-emerald-200">
          <div className="flex items-center justify-between text-emerald-800 font-bold text-[10px]">
            <span>Reservas Confirmadas</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-950">{confirmedReservationsCount}</p>
          <span className="text-[10px] text-emerald-700 font-medium">Señas validadas y cerradas</span>
        </Card>

        <Card padding="sm" className="space-y-1 bg-slate-900 text-white border-slate-800">
          <div className="flex items-center justify-between text-slate-400 font-bold text-[10px]">
            <span>Volumen Reservado</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-base font-black text-amber-400">{formatUSD(totalVolumeUSD)}</p>
          <span className="text-[10px] text-slate-400 font-medium">Monto acumulado firmado</span>
        </Card>
      </div>

      {/* Critical Expirations Alert Header */}
      {expiringHolds.length > 0 && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-950 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-extrabold">
              Atención: {expiringHolds.length} {expiringHolds.length === 1 ? 'bloqueo vence' : 'bloqueos vencen'} en menos de 2 horas.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('EXPIRACIONES')}
            className="text-[11px] font-black text-rose-700 underline hover:text-rose-900"
          >
            Ver Vencimientos
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex gap-2 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por lote, manzana o comprador..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-bold placeholder:font-normal focus:ring-2 focus:ring-amber-500 shadow-sm"
          />
        </div>

        <select
          value={blockFilter}
          onChange={(e) => setBlockFilter(e.target.value)}
          className="bg-white border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-800 shadow-sm shrink-0"
        >
          <option value="ALL">Todas las Manzanas</option>
          <option value="A">Manzana A</option>
          <option value="B">Manzana B</option>
          <option value="C">Manzana C</option>
          <option value="D">Manzana D</option>
          <option value="E">Manzana E</option>
        </select>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('HOLDS')}
          className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'HOLDS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" /> Bloqueos ({holds.filter((h) => h.status === 'ACTIVO' || h.status === 'PROXIMO_A_VENCER').length})
        </button>

        <button
          onClick={() => setActiveTab('VALIDACION')}
          className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 relative ${
            activeTab === 'VALIDACION' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          Bandeja Tesorería ({pendingDepositsCount})
          {pendingDepositsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('CONFIRMADAS')}
          className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'CONFIRMADAS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Reservas ({confirmedReservationsCount})
        </button>

        <button
          onClick={() => setActiveTab('EXPIRACIONES')}
          className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'EXPIRACIONES' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Vencimientos ({expiringHolds.length})
        </button>

        <button
          onClick={() => setActiveTab('HISTORIAL')}
          className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'HISTORIAL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" /> Historial General
        </button>
      </div>

      {/* TAB 1: HOLDS / BLOQUEOS TEMPORALES */}
      {activeTab === 'HOLDS' && (
        <div className="space-y-3">
          {filteredHolds.filter((h) => ['ACTIVO', 'PROXIMO_A_VENCER'].includes(h.status)).length === 0 ? (
            <Card padding="md" className="text-center py-10 text-slate-500">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-extrabold text-slate-800 text-sm">No hay bloqueos activos actualmente.</p>
              <p className="text-xs text-slate-500 mt-1">Haz clic en "Nuevo Bloqueo" para reservar un lote temporalmente.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateHoldOpen(true)}
                className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                + Crear Bloqueo Temporal
              </Button>
            </Card>
          ) : (
            filteredHolds
              .filter((h) => ['ACTIVO', 'PROXIMO_A_VENCER'].includes(h.status))
              .map((hold) => (
                <Card key={hold.id} padding="md" className="space-y-3 border-l-4 border-l-amber-500 shadow-sm">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">
                          Lote {hold.lotNumber} (Manzana {hold.block})
                        </span>
                        <HoldStatusBadge status={hold.status} size="sm" />
                      </div>
                      <span className="text-xs text-slate-600 font-medium block mt-0.5">
                        Lead: <strong className="text-slate-900">{hold.leadName}</strong>
                      </span>
                    </div>

                    <LotHoldCountdown expiresAtIso={hold.expiresAtIso || hold.expiresAt || hold.expiryDate} size="sm" />
                  </div>

                  {/* Context Info */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Motivo Bloqueo</span>
                      <span className="font-bold text-slate-800">{HOLD_REASON_LABELS[hold.reason || 'COTIZACION_ACEPTADA']}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Agente Comercial</span>
                      <span className="font-bold text-slate-800">{hold.agentName || 'Gonzalo Rossi'}</span>
                    </div>
                  </div>

                  {hold.notes && (
                    <p className="text-xs text-slate-600 bg-amber-50/50 p-2 rounded-lg italic border border-amber-100/60">
                      "{hold.notes}"
                    </p>
                  )}

                  {/* Actions bar for Hold */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          setSelectedHoldForReport(hold);
                          setIsReportFormOpen(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs"
                      >
                        <Upload className="w-3.5 h-3.5" /> Informar Seña (Comprobante)
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedHoldForPromise(hold);
                          setIsPromiseFormOpen(true);
                        }}
                        className="text-sky-700 border-sky-300 hover:bg-sky-50 font-bold shrink-0 text-xs"
                      >
                        + Promesa
                      </Button>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => setSelectedEntityToChangeLot(hold)}
                        className="flex-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 py-1 hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Cambiar Lote
                      </button>
                      <button
                        onClick={() => setSelectedHoldToRelease(hold)}
                        className="flex-1 text-[11px] font-bold text-rose-700 hover:text-rose-900 py-1 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3 h-3" /> Liberar Lote
                      </button>
                    </div>
                  </div>
                </Card>
              ))
          )}
        </div>
      )}

      {/* TAB 2: VALIDACIÓN DE TESORERÍA / COMPROBANTES */}
      {activeTab === 'VALIDACION' && (
        <div className="space-y-3">
          {filteredDeposits.length === 0 ? (
            <Card padding="md" className="text-center py-10 text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
              <p className="font-extrabold text-slate-800 text-sm">Bandeja de Tesorería al Día</p>
              <p className="text-xs text-slate-500 mt-1">No hay comprobantes pendientes de validación por la administración.</p>
            </Card>
          ) : (
            filteredDeposits.map((deposit) => (
              <DepositValidationCard
                key={deposit.id}
                deposit={deposit}
                userRole={userRole}
                onValidate={onValidateDeposit}
                onObserve={onObserveDeposit}
                onReject={onRejectDeposit}
                onOpenReceiptModal={(url, title) => {
                  setReceiptLightboxUrl(url);
                  setReceiptLightboxTitle(title);
                }}
              />
            ))
          )}
        </div>
      )}

      {/* TAB 3: RESERVAS CONFIRMADAS */}
      {activeTab === 'CONFIRMADAS' && (
        <div className="space-y-3">
          {filteredReservations.filter((r) => ['CONFIRMADA', 'SENA_VALIDADA'].includes(r.status)).length === 0 ? (
            <Card padding="md" className="text-center py-10 text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-extrabold text-slate-800 text-sm">No hay reservas confirmadas registradas.</p>
            </Card>
          ) : (
            filteredReservations
              .filter((r) => ['CONFIRMADA', 'SENA_VALIDADA'].includes(r.status))
              .map((res) => (
                <ReservationCard
                  key={res.id}
                  reservation={res}
                  userRole={userRole}
                  onOpenDetail={(r) => setSelectedReservationDetail(r)}
                  onPrepareSale={onPrepareSale}
                />
              ))
          )}
        </div>
      )}

      {/* TAB 4: EXPIRACIONES / CRÍTICOS */}
      {activeTab === 'EXPIRACIONES' && (
        <div className="space-y-3">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 font-medium">
            Muestra únicamente los bloqueos temporales que han expirado o se encuentran próximos a vencer en menos de 2 horas.
          </div>

          {expiringHolds.length === 0 ? (
            <Card padding="md" className="text-center py-10 text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-extrabold text-slate-800 text-sm">No hay bloqueos en riesgo de expiración crítica.</p>
            </Card>
          ) : (
            expiringHolds.map((hold) => (
              <Card key={hold.id} padding="md" className="space-y-3 border-l-4 border-l-rose-600 bg-rose-50/30">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-black text-slate-900">
                      Lote {hold.lotNumber} (Manzana {hold.block})
                    </span>
                    <span className="text-xs text-slate-600 block">Lead: {hold.leadName}</span>
                  </div>
                  <LotHoldCountdown expiresAtIso={hold.expiresAtIso || hold.expiresAt || hold.expiryDate} size="md" />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setSelectedHoldForReport(hold);
                      setIsReportFormOpen(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold"
                  >
                    Informar Seña Urgente
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setSelectedHoldToRelease(hold)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold"
                  >
                    Liberar
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 5: HISTORIAL GENERAL */}
      {activeTab === 'HISTORIAL' && (
        <div className="space-y-3">
          <Card padding="md" className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Historial Auditado de Operaciones</h3>
            <div className="space-y-2 text-xs">
              {holds
                .filter((h) => ['LIBERADO', 'CANCELADO', 'VENCIDO', 'CONVERTIDO'].includes(h.status))
                .map((h) => (
                  <div key={h.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Lote {h.lotNumber}</span>
                      <span className="text-slate-500 text-[11px] block">{h.leadName}</span>
                    </div>
                    <HoldStatusBadge status={h.status} size="sm" />
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {/* MODALS & DRAWERS */}
      {/* 1. Modal Nuevo Bloqueo */}
      <CreateHoldModal
        isOpen={isCreateHoldOpen}
        onClose={() => setIsCreateHoldOpen(false)}
        lots={lots}
        leads={leads}
        quotes={quotes}
        activeHolds={holds}
        onConfirmHold={onCreateHold}
      />

      {/* 2. Form Promesa de Seña */}
      <DepositPromiseForm
        isOpen={isPromiseFormOpen}
        onClose={() => setIsPromiseFormOpen(false)}
        hold={selectedHoldForPromise}
        onConfirmPromise={onRegisterPromise}
      />

      {/* 3. Form Informar Seña (Comprobante) */}
      <DepositReportForm
        isOpen={isReportFormOpen}
        onClose={() => setIsReportFormOpen(false)}
        hold={selectedHoldForReport}
        onReportDeposit={onReportDeposit}
      />

      {/* 4. Drawer Ficha de Reserva & Checklist */}
      <ReservationDetailDrawer
        isOpen={!!selectedReservationDetail}
        onClose={() => setSelectedReservationDetail(null)}
        reservation={selectedReservationDetail}
        userRole={userRole}
        onToggleChecklist={onToggleChecklist}
        onPrepareSale={(res) => {
          setSelectedReservationDetail(null);
          onPrepareSale?.(res);
        }}
        onChangeLot={(res) => {
          setSelectedReservationDetail(null);
          setSelectedEntityToChangeLot(res);
        }}
        onCancelReservation={(res) => {
          setSelectedReservationDetail(null);
          setSelectedResToCancel(res);
        }}
      />

      {/* 5. Dialog Liberar Lote */}
      <ReleaseLotDialog
        isOpen={!!selectedHoldToRelease}
        onClose={() => setSelectedHoldToRelease(null)}
        hold={selectedHoldToRelease}
        onConfirmRelease={onReleaseHold}
      />

      {/* 6. Dialog Cancelar Reserva */}
      <CancelReservationDialog
        isOpen={!!selectedResToCancel}
        onClose={() => setSelectedResToCancel(null)}
        reservation={selectedResToCancel}
        onConfirmCancel={onCancelReservation}
      />

      {/* 7. Flow Cambiar de Lote */}
      <ChangeLotFlow
        isOpen={!!selectedEntityToChangeLot}
        onClose={() => setSelectedEntityToChangeLot(null)}
        entity={selectedEntityToChangeLot}
        lots={lots}
        onConfirmChangeLot={onChangeLot}
      />

      {/* Modal Carga y Gestión de Barrios y Lotes */}
      <ManageLotsModal
        isOpen={isManageLotsOpen}
        onClose={() => setIsManageLotsOpen(false)}
        lots={lots}
        developments={developments || []}
        onCreateLot={(newLot) => {
          if (onCreateLot) onCreateLot(newLot);
        }}
        onCreateDevelopment={(newDev) => {
          if (onCreateDevelopment) onCreateDevelopment(newDev);
        }}
      />

      {/* 8. Lightbox visualizador de comprobante */}
      {receiptLightboxUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-extrabold text-xs">{receiptLightboxTitle}</span>
              <button
                onClick={() => setReceiptLightboxUrl(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto bg-slate-100 flex items-center justify-center min-h-[300px]">
              <img
                src={receiptLightboxUrl}
                alt="Comprobante de Pago"
                className="rounded-2xl max-h-[500px] object-contain shadow-lg border"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
