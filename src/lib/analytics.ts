/**
 * Client-side analytics tracking library.
 * Generates anonymous visitor/session IDs and sends events to /api/analytics/track.
 * No personal data is collected — only behavioral patterns.
 */

const VISITOR_COOKIE = 'ppv_vid';
const SESSION_KEY = 'ppv_sid';

// ─── Visitor ID (persistent via cookie, ~1 year) ───
export function getVisitorId(): string {
    if (typeof document === 'undefined') return '';

    const existing = document.cookie
        .split('; ')
        .find(c => c.startsWith(`${VISITOR_COOKIE}=`))
        ?.split('=')[1];

    if (existing) return existing;

    const id = crypto.randomUUID();
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${VISITOR_COOKIE}=${id}; path=/; expires=${expires}; SameSite=Lax`;
    return id;
}

// ─── Session ID (per tab session) ───
export function getSessionId(): string {
    if (typeof sessionStorage === 'undefined') return '';

    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
        sid = crypto.randomUUID();
        sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
}

// ─── Device detection ───
export function getDeviceType(): string {
    if (typeof navigator === 'undefined') return 'unknown';
    const ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) return 'mobile';
    if (/Tablet|iPad/i.test(ua)) return 'tablet';
    return 'desktop';
}

// ─── Referrer detection ───
export function getReferrerSource(): string {
    if (typeof document === 'undefined') return 'direct';
    const ref = document.referrer;
    if (!ref) return 'direct';
    try {
        const url = new URL(ref);
        const host = url.hostname.toLowerCase();
        if (host.includes('google')) return 'google';
        if (host.includes('instagram')) return 'instagram';
        if (host.includes('facebook') || host.includes('fb.')) return 'facebook';
        if (host.includes('whatsapp') || host.includes('wa.me')) return 'whatsapp';
        if (host.includes('tiktok')) return 'tiktok';
        if (host.includes('youtube')) return 'youtube';
        // Same site = direct
        if (typeof window !== 'undefined' && host === window.location.hostname) return 'direct';
        return host;
    } catch {
        return 'other';
    }
}

// ─── Core tracking function ───
export async function track(
    eventType: string,
    data: {
        page_url?: string;
        element_id?: string;
        element_text?: string;
        metadata?: Record<string, unknown>;
    } = {}
): Promise<void> {
    try {
        const payload = {
            visitor_id: getVisitorId(),
            session_id: getSessionId(),
            event_type: eventType,
            page_url: data.page_url || (typeof window !== 'undefined' ? window.location.pathname : ''),
            element_id: data.element_id || null,
            element_text: data.element_text || null,
            metadata: {
                device: getDeviceType(),
                referrer: getReferrerSource(),
                screen_width: typeof window !== 'undefined' ? window.innerWidth : null,
                ...(data.metadata || {}),
            },
        };

        // Use sendBeacon for reliability (survives page unloads), fallback to fetch
        const body = JSON.stringify(payload);
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            navigator.sendBeacon('/api/analytics/track', new Blob([body], { type: 'application/json' }));
        } else {
            fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body,
                keepalive: true,
            }).catch(() => { /* silent fail */ });
        }
    } catch {
        // Analytics should never break the app
    }
}

// ─── Convenience helpers ───
export function trackPageView(url?: string): void {
    track('page_view', { page_url: url });
}

export function trackClick(elementId: string, elementText?: string): void {
    track('click', { element_id: elementId, element_text: elementText || '' });
}

export function trackScroll(depth: number): void {
    track('scroll', { metadata: { scroll_depth: depth } });
}

export function trackWhatsAppClick(buttonId: string, buttonText?: string): void {
    track('whatsapp_click', { element_id: buttonId, element_text: buttonText || 'WhatsApp' });
}

export function trackFormStart(): void {
    track('form_start');
}

export function trackFormSubmit(): void {
    track('form_submit');
}
