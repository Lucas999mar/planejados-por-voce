'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Upload, X, Loader2, Save, Image as ImageIcon } from 'lucide-react';

interface Project {
    id: string;
    ambiente: string;
    titulo: string;
    descricao: string;
    imagem_url: string;
    ordem: number;
    ativo: boolean;
}

const CATEGORIAS = [
    'Cozinha', 'Dormitório', 'Closet', 'Banheiro', 'Living', 'Home Office',
    'Área Gourmet', 'Lavanderia', 'Adega', 'Studio', 'Suíte', 'Biblioteca',
    'Corporativo', 'Espaços Comerciais',
];

export default function AdminPortfolioPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        ambiente: 'Cozinha',
        titulo: '',
        descricao: '',
        imagem_url: '',
        ordem: 0,
    });

    useEffect(() => { loadProjects(); }, []);

    async function loadProjects() {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/portfolio');
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        setLoading(false);
    }

    function openNew() {
        setEditingProject(null);
        setForm({ ambiente: 'Cozinha', titulo: '', descricao: '', imagem_url: '', ordem: projects.length });
        setShowModal(true);
    }

    function openEdit(p: Project) {
        setEditingProject(p);
        setForm({ ambiente: p.ambiente, titulo: p.titulo, descricao: p.descricao, imagem_url: p.imagem_url, ordem: p.ordem });
        setShowModal(true);
    }

    async function handleSave() {
        if (!form.titulo || !form.descricao || !form.imagem_url) return;
        setSaving(true);
        try {
            if (editingProject) {
                await fetch('/api/admin/portfolio', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingProject.id, ...form }),
                });
            } else {
                await fetch('/api/admin/portfolio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                });
            }
            setShowModal(false);
            await loadProjects();
        } catch (e) { console.error(e); }
        setSaving(false);
    }

    async function handleDelete(id: string) {
        try {
            await fetch(`/api/admin/portfolio?id=${id}`, { method: 'DELETE' });
            setDeleteConfirm(null);
            await loadProjects();
        } catch (e) { console.error(e); }
    }

    async function handleToggleActive(p: Project) {
        await fetch('/api/admin/portfolio', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: p.id, ativo: !p.ativo }),
        });
        await loadProjects();
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (data.url) {
                setForm(prev => ({ ...prev, imagem_url: data.url }));
            }
        } catch (e) { console.error(e); }
        setUploading(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Loader2 size={32} className="animate-spin text-wood-500" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-white">Portfólio</h1>
                    <p className="text-dark-300 text-sm mt-1">Gerencie os projetos do portfólio ({projects.length} projetos)</p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 bg-wood-600 hover:bg-wood-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
                >
                    <Plus size={18} />
                    Novo Projeto
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {projects.map((p) => (
                    <div key={p.id} className={`bg-dark-800 rounded-2xl overflow-hidden border transition-all ${p.ativo ? 'border-dark-600' : 'border-red-900/30 opacity-60'}`}>
                        <div className="aspect-[4/3] relative bg-dark-700">
                            {p.imagem_url ? (
                                <img src={p.imagem_url} alt={p.titulo} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <ImageIcon size={40} className="text-dark-500" />
                                </div>
                            )}
                            {!p.ativo && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Inativo</div>
                            )}
                        </div>
                        <div className="p-4 space-y-2">
                            <span className="text-wood-400 text-xs font-semibold uppercase tracking-wider">{p.ambiente}</span>
                            <h3 className="text-white font-medium text-sm line-clamp-1">{p.titulo}</h3>
                            <p className="text-dark-400 text-xs line-clamp-2">{p.descricao}</p>
                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    onClick={() => openEdit(p)}
                                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-medium"
                                >
                                    <Pencil size={12} /> Editar
                                </button>
                                <button
                                    onClick={() => handleToggleActive(p)}
                                    className={`text-xs font-medium ${p.ativo ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}
                                >
                                    {p.ativo ? 'Desativar' : 'Ativar'}
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(p.id)}
                                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-medium ml-auto"
                                >
                                    <Trash2 size={12} /> Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-20 text-dark-400">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Nenhum projeto no portfólio</p>
                    <p className="text-sm mt-1">Clique em &quot;Novo Projeto&quot; para adicionar</p>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
                    <div className="bg-dark-800 rounded-2xl p-6 max-w-sm w-full border border-dark-600" onClick={e => e.stopPropagation()}>
                        <h3 className="text-white font-heading font-semibold text-lg mb-2">Confirmar exclusão?</h3>
                        <p className="text-dark-300 text-sm mb-6">Esta ação não pode ser desfeita.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl bg-dark-700 text-dark-200 hover:bg-dark-600 text-sm font-medium">Cancelar</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 text-sm font-medium">Excluir</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-dark-800 rounded-2xl max-w-lg w-full border border-dark-600 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-dark-600 flex items-center justify-between">
                            <h3 className="text-white font-heading font-semibold text-lg">
                                {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-dark-400 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Image */}
                            <div>
                                <label className="text-dark-200 text-sm font-medium block mb-2">Imagem</label>
                                {form.imagem_url ? (
                                    <div className="relative rounded-xl overflow-hidden bg-dark-700 aspect-[4/3]">
                                        <img src={form.imagem_url} alt="" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setForm(prev => ({ ...prev, imagem_url: '' }))}
                                            className="absolute top-2 right-2 bg-dark-900/80 text-white p-1.5 rounded-full hover:bg-red-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-dark-500 rounded-xl p-8 text-center cursor-pointer hover:border-wood-500 transition-colors"
                                    >
                                        {uploading ? (
                                            <Loader2 size={32} className="animate-spin text-wood-500 mx-auto" />
                                        ) : (
                                            <>
                                                <Upload size={32} className="text-dark-400 mx-auto mb-2" />
                                                <p className="text-dark-300 text-sm">Clique para fazer upload</p>
                                                <p className="text-dark-500 text-xs mt-1">JPG, PNG, WebP até 5MB</p>
                                            </>
                                        )}
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    className="hidden"
                                />
                                {/* Or paste URL */}
                                <input
                                    type="text"
                                    value={form.imagem_url}
                                    onChange={e => setForm(prev => ({ ...prev, imagem_url: e.target.value }))}
                                    placeholder="Ou cole a URL da imagem..."
                                    className="mt-2 w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-400 focus:border-wood-500 focus:outline-none"
                                />
                            </div>

                            {/* Ambiente */}
                            <div>
                                <label className="text-dark-200 text-sm font-medium block mb-2">Ambiente</label>
                                <select
                                    value={form.ambiente}
                                    onChange={e => setForm(prev => ({ ...prev, ambiente: e.target.value }))}
                                    className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white focus:border-wood-500 focus:outline-none"
                                >
                                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Título */}
                            <div>
                                <label className="text-dark-200 text-sm font-medium block mb-2">Título</label>
                                <input
                                    type="text"
                                    value={form.titulo}
                                    onChange={e => setForm(prev => ({ ...prev, titulo: e.target.value }))}
                                    placeholder="Ex: Cozinha Moderna Cinza"
                                    className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-400 focus:border-wood-500 focus:outline-none"
                                />
                            </div>

                            {/* Descrição */}
                            <div>
                                <label className="text-dark-200 text-sm font-medium block mb-2">Descrição</label>
                                <textarea
                                    value={form.descricao}
                                    onChange={e => setForm(prev => ({ ...prev, descricao: e.target.value }))}
                                    placeholder="Descreva o projeto..."
                                    rows={3}
                                    className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-400 focus:border-wood-500 focus:outline-none resize-none"
                                />
                            </div>

                            {/* Ordem */}
                            <div>
                                <label className="text-dark-200 text-sm font-medium block mb-2">Ordem de exibição</label>
                                <input
                                    type="number"
                                    value={form.ordem}
                                    onChange={e => setForm(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                                    className="w-full bg-dark-700 border border-dark-500 rounded-xl px-4 py-2.5 text-sm text-white focus:border-wood-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-dark-600 flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-dark-700 text-dark-200 hover:bg-dark-600 text-sm font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.titulo || !form.descricao || !form.imagem_url}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-wood-600 text-white hover:bg-wood-500 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {editingProject ? 'Salvar Alterações' : 'Criar Projeto'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
