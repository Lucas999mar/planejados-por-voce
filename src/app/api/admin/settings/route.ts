import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminToken, isAuthError } from '@/lib/adminAuth';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(url, key);
}

// GET - Read all settings or a specific key
export async function GET(req: NextRequest) {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (key) {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('key', key)
            .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    }

    const { data, error } = await supabase
        .from('site_settings')
        .select('*');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// PUT - Update a setting — PROTECTED
export async function PUT(req: NextRequest) {
    const auth = await verifyAdminToken(req);
    if (isAuthError(auth)) return auth;

    const supabase = getSupabase();
    const body = await req.json();
    const { key, value } = body;

    if (!key || !value) {
        return NextResponse.json({ error: 'key e value são obrigatórios' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
