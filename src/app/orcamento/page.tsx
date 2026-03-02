'use client';

import { useState } from 'react';
import { Phone, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { AMBIENTES, FAIXAS_ORCAMENTO, URGENCIAS, PROBLEMAS_ASSISTENCIA } from '@/lib/constants';

interface FormData {
    tipo_servico: string;
    ambiente: string;
    descricao: string;
    medidas: string;
    cidade: string;
    bairro: string;
    urgencia: string;
    orcamento_faixa: string;
    nome: string;
    whatsapp: string;
    email: string;
    consentimento_lgpd: boolean;
}

export default function OrcamentoPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState<FormData>({
        tipo_servico: '', ambiente: '', descricao: '', medidas: '',
        cidade: '', bairro: '', urgencia: '', orcamento_faixa: '',
        nome: '', whatsapp: '', email: '', consentimento_lgpd: false,
    });

    const update = (field: keyof FormData, value: string | boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const canNext = () => {
        switch (step) {
            case 1: return !!form.tipo_servico;
            case 2: return !!(form.ambiente && form.descricao);
            case 3: return !!(form.nome && form.whatsapp && form.cidade && form.consentimento_lgpd);
            default: return true;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const tags = [form.ambiente, form.tipo_servico === 'planejados' ? 'Planejados' : 'Assistência'].filter(Boolean);
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, tags, pagina_origem: '/orcamento' }),
            });
            setSubmitted(true);
        } catch {
            // Still allow WhatsApp redirect even if API fails
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    const waLink = generateWhatsAppLink({
        tipo_servico: form.tipo_servico,
        ambiente: form.ambiente,
        cidade: form.cidade,
        bairro: form.bairro,
        descricao: form.descricao,
        urgencia: form.urgencia,
        orcamento_faixa: form.orcamento_faixa,
        nome: form.nome,
        whatsapp: form.whatsapp,
        medidas: form.medidas,
    });

    if (submitted) {
        return (
            <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-wood-50 via-white to-gold-50">
                <div className="max-w-lg mx-auto text-center px-4">
                    <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-accent-500" />
                    </div>
                    <h1 className="font-heading text-3xl font-bold text-dark-800 mb-4">Orçamento enviado! 🎉</h1>
                    <p className="text-dark-400 mb-8">
                        Recebemos suas informações. Para agilizar o atendimento, clique abaixo e fale conosco no WhatsApp com o resumo do pedido preenchido:
                    </p>
                    <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                    >
                        <Phone size={22} />
                        Enviar no WhatsApp
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 min-h-screen bg-gradient-to-br from-wood-50 via-white to-gold-50">
            <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
                <div className="text-center mb-10">
                    <span className="text-wood-500 font-semibold text-sm uppercase tracking-wider">Orçamento Online</span>
                    <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark-800 mt-3">
                        Solicite seu <span className="gradient-text">orçamento</span>
                    </h1>
                    <p className="text-dark-400 mt-3">Preencha em poucos minutos e receba uma estimativa</p>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-10">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${s <= step ? 'bg-gradient-to-br from-wood-500 to-wood-700 text-white shadow-lg' : 'bg-wood-100 text-wood-400'
                                }`}>
                                {s < step ? <CheckCircle size={18} /> : s}
                            </div>
                            {s < 4 && <div className={`w-8 sm:w-12 h-1 rounded ${s < step ? 'bg-wood-500' : 'bg-wood-100'}`} />}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-wood-100 p-6 sm:p-8">
                    {/* Step 1: Type */}
                    {step === 1 && (
                        <div>
                            <h2 className="font-heading text-xl font-semibold text-dark-700 mb-6">Qual tipo de serviço?</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => update('tipo_servico', 'planejados')}
                                    className={`p-6 rounded-xl border-2 text-left transition-all ${form.tipo_servico === 'planejados'
                                            ? 'border-wood-500 bg-wood-50 shadow-lg'
                                            : 'border-wood-100 hover:border-wood-300'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">🪑</div>
                                    <h3 className="font-heading font-semibold text-dark-700">Móveis Planejados</h3>
                                    <p className="text-sm text-dark-400 mt-1">Projetos sob medida para qualquer ambiente</p>
                                </button>
                                <button
                                    onClick={() => update('tipo_servico', 'assistencia')}
                                    className={`p-6 rounded-xl border-2 text-left transition-all ${form.tipo_servico === 'assistencia'
                                            ? 'border-gold-500 bg-gold-50 shadow-lg'
                                            : 'border-wood-100 hover:border-wood-300'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">🔧</div>
                                    <h3 className="font-heading font-semibold text-dark-700">Assistência Técnica</h3>
                                    <p className="text-sm text-dark-400 mt-1">Reparos, ajustes e troca de ferragens</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <div>
                            <h2 className="font-heading text-xl font-semibold text-dark-700 mb-6">Detalhes do serviço</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-2">
                                        {form.tipo_servico === 'planejados' ? 'Qual ambiente?' : 'Qual móvel/ambiente?'}
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {(form.tipo_servico === 'planejados' ? AMBIENTES : ['Cozinha', 'Quarto', 'Closet', 'Banheiro', 'Sala', 'Outro']).map((amb) => (
                                            <button
                                                key={amb}
                                                onClick={() => update('ambiente', amb)}
                                                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${form.ambiente === amb
                                                        ? 'bg-wood-600 text-white shadow'
                                                        : 'bg-wood-50 text-wood-600 hover:bg-wood-100'
                                                    }`}
                                            >
                                                {amb}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {form.tipo_servico === 'assistencia' && (
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-2">Qual o problema?</label>
                                        <select
                                            value={form.descricao}
                                            onChange={(e) => update('descricao', e.target.value)}
                                            className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400"
                                        >
                                            <option value="">Selecione...</option>
                                            {PROBLEMAS_ASSISTENCIA.map((p) => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {form.tipo_servico === 'planejados' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-dark-600 mb-2">Descreva o que precisa</label>
                                            <textarea
                                                value={form.descricao}
                                                onChange={(e) => update('descricao', e.target.value)}
                                                rows={3}
                                                placeholder="Ex: Quero uma cozinha com armários superiores e inferiores, bancada em quartzo..."
                                                className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400 resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-dark-600 mb-2">Medidas aproximadas (opcional)</label>
                                            <input
                                                type="text"
                                                value={form.medidas}
                                                onChange={(e) => update('medidas', e.target.value)}
                                                placeholder="Ex: 3m x 2.5m"
                                                className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-2">Urgência/Prazo</label>
                                        <select
                                            value={form.urgencia}
                                            onChange={(e) => update('urgencia', e.target.value)}
                                            className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400"
                                        >
                                            <option value="">Selecione...</option>
                                            {URGENCIAS.map((u) => (
                                                <option key={u} value={u}>{u}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-2">Faixa de orçamento</label>
                                        <select
                                            value={form.orcamento_faixa}
                                            onChange={(e) => update('orcamento_faixa', e.target.value)}
                                            className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400"
                                        >
                                            <option value="">Selecione...</option>
                                            {FAIXAS_ORCAMENTO.map((f) => (
                                                <option key={f} value={f}>{f}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Contact */}
                    {step === 3 && (
                        <div>
                            <h2 className="font-heading text-xl font-semibold text-dark-700 mb-6">Seus dados de contato</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-2">Nome completo *</label>
                                    <input
                                        type="text"
                                        value={form.nome}
                                        onChange={(e) => update('nome', e.target.value)}
                                        placeholder="Seu nome"
                                        className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-2">WhatsApp *</label>
                                    <input
                                        type="tel"
                                        value={form.whatsapp}
                                        onChange={(e) => update('whatsapp', e.target.value)}
                                        placeholder="(00) 00000-0000"
                                        className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-2">E-mail (opcional)</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => update('email', e.target.value)}
                                        placeholder="seu@email.com"
                                        className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-2">Cidade *</label>
                                        <input
                                            type="text"
                                            value={form.cidade}
                                            onChange={(e) => update('cidade', e.target.value)}
                                            placeholder="Sua cidade"
                                            className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-dark-600 mb-2">Bairro</label>
                                        <input
                                            type="text"
                                            value={form.bairro}
                                            onChange={(e) => update('bairro', e.target.value)}
                                            placeholder="Seu bairro"
                                            className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400"
                                        />
                                    </div>
                                </div>
                                <label className="flex items-start gap-3 mt-4 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.consentimento_lgpd}
                                        onChange={(e) => update('consentimento_lgpd', e.target.checked)}
                                        className="mt-1 w-5 h-5 rounded border-wood-300 text-wood-600 focus:ring-wood-400"
                                    />
                                    <span className="text-sm text-dark-400">
                                        Concordo com a <a href="/politicas" className="text-wood-600 underline">Política de Privacidade</a> e autorizo o contato para orçamento. *
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Summary */}
                    {step === 4 && (
                        <div>
                            <h2 className="font-heading text-xl font-semibold text-dark-700 mb-6">Resumo do orçamento</h2>
                            <div className="space-y-3 bg-wood-50 rounded-xl p-5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-dark-400">Serviço:</span>
                                    <span className="font-medium text-dark-700">{form.tipo_servico === 'planejados' ? 'Móveis Planejados' : 'Assistência Técnica'}</span>
                                </div>
                                {form.ambiente && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-dark-400">Ambiente:</span>
                                        <span className="font-medium text-dark-700">{form.ambiente}</span>
                                    </div>
                                )}
                                {form.descricao && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-dark-400">Detalhes:</span>
                                        <span className="font-medium text-dark-700 text-right max-w-[200px]">{form.descricao}</span>
                                    </div>
                                )}
                                {form.urgencia && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-dark-400">Urgência:</span>
                                        <span className="font-medium text-dark-700">{form.urgencia}</span>
                                    </div>
                                )}
                                {form.orcamento_faixa && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-dark-400">Orçamento:</span>
                                        <span className="font-medium text-dark-700">{form.orcamento_faixa}</span>
                                    </div>
                                )}
                                <hr className="border-wood-200" />
                                <div className="flex justify-between text-sm">
                                    <span className="text-dark-400">Nome:</span>
                                    <span className="font-medium text-dark-700">{form.nome}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-dark-400">WhatsApp:</span>
                                    <span className="font-medium text-dark-700">{form.whatsapp}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-dark-400">Local:</span>
                                    <span className="font-medium text-dark-700">{form.cidade}{form.bairro ? ` - ${form.bairro}` : ''}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center gap-2 text-dark-400 hover:text-dark-600 font-medium transition-colors"
                            >
                                <ArrowLeft size={18} />
                                Voltar
                            </button>
                        ) : <div />}

                        {step < 4 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={!canNext()}
                                className="flex items-center gap-2 bg-gradient-to-r from-wood-600 to-wood-700 text-white px-6 py-3 rounded-full font-semibold hover:from-wood-700 hover:to-wood-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                Próximo
                                <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-3 rounded-full font-semibold hover:from-accent-600 hover:to-accent-700 transition-all disabled:opacity-50 shadow-lg"
                            >
                                {loading ? 'Enviando...' : 'Enviar e ir para WhatsApp'}
                                <Phone size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
