import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Public API - no auth required
export async function GET() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(url, key);

    const [projectsRes, categoriesRes] = await Promise.all([
        supabase
            .from('portfolio_projects')
            .select('*')
            .eq('ativo', true)
            .order('ordem', { ascending: true })
            .order('created_at', { ascending: false }),
        supabase
            .from('portfolio_categories')
            .select('*')
            .eq('ativo', true)
            .order('ordem', { ascending: true }),
    ]);

    if (projectsRes.error) {
        return NextResponse.json({ error: projectsRes.error.message }, { status: 500 });
    }

    return NextResponse.json({
        projects: projectsRes.data || [],
        categories: categoriesRes.data || [],
    });
}
