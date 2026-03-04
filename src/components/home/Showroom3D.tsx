'use client';

import { useState } from 'react';
import { Play, Maximize, Box } from 'lucide-react';

export default function Showroom3D() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <section className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2 block">Experiência Imersiva</span>
                    <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark-800">
                        Conheça Nosso <span className="gradient-text">Showroom</span> 3D
                    </h2>
                    <p className="text-dark-400 mt-4 max-w-2xl mx-auto">
                        Explore cada detalhe dos nossos móveis planejados em um tour virtual 360º.
                        Sinta-se dentro do ambiente e inspire-se para o seu projeto.
                    </p>
                </div>

                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-dark-800 shadow-2xl group border-4 border-white">
                    {!isPlaying ? (
                        <div
                            className="absolute inset-0 cursor-pointer transition-all duration-700 hover:scale-105"
                            onClick={() => setIsPlaying(true)}
                        >
                            {/* Splash Image / Overlay */}
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: 'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000")',
                                    filter: 'brightness(0.6)'
                                }}
                            />

                            {/* Content Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-6 text-center">
                                <div className="w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 group-hover:bg-accent-600 transition-all duration-300">
                                    <Play size={40} className="fill-white ml-2" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Explore o Space 3D</h3>
                                <p className="text-white/80 max-w-md text-sm sm:text-base">
                                    Clique para iniciar o tour virtual interativo e caminhar pelo nosso showroom.
                                </p>

                                <div className="mt-8 flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-white/60">
                                    <span className="flex items-center gap-1"><Maximize size={14} /> 360º View</span>
                                    <span className="flex items-center gap-1"><Box size={14} /> Virtual Reality</span>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs font-semibold">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                SHOWROOM AO VIVO
                            </div>
                        </div>
                    ) : (
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://my.matterport.com/show/?m=hTqRuJQSTkN&play=1&qs=1&brand=0&help=1&hl=1"
                            frameBorder="0"
                            allowFullScreen
                            allow="xr-spatial-tracking"
                            className="absolute inset-0"
                        />
                    )}
                </div>

                <div className="mt-10 flex flex-wrap justify-center gap-8 text-dark-300 text-sm italic">
                    <p>• Navegue clicando nos pontos no chão</p>
                    <p>• Visualize detalhes em alta definição</p>
                    <p>• Use óculos VR para uma experiência imersiva</p>
                </div>
            </div>
        </section>
    );
}
