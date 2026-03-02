import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const tipo = searchParams.get('tipo_servico');

        let query = supabase
            .from('leads')
            .select('id, nome, whatsapp, email, cidade, bairro, tipo_servico, ambiente, orcamento_faixa, urgencia, descricao, status, tags, created_at')
            .order('created_at', { ascending: false });

        if (status) query = query.eq('status', status);
        if (tipo) query = query.eq('tipo_servico', tipo);

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 });
        }

        // Convert to CSV
        if (!data || data.length === 0) {
            return new NextResponse('Nenhum lead encontrado', { status: 404 });
        }

        const headers = [
            'ID', 'Nome', 'WhatsApp', 'Email', 'Cidade', 'Bairro',
            'Tipo de Serviço', 'Ambiente', 'Orçamento', 'Urgência',
            'Descrição', 'Status', 'Tags', 'Data'
        ];

        const rows = data.map(lead => [
            lead.id,
            lead.nome || '',
            lead.whatsapp || '',
            lead.email || '',
            lead.cidade || '',
            lead.bairro || '',
            lead.tipo_servico || '',
            lead.ambiente || '',
            lead.orcamento_faixa || '',
            lead.urgencia || '',
            (lead.descricao || '').replace(/"/g, '""'),
            lead.status || '',
            (lead.tags || []).join('; '),
            new Date(lead.created_at).toLocaleString('pt-BR'),
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\n');

        // Add BOM for Excel compatibility
        const bom = '\uFEFF';

        return new NextResponse(bom + csvContent, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename=leads_${new Date().toISOString().slice(0, 10)}.csv`,
            },
        });
    } catch (error) {
        console.error('Export CSV error:', error);
        return NextResponse.json({ error: 'Erro ao exportar' }, { status: 500 });
    }
}
