'use client';

import { MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';

export default function WhatsAppFloat() {
    return (
        <a
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
            aria-label="Falar no WhatsApp"
        >
            <MessageCircle size={28} className="text-white" fill="white" />
        </a>
    );
}
