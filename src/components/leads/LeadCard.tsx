import React from 'react';
import { Lead } from '../../types';
import { calculateSLA, formatUSD } from '../../domain/rules';
import { LeadStatusBadge, LeadTemperatureBadge, LeadSourceBadge, SellerAvatar } from './LeadBadges';
import { LeadQuickActions } from './LeadQuickActions';
import { Clock, Calendar, AlertCircle, ArrowUpRight, DollarSign } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onSelect: (lead: Lead) => void;
  onLogActivity: (lead: Lead) => void;
  onQualify: (lead: Lead) => void;
  onChangeStatus: (lead: Lead) => void;
  onMarkLost: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onSelect,
  onLogActivity,
  onQualify,
  onChangeStatus,
  onMarkLost
}) => {
  const sla = calculateSLA(lead.createdAt, lead.status);

  return (
    <div
      onClick={() => onSelect(lead)}
      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-brand-300 hover:shadow-md transition-all cursor-pointer relative group"
    >
      {/* Top Header: SLA & Source */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <LeadSourceBadge source={lead.source} />
          {lead.campaignName && (
            <span className="text-[10px] text-slate-500 truncate max-w-[140px]" title={lead.campaignName}>
              • {lead.campaignName}
            </span>
          )}
        </div>

        {/* SLA Badge */}
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${sla.badgeClass}`}>
          {sla.ageText}
        </div>
      </div>

      {/* Main Row: Lead Name & Status */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors flex items-center gap-1">
            <span>{lead.fullName}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition-colors" />
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
            <span>{lead.phone}</span>
            {lead.city && <span>• {lead.city}</span>}
          </p>
        </div>

        <LeadStatusBadge status={lead.status} />
      </div>

      {/* Qualification, Score & Budget Row */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 my-2.5 text-xs">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Presupuesto</div>
          <div className="font-extrabold text-slate-800">
            {lead.budgetUSD ? formatUSD(lead.budgetUSD) : 'No especificado'}
          </div>
          {lead.availableDownPayment ? (
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              Anticipo: {formatUSD(lead.availableDownPayment)}
            </div>
          ) : null}
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
            <span>Score</span>
            <span className="text-brand-700">{lead.score || lead.qualificationScore || 50}/100</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                (lead.score || 50) >= 80
                  ? 'bg-emerald-500'
                  : (lead.score || 50) >= 50
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, lead.score || 50))}%` }}
            />
          </div>
          <div className="mt-1 flex items-center gap-1">
            <LeadTemperatureBadge temp={lead.qualification} />
          </div>
        </div>
      </div>

      {/* Notes preview if any */}
      {lead.notes && (
        <p className="text-xs text-slate-600 line-clamp-2 italic mb-3 bg-amber-50/50 p-2 rounded-lg border border-amber-100/60">
          "{lead.notes}"
        </p>
      )}

      {/* Footer: Assigned Seller & Quick Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SellerAvatar sellerName={lead.assignedAgent || 'Sin Asignar'} size="sm" />
          <span className="text-xs text-slate-600 font-medium truncate max-w-[110px]">
            {lead.assignedAgent || 'Sin Asignar'}
          </span>
        </div>

        <LeadQuickActions
          lead={lead}
          onLogActivity={onLogActivity}
          onQualify={onQualify}
          onChangeStatus={onChangeStatus}
          onMarkLost={onMarkLost}
        />
      </div>
    </div>
  );
};
