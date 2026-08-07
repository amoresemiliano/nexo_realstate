import React from 'react';
import { getHoldCountdown } from '../../domain/reservationDomain';
import { Clock, AlertCircle, ShieldAlert } from 'lucide-react';

interface LotHoldCountdownProps {
  expiresAtIso?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const LotHoldCountdown: React.FC<LotHoldCountdownProps> = ({
  expiresAtIso,
  size = 'sm',
  showIcon = true,
}) => {
  const { text, badgeClass, isExpired, isCritical } = getHoldCountdown(expiresAtIso);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  return (
    <span className={`inline-flex items-center rounded-lg border ${sizeClasses} ${badgeClass}`}>
      {showIcon && (
        isExpired ? (
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-700" />
        ) : isCritical ? (
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 animate-bounce" />
        ) : (
          <Clock className="w-3.5 h-3.5 shrink-0 text-amber-700" />
        )
      )}
      <span className="font-semibold tracking-tight">{text}</span>
    </span>
  );
};
