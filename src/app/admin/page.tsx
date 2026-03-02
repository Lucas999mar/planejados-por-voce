'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Users, TrendingUp, Target, BarChart3,
    ArrowRight, Loader2, Phone
} from 'lucide-react';
import { LEAD_STATUS } from '@/lib/constants';

interface Metrics {
    totalLeads: number;
    leadsPeriodo: number;
    porStatus: Record<string, number>;
    porTipo: Record<string, number>;
    recentes: Array<{
        id: string;
        nome: string | null;
        whatsapp: string | null;
        cidade: string | null;
        tipo_servico: string | null;
        status: string;
        created_at: string;
    }>;
    porDia: Array<{ data: string; count: number }>;
    taxaConversao: number;
}

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/metrics')
            .then(res => res.json())
            .then(data => {
                setMetrics(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Loader2 size={32} className="animate-spin text-wood-500" />
            </div>
        );
    }

    if (!metrics) {
        return (
            <div className="p-8 text-center text-dark-300">
                <p>Erro ao carregar métricas. Verifique a conexão com o banco de dados.</p>
            </div>
        );
    }

    const maxDia = Math.max(...metrics.porDia.map(d => d.count), 1);

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div>
                <h1 className="font-heading text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-dark-300 text-sm mt-1">Visão geral dos leads e métricas</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Users size={20} className="text-blue-400" />
                        </div>
                        <span className="text-dark-300 text-sm">Total de Leads</span>
                    </div>
                    <p className="text-3xl font-heading font-bold text-white">{metrics.totalLeads}</p>
                </div>

                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <TrendingUp size={20} className="text-green-400" />
                        </div>
                        <span className="text-dark-300 text-sm">Últimos 30 dias</span>
                    </div>
                    <p className="text-3xl font-heading font-bold text-white">{metrics.leadsPeriodo}</p>
                </div>

                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                            <Target size={20} className="text-purple-400" />
                        </div>
                        <span className="text-dark-300 text-sm">Taxa de Conversão</span>
                    </div>
                    <p className="text-3xl font-heading font-bold text-white">{metrics.taxaConversao}%</p>
                </div>

                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                            <BarChart3 size={20} className="text-yellow-400" />
                        </div>
                        <span className="text-dark-300 text-sm">Novos Hoje</span>
                    </div>
                    <p className="text-3xl font-heading font-bold text-white">
                        {metrics.porDia[metrics.porDia.length - 1]?.count || 0}
                    </p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <h3 className="font-heading font-semibold text-white mb-6">Leads por dia (últimos 7 dias)</h3>
                    <div className="flex items-end gap-3 h-40">
                        {metrics.porDia.map((dia) => (
                            <div key={dia.data} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-dark-300 text-xs">{dia.count}</span>
                                <div
                                    className="w-full bg-gradient-to-t from-wood-600 to-wood-400 rounded-t-lg transition-all"
                                    style={{ height: `${Math.max((dia.count / maxDia) * 100, 4)}%` }}
                                />
                                <span className="text-dark-400 text-xs">{dia.data}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <h3 className="font-heading font-semibold text-white mb-6">Leads por status</h3>
                    <div className="space-y-3">
                        {Object.entries(LEAD_STATUS).map(([key, val]) => {
                            const count = metrics.porStatus[key] || 0;
                            const pct = metrics.totalLeads ? Math.round((count / metrics.totalLeads) * 100) : 0;
                            return (
                                <div key={key} className="flex items-center gap-3">
                                    <span className={`w-3 h-3 rounded-full ${val.color}`} />
                                    <span className="text-dark-200 text-sm flex-1">{val.label}</span>
                                    <span className="text-dark-300 text-sm">{count}</span>
                                    <div className="w-24 h-2 bg-dark-600 rounded-full overflow-hidden">
                                        <div className={`h-full ${val.color} rounded-full`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Leads */}
            <div className="bg-dark-800 rounded-2xl border border-dark-600 overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-dark-600">
                    <h3 className="font-heading font-semibold text-white">Leads Recentes</h3>
                    <Link
                        href="/admin/leads"
                        className="text-wood-400 hover:text-wood-300 text-sm font-medium flex items-center gap-1"
                    >
                        Ver todos <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-dark-300 text-xs uppercase tracking-wider border-b border-dark-600">
                                <th className="px-6 py-3 text-left">Nome</th>
                                <th className="px-6 py-3 text-left">WhatsApp</th>
                                <th className="px-6 py-3 text-left">Cidade</th>
                                <th className="px-6 py-3 text-left">Serviço</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {metrics.recentes.map((lead) => (
                                <tr key={lead.id} className="hover:bg-dark-700/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-white">{lead.nome || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-dark-200">
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
                                        ) : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-dark-200">{lead.cidade || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-dark-200 capitalize">{lead.tipo_servico || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${LEAD_STATUS[lead.status as keyof typeof LEAD_STATUS]?.color || 'bg-dark-500'
                                            }`}>
                                            {LEAD_STATUS[lead.status as keyof typeof LEAD_STATUS]?.label || lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-dark-300">
                                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
