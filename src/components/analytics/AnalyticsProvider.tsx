'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackClick, trackScroll, trackWhatsAppClick } from '@/lib/analytics';

const SCROLL_THRESHOLDS = [25, 50, 75, 100];

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const scrollMilestones = useRef<Set<number>>(new Set());
    const startTime = useRef<number>(Date.now());

    // ─── Track page views on route change ───
    useEffect(() => {
        trackPageView(pathname);
        scrollMilestones.current = new Set();
        startTime.current = Date.now();
    }, [pathname]);

    // ─── Track scroll depth ───
    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;

        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        for (const threshold of SCROLL_THRESHOLDS) {
            if (scrollPercent >= threshold && !scrollMilestones.current.has(threshold)) {
                scrollMilestones.current.add(threshold);
                trackScroll(threshold);
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // ─── Track clicks on data-track elements ───
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const trackEl = target.closest('[data-track]') as HTMLElement | null;

            if (trackEl) {
                const trackId = trackEl.getAttribute('data-track') || trackEl.id || 'unknown';
                const trackText = trackEl.getAttribute('data-track-label') ||
                    trackEl.textContent?.trim().slice(0, 80) || '';

                // Check if it's a WhatsApp link
                const href = trackEl.getAttribute('href') || '';
                const isWhatsApp = href.includes('wa.me') || href.includes('whatsapp.com');

                if (isWhatsApp) {
                    trackWhatsAppClick(trackId, trackText);
                } else {
                    trackClick(trackId, trackText);
                }
            } else {
                // FALLBACK: Auto-track any WhatsApp link even without data-track
                const link = target.closest('a');
                if (link) {
                    const href = link.getAttribute('href') || '';
                    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
                        const trackId = link.id || 'whatsapp-auto';
                        const trackText = link.getAttribute('data-track-label') ||
                            link.textContent?.trim().slice(0, 80) || 'WhatsApp Link';
                        trackWhatsAppClick(trackId, trackText);
                    }
                }
            }
        };

        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, []);

    return <>{children}</>;
}
