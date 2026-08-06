import React, { useState } from 'react';
import { Lead, LeadStatus } from '../../types';
import { mockLeads } from '../../data/mockData';
import { formatUSD } from '../../domain/rules';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { Users, Plus, Phone, Mail, Filter, Search, Star, MessageSquare, ArrowRight } from 'lucide-react';

interface LeadsModuleProps {
  leads: Lead[];
  onOpenNewLead: () => void;
  onSelectLead: (lead: Lead) => void;
}

export const LeadsModule: React.FC<LeadsModuleProps> = ({
  leads,
  onOpenNewLead,
  onSelectLead,
}) => {
  const [activeTab, setActiveTab] = useState<string>('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'TODOS', label: 'Todos', count: leads.length },
    { id: 'NUEVO', label: 'Nuevos', count: leads.filter(l => l.status === 'NUEVO').length },
    { id: 'CALIFICADO', label: 'Calificados', count: leads.filter(l => l.status === 'CALIFICADO').length },
    { id: 'VISITA', label: 'Visitas', count: leads.filter(l => l.status === 'VISITA').length },
    { id: 'NEGOCIACION', label: 'Negociación', count: leads.filter(l => l.status === 'NEGOCIACION').length },
  ];

  const filteredLeads = leads.filter(l => {
    const matchesTab = activeTab === 'TODOS' || l.status === activeTab;
    const matchesSearch = l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || l.phone.includes(searchTerm) || l.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Pipeline de Leads</h2>
          <p className="text-xs text-slate-500">Gestión de oportunidades comerciales</p>
        </div>
        <Button variant="primary" size="sm" onClick={onOpenNewLead}>
          <Plus className="w-4 h-4" /> Nuevo Lead
        </Button>
      </div>

      {/* Tabs & Search */}
      <div className="space-y-2">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xs"
          />
        </div>
      </div>

      {/* Leads Cards List */}
      <div className="space-y-3">
        {filteredLeads.map(lead => (
          <Card key={lead.id} padding="md" onClick={() => onSelectLead(lead)} className="space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">{lead.fullName}</h3>
                  <div className="flex items-center text-amber-500 text-xs font-bold gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{lead.qualificationScore}/10</span>
                  </div>
                </div>
                <span className="text-xs text-brand-600 font-semibold">{lead.channel}</span>
              </div>
              <Badge variant={lead.status === 'RESERVADO' ? 'success' : 'brand'}>
                {lead.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
              <div className="flex items-center gap-1.5 truncate">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{lead.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{lead.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-500">Presupuesto: <strong className="text-slate-900">{formatUSD(lead.budgetUSD)}</strong></span>
              <span className="text-slate-400 text-[11px]">Agente: {lead.assignedAgent}</span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50/50 p-2 rounded-lg italic">
              "{lead.notes}"
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
