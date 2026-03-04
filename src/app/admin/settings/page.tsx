'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save, Phone, Globe, Palette, CheckCircle } from 'lucide-react';

interface SettingEntry {
    key: string;
    value: Record<string, string>;
    updated_at: string;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SettingEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [saved, setSaved] = useState<string | null>(null);

    useEffect(() => { loadSettings(); }, []);

    async function loadSettings() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            setSettings(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        setLoading(false);
    }

    async function saveSetting(key: string, value: Record<string, string>) {
        setSaving(key);
        try {
            await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value }),
            });
            setSaved(key);
            setTimeout(() => setSaved(null), 2000);
            await loadSettings();
        } catch (e) { console.error(e); }
        setSaving(null);
    }

    function getSetting(key: string): Record<string, string> {
        return settings.find(s => s.key === key)?.value || {};
    }

    function updateSettingLocal(key: string, field: string, val: string) {
        setSettings(prev => prev.map(s =>
            s.key === key ? { ...s, value: { ...s.value, [field]: val } } : s
        ));
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Loader2 size={32} className="animate-spin text-wood-500" />
            </div>
        );
    }

    const contact = getSetting('contact');
    const seo = getSetting('seo');
    const theme = getSetting('theme');

    return (
        <div className="p-6 lg:p-8 space-y-6 max-w-3xl">
            <div>
                <h1 className="font-heading text-2xl font-bold text-white">Configurações</h1>
                <p className="text-dark-300 text-sm mt-1">Edite as configurações gerais do site</p>
            </div>

            {/* Contact Settings */}
            <div className="bg-dark-800 rounded-2xl border border-dark-600 overflow-hidden">
                <div className="p-5 border-b border-dark-600 flex items-center gap-3">
                    <div className="w-9 h-9 bg-green-500/10 rounded-xl flex items-center justify-center">
                        <Phone size={18} className="text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-white font-heading font-semibold">Contato</h2>
                        <p className="text-dark-400 text-xs">WhatsApp, e-mail e endereço</p>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="text-dark-200 text-sm font-medium block mb-1.5">WhatsApp (número completo)</label>
                        <input
                            type="text"
                            value={contact.whatsapp || ''}
                            onChange={e => updateSettingLocal('contact', 'whatsapp', e.target.value)}
                            placeholder="Ex: 5522999093710"
                            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-400 focus:border-wood-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-dark-200 text-sm font-medium block mb-1.5">WhatsApp (exibição)</label>
                        <input
                            type="text"
                            value={contact.whatsapp_display || ''}
                            onChange={e => updateSettingLocal('contact', 'whatsapp_display', e.target.value)}
                            placeholder="Ex: (22) 99909-3710"
                            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-400 focus:border-wood-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-dark-200 text-sm font-medium block mb-1.5">E-mail</label>
                        <input
                            type="email"
                            value={contact.email || ''}
                            onChange={e => updateSettingLocal('contact', 'email', e.target.value)}
                            placeholder="contato@planejadosporvoce.com.br"
                            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-400 focus:border-wood-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-dark-200 text-sm font-medium block mb-1.5">Endereço</label>
                        <input
                            type="text"
                            value={contact.endereco || ''}
                            onChange={e => updateSettingLocal('contact', 'endereco', e.target.value)}
                            placeholder="Rua Exemplo, 123 - Cidade/UF"
                            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-400 focus:border-wood-500 focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={() => saveSetting('contact', contact)}
                        disabled={saving === 'contact'}
                        className="flex items-center gap-2 bg-wood-600 hover:bg-wood-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                    >
                        {saving === 'contact' ? <Loader2 size={16} className="animate-spin" /> : saved === 'contact' ? <CheckCircle size={16} /> : <Save size={16} />}
                        {saved === 'contact' ? 'Salvo!' : 'Salvar Contato'}
                    </button>
                </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-dark-800 rounded-2xl border border-dark-600 overflow-hidden">
                <div className="p-5 border-b border-dark-600 flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <Globe size={18} className="text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-white font-heading font-semibold">SEO</h2>
                        <p className="text-dark-400 text-xs">Nome do site e meta descrição</p>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="text-dark-200 text-sm font-medium block mb-1.5">Nome do Site</label>
                        <input
                            type="text"
                            value={seo.site_name || ''}
                            onChange={e => updateSettingLocal('seo', 'site_name', e.target.value)}
                            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-400 focus:border-wood-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-dark-200 text-sm font-medium block mb-1.5">Meta Descrição</label>
                        <textarea
                            value={seo.description || ''}
                            onChange={e => updateSettingLocal('seo', 'description', e.target.value)}
                            rows={3}
                            className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-400 focus:border-wood-500 focus:outline-none resize-none"
                        />
                    </div>
                    <button
                        onClick={() => saveSetting('seo', seo)}
                        disabled={saving === 'seo'}
                        className="flex items-center gap-2 bg-wood-600 hover:bg-wood-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                    >
                        {saving === 'seo' ? <Loader2 size={16} className="animate-spin" /> : saved === 'seo' ? <CheckCircle size={16} /> : <Save size={16} />}
                        {saved === 'seo' ? 'Salvo!' : 'Salvar SEO'}
                    </button>
                </div>
            </div>

            {/* Theme Settings */}
            <div className="bg-dark-800 rounded-2xl border border-dark-600 overflow-hidden">
                <div className="p-5 border-b border-dark-600 flex items-center gap-3">
                    <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center">
                        <Palette size={18} className="text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-white font-heading font-semibold">Tema / Cores</h2>
                        <p className="text-dark-400 text-xs">Paleta de cores do site</p>
                    </div>
                </div>
                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-dark-200 text-sm font-medium block mb-1.5">Cor Primária</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={theme.primary_color || '#A67C52'}
                                    onChange={e => updateSettingLocal('theme', 'primary_color', e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                />
                                <input
                                    type="text"
                                    value={theme.primary_color || '#A67C52'}
                                    onChange={e => updateSettingLocal('theme', 'primary_color', e.target.value)}
                                    className="flex-1 bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white focus:border-wood-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-dark-200 text-sm font-medium block mb-1.5">Cor de Destaque</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={theme.accent_color || '#4A9B7F'}
                                    onChange={e => updateSettingLocal('theme', 'accent_color', e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                />
                                <input
                                    type="text"
                                    value={theme.accent_color || '#4A9B7F'}
                                    onChange={e => updateSettingLocal('theme', 'accent_color', e.target.value)}
                                    className="flex-1 bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white focus:border-wood-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-dark-700 rounded-xl">
                        <span className="text-dark-300 text-sm">Preview:</span>
                        <div className="w-16 h-8 rounded-lg" style={{ backgroundColor: theme.primary_color || '#A67C52' }} />
                        <div className="w-16 h-8 rounded-lg" style={{ backgroundColor: theme.accent_color || '#4A9B7F' }} />
                    </div>
                    <button
                        onClick={() => saveSetting('theme', theme)}
                        disabled={saving === 'theme'}
                        className="flex items-center gap-2 bg-wood-600 hover:bg-wood-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
                    >
                        {saving === 'theme' ? <Loader2 size={16} className="animate-spin" /> : saved === 'theme' ? <CheckCircle size={16} /> : <Save size={16} />}
                        {saved === 'theme' ? 'Salvo!' : 'Salvar Tema'}
                    </button>
                </div>
            </div>
        </div>
    );
}
