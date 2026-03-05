'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3, Eye, MousePointerClick, Clock, TrendingUp,
    Monitor, Smartphone, Tablet, Globe, Loader2, Users,
    ArrowDownRight
} from 'lucide-react';
import type { AnalyticsStats } from '@/types';

type Period = '7' | '30' | '90';

export default function AdminAnalyticsPage() {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<Period | 'custom'>('30');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (period !== 'custom') {
            fetchStats();
        }
    }, [period]);

    const fetchStats = () => {
        setLoading(true);
        const token = localStorage.getItem('admin_token');
        let url = `/api/analytics/stats?period=${period}`;

        if (period === 'custom' && startDate && endDate) {
            url = `/api/analytics/stats?startDate=${startDate}&endDate=${endDate}`;
        }

        fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setStats(null);
                } else {
                    setStats(data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Loader2 size={32} className="animate-spin text-wood-500" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-8 text-center text-dark-300">
                <BarChart3 size={48} className="mx-auto mb-4 text-dark-500" />
                <p className="text-lg font-medium text-white mb-2">Sem dados de analytics ainda</p>
                <p className="text-sm">Os dados aparecerão aqui conforme os visitantes navegam pelo site.</p>
            </div>
        );
    }

    const maxDaily = Math.max(...stats.dailyVisitors.map(d => d.pageViews), 1);
    const maxPageViews = Math.max(...stats.topPages.map(p => p.views), 1);
    const maxClicks = Math.max(...stats.topClicks.map(c => c.clicks), 1);
    const totalDevices = Object.values(stats.deviceBreakdown).reduce((a, b) => a + b, 0) || 1;
    const totalReferrers = Object.values(stats.referrerBreakdown).reduce((a, b) => a + b, 0) || 1;

    const deviceIcons: Record<string, React.ReactNode> = {
        desktop: <Monitor size={16} />,
        mobile: <Smartphone size={16} />,
        tablet: <Tablet size={16} />,
    };

    const deviceColors: Record<string, string> = {
        desktop: 'bg-blue-500',
        mobile: 'bg-green-500',
        tablet: 'bg-purple-500',
        unknown: 'bg-dark-400',
    };

    const referrerColors: Record<string, string> = {
        direct: 'bg-blue-400',
        google: 'bg-red-400',
        instagram: 'bg-pink-500',
        facebook: 'bg-blue-600',
        whatsapp: 'bg-green-500',
        tiktok: 'bg-dark-200',
        youtube: 'bg-red-600',
    };

    const funnelSteps = [
        { label: 'Visitaram o site', value: stats.funnel.visited, color: 'from-blue-500 to-blue-600' },
        { label: 'Navegaram +1 página', value: stats.funnel.multiPage, color: 'from-purple-500 to-purple-600' },
        { label: 'Clicaram em CTA', value: stats.funnel.clickedCta, color: 'from-yellow-500 to-yellow-600' },
        { label: 'Converteram', value: stats.funnel.converted, color: 'from-green-500 to-green-600' },
    ];
    const maxFunnel = Math.max(stats.funnel.visited, 1);

    function formatTime(seconds: number): string {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }

    const pageNameMap: Record<string, string> = {
        '/': 'Home',
        '/portfolio': 'Portfólio',
        '/servicos': 'Serviços',
        '/orcamento': 'Orçamento',
        '/contato': 'Contato',
        '/faq': 'FAQ',
        '/politicas': 'Políticas',
    };

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-white flex items-center gap-3">
                        <BarChart3 size={28} className="text-wood-400" />
                        Analytics
                    </h1>
                    <p className="text-dark-300 text-sm mt-1">Rastreamento de comportamento dos visitantes</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    {/* Period Selector */}
                    <div className="flex bg-dark-800 rounded-xl border border-dark-600 overflow-hidden">
                        {(['7', '30', '90'] as Period[]).map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${period === p
                                    ? 'bg-wood-600 text-white'
                                    : 'text-dark-300 hover:text-white hover:bg-dark-700'
                                    }`}
                            >
                                {p}d
                            </button>
                        ))}
                        <button
                            onClick={() => setPeriod('custom')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${period === 'custom'
                                ? 'bg-wood-600 text-white'
                                : 'text-dark-300 hover:text-white hover:bg-dark-700'
                                }`}
                        >
                            Custom
                        </button>
                    </div>

                    {/* Custom Date Filters */}
                    {period === 'custom' && (
                        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-dark-400 font-medium">De:</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-wood-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-dark-400 font-medium">Até:</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-wood-500"
                                />
                            </div>
                            <button
                                onClick={fetchStats}
                                disabled={!startDate || !endDate}
                                className="bg-wood-600 hover:bg-wood-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-lg ml-2"
                            >
                                Filtrar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Users size={20} className="text-blue-400" />
                        </div>
                        <span className="text-dark-300 text-sm">Visitantes</span>
                    </div>
                    <p className="text-3xl font-heading font-bold text-white">
                        {stats.visitorsTotal.toLocaleString('pt-BR')}
                    </p>
                </div>

                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <Eye size={20} className="text-green-400" />
                        </div>
                        <span className="text-dark-300 text-sm">Page Views</span>
                    </div>
                    <p className="text-3xl font-heading font-bold text-white">
                        {stats.pageViewsTotal.toLocaleString('pt-BR')}
                    </p>
                </div>

                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                            <TrendingUp size={20} className="text-purple-400" />
                        </div>
                        <span className="text-dark-300 text-sm">Taxa de Conversão</span>
                    </div>
                    <p className="text-3xl font-heading font-bold text-white">{stats.conversionRate}%</p>
                </div>

                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                            <Clock size={20} className="text-yellow-400" />
                        </div>
                        <span className="text-dark-300 text-sm">Tempo Médio</span>
                    </div>
                    <p className="text-3xl font-heading font-bold text-white">{formatTime(stats.avgTimeOnSite)}</p>
                </div>
            </div>

            {/* Traffic Chart */}
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                <h3 className="font-heading font-semibold text-white mb-6">Tráfego Diário</h3>
                <div className="flex items-end gap-1 h-44 overflow-x-auto pb-2">
                    {stats.dailyVisitors.map((day) => (
                        <div key={day.date} className="flex-1 min-w-[24px] flex flex-col items-center gap-1 group">
                            <div className="relative w-full flex justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-dark-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                    {day.visitors} vis · {day.pageViews} pv
                                </div>
                            </div>
                            <div className="w-full flex gap-0.5 items-end justify-center" style={{ height: '128px' }}>
                                <div
                                    className="flex-1 max-w-[12px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all"
                                    style={{ height: `${Math.max((day.visitors / Math.max(...stats.dailyVisitors.map(d => d.visitors), 1)) * 100, 4)}%` }}
                                    title={`${day.visitors} visitantes`}
                                />
                                <div
                                    className="flex-1 max-w-[12px] bg-gradient-to-t from-wood-600 to-wood-400 rounded-t transition-all"
                                    style={{ height: `${Math.max((day.pageViews / maxDaily) * 100, 4)}%` }}
                                    title={`${day.pageViews} page views`}
                                />
                            </div>
                            <span className="text-dark-400 text-[10px] whitespace-nowrap">{day.date}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-6 mt-4 text-xs text-dark-300">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-500" /> Visitantes
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-wood-500" /> Page Views
                    </div>
                </div>
            </div>

            {/* Two columns: Top Pages + Top Clicks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <h3 className="font-heading font-semibold text-white mb-6 flex items-center gap-2">
                        <Eye size={18} className="text-green-400" />
                        Páginas Mais Visitadas
                    </h3>
                    {stats.topPages.length === 0 ? (
                        <p className="text-dark-400 text-sm">Sem dados ainda</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.topPages.map((page, i) => (
                                <div key={page.page} className="flex items-center gap-3">
                                    <span className="text-dark-400 text-xs w-5 text-right font-mono">{i + 1}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-dark-100 text-sm truncate max-w-[200px]">
                                                {pageNameMap[page.page] || page.page}
                                            </span>
                                            <span className="text-dark-300 text-sm font-mono ml-2">{page.views}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-dark-600 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
                                                style={{ width: `${(page.views / maxPageViews) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Clicks */}
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <h3 className="font-heading font-semibold text-white mb-6 flex items-center gap-2">
                        <MousePointerClick size={18} className="text-yellow-400" />
                        CTAs Mais Clicados
                    </h3>
                    {stats.topClicks.length === 0 ? (
                        <p className="text-dark-400 text-sm">Sem dados ainda</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.topClicks.map((click, i) => (
                                <div key={click.element_id} className="flex items-center gap-3">
                                    <span className="text-dark-400 text-xs w-5 text-right font-mono">{i + 1}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-dark-100 text-sm truncate max-w-[200px]">
                                                {click.element_text || click.element_id}
                                            </span>
                                            <span className="text-dark-300 text-sm font-mono ml-2">{click.clicks}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-dark-600 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all"
                                                style={{ width: `${(click.clicks / maxClicks) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Funnel */}
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                <h3 className="font-heading font-semibold text-white mb-6 flex items-center gap-2">
                    <ArrowDownRight size={18} className="text-purple-400" />
                    Funil de Conversão
                </h3>
                <div className="space-y-4">
                    {funnelSteps.map((step, i) => {
                        const pct = Math.round((step.value / maxFunnel) * 100);
                        const dropoff = i > 0
                            ? funnelSteps[i - 1].value > 0
                                ? Math.round(((funnelSteps[i - 1].value - step.value) / funnelSteps[i - 1].value) * 100)
                                : 0
                            : 0;
                        return (
                            <div key={step.label}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-dark-100 text-sm font-medium">{step.label}</span>
                                    <div className="flex items-center gap-3">
                                        {i > 0 && dropoff > 0 && (
                                            <span className="text-red-400 text-xs">-{dropoff}%</span>
                                        )}
                                        <span className="text-white font-heading font-bold">
                                            {step.value.toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full h-8 bg-dark-600 rounded-lg overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${step.color} rounded-lg transition-all flex items-center justify-end pr-3`}
                                        style={{ width: `${Math.max(pct, 3)}%` }}
                                    >
                                        {pct >= 15 && (
                                            <span className="text-white text-xs font-medium">{pct}%</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Two columns: Devices + Origin */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Devices */}
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <h3 className="font-heading font-semibold text-white mb-6 flex items-center gap-2">
                        <Monitor size={18} className="text-blue-400" />
                        Dispositivos
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(stats.deviceBreakdown).length === 0 ? (
                            <p className="text-dark-400 text-sm">Sem dados ainda</p>
                        ) : (
                            Object.entries(stats.deviceBreakdown)
                                .sort(([, a], [, b]) => b - a)
                                .map(([device, count]) => {
                                    const pct = Math.round((count / totalDevices) * 100);
                                    return (
                                        <div key={device} className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center text-dark-200">
                                                {deviceIcons[device] || <Globe size={16} />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-dark-100 text-sm capitalize">{device}</span>
                                                    <span className="text-dark-300 text-sm">{pct}% ({count})</span>
                                                </div>
                                                <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${deviceColors[device] || deviceColors.unknown} rounded-full`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </div>

                {/* Referrers */}
                <div className="bg-dark-800 rounded-2xl p-6 border border-dark-600">
                    <h3 className="font-heading font-semibold text-white mb-6 flex items-center gap-2">
                        <Globe size={18} className="text-pink-400" />
                        Origem do Tráfego
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(stats.referrerBreakdown).length === 0 ? (
                            <p className="text-dark-400 text-sm">Sem dados ainda</p>
                        ) : (
                            Object.entries(stats.referrerBreakdown)
                                .sort(([, a], [, b]) => b - a)
                                .map(([ref, count]) => {
                                    const pct = Math.round((count / totalReferrers) * 100);
                                    return (
                                        <div key={ref} className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center text-dark-200">
                                                <Globe size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-dark-100 text-sm capitalize">{ref}</span>
                                                    <span className="text-dark-300 text-sm">{pct}% ({count})</span>
                                                </div>
                                                <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${referrerColors[ref] || 'bg-dark-300'} rounded-full`}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
