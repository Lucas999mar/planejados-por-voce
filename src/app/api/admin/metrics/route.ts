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
        const periodo = searchParams.get('periodo') || '30'; // dias

        const dataInicio = new Date();
        dataInicio.setDate(dataInicio.getDate() - parseInt(periodo));

        // Total leads
        const { count: totalLeads } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true });

        // Leads no período
        const { count: leadsPeriodo } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', dataInicio.toISOString());

        // Leads por status
        const { data: statusData } = await supabase
            .from('leads')
            .select('status');

        const porStatus: Record<string, number> = {};
        statusData?.forEach((l) => {
            porStatus[l.status] = (porStatus[l.status] || 0) + 1;
        });

        // Leads por tipo de serviço
        const { data: tipoData } = await supabase
            .from('leads')
            .select('tipo_servico');

        const porTipo: Record<string, number> = {};
        tipoData?.forEach((l) => {
            const key = l.tipo_servico || 'não informado';
            porTipo[key] = (porTipo[key] || 0) + 1;
        });

        // Leads recentes (últimos 5)
        const { data: recentes } = await supabase
            .from('leads')
            .select('id, nome, whatsapp, cidade, tipo_servico, status, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        // Leads por dia (últimos 7 dias)
        const porDia: { data: string; count: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const inicio = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const fim = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);

            const { count } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', inicio.toISOString())
                .lt('created_at', fim.toISOString());

            porDia.push({
                data: inicio.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                count: count || 0,
            });
        }

        return NextResponse.json({
            totalLeads: totalLeads || 0,
            leadsPeriodo: leadsPeriodo || 0,
            porStatus,
            porTipo,
            recentes: recentes || [],
            porDia,
            taxaConversao: totalLeads ? Math.round(((porStatus.fechado || 0) / totalLeads) * 100) : 0,
        });
    } catch (error) {
        console.error('Metrics error:', error);
        return NextResponse.json({ error: 'Erro ao buscar métricas' }, { status: 500 });
    }
}
