import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { data: lead, error } = await supabase
            .from('leads')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !lead) {
            return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 });
        }

        // Get conversations and messages
        const { data: conversations } = await supabase
            .from('conversations')
            .select('*, messages(*)')
            .eq('lead_id', id)
            .order('created_at', { ascending: false });

        return NextResponse.json({ lead, conversations: conversations || [] });
    } catch (error) {
        console.error('Lead detail error:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const allowedFields = ['status', 'tags', 'notas_admin', 'nome', 'whatsapp', 'email', 'cidade', 'bairro'];
        const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        const { data, error } = await supabase
            .from('leads')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: 'Erro ao atualizar lead' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Lead PATCH error:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            return NextResponse.json({ error: 'DB not configured' }, { status: 500 });
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Delete messages first, then conversations, then lead (LGPD)
        const { data: conversations } = await supabase
            .from('conversations')
            .select('id')
            .eq('lead_id', id);

        if (conversations?.length) {
            const convIds = conversations.map(c => c.id);
            await supabase.from('messages').delete().in('conversation_id', convIds);
            await supabase.from('conversations').delete().eq('lead_id', id);
        }

        await supabase.from('leads').delete().eq('id', id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Lead DELETE error:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
