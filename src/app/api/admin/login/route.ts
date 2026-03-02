import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ error: 'E-mail ou senha inválidos' }, { status: 401 });
        }

        return NextResponse.json({
            token: data.session?.access_token,
            user: { email: data.user?.email },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
