import React from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { mockAlerts } from '../../data/mockData';
import { AlertTriangle, Bell, ArrowRight, ShieldAlert } from 'lucide-react';

interface NotificationsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string) => void;
}

export const NotificationsSheet: React.FC<NotificationsSheetProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Centro de Alertas Operativas"
      subtitle="Notificaciones de eventos y acciones prioritarias"
    >
      <div className="space-y-3 pt-1">
        {mockAlerts.map(alt => (
          <div
            key={alt.id}
            className={`p-3 rounded-2xl border ${
              alt.severity === 'ALTA'
                ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                alt.severity === 'ALTA' ? 'text-rose-600' : 'text-amber-600'
              }`} />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black">{alt.title}</h4>
                  <span className="text-[10px] opacity-70 font-mono">{alt.createdAt}</span>
                </div>
                <p className="text-xs opacity-90">{alt.description}</p>
                <div className="pt-2 flex items-center justify-between border-t border-black/5">
                  <span className="text-[11px] font-bold underline">
                    {alt.actionRequired}
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate(alt.targetModule);
                    }}
                    className="text-xs font-extrabold flex items-center gap-1 hover:opacity-80"
                  >
                    <span>Ir al módulo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
};
