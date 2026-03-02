'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Search, Filter, Download, Phone, Eye,
    Loader2, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { LEAD_STATUS } from '@/lib/constants';
import type { Lead } from '@/types';

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [tipoFilter, setTipoFilter] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [conversations, setConversations] = useState<Array<{ id: string; messages: Array<{ sender: string; content: string; created_at: string }> }>>([]);
    const [detailLoading, setDetailLoading] = useState(false);
    const limit = 20;

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);
        if (tipoFilter) params.set('tipo_servico', tipoFilter);
        params.set('page', String(page));
        params.set('limit', String(limit));

        try {
            const res = await fetch(`/api/leads?${params}`);
            const data = await res.json();
            setLeads(data.data || []);
            setTotal(data.count || 0);
        } catch {
            // handle error
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, tipoFilter, page]);

    useEffect(() => { fetchLeads(); }, [fetchLeads]);

    const exportCSV = () => {
        const params = new URLSearchParams();
        if (statusFilter) params.set('status', statusFilter);
        if (tipoFilter) params.set('tipo_servico', tipoFilter);
        window.open(`/api/admin/export?${params}`, '_blank');
    };

    const openDetail = async (lead: Lead) => {
        setSelectedLead(lead);
        setDetailLoading(true);
        try {
            const res = await fetch(`/api/leads/${lead.id}`);
            const data = await res.json();
            setConversations(data.conversations || []);
        } catch {
            setConversations([]);
        } finally {
            setDetailLoading(false);
        }
    };

    const updateLeadStatus = async (id: string, newStatus: string) => {
        await fetch(`/api/leads/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        fetchLeads();
        if (selectedLead?.id === id) {
            setSelectedLead({ ...selectedLead, status: newStatus as Lead['status'] });
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-white">Leads</h1>
                    <p className="text-dark-300 text-sm mt-1">{total} leads no total</p>
                </div>
                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 bg-dark-700 text-dark-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-dark-600 transition-colors border border-dark-500"
                >
                    <Download size={16} />
                    Exportar CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Buscar por nome, WhatsApp ou cidade..."
                        className="w-full bg-dark-800 border border-dark-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-wood-500"
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="bg-dark-800 border border-dark-600 rounded-xl pl-8 pr-4 py-2.5 text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-wood-500 appearance-none"
                        >
                            <option value="">Todos os status</option>
                            {Object.entries(LEAD_STATUS).map(([key, val]) => (
                                <option key={key} value={key}>{val.label}</option>
                            ))}
                        </select>
                    </div>
                    <select
                        value={tipoFilter}
                        onChange={(e) => { setTipoFilter(e.target.value); setPage(1); }}
                        className="bg-dark-800 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-dark-200 focus:outline-none focus:ring-2 focus:ring-wood-500 appearance-none"
                    >
                        <option value="">Todos os tipos</option>
                        <option value="planejados">Planejados</option>
                        <option value="assistencia">Assistência</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-dark-800 rounded-2xl border border-dark-600 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={24} className="animate-spin text-wood-500" />
                    </div>
                ) : leads.length === 0 ? (
                    <div className="text-center py-20 text-dark-300">
                        Nenhum lead encontrado
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-dark-300 text-xs uppercase tracking-wider border-b border-dark-600">
                                    <th className="px-5 py-3 text-left">Nome</th>
                                    <th className="px-5 py-3 text-left">WhatsApp</th>
                                    <th className="px-5 py-3 text-left">Cidade</th>
                                    <th className="px-5 py-3 text-left">Serviço</th>
                                    <th className="px-5 py-3 text-left">Ambiente</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                    <th className="px-5 py-3 text-left">Data</th>
                                    <th className="px-5 py-3 text-left">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700">
                                {leads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-dark-700/50 transition-colors">
                                        <td className="px-5 py-4 text-sm text-white font-medium">{lead.nome || '—'}</td>
                                        <td className="px-5 py-4 text-sm">
                                            {lead.whatsapp ? (
                                                <a
                                                    href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-green-400 hover:text-green-300"
                                                >
                                                    <Phone size={12} />
                                                    {lead.whatsapp}
                                                </a>
                                            ) : <span className="text-dark-400">—</span>}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-dark-200">{lead.cidade || '—'}</td>
                                        <td className="px-5 py-4 text-sm text-dark-200 capitalize">{lead.tipo_servico || '—'}</td>
                                        <td className="px-5 py-4 text-sm text-dark-200">{lead.ambiente || '—'}</td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={lead.status}
                                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                                className={`px-2 py-1 rounded-lg text-xs font-medium text-white border-0 cursor-pointer ${LEAD_STATUS[lead.status]?.color || 'bg-dark-500'
                                                    }`}
                                            >
                                                {Object.entries(LEAD_STATUS).map(([key, val]) => (
                                                    <option key={key} value={key}>{val.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-dark-300">
                                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => openDetail(lead)}
                                                className="p-2 text-dark-300 hover:text-wood-400 transition-colors rounded-lg hover:bg-dark-600"
                                                aria-label="Ver detalhes"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-dark-600">
                        <span className="text-dark-300 text-sm">Página {page} de {totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 text-dark-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-dark-600 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 text-dark-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-dark-600 transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Lead Detail Modal */}
            {selectedLead && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedLead(null)}>
                    <div
                        className="bg-dark-800 rounded-2xl border border-dark-600 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-dark-800 p-6 border-b border-dark-600 flex items-center justify-between">
                            <h2 className="font-heading text-lg font-semibold text-white">
                                {selectedLead.nome || 'Lead sem nome'}
                            </h2>
                            <button onClick={() => setSelectedLead(null)} className="text-dark-300 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Lead Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    ['WhatsApp', selectedLead.whatsapp],
                                    ['E-mail', selectedLead.email],
                                    ['Cidade', selectedLead.cidade],
                                    ['Bairro', selectedLead.bairro],
                                    ['Serviço', selectedLead.tipo_servico],
                                    ['Ambiente', selectedLead.ambiente],
                                    ['Orçamento', selectedLead.orcamento_faixa],
                                    ['Urgência', selectedLead.urgencia],
                                ].map(([label, value]) => (
                                    <div key={label as string}>
                                        <span className="text-dark-400 text-xs uppercase tracking-wider">{label}</span>
                                        <p className="text-dark-100 text-sm mt-1">{(value as string) || '—'}</p>
                                    </div>
                                ))}
                            </div>

                            {selectedLead.descricao && (
                                <div>
                                    <span className="text-dark-400 text-xs uppercase tracking-wider">Descrição</span>
                                    <p className="text-dark-100 text-sm mt-1">{selectedLead.descricao}</p>
                                </div>
                            )}

                            {selectedLead.tags?.length > 0 && (
                                <div>
                                    <span className="text-dark-400 text-xs uppercase tracking-wider">Tags</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedLead.tags.map((tag) => (
                                            <span key={tag} className="bg-wood-600/20 text-wood-300 text-xs px-2.5 py-1 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Chat History */}
                            <div>
                                <h3 className="text-dark-300 text-xs uppercase tracking-wider mb-3">Histórico do Chat</h3>
                                {detailLoading ? (
                                    <Loader2 size={18} className="animate-spin text-wood-500" />
                                ) : conversations.length === 0 ? (
                                    <p className="text-dark-400 text-sm">Nenhuma conversa registrada</p>
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar bg-dark-900 rounded-xl p-4">
                                        {conversations.flatMap(c => c.messages || []).map((msg, i) => (
                                            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div
                                                    className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${msg.sender === 'user'
                                                            ? 'bg-wood-600 text-white'
                                                            : 'bg-dark-700 text-dark-200'
                                                        }`}
                                                >
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {selectedLead.whatsapp && (
                                <a
                                    href={`https://wa.me/${selectedLead.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                                >
                                    <Phone size={16} />
                                    Abrir no WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
