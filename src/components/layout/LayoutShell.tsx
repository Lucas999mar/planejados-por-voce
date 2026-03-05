'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import ChatWidget from '@/components/chat/ChatWidget';
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <AnalyticsProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppFloat />
            <ChatWidget />
        </AnalyticsProvider>
    );
}
