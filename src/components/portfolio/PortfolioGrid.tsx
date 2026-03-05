'use client';

import { useState, useEffect } from 'react';
import { Phone, Loader2, X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';

interface Project {
    id: string;
    ambiente: string;
    titulo: string;
    descricao: string;
    imagem_url: string;
    imagens: string[];
    ordem: number;
}

const DEFAULT_CATEGORIAS = ['Todos', 'Cozinha', 'Dormitório', 'Closet', 'Banheiro', 'Living', 'Home Office', 'Área Gourmet', 'Lavanderia', 'Adega', 'Studio', 'Suíte', 'Biblioteca', 'Corporativo', 'Espaços Comerciais'];

// Fallback data
const FALLBACK_PROJECTS: Project[] = [
    { id: '1', ambiente: 'Cozinha', titulo: 'Cozinha Moderna Cinza', descricao: 'Cozinha planejada com acabamento cinza fosco e puxadores integrados', imagem_url: '/portfolio/cozinha-1.webp', imagens: [], ordem: 1 },
    { id: '2', ambiente: 'Cozinha', titulo: 'Cozinha Branca Clássica', descricao: 'Design clean com bancada em quartzo e iluminação sob armário', imagem_url: '/portfolio/cozinha-2.webp', imagens: [], ordem: 2 },
    { id: '3', ambiente: 'Closet', titulo: 'Closet com Iluminação LED', descricao: 'Closet aberto com divisórias modulares e iluminação embutida', imagem_url: '/portfolio/closet-1.webp', imagens: [], ordem: 3 },
    { id: '4', ambiente: 'Closet', titulo: 'Closet Casal Espelhado', descricao: 'Closet em L com portas espelhadas, gavetas organizadoras e cabideiros duplos', imagem_url: '/portfolio/closet-2.webp', imagens: [], ordem: 4 },
    { id: '5', ambiente: 'Dormitório', titulo: 'Dormitório Infantil Lúdico', descricao: 'Móveis coloridos com segurança e funcionalidade para crianças', imagem_url: '/portfolio/dormitorio-1.webp', imagens: [], ordem: 5 },
    { id: '6', ambiente: 'Dormitório', titulo: 'Dormitório Casal Contemporâneo', descricao: 'Cabeceira estofada com criados-mudos suspensos e painel ripado', imagem_url: '/portfolio/dormitorio-2.webp', imagens: [], ordem: 6 },
    { id: '7', ambiente: 'Living', titulo: 'Painel TV com Lareira', descricao: 'Painel em MDF carvalho com nicho para lareira elétrica e prateleiras decorativas', imagem_url: '/portfolio/living-1.webp', imagens: [], ordem: 7 },
    { id: '8', ambiente: 'Living', titulo: 'Estante Living Integrada', descricao: 'Estante modular com nichos abertos, portas de correr e iluminação indireta', imagem_url: '/portfolio/living-2.webp', imagens: [], ordem: 8 },
    { id: '9', ambiente: 'Banheiro', titulo: 'Gabinete Suspenso', descricao: 'Gabinete com duas cubas, espelheira e organização interna', imagem_url: '/portfolio/banheiro-1.webp', imagens: [], ordem: 9 },
    { id: '10', ambiente: 'Banheiro', titulo: 'Banheiro Spa Relaxante', descricao: 'Bancada em porcelanato com iluminação cênica e armário espelhado', imagem_url: '/portfolio/banheiro-2.webp', imagens: [], ordem: 10 },
    { id: '11', ambiente: 'Home Office', titulo: 'Escritório Compacto', descricao: 'Mesa em L com estante integrada e passa fios', imagem_url: '/portfolio/homeoffice-1.webp', imagens: [], ordem: 11 },
    { id: '12', ambiente: 'Home Office', titulo: 'Home Office Premium', descricao: 'Escritório com estante do piso ao teto, mesa executiva e painel acústico', imagem_url: '/portfolio/homeoffice-2.webp', imagens: [], ordem: 12 },
    { id: '13', ambiente: 'Área Gourmet', titulo: 'Espaço Gourmet Completo', descricao: 'Bancada com cuba, armários e espaço para geladeira e forno', imagem_url: '/portfolio/areagourmet-1.webp', imagens: [], ordem: 13 },
    { id: '14', ambiente: 'Lavanderia', titulo: 'Lavanderia Funcional', descricao: 'Armário torre para máquina e secadora com tanque embutido', imagem_url: '/portfolio/lavanderia-1.webp', imagens: [], ordem: 14 },
    { id: '15', ambiente: 'Lavanderia', titulo: 'Lavanderia Compacta Planejada', descricao: 'Solução vertical otimizada com varal retrátil e prateleiras organizadoras', imagem_url: '/portfolio/lavanderia-2.webp', imagens: [], ordem: 15 },
    { id: '16', ambiente: 'Adega', titulo: 'Adega Climatizada em Madeira', descricao: 'Adega com suporte para 80 garrafas, iluminação LED e acabamento em carvalho', imagem_url: '/portfolio/adega-1.webp', imagens: [], ordem: 16 },
    { id: '17', ambiente: 'Adega', titulo: 'Adega Compacta Moderna', descricao: 'Mini adega integrada à sala de jantar com prateleiras inclinadas e vidro temperado', imagem_url: '/portfolio/adega-2.webp', imagens: [], ordem: 17 },
    { id: '18', ambiente: 'Studio', titulo: 'Studio Multifuncional', descricao: 'Ambiente integrado com cozinha compacta, living e dormitório com marcenaria inteligente', imagem_url: '/portfolio/studio-1.webp', imagens: [], ordem: 18 },
    { id: '19', ambiente: 'Studio', titulo: 'Studio Contemporâneo', descricao: 'Espaço otimizado com móveis retráteis, bancada dobrável e divisórias modulares', imagem_url: '/portfolio/studio-2.webp', imagens: [], ordem: 19 },
    { id: '20', ambiente: 'Suíte', titulo: 'Suíte Master Elegante', descricao: 'Suíte com cabeceira planejada, closet integrado e penteadeira com espelho camarim', imagem_url: '/portfolio/suite-1.webp', imagens: [], ordem: 20 },
    { id: '21', ambiente: 'Suíte', titulo: 'Suíte Minimalista', descricao: 'Design limpo com armários de piso a teto, nicho retroiluminado e automatização', imagem_url: '/portfolio/suite-2.webp', imagens: [], ordem: 21 },
    { id: '22', ambiente: 'Biblioteca', titulo: 'Biblioteca Clássica com Escada', descricao: 'Estantes em madeira escura do piso ao teto com escada deslizante e poltrona de leitura', imagem_url: '/portfolio/biblioteca-1.webp', imagens: [], ordem: 22 },
    { id: '23', ambiente: 'Biblioteca', titulo: 'Biblioteca Moderna Compacta', descricao: 'Nichos assimétricos com iluminação individual e espaço para coleção de livros', imagem_url: '/portfolio/biblioteca-2.webp', imagens: [], ordem: 23 },
    { id: '24', ambiente: 'Corporativo', titulo: 'Sala de Reuniões Executiva', descricao: 'Ambiente corporativo com mesa para 10 pessoas, marcenaria em MDF e acústica', imagem_url: '/portfolio/corporativo-1.webp', imagens: [], ordem: 24 },
    { id: '25', ambiente: 'Corporativo', titulo: 'Recepção Corporativa', descricao: 'Balcão de recepção planejado com painel logotipo retroiluminado e sala de espera', imagem_url: '/portfolio/corporativo-2.webp', imagens: [], ordem: 25 },
    { id: '26', ambiente: 'Espaços Comerciais', titulo: 'Loja de Roupas Planejada', descricao: 'Projeto comercial com expositores modulares, provadores e balcão de atendimento', imagem_url: '/portfolio/comercial-1.webp', imagens: [], ordem: 26 },
    { id: '27', ambiente: 'Espaços Comerciais', titulo: 'Consultório Odontológico', descricao: 'Ambiente clínico com armários esterilizáveis, bancada ergonômica e recepção acolhedora', imagem_url: '/portfolio/comercial-2.webp', imagens: [], ordem: 27 },
];

export default function PortfolioGrid() {
    const [filtroAtivo, setFiltroAtivo] = useState('Todos');
    const [projetos, setProjetos] = useState<Project[]>(FALLBACK_PROJECTS);
    const [categorias, setCategorias] = useState<string[]>(DEFAULT_CATEGORIAS);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState<{ projeto: Project; index: number } | null>(null);

    useEffect(() => {
        async function loadFromDB() {
            try {
                const res = await fetch('/api/portfolio');
                const data = await res.json();
                if (data.projects && data.projects.length > 0) {
                    setProjetos(data.projects.map((p: any) => {
                        let parsedImagens: string[] = [];
                        try {
                            if (Array.isArray(p.imagens)) {
                                parsedImagens = p.imagens;
                            } else if (typeof p.imagens === 'string' && p.imagens) {
                                // Handle PostgreSQL array format/text: {url1,url2}
                                const cleaned = p.imagens.replace(/^\{(.*)\}$/, '$1');
                                if (cleaned) {
                                    parsedImagens = cleaned.split(',').map((s: string) => s.trim().replace(/^"(.*)"$/, '$1'));
                                }
                            } else if (p.imagens && typeof p.imagens === 'object') {
                                parsedImagens = Object.values(p.imagens).filter(v => typeof v === 'string') as string[];
                            }
                        } catch (e) {
                            console.error('Error parsing gallery images for project', p.id, e);
                        }

                        return {
                            id: p.id,
                            ambiente: p.ambiente,
                            titulo: p.titulo,
                            descricao: p.descricao,
                            imagem_url: p.imagem_url,
                            imagens: Array.isArray(parsedImagens) ? parsedImagens : [],
                            ordem: p.ordem,
                        };
                    }));
                    if (data.categories && data.categories.length > 0) {
                        setCategorias(['Todos', ...data.categories.map((c: any) => c.nome)]);
                    }
                }
            } catch (e) {
                console.error('Failed to load from DB, using fallback:', e);
            }
            setLoading(false);
        }
        loadFromDB();
    }, []);

    const projetosFiltrados = filtroAtivo === 'Todos'
        ? projetos
        : projetos.filter((p) => p.ambiente === filtroAtivo);

    function getAllImages(projeto: Project): string[] {
        const all = [projeto.imagem_url];
        if (projeto.imagens && projeto.imagens.length > 0) {
            all.push(...projeto.imagens);
        }
        return all;
    }

    function openLightbox(projeto: Project) {
        setLightbox({ projeto, index: 0 });
    }

    function lightboxPrev() {
        if (!lightbox) return;
        const images = getAllImages(lightbox.projeto);
        setLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + images.length) % images.length } : null);
    }

    function lightboxNext() {
        if (!lightbox) return;
        const images = getAllImages(lightbox.projeto);
        setLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % images.length } : null);
    }

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
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={32} className="animate-spin text-wood-500" />
                        </div>
                    ) : projetosFiltrados.length === 0 ? (
                        <div className="text-center py-20 text-dark-400">
                            <p className="text-lg">Nenhum projeto encontrado nesta categoria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projetosFiltrados.map((projeto) => {
                                const totalImages = 1 + (projeto.imagens?.length || 0);
                                return (
                                    <div
                                        key={projeto.id}
                                        className="group bg-white rounded-2xl overflow-hidden border border-wood-100 hover:shadow-xl transition-all"
                                    >
                                        <div
                                            className="aspect-[4/3] relative overflow-hidden cursor-pointer"
                                            onClick={() => openLightbox(projeto)}
                                        >
                                            <img
                                                src={projeto.imagem_url}
                                                alt={projeto.titulo}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-wood-700 px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg">
                                                    Ver fotos
                                                </span>
                                            </div>
                                            {totalImages > 1 && (
                                                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                                                    📷 {totalImages} fotos
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-wood-500 text-xs font-semibold uppercase tracking-wider">{projeto.ambiente}</span>
                                            </div>
                                            <h3 className="font-heading font-semibold text-dark-700 mt-1">{projeto.titulo}</h3>
                                            <p className="text-dark-400 text-sm mt-2">{projeto.descricao}</p>
                                            <a
                                                href={generateWhatsAppLink({ tipo_servico: 'planejados', ambiente: projeto.ambiente, descricao: `Quero um projeto parecido com: ${projeto.titulo}` })}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                data-track={`portfolio-whatsapp-${projeto.ambiente.toLowerCase()}`}
                                                data-track-label={`Quero um projeto parecido: ${projeto.titulo}`}
                                                className="mt-3 inline-flex items-center gap-2 text-wood-600 hover:text-wood-700 text-sm font-medium"
                                            >
                                                <Phone size={14} />
                                                Quero um projeto parecido
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Gallery */}
            {lightbox && (() => {
                const images = getAllImages(lightbox.projeto);
                return (
                    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setLightbox(null)}>
                        {/* Close */}
                        <button
                            onClick={() => setLightbox(null)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white z-50 bg-black/40 p-2 rounded-full"
                        >
                            <X size={24} />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 left-4 text-white/70 text-sm z-50 bg-black/40 px-3 py-1.5 rounded-full">
                            {lightbox.index + 1} / {images.length}
                        </div>

                        {/* Project Info */}
                        <div className="absolute bottom-4 left-4 right-4 text-center z-50">
                            <h3 className="text-white font-heading font-semibold text-lg">{lightbox.projeto.titulo}</h3>
                            <p className="text-white/60 text-sm mt-1">{lightbox.projeto.ambiente} • {lightbox.projeto.descricao}</p>
                            <a
                                href={generateWhatsAppLink({ tipo_servico: 'planejados', ambiente: lightbox.projeto.ambiente, descricao: `Quero um projeto parecido com: ${lightbox.projeto.titulo}` })}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-track={`lightbox-whatsapp-${lightbox.projeto.ambiente.toLowerCase()}`}
                                data-track-label={`Quero um projeto parecido: ${lightbox.projeto.titulo} (Lightbox)`}
                                className="mt-3 inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg transition-colors"
                                onClick={e => e.stopPropagation()}
                            >
                                <Phone size={14} />
                                Quero um projeto parecido
                            </a>
                        </div>

                        {/* Main Image */}
                        <div className="max-w-5xl max-h-[75vh] px-16" onClick={e => e.stopPropagation()}>
                            <img
                                src={images[lightbox.index]}
                                alt={`${lightbox.projeto.titulo} - Foto ${lightbox.index + 1}`}
                                className="max-w-full max-h-[75vh] object-contain mx-auto rounded-lg"
                            />
                        </div>

                        {/* Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-50" onClick={e => e.stopPropagation()}>
                                {images.map((url, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setLightbox(prev => prev ? { ...prev, index: i } : null)}
                                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === lightbox.index ? 'border-wood-500 scale-110' : 'border-white/20 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })()}
        </>
    );
}
