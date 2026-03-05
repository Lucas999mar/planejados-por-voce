import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Verifies the admin JWT token from the Authorization header.
 * Returns the Supabase user if valid, or a 401 NextResponse if not.
 */
export async function verifyAdminToken(
    req: NextRequest
): Promise<{ user: { id: string; email?: string } } | NextResponse> {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '').trim();

    if (!token) {
        return NextResponse.json({ error: 'Não autorizado: token ausente' }, { status: 401 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
        return NextResponse.json({ error: 'Não autorizado: token inválido' }, { status: 401 });
    }

    return { user: { id: data.user.id, email: data.user.email } };
}

/**
 * Helper to check if a verifyAdminToken result is an error response.
 */
export function isAuthError(result: unknown): result is NextResponse {
    return result instanceof NextResponse;
}
