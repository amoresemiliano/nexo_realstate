import React, { useState } from 'react';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { NotificationItem, UserRole } from '../../types';
import { Bell, ArrowRight, CheckCheck, ShieldAlert, Sparkles, X } from 'lucide-react';

interface NotificationsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  userRole: UserRole;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onNavigate: (moduleKey: string) => void;
}

export const NotificationsSheet: React.FC<NotificationsSheetProps> = ({
  isOpen,
  onClose,
  notifications,
  userRole,
  onMarkAllAsRead,
  onMarkAsRead,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'UNREAD' | 'TODAY' | 'ALL'>('UNREAD');

  // Filter notifications for active user role
  const roleNotifications = notifications.filter(
    n => !n.role || n.role === userRole || userRole === 'GERENCIA'
  );

  const unreadCount = roleNotifications.filter(n => !n.readAt).length;

  const filteredNotifications = roleNotifications.filter(n => {
    if (activeTab === 'UNREAD') return !n.readAt;
    if (activeTab === 'TODAY') return true; // all items in mock are today/recent
    return true;
  });

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Centro de Notificaciones Ecosistémico"
      subtitle={`Novedades y alertas en tiempo real para el rol ${userRole}`}
    >
      <div className="space-y-3 pt-1 pb-4">
        {/* TOP CONTROLS */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1">
            {[
              { id: 'UNREAD', label: `No Leídas (${unreadCount})` },
              { id: 'TODAY', label: 'Recientes' },
              { id: 'ALL', label: `Todas (${roleNotifications.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white font-black'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-extrabold text-amber-700 hover:underline flex items-center gap-1 shrink-0"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Marcar todas leídas
            </button>
          )}
        </div>

        {/* NOTIFICATIONS LIST */}
        {filteredNotifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No hay notificaciones en esta bandeja.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map(n => (
              <div
                key={n.id}
                className={`p-3 rounded-2xl border transition-all ${
                  !n.readAt
                    ? n.severity === 'CRITICA' || n.severity === 'ALTA'
                      ? 'bg-rose-50/80 border-rose-200 text-rose-950 font-medium'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-700 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Badge variant={n.severity === 'CRITICA' ? 'danger' : n.severity === 'ALTA' ? 'warning' : 'info'} size="sm">
                        {n.severity}
                      </Badge>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{n.category}</span>
                    </div>
                    <h4 className="text-xs font-black">{n.title}</h4>
                    <p className="text-xs opacity-90">{n.message}</p>
                  </div>
                  <span className="text-[10px] opacity-60 shrink-0">{n.createdAt}</span>
                </div>

                <div className="pt-2 mt-2 flex items-center justify-between border-t border-black/5 text-xs">
                  <button
                    onClick={() => onMarkAsRead(n.id)}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-800"
                  >
                    {!n.readAt ? 'Marcar como leída' : 'Leída'}
                  </button>

                  {n.actionModule && (
                    <button
                      onClick={() => {
                        onMarkAsRead(n.id);
                        onClose();
                        onNavigate(n.actionModule!);
                      }}
                      className="text-xs font-extrabold text-amber-900 hover:underline flex items-center gap-1"
                    >
                      <span>{n.actionLabel || 'Ir a módulo'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BottomSheet>
  );
};
