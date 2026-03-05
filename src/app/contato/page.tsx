import { Phone, Mail, MapPin, Clock, ArrowRight, MessageSquare } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { WHATSAPP_DISPLAY } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contato | Planejados Por Você',
    description: 'Entre em contato conosco. WhatsApp, e-mail ou formulário. Atendemos em todo o Brasil.',
};

export default function ContatoPage() {
    return (
        <div className="pt-20">
            <section className="section-padding bg-gradient-to-br from-wood-50 via-white to-gold-50">
                <div className="max-w-5xl mx-auto text-center">
                    <span className="text-wood-500 font-semibold text-sm uppercase tracking-wider">Contato</span>
                    <h1 className="font-heading text-4xl sm:text-5xl font-bold text-dark-800 mt-3">
                        Fale <span className="gradient-text">conosco</span>
                    </h1>
                    <p className="text-dark-400 text-lg mt-4 max-w-2xl mx-auto">
                        O jeito mais rápido de ser atendido é pelo WhatsApp. Mas você também pode usar nosso formulário!
                    </p>
                </div>
            </section>

            <section className="section-padding bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h2 className="font-heading text-2xl font-bold text-dark-800 mb-8">Canais de atendimento</h2>
                            <div className="space-y-6">
                                <a
                                    href={generateWhatsAppLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-track="whatsapp-contato-main"
                                    data-track-label="WhatsApp Contato (Principal)"
                                    className="flex items-center gap-4 p-5 bg-accent-50 rounded-2xl border border-accent-100 hover:shadow-lg transition-shadow group"
                                >
                                    <div className="w-14 h-14 bg-accent-500 rounded-xl flex items-center justify-center shrink-0">
                                        <Phone size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-dark-700">WhatsApp (mais rápido)</h3>
                                        <p className="text-accent-600 font-medium">{WHATSAPP_DISPLAY}</p>
                                        <p className="text-dark-400 text-sm mt-1">Resposta imediata</p>
                                    </div>
                                    <ArrowRight size={20} className="text-accent-400 ml-auto group-hover:translate-x-1 transition-transform" />
                                </a>

                                <div className="flex items-center gap-4 p-5 bg-wood-50 rounded-2xl border border-wood-100">
                                    <div className="w-14 h-14 bg-wood-200 rounded-xl flex items-center justify-center shrink-0">
                                        <Mail size={24} className="text-wood-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-dark-700">E-mail</h3>
                                        <p className="text-wood-600 font-medium">contato@planejadosporvoce.com.br</p>
                                        <p className="text-dark-400 text-sm mt-1">Resposta em até 24h</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-wood-50 rounded-2xl border border-wood-100">
                                    <div className="w-14 h-14 bg-wood-200 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin size={24} className="text-wood-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-dark-700">Região de Atendimento</h3>
                                        <p className="text-dark-600 font-medium">Todo o Brasil</p>
                                        <p className="text-dark-400 text-sm mt-1">Consulte disponibilidade</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-wood-50 rounded-2xl border border-wood-100">
                                    <div className="w-14 h-14 bg-wood-200 rounded-xl flex items-center justify-center shrink-0">
                                        <Clock size={24} className="text-wood-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-semibold text-dark-700">Horário</h3>
                                        <p className="text-dark-600 font-medium">24 horas</p>
                                        <p className="text-dark-400 text-sm mt-1">Chat e WhatsApp sempre disponíveis</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Simple Form */}
                        <div>
                            <h2 className="font-heading text-2xl font-bold text-dark-800 mb-8">Envie uma mensagem</h2>
                            <form className="space-y-5" action={generateWhatsAppLink()} target="_blank">
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-2">Nome</label>
                                    <input
                                        type="text"
                                        placeholder="Seu nome"
                                        className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-2">WhatsApp</label>
                                    <input
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-dark-600 mb-2">Mensagem</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Como podemos te ajudar?"
                                        className="w-full bg-wood-50 border border-wood-200 rounded-xl px-4 py-3 text-sm text-dark-700 focus:outline-none focus:ring-2 focus:ring-wood-400 resize-none"
                                    />
                                </div>
                                <a
                                    href={generateWhatsAppLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-track="whatsapp-contato-form"
                                    data-track-label="WhatsApp Contato (Formulário)"
                                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-3 rounded-full font-semibold hover:from-accent-600 hover:to-accent-700 transition-all shadow-lg"
                                >
                                    <MessageSquare size={18} />
                                    Enviar no WhatsApp
                                </a>
                                <p className="text-dark-300 text-xs text-center">
                                    Ao enviar, você será redirecionado ao WhatsApp com sua mensagem
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
