export const WHATSAPP_NUMBER = '5522999093710';
export const WHATSAPP_DISPLAY = '(22) 99909-3710';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const SITE_NAME = 'Planejados Por Você';
export const SITE_DESCRIPTION = 'Móveis planejados sob medida e assistência técnica especializada. Transforme seus ambientes com qualidade e preço justo.';

export const AMBIENTES = [
    'Cozinha', 'Quarto', 'Closet', 'Banheiro', 'Sala',
    'Área Gourmet', 'Lavanderia', 'Home Office', 'Outro'
] as const;

export const FAIXAS_ORCAMENTO = [
    'Até R$ 3.000',
    'R$ 3.000 a R$ 7.000',
    'R$ 7.000 a R$ 15.000',
    'R$ 15.000 a R$ 30.000',
    'Acima de R$ 30.000',
    'Preciso de uma estimativa',
] as const;

export const URGENCIAS = [
    'Urgente (até 7 dias)',
    'Até 15 dias',
    'Até 30 dias',
    'Sem pressa (mais de 30 dias)',
    'Apenas pesquisando',
] as const;

export const LEAD_STATUS = {
    novo: { label: 'Novo', color: 'bg-blue-500' },
    em_atendimento: { label: 'Em Atendimento', color: 'bg-yellow-500' },
    orcamento_enviado: { label: 'Orçamento Enviado', color: 'bg-purple-500' },
    fechado: { label: 'Fechado', color: 'bg-green-500' },
    perdido: { label: 'Perdido', color: 'bg-red-500' },
    followup: { label: 'Follow-up', color: 'bg-orange-500' },
} as const;

export const PROBLEMAS_ASSISTENCIA = [
    'Porta desalinhada ou solta',
    'Dobradiça com defeito',
    'Trilho ou corrediça com problema',
    'Gaveta não fecha / não abre',
    'Troca de ferragens',
    'Reparo no acabamento',
    'Peça quebrada ou danificada',
    'Manutenção preventiva',
    'Outro problema',
] as const;

export const NAV_LINKS = [
    { label: 'Início', href: '/' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Portfólio', href: '/portfolio' },
    { label: 'Orçamento', href: '/orcamento' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contato', href: '/contato' },
] as const;
