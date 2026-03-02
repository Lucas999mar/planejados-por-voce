import { SITE_NAME, WHATSAPP_DISPLAY } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidade e Termos | Planejados Por Você',
    description: 'Política de privacidade, LGPD e termos de uso do site Planejados Por Você.',
};

export default function PoliticasPage() {
    return (
        <div className="pt-20">
            <section className="section-padding bg-gradient-to-br from-wood-50 via-white to-gold-50">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="font-heading text-4xl font-bold text-dark-800">
                        Políticas e <span className="gradient-text">Termos</span>
                    </h1>
                </div>
            </section>

            <section className="section-padding bg-white">
                <div className="max-w-3xl mx-auto prose prose-wood">
                    <h2 className="font-heading text-2xl font-bold text-dark-800" id="privacidade">Política de Privacidade (LGPD)</h2>
                    <p className="text-dark-500 text-sm leading-relaxed">Última atualização: Março de 2026</p>

                    <div className="space-y-6 text-dark-500 text-sm leading-relaxed mt-6">
                        <div>
                            <h3 className="font-heading font-semibold text-dark-700 text-base mb-2">1. Dados coletados</h3>
                            <p>Coletamos apenas os dados fornecidos voluntariamente por você, incluindo: nome, WhatsApp, e-mail, cidade, bairro, tipo de serviço desejado, preferências de ambiente, faixa de orçamento e prazo/urgência. Também registramos a data e hora do contato e a página de origem.</p>
                        </div>

                        <div>
                            <h3 className="font-heading font-semibold text-dark-700 text-base mb-2">2. Finalidade do uso</h3>
                            <p>Seus dados são utilizados exclusivamente para: atendimento e orçamento, registro de interesse para follow-up comercial, melhoria dos nossos serviços e comunicação sobre ofertas e novidades (somente com consentimento).</p>
                        </div>

                        <div>
                            <h3 className="font-heading font-semibold text-dark-700 text-base mb-2">3. Compartilhamento</h3>
                            <p>Não compartilhamos seus dados com terceiros, exceto: fornecedores necessários para a execução do serviço contratado, quando exigido por lei.</p>
                        </div>

                        <div>
                            <h3 className="font-heading font-semibold text-dark-700 text-base mb-2">4. Armazenamento e segurança</h3>
                            <p>Seus dados são armazenados em servidores seguros com criptografia. Adotamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda ou alteração.</p>
                        </div>

                        <div>
                            <h3 className="font-heading font-semibold text-dark-700 text-base mb-2">5. Seus direitos (LGPD)</h3>
                            <p>De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a: acessar seus dados, corrigir informações, solicitar exclusão dos seus dados, revogar consentimento a qualquer momento. Para exercer seus direitos, entre em contato pelo WhatsApp {WHATSAPP_DISPLAY} ou e-mail contato@planejadosporvoce.com.br.</p>
                        </div>

                        <div>
                            <h3 className="font-heading font-semibold text-dark-700 text-base mb-2">6. Cookies</h3>
                            <p>Este site pode utilizar cookies para melhorar a experiência de navegação. Cookies são pequenos arquivos armazenados no seu navegador que nos ajudam a entender como você usa o site.</p>
                        </div>

                        <div>
                            <h3 className="font-heading font-semibold text-dark-700 text-base mb-2">7. Consentimento</h3>
                            <p>Ao utilizar nossos formulários e chat, e marcar a opção de consentimento, você concorda com esta política de privacidade.</p>
                        </div>
                    </div>

                    <hr className="my-12 border-wood-200" />

                    <h2 className="font-heading text-2xl font-bold text-dark-800" id="termos">Termos de Uso</h2>

                    <div className="space-y-6 text-dark-500 text-sm leading-relaxed mt-6">
                        <div>
                            <h3 className="font-heading font-semibold text-dark-700 text-base mb-2">1. Sobre o site</h3>
                            <p>O site {SITE_NAME} é uma plataforma de apresentação de serviços e captação de leads. Orçamentos e fechamentos são realizados exclusivamente via WhatsApp ou contato direto.</p>
                        </div>

                        <div>
                            <h3 className="font-heading font-semibold text-dark-700 text-base mb-2">2. Orçamentos</h3>
                            <p>Valores e prazos informados no site ou pelo chat são estimativas e não constituem proposta comercial. Orçamentos formais são apresentados após visita técnica e análise do projeto.</p>
                        </div>

                        <div>
                            <h3 className="font-heading font-semibold text-dark-700 text-base mb-2">3. Chat com IA</h3>
                            <p>O assistente virtual utiliza inteligência artificial para auxiliar no atendimento. As respostas são orientativas e não substituem a avaliação técnica de um profissional. Valores, prazos e especificações definitivas são confirmados apenas via WhatsApp.</p>
                        </div>

                        <div>
                            <h3 className="font-heading font-semibold text-dark-700 text-base mb-2">4. Propriedade intelectual</h3>
                            <p>Todo o conteúdo deste site (textos, imagens, design) é de propriedade da {SITE_NAME} e protegido por direitos autorais.</p>
                        </div>

                        <div>
                            <h3 className="font-heading font-semibold text-dark-700 text-base mb-2">5. Alterações</h3>
                            <p>Reservamo-nos o direito de alterar estes termos a qualquer momento. As alterações entram em vigor imediatamente após publicação no site.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
