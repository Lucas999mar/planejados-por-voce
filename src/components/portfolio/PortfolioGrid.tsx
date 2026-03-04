'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';

const projetos = [
    // Cozinha
    { id: 1, ambiente: 'Cozinha', titulo: 'Cozinha Moderna Cinza', desc: 'Cozinha planejada com acabamento cinza fosco e puxadores integrados', imagem: '/portfolio/cozinha-1.webp' },
    { id: 2, ambiente: 'Cozinha', titulo: 'Cozinha Branca Clássica', desc: 'Design clean com bancada em quartzo e iluminação sob armário', imagem: '/portfolio/cozinha-2.webp' },

    // Closet
    { id: 3, ambiente: 'Closet', titulo: 'Closet com Iluminação LED', desc: 'Closet aberto com divisórias modulares e iluminação embutida', imagem: '/portfolio/closet-1.webp' },
    { id: 4, ambiente: 'Closet', titulo: 'Closet Casal Espelhado', desc: 'Closet em L com portas espelhadas, gavetas organizadoras e cabideiros duplos', imagem: '/portfolio/closet-2.webp' },

    // Dormitório
    { id: 5, ambiente: 'Dormitório', titulo: 'Dormitório Infantil Lúdico', desc: 'Móveis coloridos com segurança e funcionalidade para crianças', imagem: '/portfolio/dormitorio-1.webp' },
    { id: 6, ambiente: 'Dormitório', titulo: 'Dormitório Casal Contemporâneo', desc: 'Cabeceira estofada com criados-mudos suspensos e painel ripado', imagem: '/portfolio/dormitorio-2.webp' },

    // Living
    { id: 7, ambiente: 'Living', titulo: 'Painel TV com Lareira', desc: 'Painel em MDF carvalho com nicho para lareira elétrica e prateleiras decorativas', imagem: '/portfolio/living-1.webp' },
    { id: 8, ambiente: 'Living', titulo: 'Estante Living Integrada', desc: 'Estante modular com nichos abertos, portas de correr e iluminação indireta', imagem: '/portfolio/living-2.webp' },

    // Banheiro
    { id: 9, ambiente: 'Banheiro', titulo: 'Gabinete Suspenso', desc: 'Gabinete com duas cubas, espelheira e organização interna', imagem: '/portfolio/banheiro-1.webp' },
    { id: 10, ambiente: 'Banheiro', titulo: 'Banheiro Spa Relaxante', desc: 'Bancada em porcelanato com iluminação cênica e armário espelhado', imagem: '/portfolio/banheiro-2.webp' },

    // Home Office
    { id: 11, ambiente: 'Home Office', titulo: 'Escritório Compacto', desc: 'Mesa em L com estante integrada e passa fios', imagem: '/portfolio/homeoffice-1.webp' },
    { id: 12, ambiente: 'Home Office', titulo: 'Home Office Premium', desc: 'Escritório com estante do piso ao teto, mesa executiva e painel acústico', imagem: '/portfolio/homeoffice-2.webp' },

    // Área Gourmet
    { id: 13, ambiente: 'Área Gourmet', titulo: 'Espaço Gourmet Completo', desc: 'Bancada com cuba, armários e espaço para geladeira e forno', imagem: '/portfolio/areagourmet-1.webp' },

    // Lavanderia
    { id: 14, ambiente: 'Lavanderia', titulo: 'Lavanderia Funcional', desc: 'Armário torre para máquina e secadora com tanque embutido', imagem: '/portfolio/lavanderia-1.webp' },
    { id: 15, ambiente: 'Lavanderia', titulo: 'Lavanderia Compacta Planejada', desc: 'Solução vertical otimizada com varal retrátil e prateleiras organizadoras', imagem: '/portfolio/lavanderia-2.webp' },

    // Adega
    { id: 16, ambiente: 'Adega', titulo: 'Adega Climatizada em Madeira', desc: 'Adega com suporte para 80 garrafas, iluminação LED e acabamento em carvalho', imagem: '/portfolio/adega-1.webp' },
    { id: 17, ambiente: 'Adega', titulo: 'Adega Compacta Moderna', desc: 'Mini adega integrada à sala de jantar com prateleiras inclinadas e vidro temperado', imagem: '/portfolio/adega-2.webp' },

    // Studio
    { id: 18, ambiente: 'Studio', titulo: 'Studio Multifuncional', desc: 'Ambiente integrado com cozinha compacta, living e dormitório com marcenaria inteligente', imagem: '/portfolio/studio-1.webp' },
    { id: 19, ambiente: 'Studio', titulo: 'Studio Contemporâneo', desc: 'Espaço otimizado com móveis retráteis, bancada dobrável e divisórias modulares', imagem: '/portfolio/studio-2.webp' },

    // Suíte
    { id: 20, ambiente: 'Suíte', titulo: 'Suíte Master Elegante', desc: 'Suíte com cabeceira planejada, closet integrado e penteadeira com espelho camarim', imagem: '/portfolio/suite-1.webp' },
    { id: 21, ambiente: 'Suíte', titulo: 'Suíte Minimalista', desc: 'Design limpo com armários de piso a teto, nicho retroiluminado e automatização', imagem: '/portfolio/suite-2.webp' },

    // Biblioteca
    { id: 22, ambiente: 'Biblioteca', titulo: 'Biblioteca Clássica com Escada', desc: 'Estantes em madeira escura do piso ao teto com escada deslizante e poltrona de leitura', imagem: '/portfolio/biblioteca-1.webp' },
    { id: 23, ambiente: 'Biblioteca', titulo: 'Biblioteca Moderna Compacta', desc: 'Nichos assimétricos com iluminação individual e espaço para coleção de livros', imagem: '/portfolio/biblioteca-2.webp' },

    // Corporativo
    { id: 24, ambiente: 'Corporativo', titulo: 'Sala de Reuniões Executiva', desc: 'Ambiente corporativo com mesa para 10 pessoas, marcenaria em MDF e acústica', imagem: '/portfolio/corporativo-1.webp' },
    { id: 25, ambiente: 'Corporativo', titulo: 'Recepção Corporativa', desc: 'Balcão de recepção planejado com painel logotipo retroiluminado e sala de espera', imagem: '/portfolio/corporativo-2.webp' },

    // Espaços Comerciais
    { id: 26, ambiente: 'Espaços Comerciais', titulo: 'Loja de Roupas Planejada', desc: 'Projeto comercial com expositores modulares, provadores e balcão de atendimento', imagem: '/portfolio/comercial-1.webp' },
    { id: 27, ambiente: 'Espaços Comerciais', titulo: 'Consultório Odontológico', desc: 'Ambiente clínico com armários esterilizáveis, bancada ergonômica e recepção acolhedora', imagem: '/portfolio/comercial-2.webp' },
];

