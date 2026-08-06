import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
  padding = 'md',
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-2xl border border-slate-150 shadow-sm transition-all duration-150',
        paddings[padding],
        hoverable && 'hover:shadow-md hover:border-slate-250 cursor-pointer active:scale-[0.99]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};
