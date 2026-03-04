'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save, CheckCircle, ChevronDown, ChevronRight, FileText, Type } from 'lucide-react';

interface ContentItem {
    id: string;
    section: string;
    content: Record<string, string>;
    updated_at: string;
}

const SECTION_LABELS: Record<string, string> = {
    home: 'Página Inicial',
    servicos: 'Serviços',
    contato: 'Contato',
    orcamento: 'Orçamento',
};

const CONTENT_LABELS: Record<string, string> = {
    hero: 'Hero / Banner Principal',
    diferenciais: 'Diferenciais (Por que nos escolher)',
    etapas: 'Etapas (Como funciona)',
    ambientes: 'Ambientes que Transformamos',
    faq: 'Perguntas Frequentes (FAQ)',
    servicos_hero: 'Hero Serviços',
    servicos_assistencia: 'Assistência Técnica',
    contato_hero: 'Hero Contato',
    orcamento_hero: 'Hero Orçamento',
};

const FIELD_LABELS: Record<string, string> = {
    titulo: 'Título',
    subtitulo: 'Subtítulo',
    descricao: 'Descrição',
    cta_text: 'Texto do Botão (CTA)',
    itens: 'Itens (JSON)',
};

export default function AdminContentPage() {
    const [contentItems, setContentItems] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [saved, setSaved] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ home: true });

    useEffect(() => { loadContent(); }, []);

    async function loadContent() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/content');
            const data = await res.json();
            setContentItems(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        setLoading(false);
    }

    function toggleSection(section: string) {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    }

    function updateField(id: string, field: string, value: string) {
        setContentItems(prev => prev.map(item =>
            item.id === id ? { ...item, content: { ...item.content, [field]: value } } : item
        ));
    }

    async function saveItem(item: ContentItem) {
        setSaving(item.id);
        try {
            await fetch('/api/admin/content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: item.id, section: item.section, content: item.content }),
            });
            setSaved(item.id);
            setTimeout(() => setSaved(null), 2000);
        } catch (e) { console.error(e); }
        setSaving(null);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Loader2 size={32} className="animate-spin text-wood-500" />
            </div>
        );
    }

    // Group by section
    const grouped: Record<string, ContentItem[]> = {};
    contentItems.forEach(item => {
        if (!grouped[item.section]) grouped[item.section] = [];
        grouped[item.section].push(item);
    });

    return (
        <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
            <div>
                <h1 className="font-heading text-2xl font-bold text-white">Conteúdo do Site</h1>
                <p className="text-dark-300 text-sm mt-1">Edite os textos de cada seção do site</p>
            </div>

            {Object.entries(grouped).map(([section, items]) => (
                <div key={section} className="bg-dark-800 rounded-2xl border border-dark-600 overflow-hidden">
                    {/* Section Header */}
                    <button
                        onClick={() => toggleSection(section)}
                        className="w-full p-5 flex items-center gap-3 hover:bg-dark-700/50 transition-colors"
                    >
                        <div className="w-9 h-9 bg-wood-500/10 rounded-xl flex items-center justify-center">
                            <FileText size={18} className="text-wood-400" />
                        </div>
                        <div className="text-left flex-1">
                            <h2 className="text-white font-heading font-semibold">{SECTION_LABELS[section] || section}</h2>
                            <p className="text-dark-400 text-xs">{items.length} seções editáveis</p>
                        </div>
                        {expandedSections[section] ? <ChevronDown size={20} className="text-dark-400" /> : <ChevronRight size={20} className="text-dark-400" />}
                    </button>

                    {/* Section Content */}
                    {expandedSections[section] && (
                        <div className="border-t border-dark-600">
                            {items.map((item) => (
                                <div key={item.id} className="p-5 border-b border-dark-700 last:border-b-0">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Type size={14} className="text-wood-400" />
                                        <h3 className="text-dark-200 font-medium text-sm">{CONTENT_LABELS[item.id] || item.id}</h3>
                                    </div>

                                    <div className="space-y-3">
                                        {Object.entries(item.content).map(([field, value]) => {
                                            const isJSON = field === 'itens';
                                            const isLong = isJSON || field === 'descricao';
                                            return (
                                                <div key={field}>
                                                    <label className="text-dark-300 text-xs font-medium block mb-1">
                                                        {FIELD_LABELS[field] || field}
                                                    </label>
                                                    {isLong ? (
                                                        <textarea
                                                            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                                                            onChange={e => updateField(item.id, field, e.target.value)}
                                                            rows={isJSON ? 6 : 3}
                                                            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-400 focus:border-wood-500 focus:outline-none resize-none font-mono"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={typeof value === 'string' ? value : String(value)}
                                                            onChange={e => updateField(item.id, field, e.target.value)}
                                                            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-400 focus:border-wood-500 focus:outline-none"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => saveItem(item)}
                                        disabled={saving === item.id}
                                        className="mt-4 flex items-center gap-2 bg-wood-600 hover:bg-wood-500 text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                                    >
                                        {saving === item.id ? <Loader2 size={14} className="animate-spin" /> : saved === item.id ? <CheckCircle size={14} /> : <Save size={14} />}
                                        {saved === item.id ? 'Salvo!' : 'Salvar'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {contentItems.length === 0 && (
                <div className="text-center py-20 text-dark-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Nenhum conteúdo configurado</p>
                </div>
            )}
        </div>
    );
}
