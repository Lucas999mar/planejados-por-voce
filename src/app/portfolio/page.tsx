import { Phone, ArrowRight } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import type { Metadata } from 'next';
import PortfolioGrid from '@/components/portfolio/PortfolioGrid';

export const metadata: Metadata = {
    title: 'Portfólio | Planejados Por Você',
    description: 'Veja nossos projetos de móveis planejados: cozinhas, dormitórios, closets, banheiros, living, home office, adega, suíte, biblioteca, studio, corporativo, espaços comerciais e mais.',
};

export default function PortfolioPage() {
    return (
        <div className="pt-20">
            {/* Hero */}
            <section className="section-padding bg-gradient-to-br from-wood-50 via-white to-gold-50">
                <div className="max-w-5xl mx-auto text-center">
                    <span className="text-wood-500 font-semibold text-sm uppercase tracking-wider">Nossos Projetos</span>
                    <h1 className="font-heading text-4xl sm:text-5xl font-bold text-dark-800 mt-3">
                        <span className="gradient-text">Portfólio</span> de Projetos
                    </h1>
                    <p className="text-dark-400 text-lg mt-4 max-w-2xl mx-auto">
                        Inspire-se com nossos trabalhos. Cada projeto é único e feito sob medida.
                    </p>
                </div>
            </section>

            {/* Interactive Filters + Grid */}
            <PortfolioGrid />

            {/* CTA */}
            <section className="section-padding bg-gradient-to-r from-wood-700 to-wood-800 text-white">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="font-heading text-3xl font-bold mb-4">Gostou do que viu?</h2>
                    <p className="text-wood-200 text-lg mb-8">
                        Envie fotos de inspiração no WhatsApp e criamos um projeto exclusivo para você!
                    </p>
                    <a
                        href={generateWhatsAppLink({ descricao: 'Vi o portfólio no site e gostaria de um projeto sob medida' })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                    >
                        <Phone size={22} />
                        Enviar Inspiração no WhatsApp
                        <ArrowRight size={20} />
                    </a>
                </div>
            </section>
        </div>
    );
}
