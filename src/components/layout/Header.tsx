'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_LINKS, WHATSAPP_DISPLAY } from '@/lib/constants';
import { generateWhatsAppLink } from '@/lib/whatsapp';

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-wood-600 to-wood-800 flex items-center justify-center">
                            <span className="text-white font-heading font-bold text-lg">P</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-heading font-bold text-lg text-wood-800">Planejados</span>
                            <span className="font-heading font-light text-lg text-wood-500"> Por Você</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 text-sm font-medium text-dark-600 hover:text-wood-600 transition-colors rounded-lg hover:bg-wood-50"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA + Mobile Toggle */}
                    <div className="flex items-center gap-3">
                        <a
                            href={generateWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:from-accent-600 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Phone size={16} />
                            <span>{WHATSAPP_DISPLAY}</span>
                        </a>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-2 text-dark-600 hover:text-wood-600 transition-colors"
                            aria-label="Menu"
                        >
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden bg-white border-t border-wood-100 shadow-xl">
                    <nav className="px-4 py-4 space-y-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-3 text-base font-medium text-dark-600 hover:text-wood-600 hover:bg-wood-50 rounded-lg transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <a
                            href={generateWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 mt-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-5 py-3 rounded-full text-base font-semibold"
                        >
                            <Phone size={18} />
                            <span>Falar no WhatsApp</span>
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}
