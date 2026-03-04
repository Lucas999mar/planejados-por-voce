import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(url, key);
}

export async function POST(req: NextRequest) {
    const supabase = getSupabase();

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Tipo de arquivo não permitido. Use JPG, PNG, WebP ou GIF.' }, { status: 400 });
        }

        // Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB.' }, { status: 400 });
        }

        const ext = file.name.split('.').pop() || 'webp';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        const buffer = Buffer.from(await file.arrayBuffer());

        const { data, error } = await supabase.storage
            .from('portfolio-images')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { data: urlData } = supabase.storage
            .from('portfolio-images')
            .getPublicUrl(data.path);

        return NextResponse.json({
            url: urlData.publicUrl,
            path: data.path,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Erro no upload' }, { status: 500 });
    }
}
