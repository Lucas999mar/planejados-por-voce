import { WHATSAPP_BASE_URL } from './constants';

interface WhatsAppMessageData {
    tipo_servico?: string;
    ambiente?: string;
    cidade?: string;
    bairro?: string;
    descricao?: string;
    urgencia?: string;
    orcamento_faixa?: string;
    nome?: string;
    whatsapp?: string;
    medidas?: string;
}

export function generateWhatsAppMessage(data: WhatsAppMessageData): string {
    const lines: string[] = ['Olá! Vim pelo site Planejados Por Você.', ''];

    if (data.tipo_servico) {
        lines.push(`📋 *Tipo de serviço:* ${data.tipo_servico === 'planejados' ? 'Móveis Planejados' : 'Assistência Técnica'}`);
    }
    if (data.ambiente) lines.push(`🏠 *Ambiente/Móvel:* ${data.ambiente}`);
    if (data.cidade) {
        let local = data.cidade;
        if (data.bairro) local += ` - ${data.bairro}`;
        lines.push(`📍 *Cidade/Bairro:* ${local}`);
    }
    if (data.descricao) lines.push(`📝 *Detalhes:* ${data.descricao}`);
    if (data.medidas) lines.push(`📏 *Medidas:* ${data.medidas}`);
    if (data.urgencia) lines.push(`⏰ *Urgência/prazo:* ${data.urgencia}`);
    if (data.orcamento_faixa) lines.push(`💰 *Orçamento (faixa):* ${data.orcamento_faixa}`);
    if (data.nome) lines.push(`👤 *Meu nome:* ${data.nome}`);
    if (data.whatsapp) lines.push(`📱 *Meu WhatsApp:* ${data.whatsapp}`);

    return lines.join('\n');
}

export function generateWhatsAppLink(data?: WhatsAppMessageData): string {
    if (!data || Object.keys(data).length === 0) {
        const defaultMsg = encodeURIComponent('Olá! Vim pelo site Planejados Por Você e gostaria de saber mais sobre os serviços.');
        return `${WHATSAPP_BASE_URL}?text=${defaultMsg}`;
    }
    const message = generateWhatsAppMessage(data);
    return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

export function generateSimpleWhatsAppLink(message: string): string {
    return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}
