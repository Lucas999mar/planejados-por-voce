import {
    ChefHat, BedDouble, ShirtIcon, Bath, Sofa, Flame, WashingMachine, Monitor,
    Wrench, Phone, ArrowRight, AlertTriangle
} from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { PROBLEMAS_ASSISTENCIA } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Serviços | Planejados Por Você',
    description: 'Móveis planejados sob medida para todos os ambientes e assistência técnica especializada em ferragens, dobradiças e reparos.',
};

const ambientes = [
    { icon: ChefHat, nome: 'Cozinha', desc: 'Armários superiores e inferiores, bancadas em diversos materiais, despensas organizadas, nichos e prateleiras. Cada centímetro aproveitado.' },
    { icon: BedDouble, nome: 'Quarto', desc: 'Guarda-roupas com divisórias personalizadas, cabeceiras estofadas, cômodas e criados-mudos sob medida.' },
    { icon: ShirtIcon, nome: 'Closet', desc: 'Closets abertos ou fechados com módulos de gavetas, maleiro, prateleiras, cabideiros e iluminação integrada.' },
    { icon: Bath, nome: 'Banheiro', desc: 'Gabinetes para pia, nichos para box, armários espelhados e soluções para banheiros compactos.' },
    { icon: Sofa, nome: 'Sala', desc: 'Painéis para TV com LED, estantes modulares, racks, aparadores e móveis de apoio.' },
    { icon: Flame, nome: 'Área Gourmet', desc: 'Bancadas para churrasqueira, armários para utensílios, adegas e espaços de lazer completos.' },
    { icon: WashingMachine, nome: 'Lavanderia', desc: 'Armários para máquina e secadora, tanque embutido, varais retráteis e organização funcional.' },
    { icon: Monitor, nome: 'Home Office', desc: 'Mesas em L, estantes com prateleiras reguláveis, gaveteiros e organização de cabos.' },
];

export default function ServicosPage() {
    return (
        <div className="pt-20">
            {/* Hero */}
            <section className="section-padding bg-gradient-to-br from-wood-50 via-white to-gold-50">
                <div className="max-w-5xl mx-auto text-center">
                    <span className="text-wood-500 font-semibold text-sm uppercase tracking-wider">Nossos Serviços</span>
                    <h1 className="font-heading text-4xl sm:text-5xl font-bold text-dark-800 mt-3">
                        Soluções completas em <span className="gradient-text">móveis planejados</span>
                    </h1>
                    <p className="text-dark-400 text-lg mt-4 max-w-2xl mx-auto">
                        Do projeto à instalação, cuidamos de cada detalhe. E se precisar de reparo, nossa assistência técnica resolve.
                    </p>
                </div>
            </section>

            {/* Planejados por ambiente */}
            <section className="section-padding bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-heading text-3xl font-bold text-dark-800 mb-12 text-center">
                        Móveis Planejados por <span className="gradient-text">Ambiente</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ambientes.map((amb) => (
                            <div
                                key={amb.nome}
                                className="group bg-wood-50 rounded-2xl p-6 border border-wood-100 hover:shadow-xl transition-all hover:border-wood-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-wood-500 to-wood-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                                        <amb.icon size={26} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-heading font-semibold text-xl text-dark-700">{amb.nome}</h3>
                                        <p className="text-dark-400 text-sm mt-2 leading-relaxed">{amb.desc}</p>
                                        <a
                                            href={generateWhatsAppLink({ tipo_servico: 'planejados', ambiente: amb.nome })}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 mt-4 text-accent-600 font-semibold text-sm hover:text-accent-700 transition-colors"
                                        >
                                            <Phone size={14} />
                                            Quero orçamento para {amb.nome.toLowerCase()}
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Assistência Técnica */}
            <section className="section-padding bg-gradient-to-b from-dark-800 to-dark-900 text-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-gold-400 font-semibold text-sm uppercase tracking-wider">Assistência Técnica</span>
                        <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-2">
                            Reparos e manutenção <span className="text-gold-400">especializada</span>
                        </h2>
                        <p className="text-dark-200 mt-4 max-w-xl mx-auto">
                            Problemas com seus móveis? Nossa equipe resolve com agilidade e qualidade.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PROBLEMAS_ASSISTENCIA.map((problema) => (
                            <a
                                key={problema}
                                href={generateWhatsAppLink({ tipo_servico: 'assistencia', descricao: problema })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-dark-700/50 backdrop-blur-sm p-4 rounded-xl border border-dark-600 hover:border-gold-500/40 transition-all hover:bg-dark-600/50 group"
                            >
                                <AlertTriangle size={18} className="text-gold-400 shrink-0" />
                                <span className="text-dark-100 text-sm">{problema}</span>
                                <ArrowRight size={14} className="text-dark-400 ml-auto group-hover:text-gold-400 transition-colors shrink-0" />
                            </a>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <a
                            href={generateWhatsAppLink({ tipo_servico: 'assistencia' })}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl hover:from-gold-600 hover:to-gold-700 transition-all"
                        >
                            <Wrench size={22} />
                            Solicitar Assistência Técnica
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-gradient-to-r from-accent-600 to-accent-700 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-heading text-3xl font-bold mb-4">Não encontrou o que procura?</h2>
                    <p className="text-accent-100 text-lg mb-8">
                        Fale conosco no WhatsApp e conte sua necessidade. Criamos projetos personalizados!
                    </p>
                    <a
                        href={generateWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-white text-accent-700 px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                    >
                        <Phone size={22} />
                        Falar com Especialista
                    </a>
                </div>
            </section>
        </div>
    );
}
