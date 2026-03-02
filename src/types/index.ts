export interface Lead {
    id: string;
    nome: string | null;
    whatsapp: string | null;
    email: string | null;
    cidade: string | null;
    bairro: string | null;
    tipo_servico: 'planejados' | 'assistencia' | null;
    ambiente: string | null;
    orcamento_faixa: string | null;
    urgencia: string | null;
    descricao: string | null;
    consentimento_lgpd: boolean;
    origem_utm: Record<string, string> | null;
    status: 'novo' | 'em_atendimento' | 'orcamento_enviado' | 'fechado' | 'perdido' | 'followup';
    tags: string[];
    notas_admin: string | null;
    dispositivo: string | null;
    pagina_origem: string | null;
    created_at: string;
    updated_at: string;
}

export interface Conversation {
    id: string;
    lead_id: string | null;
    channel: string;
    created_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender: 'user' | 'ai';
    content: string;
    metadata: Record<string, unknown> | null;
    created_at: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface LeadData {
    nome?: string;
    whatsapp?: string;
    email?: string;
    cidade?: string;
    bairro?: string;
    tipo_servico?: 'planejados' | 'assistencia';
    ambiente?: string;
    orcamento_faixa?: string;
    urgencia?: string;
    descricao?: string;
    tags?: string[];
    consentimento_lgpd?: boolean;
    pagina_origem?: string;
    dispositivo?: string;
    origem_utm?: Record<string, string>;
}
