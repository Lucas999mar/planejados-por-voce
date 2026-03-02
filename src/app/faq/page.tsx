import { ChevronDown, Phone, ArrowRight } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FAQ | Planejados Por Você',
    description: 'Dúvidas frequentes sobre móveis planejados e assistência técnica. Encontre respostas rápidas.',
};

const faqSections = [
    {
        titulo: 'Sobre Móveis Planejados',
        itens: [
            { p: 'Quanto tempo leva para fabricar e instalar?', r: 'O prazo varia conforme o projeto, mas em média de 15 a 30 dias úteis após aprovação do orçamento. O prazo exato é informado no seu orçamento personalizado.' },
            { p: 'Vocês fazem visita para medir?', r: 'Sim! Após o contato inicial no WhatsApp, agendamos uma visita gratuita para medição no local.' },
            { p: 'Quais materiais vocês utilizam?', r: 'Trabalhamos com MDF, MDP, material ultracompacto e outros de alta qualidade. Ferragens de marcas renomadas como Blum, Hafele e Hettich.' },
            { p: 'Posso escolher cores e acabamentos?', r: 'Claro! Temos um amplo catálogo de cores, acabamentos e texturas. Apresentamos amostras durante o projeto.' },
            { p: 'O projeto é cobrado à parte?', r: 'O projeto é incluído no orçamento quando há a contratação. Para projetos avulsos, entre em contato no WhatsApp para valores.' },
            { p: 'Vocês também fazem a instalação?', r: 'Sim, do projeto à instalação completa, incluindo montagem no local.' },
        ],
    },
    {
        titulo: 'Sobre Assistência Técnica',
        itens: [
            { p: 'Vocês consertam móveis de outras marcas?', r: 'Sim! Realizamos reparos, troca de ferragens e ajustes em móveis de qualquer marca e fabricante.' },
            { p: 'Quais problemas vocês resolvem?', r: 'Portas desalinhadas, dobradiças com defeito, trilhos e corrediças com problema, gavetas travadas, troca de ferragens, reparos no acabamento e muito mais.' },
            { p: 'Preciso levar o móvel até vocês?', r: 'Não! Realizamos atendimento no local (residência ou empresa). Agende pelo WhatsApp.' },
            { p: 'Quanto custa uma assistência?', r: 'O valor depende do tipo de reparo e das peças necessárias. Envie fotos e detalhes no WhatsApp para uma estimativa rápida.' },
        ],
    },
    {
        titulo: 'Pagamento e Garantia',
        itens: [
            { p: 'Quais formas de pagamento?', r: 'Aceitamos PIX, transferência bancária, boleto e cartão de crédito (condições pelo WhatsApp).' },
            { p: 'Tem garantia?', r: 'Sim, oferecemos garantia para vícios de fabricação e montagem. O prazo específico é informado no contrato.' },
            { p: 'Posso parcelar?', r: 'Sim! Condições de parcelamento são informadas no WhatsApp conforme o valor do orçamento.' },
        ],
    },
    {
        titulo: 'Atendimento e Região',
        itens: [
            { p: 'Qual o horário de atendimento?', r: 'Nosso chat e WhatsApp funcionam 24 horas. As visitas técnicas são agendadas em horário comercial.' },
            { p: 'Atendem em qual região?', r: 'Atendemos em todo o Brasil! Fale conosco no WhatsApp para confirmar disponibilidade na sua região.' },
            { p: 'Como entro em contato?', r: 'O jeito mais rápido é pelo WhatsApp! Clique no botão verde em qualquer página do site ou use nosso chat.' },
        ],
    },
];

export default function FaqPage() {
    return (
        <div className="pt-20">
            {/* Hero */}
            <section className="section-padding bg-gradient-to-br from-wood-50 via-white to-gold-50">
                <div className="max-w-5xl mx-auto text-center">
                    <span className="text-wood-500 font-semibold text-sm uppercase tracking-wider">Dúvidas Frequentes</span>
                    <h1 className="font-heading text-4xl sm:text-5xl font-bold text-dark-800 mt-3">
                        Perguntas <span className="gradient-text">Frequentes</span>
                    </h1>
                    <p className="text-dark-400 text-lg mt-4 max-w-2xl mx-auto">
                        Encontre respostas rápidas. Se não achar o que procura, fale conosco no WhatsApp!
                    </p>
                </div>
            </section>

            {/* FAQ Sections */}
            <section className="section-padding bg-white">
                <div className="max-w-3xl mx-auto space-y-12">
                    {faqSections.map((section) => (
                        <div key={section.titulo}>
                            <h2 className="font-heading text-2xl font-bold text-dark-800 mb-6">{section.titulo}</h2>
                            <div className="space-y-3">
                                {section.itens.map((item, i) => (
                                    <details key={i} className="group bg-wood-50 rounded-xl border border-wood-100 overflow-hidden">
                                        <summary className="flex items-center justify-between p-5 cursor-pointer font-heading font-medium text-dark-700 hover:text-wood-600 transition-colors list-none">
                                            <span>{item.p}</span>
                                            <ChevronDown size={20} className="text-wood-400 group-open:rotate-180 transition-transform shrink-0 ml-4" />
                                        </summary>
                                        <div className="px-5 pb-5 text-sm text-dark-400 leading-relaxed">{item.r}</div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-gradient-to-r from-wood-700 to-dark-800 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-heading text-3xl font-bold mb-4">Ainda tem dúvidas?</h2>
                    <p className="text-wood-200 text-lg mb-8">Fale conosco no WhatsApp — respondemos rápido!</p>
                    <a
                        href={generateWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl transition-all"
                    >
                        <Phone size={22} />
                        Perguntar no WhatsApp
                        <ArrowRight size={20} />
                    </a>
                </div>
            </section>
        </div>
    );
}
