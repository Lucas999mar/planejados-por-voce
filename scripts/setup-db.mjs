import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && !key.startsWith('#')) {
        process.env[key.trim()] = rest.join('=').trim();
    }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function runSQL(sql, label) {
    console.log(`\n📦 ${label}...`);
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
        // Try alternative: use the REST endpoint directly
        const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': serviceKey,
                'Authorization': `Bearer ${serviceKey}`,
            },
            body: JSON.stringify({ sql_query: sql }),
        });
        if (!res.ok) {
            console.log(`⚠️  RPC not available, using direct table creation...`);
            return false;
        }
    }
    console.log(`✅ ${label} done`);
    return true;
}

async function setupTables() {
    console.log('🚀 Setting up Supabase tables...\n');

    // Try to create tables using direct Supabase operations
    // 1. Portfolio Categories
    console.log('📦 Creating portfolio_categories...');
    const categories = [
        { nome: 'Cozinha', ordem: 1, ativo: true },
        { nome: 'Dormitório', ordem: 2, ativo: true },
        { nome: 'Closet', ordem: 3, ativo: true },
        { nome: 'Banheiro', ordem: 4, ativo: true },
        { nome: 'Living', ordem: 5, ativo: true },
        { nome: 'Home Office', ordem: 6, ativo: true },
        { nome: 'Área Gourmet', ordem: 7, ativo: true },
        { nome: 'Lavanderia', ordem: 8, ativo: true },
        { nome: 'Adega', ordem: 9, ativo: true },
        { nome: 'Studio', ordem: 10, ativo: true },
        { nome: 'Suíte', ordem: 11, ativo: true },
        { nome: 'Biblioteca', ordem: 12, ativo: true },
        { nome: 'Corporativo', ordem: 13, ativo: true },
        { nome: 'Espaços Comerciais', ordem: 14, ativo: true },
    ];

    // Check if table exists by trying to select
    const { error: catCheckError } = await supabase.from('portfolio_categories').select('id').limit(1);
    if (catCheckError && catCheckError.code === '42P01') {
        console.log('  Table does not exist yet - needs SQL creation via dashboard');
        return false;
    } else if (!catCheckError) {
        // Table exists, check if data exists
        const { data: existingCats } = await supabase.from('portfolio_categories').select('id');
        if (!existingCats || existingCats.length === 0) {
            const { error: insertError } = await supabase.from('portfolio_categories').insert(categories);
            if (insertError) console.log('  ⚠️ Error inserting categories:', insertError.message);
            else console.log('  ✅ Categories inserted');
        } else {
            console.log('  ✅ Categories already exist');
        }
    }

    // 2. Portfolio Projects - check if exists
    console.log('📦 Checking portfolio_projects...');
    const { error: projCheckError } = await supabase.from('portfolio_projects').select('id').limit(1);
    if (projCheckError && projCheckError.code === '42P01') {
        console.log('  Table does not exist yet - needs SQL creation via dashboard');
        return false;
    } else {
        console.log('  ✅ portfolio_projects table exists');
    }

    // 3. Site Settings - check if exists
    console.log('📦 Checking site_settings...');
    const { error: settingsCheckError } = await supabase.from('site_settings').select('key').limit(1);
    if (settingsCheckError && settingsCheckError.code === '42P01') {
        console.log('  Table does not exist yet - needs SQL creation via dashboard');
        return false;
    } else {
        const { data: existingSettings } = await supabase.from('site_settings').select('key');
        if (!existingSettings || existingSettings.length === 0) {
            const settings = [
                { key: 'contact', value: { whatsapp: '5522999093710', whatsapp_display: '(22) 99909-3710', email: '', endereco: '' } },
                { key: 'seo', value: { site_name: 'Planejados Por Você', description: 'Móveis planejados sob medida e assistência técnica especializada.' } },
                { key: 'theme', value: { primary_color: '#A67C52', accent_color: '#4A9B7F' } },
            ];
            const { error: insertError } = await supabase.from('site_settings').insert(settings);
            if (insertError) console.log('  ⚠️ Error inserting settings:', insertError.message);
            else console.log('  ✅ Settings inserted');
        } else {
            console.log('  ✅ Settings already exist');
        }
    }

    // 4. Storage bucket
    console.log('📦 Creating storage bucket...');
    const { error: bucketError } = await supabase.storage.createBucket('portfolio-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    });
    if (bucketError && bucketError.message.includes('already exists')) {
        console.log('  ✅ Bucket already exists');
    } else if (bucketError) {
        console.log('  ⚠️ Bucket error:', bucketError.message);
    } else {
        console.log('  ✅ Bucket created');
    }

    console.log('\n🎉 Setup complete!');
    return true;
}

setupTables().catch(console.error);
