import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(url, key);
}

// GET - Read page content
export async function GET(req: NextRequest) {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const id = searchParams.get('id');

    let query = supabase.from('page_content').select('*');
    if (section) query = query.eq('section', section);
    if (id) query = query.eq('id', id);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// PUT - Update page content
export async function PUT(req: NextRequest) {
    const supabase = getSupabase();
    const body = await req.json();
    const { id, section, content } = body;

    if (!id || !section || !content) {
        return NextResponse.json({ error: 'id, section e content são obrigatórios' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('page_content')
        .upsert({ id, section, content, updated_at: new Date().toISOString() })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