const categorias = ['Todos', 'Cozinha', 'Dormitório', 'Closet', 'Banheiro', 'Living', 'Home Office', 'Área Gourmet', 'Lavanderia', 'Adega', 'Studio', 'Suíte', 'Biblioteca', 'Corporativo', 'Espaços Comerciais'];

export default function PortfolioGrid() {
    const [filtroAtivo, setFiltroAtivo] = useState('Todos');

    const projetosFiltrados = filtroAtivo === 'Todos'
        ? projetos
        : projetos.filter((p) => p.ambiente === filtroAtivo);

    return (
        <>
            {/* Filtros */}
            <section className="bg-white border-b border-wood-100 sticky top-16 md:top-20 z-30">
                <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto">
                    <div className="flex gap-2">
                        {categorias.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFiltroAtivo(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filtroAtivo === cat
                                        ? 'bg-wood-600 text-white shadow-md'
                                        : 'bg-wood-50 text-wood-600 hover:bg-wood-100'
                                    }`}
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
                    {projetosFiltrados.length === 0 ? (
                        <div className="text-center py-20 text-dark-400">
                            <p className="text-lg">Nenhum projeto encontrado nesta categoria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projetosFiltrados.map((projeto) => (
                                <div
                                    key={projeto.id}
                                    className="group bg-white rounded-2xl overflow-hidden border border-wood-100 hover:shadow-xl transition-all"
                                >
                                    {/* Project image */}
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <img
                                            src={projeto.imagem}
                                            alt={projeto.titulo}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
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
                    )}
                </div>
            </section>
        </>
    );
}
