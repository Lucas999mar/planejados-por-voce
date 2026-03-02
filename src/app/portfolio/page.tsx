import { Phone, ArrowRight } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Portfólio | Planejados Por Você',
    description: 'Veja nossos projetos de móveis planejados: cozinhas, quartos, closets, banheiros, salas e mais.',
};

const projetos = [
    { id: 1, ambiente: 'Cozinha', titulo: 'Cozinha Moderna Cinza', desc: 'Cozinha planejada com acabamento cinza fosco e puxadores integrados', cor: 'from-stone-400 to-stone-600' },
    { id: 2, ambiente: 'Closet', titulo: 'Closet com Iluminação LED', desc: 'Closet aberto com divisórias modulares e iluminação embutida', cor: 'from-amber-300 to-amber-500' },
    { id: 3, ambiente: 'Quarto', titulo: 'Quarto Infantil Lúdico', desc: 'Móveis coloridos com segurança e funcionalidade para crianças', cor: 'from-sky-300 to-sky-500' },
    { id: 4, ambiente: 'Sala', titulo: 'Painel TV com Lareira', desc: 'Painel em MDF carvalho com nicho para lareira elétrica', cor: 'from-wood-400 to-wood-600' },
    { id: 5, ambiente: 'Banheiro', titulo: 'Gabinete Suspenso', desc: 'Gabinete com duas cubas, espelheira e organização interna', cor: 'from-teal-300 to-teal-500' },
    { id: 6, ambiente: 'Home Office', titulo: 'Escritório Compacto', desc: 'Mesa em L com estante integrada e passa fios', cor: 'from-indigo-300 to-indigo-500' },
    { id: 7, ambiente: 'Área Gourmet', titulo: 'Espaço Gourmet Completo', desc: 'Bancada com cuba, armários e espaço para geladeira e forno', cor: 'from-red-300 to-red-500' },
    { id: 8, ambiente: 'Lavanderia', titulo: 'Lavanderia Funcional', desc: 'Armário torre para máquina e secadora com tanque embutido', cor: 'from-emerald-300 to-emerald-500' },
    { id: 9, ambiente: 'Cozinha', titulo: 'Cozinha Branca Clássica', desc: 'Design clean com bancada em quartzo e iluminação sob armário', cor: 'from-gray-200 to-gray-400' },
];

const categorias = ['Todos', 'Cozinha', 'Quarto', 'Closet', 'Banheiro', 'Sala', 'Home Office', 'Área Gourmet', 'Lavanderia'];

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

            {/* Filtros */}
            <section className="bg-white border-b border-wood-100 sticky top-16 md:top-20 z-30">
                <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto">
                    <div className="flex gap-2">
                        {categorias.map((cat) => (
                            <button
                                key={cat}
                                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-wood-50 text-wood-600 hover:bg-wood-100 first:bg-wood-600 first:text-white"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="section-padding bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projetos.map((projeto) => (
                            <div
                                key={projeto.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-wood-100 hover:shadow-xl transition-all"
                            >
                                {/* Placeholder image area */}
                                <div className={`aspect-[4/3] bg-gradient-to-br ${projeto.cor} relative flex items-center justify-center`}>
                                    <span className="text-white/80 text-6xl font-heading font-bold opacity-30">{projeto.ambiente[0]}</span>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                        <a
                                            href={generateWhatsAppLink({ tipo_servico: 'planejados', ambiente: projeto.ambiente, descricao: `Quero um projeto parecido com: ${projeto.titulo}` })}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-wood-700 px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg flex items-center gap-2"
                                        >
                                            <Phone size={14} />
                                            Quero um projeto parecido
                                        </a>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <span className="text-wood-500 text-xs font-semibold uppercase tracking-wider">{projeto.ambiente}</span>
                                    <h3 className="font-heading font-semibold text-dark-700 mt-1">{projeto.titulo}</h3>
                                    <p className="text-dark-400 text-sm mt-2">{projeto.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
