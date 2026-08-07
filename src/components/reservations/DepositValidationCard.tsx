import React, { useState } from 'react';
import { Deposit, DepositRejectionReason, UserRole } from '../../types';
import { DEPOSIT_STATUS_LABELS, DEPOSIT_REJECTION_REASON_LABELS } from '../../domain/reservationDomain';
import { formatUSD } from '../../domain/rules';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle2, AlertTriangle, XCircle, FileText, ExternalLink, ShieldCheck, UserCheck, Eye } from 'lucide-react';

interface DepositValidationCardProps {
  deposit: Deposit;
  userRole: UserRole;
  onValidate: (depositId: string) => void;
  onObserve: (depositId: string, note: string) => void;
  onReject: (depositId: string, reason: DepositRejectionReason, note: string, releaseHold: boolean) => void;
  onOpenReceiptModal?: (previewUrl: string, fileName: string) => void;
}

export const DepositValidationCard: React.FC<DepositValidationCardProps> = ({
  deposit,
  userRole,
  onValidate,
  onObserve,
  onReject,
  onOpenReceiptModal,
}) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isObserveModalOpen, setIsObserveModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState<DepositRejectionReason>('PAGO_NO_IDENTIFICADO');
  const [note, setNote] = useState('');
  const [releaseHoldChoice, setReleaseHoldChoice] = useState(true);

  const statusConfig = DEPOSIT_STATUS_LABELS[deposit.status] || DEPOSIT_STATUS_LABELS.EN_VALIDACION;
  const isAdminOrTreasury = userRole === 'ADMINISTRACION' || userRole === 'ADMIN';

  const handleConfirmReject = () => {
    onReject(deposit.id, rejectReason, note, releaseHoldChoice);
    setIsRejectModalOpen(false);
  };

  const handleConfirmObserve = () => {
    onObserve(deposit.id, note);
    setIsObserveModalOpen(false);
  };

  return (
    <Card padding="md" className="space-y-3 border-l-4 border-l-indigo-600 shadow-sm hover:shadow-md transition-shadow">
      {/* Header: Lot & Status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900">
              Lote {deposit.lotNumber} (Manzana {deposit.block})
            </span>
            <span className="text-[10px] font-mono text-slate-400">Ref: {deposit.receiptReference || deposit.id}</span>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Comprador: <strong className="text-slate-900">{deposit.leadName || 'Lead registrado'}</strong>
          </p>
        </div>
        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* Financial Breakdown */}
      <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Seña Informada</span>
          <span className="font-black text-indigo-700 text-sm">{formatUSD(deposit.amount)}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Medio</span>
          <span className="font-bold text-slate-800">{deposit.paymentMethod}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Fecha Carga</span>
          <span className="font-medium text-slate-700">{deposit.reportedAt?.substring(0, 10) || 'Hoy'}</span>
        </div>
      </div>

      {/* Receipt File Preview & Note */}
      <div className="flex items-center justify-between bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100 text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-bold text-slate-800 truncate">{deposit.receiptFileName || 'Comprobante.pdf'}</span>
        </div>
        {deposit.receiptPreviewUrl && (
          <button
            onClick={() => onOpenReceiptModal?.(deposit.receiptPreviewUrl!, deposit.receiptFileName || 'Comprobante.pdf')}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2 py-1 rounded-lg border border-indigo-200"
          >
            <Eye className="w-3.5 h-3.5" /> Ver Comprobante
          </button>
        )}
      </div>

      {deposit.notes && (
        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg italic">
          "{deposit.notes}"
        </p>
      )}

      {/* Treasury Action Buttons */}
      {deposit.status === 'EN_VALIDACION' && (
        <div className="pt-1 border-t border-slate-100 space-y-2">
          {isAdminOrTreasury ? (
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => onValidate(deposit.id)}
                className="col-span-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] py-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Aprobar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsObserveModalOpen(true)}
                className="col-span-1 text-amber-700 border-amber-300 hover:bg-amber-50 font-bold text-[11px] py-2"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Observar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRejectModalOpen(true)}
                className="col-span-1 text-rose-700 border-rose-300 hover:bg-rose-50 font-bold text-[11px] py-2"
              >
                <XCircle className="w-3.5 h-3.5" /> Rechazar
              </Button>
            </div>
          ) : (
            <div className="p-2 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-[11px] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Pendiente de revisión por Tesorería. Cambia tu rol a <strong>Administración</strong> para auditar.</span>
            </div>
          )}
        </div>
      )}

      {/* Modal Observar */}
      {isObserveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 space-y-3 text-xs">
            <h3 className="font-extrabold text-slate-900 text-sm">Observar Comprobante de Seña</h3>
            <p className="text-slate-600">Solicitar aclaración o foto legible al vendedor sin anular la operación.</p>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej. El comprobante adjunto es ilegible. Reenviar foto nítida de la transferencia..."
              className="w-full border rounded-xl p-2 text-xs"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" fullWidth onClick={() => setIsObserveModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" fullWidth onClick={handleConfirmObserve} className="bg-amber-600">
                Guardar Observación
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rechazar */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 space-y-3 text-xs">
            <h3 className="font-extrabold text-rose-900 text-sm">Rechazar Comprobante de Seña</h3>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value as DepositRejectionReason)}
              className="w-full border rounded-xl p-2 text-xs font-bold"
            >
              {(Object.keys(DEPOSIT_REJECTION_REASON_LABELS) as DepositRejectionReason[]).map((rk) => (
                <option key={rk} value={rk}>
                  {DEPOSIT_REJECTION_REASON_LABELS[rk]}
                </option>
              ))}
            </select>

            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Notas del rechazo para legajo administrativo..."
              className="w-full border rounded-xl p-2 text-xs"
            />

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={releaseHoldChoice}
                onChange={(e) => setReleaseHoldChoice(e.target.checked)}
                className="rounded text-rose-600"
              />
              <span>Liberar el lote inmediatamente</span>
            </label>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" fullWidth onClick={() => setIsRejectModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="danger" size="sm" fullWidth onClick={handleConfirmReject}>
                Confirmar Rechazo
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
