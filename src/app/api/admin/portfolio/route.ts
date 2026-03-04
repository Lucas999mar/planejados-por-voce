import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase(token?: string) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(url, key);
}

// GET - List all projects (admin view, including inactive)
export async function GET(req: NextRequest) {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('ordem', { ascending: true })
        .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// POST - Create a new project
export async function POST(req: NextRequest) {
    const supabase = getSupabase();
    const body = await req.json();

    const { ambiente, titulo, descricao, imagem_url, imagens = [], ordem = 0 } = body;
    if (!ambiente || !titulo || !descricao || !imagem_url) {
        return NextResponse.json({ error: 'Campos obrigatórios: ambiente, titulo, descricao, imagem_url' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('portfolio_projects')
        .insert({ ambiente, titulo, descricao, imagem_url, imagens, ordem })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}

// PUT - Update a project
export async function PUT(req: NextRequest) {
    const supabase = getSupabase();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('portfolio_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// DELETE - Remove a project
export async function DELETE(req: NextRequest) {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });

    const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
