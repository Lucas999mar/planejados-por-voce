import Link from 'next/link';
import { NAV_LINKS, SITE_NAME, WHATSAPP_DISPLAY } from '@/lib/constants';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-dark-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                                <span className="text-white font-heading font-bold text-lg">P</span>
                            </div>
                            <span className="font-heading font-bold text-xl">{SITE_NAME}</span>
                        </div>
                        <p className="text-dark-200 text-sm leading-relaxed">
                            Transformando ambientes com móveis planejados sob medida e assistência técnica de qualidade.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-heading font-semibold text-lg mb-4 text-gold-400">Navegação</h4>
                        <nav className="space-y-2">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block text-dark-200 hover:text-gold-300 transition-colors text-sm"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-heading font-semibold text-lg mb-4 text-gold-400">Serviços</h4>
                        <ul className="space-y-2 text-sm text-dark-200">
                            <li>Cozinhas Planejadas</li>
                            <li>Quartos e Closets</li>
                            <li>Banheiros Sob Medida</li>
                            <li>Home Office</li>
                            <li>Assistência Técnica</li>
                            <li>Troca de Ferragens</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-heading font-semibold text-lg mb-4 text-gold-400">Contato</h4>
                        <div className="space-y-3">
                            <a
                                href={generateWhatsAppLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-track="whatsapp-footer"
                                data-track-label="WhatsApp footer"
                                className="flex items-center gap-2 text-sm text-dark-200 hover:text-green-400 transition-colors"
                            >
                                <Phone size={16} />
                                <span>{WHATSAPP_DISPLAY}</span>
                            </a>
                            <div className="flex items-center gap-2 text-sm text-dark-200">
                                <Mail size={16} />
                                <span>contato@planejadosporvoce.com.br</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-dark-200">
                                <MapPin size={16} />
                                <span>Atendimento em todo o Brasil</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-dark-600 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-dark-300 text-sm">
                        © {new Date().getFullYear()} {SITE_NAME}. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-6 text-sm">
                        <Link href="/politicas" className="text-dark-300 hover:text-gold-400 transition-colors">
                            Política de Privacidade
                        </Link>
                        <Link href="/politicas#termos" className="text-dark-300 hover:text-gold-400 transition-colors">
                            Termos de Uso
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
