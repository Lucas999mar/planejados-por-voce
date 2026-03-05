import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(url, key);
}

const VALID_EVENTS = ['page_view', 'click', 'scroll', 'form_start', 'form_submit', 'whatsapp_click'];

export async function POST(req: NextRequest) {
    try {
        let body;
        const contentType = req.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            body = await req.json();
        } else {
            // Handle sendBeacon blob
            const text = await req.text();
            body = JSON.parse(text);
        }

        const { visitor_id, session_id, event_type, page_url, element_id, element_text, metadata } = body;

        // Validate required fields
        if (!visitor_id || !session_id || !event_type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!VALID_EVENTS.includes(event_type)) {
            return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
        }

        const supabase = getSupabase();

        const { error } = await supabase
            .from('analytics_events')
            .insert({
                visitor_id,
                session_id,
                event_type,
                page_url: page_url || '/',
                element_id: element_id || null,
                element_text: element_text ? String(element_text).slice(0, 200) : null,
                metadata: metadata || null,
            });

        if (error) {
            console.error('Analytics track error:', error);
            return NextResponse.json({ error: 'Failed to store event' }, { status: 500 });
        }

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
        console.error('Analytics track API error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
