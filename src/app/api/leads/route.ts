import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            nome, whatsapp, email, cidade, bairro, tipo_servico,
            ambiente, orcamento_faixa, urgencia, descricao,
            consentimento_lgpd, tags, pagina_origem, dispositivo,
            origem_utm
        } = body;

        if (!consentimento_lgpd) {
            return NextResponse.json({ error: 'Consentimento LGPD é obrigatório' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Banco de dados não configurado' }, { status: 500 });
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data, error } = await supabase
            .from('leads')
            .insert({
                nome: nome || null,
                whatsapp: whatsapp || null,
                email: email || null,
                cidade: cidade || null,
                bairro: bairro || null,
                tipo_servico: tipo_servico || null,
                ambiente: ambiente || null,
                orcamento_faixa: orcamento_faixa || null,
                urgencia: urgencia || null,
                descricao: descricao || null,
                consentimento_lgpd: consentimento_lgpd || false,
                tags: tags || [],
                pagina_origem: pagina_origem || null,
                dispositivo: dispositivo || null,
                origem_utm: origem_utm || null,
                status: 'novo',
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error creating lead:', error);
            return NextResponse.json({ error: 'Erro ao salvar lead' }, { status: 500 });
        }

        return NextResponse.json({ id: data.id, success: true });
    } catch (error) {
        console.error('Lead API error:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'Banco de dados não configurado' }, { status: 500 });
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const tipo = searchParams.get('tipo_servico');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        let query = supabase
            .from('leads')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (status) query = query.eq('status', status);
        if (tipo) query = query.eq('tipo_servico', tipo);
        if (search) {
            query = query.or(`nome.ilike.%${search}%,whatsapp.ilike.%${search}%,cidade.ilike.%${search}%`);
        }

        query = query.range((page - 1) * limit, page * limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching leads:', error);
            return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 });
        }

        return NextResponse.json({ data, count, page, limit });
    } catch (error) {
        console.error('Leads GET error:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
