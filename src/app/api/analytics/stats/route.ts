import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminToken, isAuthError } from '@/lib/adminAuth';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(url, key);
}

export async function GET(req: NextRequest) {
    // Protected — admin only
    const auth = await verifyAdminToken(req);
    if (isAuthError(auth)) return auth;

    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30';
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    let since: string;
    let until: string = new Date().toISOString();
    let days: number;

    if (startDateParam) {
        since = new Date(startDateParam).toISOString();
        if (endDateParam) {
            until = new Date(endDateParam).toISOString();
        }
        const diffTime = Math.abs(new Date(until).getTime() - new Date(since).getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else {
        days = parseInt(period) || 30;
        since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    }

    try {
        // Fetch all events in the period
        const { data: events, error } = await supabase
            .from('analytics_events')
            .select('*')
            .gte('created_at', since)
            .lte('created_at', until)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Analytics stats error:', error);
            return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
        }

        const allEvents = events || [];

        // ─── Unique visitors ───
        const uniqueVisitors = new Set(allEvents.map(e => e.visitor_id));
        const visitorsTotal = uniqueVisitors.size;

        // ─── Page views ───
        const pageViews = allEvents.filter(e => e.event_type === 'page_view');
        const pageViewsTotal = pageViews.length;

        // ─── Average time on site (estimate from session events) ───
        const sessionTimes: Record<string, { first: number; last: number }> = {};
        for (const ev of allEvents) {
            const t = new Date(ev.created_at).getTime();
            if (!sessionTimes[ev.session_id]) {
                sessionTimes[ev.session_id] = { first: t, last: t };
            } else {
                sessionTimes[ev.session_id].last = Math.max(sessionTimes[ev.session_id].last, t);
            }
        }
        const sessions = Object.values(sessionTimes);
        const totalSessionTime = sessions.reduce((sum, s) => sum + (s.last - s.first), 0);
        const avgTimeOnSite = sessions.length > 0 ? Math.round(totalSessionTime / sessions.length / 1000) : 0;

        // ─── Daily visitors & page views ───
        const dailyMap: Record<string, { visitors: Set<string>; pageViews: number }> = {};

        // Populate all days in range
        const start = new Date(since);
        const end = new Date(until);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const key = d.toISOString().split('T')[0];
            dailyMap[key] = { visitors: new Set(), pageViews: 0 };
        }

        for (const ev of allEvents) {
            const day = ev.created_at.split('T')[0];
            if (dailyMap[day]) {
                dailyMap[day].visitors.add(ev.visitor_id);
                if (ev.event_type === 'page_view') dailyMap[day].pageViews++;
            }
        }
        const dailyVisitors = Object.entries(dailyMap).map(([date, d]) => ({
            date: date.slice(5), // MM-DD
            visitors: d.visitors.size,
            pageViews: d.pageViews,
        }));

        // ─── Top pages ───
        const pageCounts: Record<string, number> = {};
        for (const pv of pageViews) {
            const page = pv.page_url || '/';
            pageCounts[page] = (pageCounts[page] || 0) + 1;
        }
        const topPages = Object.entries(pageCounts)
            .map(([page, views]) => ({ page, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 10);

        // ─── Top clicks ───
        const clickEvents = allEvents.filter(e => e.event_type === 'click' || e.event_type === 'whatsapp_click');
        const clickCounts: Record<string, { element_text: string; clicks: number }> = {};
        for (const c of clickEvents) {
            const id = c.element_id || 'unknown';
            if (!clickCounts[id]) {
                clickCounts[id] = { element_text: c.element_text || id, clicks: 0 };
            }
            clickCounts[id].clicks++;
        }
        const topClicks = Object.entries(clickCounts)
            .map(([element_id, d]) => ({ element_id, ...d }))
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 10);

        // ─── Device breakdown ───
        const deviceCounts: Record<string, number> = {};
        // Count once per visitor using their first event's metadata
        const visitorDevices: Record<string, string> = {};
        for (const ev of allEvents) {
            if (!visitorDevices[ev.visitor_id] && ev.metadata?.device) {
                visitorDevices[ev.visitor_id] = ev.metadata.device as string;
            }
        }
        for (const device of Object.values(visitorDevices)) {
            deviceCounts[device] = (deviceCounts[device] || 0) + 1;
        }

        // ─── Referrer breakdown ───
        const referrerCounts: Record<string, number> = {};
        const visitorRefs: Record<string, string> = {};
        for (const ev of allEvents) {
            if (!visitorRefs[ev.visitor_id] && ev.metadata?.referrer) {
                visitorRefs[ev.visitor_id] = ev.metadata.referrer as string;
            }
        }
        for (const ref of Object.values(visitorRefs)) {
            referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
        }

        // ─── Conversion funnel ───
        const visited = visitorsTotal;

        // Multi-page: visitors with >1 page view
        const visitorPageCounts: Record<string, number> = {};
        for (const pv of pageViews) {
            visitorPageCounts[pv.visitor_id] = (visitorPageCounts[pv.visitor_id] || 0) + 1;
        }
        const multiPage = Object.values(visitorPageCounts).filter(c => c > 1).length;

        // Clicked CTA: visitors with click or whatsapp_click events
        const ctaClickers = new Set(clickEvents.map(e => e.visitor_id));
        const clickedCta = ctaClickers.size;

        // Converted: visitors with form_submit or whatsapp_click
        const conversionEvents = allEvents.filter(e => e.event_type === 'form_submit' || e.event_type === 'whatsapp_click');
        const convertedVisitors = new Set(conversionEvents.map(e => e.visitor_id));
        const converted = convertedVisitors.size;

        const conversionRate = visitorsTotal > 0 ? Math.round((converted / visitorsTotal) * 100) : 0;

        // Ensure we always have a valid structure
        const responseData = {
            visitorsTotal: visitorsTotal || 0,
            pageViewsTotal: pageViewsTotal || 0,
            avgTimeOnSite: avgTimeOnSite || 0,
            conversionRate: conversionRate || 0,
            dailyVisitors: dailyVisitors && dailyVisitors.length > 0 ? dailyVisitors : [],
            topPages: topPages || [],
            topClicks: topClicks || [],
            deviceBreakdown: deviceCounts || {},
            referrerBreakdown: referrerCounts || {},
            funnel: {
                visited: visited || 0,
                multiPage: multiPage || 0,
                clickedCta: clickedCta || 0,
                converted: converted || 0
            },
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Analytics stats API error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
