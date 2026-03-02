import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/prompts/system-prompt';

export async function POST(req: NextRequest) {
    try {
        const { message, conversationId, history } = await req.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Mensagem inválida' }, { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;

        // If no API key, provide a fallback experience
        if (!apiKey) {
            return NextResponse.json({
                reply: 'No momento nosso chat está em manutenção. Mas você pode falar diretamente no WhatsApp e ter um atendimento ainda mais rápido! 😊\n\nClique no botão abaixo ou ligue para **(22) 99909-3710**.',
                conversationId: conversationId || 'offline',
            });
        }

        // Build messages array for OpenAI
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...(history || []).map((m: { role: string; content: string }) => ({
                role: m.role,
                content: m.content,
            })),
            { role: 'user', content: message },
        ];

        // Call OpenAI API
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                messages,
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!openaiRes.ok) {
            const errorText = await openaiRes.text();
            console.error('OpenAI API error:', errorText);
            return NextResponse.json({
                reply: 'Tive um problema ao processar sua mensagem. Que tal falar direto no WhatsApp? Lá consigo te ajudar melhor! 😊',
                conversationId: conversationId || null,
            });
        }

        const openaiData = await openaiRes.json();
        let reply = openaiData.choices?.[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';

        // Extract lead data from tags if present
        let leadData = null;
        const leadMatch = reply.match(/<lead_data>([\s\S]*?)<\/lead_data>/);
        if (leadMatch) {
            try {
                leadData = JSON.parse(leadMatch[1]);
                // Remove the tags from the visible reply
                reply = reply.replace(/<lead_data>[\s\S]*?<\/lead_data>/, '').trim();
            } catch {
                // Ignore JSON parse errors
            }
        }

        // Save to database if we have a Supabase connection
        let newConversationId = conversationId;
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

            if (supabaseUrl && supabaseServiceKey) {
                const { createClient } = await import('@supabase/supabase-js');
                const supabase = createClient(supabaseUrl, supabaseServiceKey);

                // Create or get conversation
                if (!newConversationId) {
                    // Create a new lead first if we have lead data
                    let leadId = null;
                    if (leadData) {
                        const { data: lead } = await supabase
                            .from('leads')
                            .insert({
                                nome: leadData.nome || null,
                                whatsapp: leadData.whatsapp || null,
                                cidade: leadData.cidade || null,
                                bairro: leadData.bairro || null,
                                tipo_servico: leadData.tipo_servico || null,
                                ambiente: leadData.ambiente || null,
                                orcamento_faixa: leadData.orcamento_faixa || null,
                                urgencia: leadData.urgencia || null,
                                descricao: leadData.descricao || null,
                                consentimento_lgpd: leadData.consentimento_lgpd || false,
                                tags: leadData.tags || [],
                                status: 'novo',
                            })
                            .select('id')
                            .single();
                        leadId = lead?.id;
                    }

                    const { data: conv } = await supabase
                        .from('conversations')
                        .insert({
                            lead_id: leadId,
                            channel: 'site_chat',
                        })
                        .select('id')
                        .single();
                    newConversationId = conv?.id;
                } else if (leadData) {
                    // Update existing lead if we have new data
                    const { data: conv } = await supabase
                        .from('conversations')
                        .select('lead_id')
                        .eq('id', newConversationId)
                        .single();

                    if (conv?.lead_id) {
                        const updateData: Record<string, unknown> = {};
                        if (leadData.nome) updateData.nome = leadData.nome;
                        if (leadData.whatsapp) updateData.whatsapp = leadData.whatsapp;
                        if (leadData.cidade) updateData.cidade = leadData.cidade;
                        if (leadData.bairro) updateData.bairro = leadData.bairro;
                        if (leadData.tipo_servico) updateData.tipo_servico = leadData.tipo_servico;
                        if (leadData.ambiente) updateData.ambiente = leadData.ambiente;
                        if (leadData.orcamento_faixa) updateData.orcamento_faixa = leadData.orcamento_faixa;
                        if (leadData.urgencia) updateData.urgencia = leadData.urgencia;
                        if (leadData.descricao) updateData.descricao = leadData.descricao;
                        if (leadData.tags?.length) updateData.tags = leadData.tags;
                        if (leadData.consentimento_lgpd !== undefined) updateData.consentimento_lgpd = leadData.consentimento_lgpd;

                        if (Object.keys(updateData).length > 0) {
                            updateData.updated_at = new Date().toISOString();
                            await supabase.from('leads').update(updateData).eq('id', conv.lead_id);
                        }
                    } else if (leadData.nome || leadData.whatsapp) {
                        // Create lead and link to conversation
                        const { data: lead } = await supabase
                            .from('leads')
                            .insert({
                                nome: leadData.nome || null,
                                whatsapp: leadData.whatsapp || null,
                                cidade: leadData.cidade || null,
                                bairro: leadData.bairro || null,
                                tipo_servico: leadData.tipo_servico || null,
                                ambiente: leadData.ambiente || null,
                                orcamento_faixa: leadData.orcamento_faixa || null,
                                urgencia: leadData.urgencia || null,
                                descricao: leadData.descricao || null,
                                consentimento_lgpd: leadData.consentimento_lgpd || false,
                                tags: leadData.tags || [],
                                status: 'novo',
                            })
                            .select('id')
                            .single();

                        if (lead?.id) {
                            await supabase.from('conversations').update({ lead_id: lead.id }).eq('id', newConversationId);
                        }
                    }
                }

                // Save messages
                if (newConversationId) {
                    await supabase.from('messages').insert([
                        {
                            conversation_id: newConversationId,
                            sender: 'user',
                            content: message,
                        },
                        {
                            conversation_id: newConversationId,
                            sender: 'ai',
                            content: reply,
                            metadata: leadData || null,
                        },
                    ]);
                }
            }
        } catch (dbError) {
            console.error('Database error:', dbError);
            // Don't fail the response due to DB issues
        }

        return NextResponse.json({
            reply,
            conversationId: newConversationId,
            leadData,
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
