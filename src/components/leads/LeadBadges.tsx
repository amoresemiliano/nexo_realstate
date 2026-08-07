import React from 'react';
import { LeadStatus, LeadTemperature, LeadPriority, LeadSource, Seller } from '../../types';
import { LEAD_STATUS_CONFIG, TEMPERATURE_CONFIG, PRIORITY_CONFIG } from '../../domain/rules';
import {
  Globe,
  Share2,
  Instagram,
  Facebook,
  MessageCircle,
  Building,
  UserCheck,
  Calendar,
  Phone,
  FileText,
  Tag
} from 'lucide-react';

export const LeadStatusBadge: React.FC<{ status: LeadStatus; className?: string }> = ({ status, className = '' }) => {
  const config = LEAD_STATUS_CONFIG[status] || {
    label: status,
    color: 'text-slate-700',
    bg: 'bg-slate-100',
    border: 'border-slate-200'
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${config.bg} ${config.color} ${config.border} ${className}`}
    >
      {config.label}
    </span>
  );
};

export const LeadTemperatureBadge: React.FC<{ temp?: LeadTemperature | string; className?: string }> = ({ temp = 'TIBIO', className = '' }) => {
  const config = TEMPERATURE_CONFIG[temp] || TEMPERATURE_CONFIG['TIBIO'];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${config.bg} ${config.color} ${className}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

export const LeadPriorityBadge: React.FC<{ priority?: LeadPriority; className?: string }> = ({ priority = 'MEDIA', className = '' }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['MEDIA'];

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${config.bg} ${config.color} ${className}`}
    >
      {config.label}
    </span>
  );
};

export const LeadSourceBadge: React.FC<{ source: LeadSource | string; className?: string }> = ({ source, className = '' }) => {
  const getSourceIcon = (src: string) => {
    switch (src) {
      case 'Meta Ads':
      case 'Facebook Orgánico':
        return <Facebook className="w-3 h-3 text-blue-600" />;
      case 'Instagram Orgánico':
        return <Instagram className="w-3 h-3 text-pink-600" />;
      case 'Google Ads':
        return <Globe className="w-3 h-3 text-red-500" />;
      case 'WhatsApp':
        return <MessageCircle className="w-3 h-3 text-emerald-600" />;
      case 'Sitio Web':
        return <Globe className="w-3 h-3 text-slate-600" />;
      case 'Referido':
        return <UserCheck className="w-3 h-3 text-brand-600" />;
      case 'Inmobiliaria':
        return <Building className="w-3 h-3 text-amber-600" />;
      case 'Evento':
        return <Calendar className="w-3 h-3 text-purple-600" />;
      default:
        return <Tag className="w-3 h-3 text-slate-500" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200 ${className}`}
    >
      {getSourceIcon(source)}
      <span>{source}</span>
    </span>
  );
};

export const SellerAvatar: React.FC<{ sellerName?: string; size?: 'sm' | 'md' }> = ({ sellerName = 'Sin Asignar', size = 'sm' }) => {
  const initials = sellerName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isUnassigned = sellerName === 'Sin Asignar';

  const sizeClasses = size === 'sm' ? 'w-5 h-5 text-[9px]' : 'w-7 h-7 text-xs';

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center font-extrabold ${
        isUnassigned
          ? 'bg-slate-200 text-slate-500 border border-slate-300'
          : 'bg-brand-600 text-white shadow-xs'
      }`}
      title={`Vendedor: ${sellerName}`}
    >
      {initials}
    </div>
  );
};
