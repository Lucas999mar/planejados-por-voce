import Link from 'next/link';
import {
  ChefHat, BedDouble, ShirtIcon, Bath, Sofa, Flame, WashingMachine, Monitor,
  Wrench, Phone, ArrowRight, Star, CheckCircle, Clock, Shield, HeartHandshake,
  ChevronDown, MessageCircle
} from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import Showroom3D from '@/components/home/Showroom3D';

const ambientes = [
  { icon: ChefHat, nome: 'Cozinha', desc: 'Armários, bancadas e despensas sob medida' },
  { icon: BedDouble, nome: 'Quarto', desc: 'Guarda-roupas, cabeceiras e cômodas' },
  { icon: ShirtIcon, nome: 'Closet', desc: 'Closets organizados do seu jeito' },
  { icon: Bath, nome: 'Banheiro', desc: 'Gabinetes e nichos personalizados' },
  { icon: Sofa, nome: 'Sala', desc: 'Painéis de TV, estantes e racks' },
  { icon: Flame, nome: 'Área Gourmet', desc: 'Projetos para churrasqueira e lazer' },
  { icon: WashingMachine, nome: 'Lavanderia', desc: 'Organização funcional e compacta' },
  { icon: Monitor, nome: 'Home Office', desc: 'Mesas, estantes e organização' },
];

const diferenciais = [
  { icon: CheckCircle, titulo: 'Qualidade Premium', desc: 'Ferragens de primeira linha e acabamento impecável' },
  { icon: Clock, titulo: 'Prazo Respeitado', desc: 'Cumprimos o prazo combinado, sem surpresas' },
  { icon: Shield, titulo: 'Garantia', desc: 'Cobertura para vícios de fabricação e montagem' },
  { icon: HeartHandshake, titulo: 'Pós-venda', desc: 'Assistência técnica e suporte contínuo' },
];

const etapas = [
  { num: '01', titulo: 'Contato', desc: 'Fale conosco pelo WhatsApp e conte o que precisa' },
  { num: '02', titulo: 'Projeto', desc: 'Entendemos suas necessidades e criamos o projeto ideal' },
  { num: '03', titulo: 'Orçamento', desc: 'Apresentamos o orçamento detalhado e transparente' },
  { num: '04', titulo: 'Entrega', desc: 'Fabricamos e instalamos com perfeição' },
];

const depoimentos = [
  { nome: 'Ana R.', cidade: 'Rio de Janeiro', texto: 'Minha cozinha ficou incrível! O acabamento é perfeito e o prazo foi cumprido certinho. Super recomendo!', rating: 5 },
  { nome: 'Carlos M.', cidade: 'São Paulo', texto: 'Contratei para assistência técnica e resolveram meu problema de corrediça no mesmo dia. Profissionais excelentes!', rating: 5 },
  { nome: 'Juliana S.', cidade: 'Belo Horizonte', texto: 'O closet que fizeram superou todas as expectativas. Organização e beleza em cada detalhe.', rating: 5 },
  { nome: 'Roberto L.', cidade: 'Curitiba', texto: 'Atendimento nota 10! Do orçamento à entrega, tudo foi transparente e profissional.', rating: 5 },
];

const faqItems = [
  { p: 'Quanto tempo leva para fabricar e instalar?', r: 'O prazo varia conforme o projeto, mas em média de 15 a 30 dias úteis após a aprovação do orçamento. Prazo exato é informado no seu orçamento personalizado.' },
  { p: 'Vocês fazem visita para medir?', r: 'Sim! Após o primeiro contato no WhatsApp, agendamos uma visita para medição no local, sem compromisso.' },
  { p: 'Qual a garantia dos móveis?', r: 'Oferecemos garantia para vícios de fabricação e montagem. O prazo específico é informado no contrato.' },
  { p: 'Vocês fazem assistência em móveis de outras marcas?', r: 'Sim! Nossa assistência técnica atende reparos, troca de ferragens e ajustes em móveis de diversas marcas e fabricantes.' },
  { p: 'Como funciona o orçamento?', r: 'O orçamento é gratuito! Basta nos enviar as informações pelo WhatsApp e retornamos com uma estimativa. Para valores exatos, agendamos uma visita.' },
  { p: 'Atendem em qual região?', r: 'Atendemos em todo o Brasil! Fale conosco no WhatsApp para confirmar disponibilidade na sua região.' },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* SHOWROOM 3D */}
      <div className="bg-white pt-20">
        <Showroom3D />
      </div>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-wood-50 via-white to-gold-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,69,19,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(212,165,116,0.08)_0%,transparent_50%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-wood-100 text-wood-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Wrench size={16} />
            <span>Planejados + Assistência Técnica</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-dark-800 leading-tight mb-6">
            Móveis{' '}
            <span className="gradient-text">Planejados</span>
            <br />
            <span className="text-wood-600">Sob Medida</span> Para Você
          </h1>
          <p className="text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transforme seus ambientes com móveis sob medida de alta qualidade.
            Assistência técnica especializada para manter tudo perfeito.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl hover:from-accent-600 hover:to-accent-700 transition-all"
            >
              <Phone size={22} />
              Pedir Orçamento no WhatsApp
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/orcamento"
              className="flex items-center gap-2 bg-white text-wood-700 px-8 py-4 rounded-full text-lg font-semibold border-2 border-wood-200 hover:border-wood-400 transition-all shadow-lg"
            >
              <MessageCircle size={20} />
              Orçamento Online
            </Link>
          </div>
          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-dark-300 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-gold-400 fill-gold-400" />
                ))}
              </div>
              <span>5.0 no Google</span>
            </div>
            <span className="hidden sm:block">•</span>
            <span>✅ Atendimento 24h</span>
            <span className="hidden sm:block">•</span>
            <span>🇧🇷 Todo o Brasil</span>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-wood-500 font-semibold text-sm uppercase tracking-wider">Nossos Serviços</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark-800 mt-2">
              Ambientes que <span className="gradient-text">transformam</span> sua casa
            </h2>
            <p className="text-dark-400 mt-4 max-w-xl mx-auto">
              Cada projeto é único. Criamos móveis sob medida para cada ambiente da sua casa.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {ambientes.map((amb) => (
              <a
                key={amb.nome}
                href={generateWhatsAppLink({ tipo_servico: 'planejados', ambiente: amb.nome })}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-wood-50 hover:bg-gradient-to-br hover:from-wood-600 hover:to-wood-700 p-6 rounded-2xl transition-all duration-300 cursor-pointer border border-wood-100 hover:border-transparent hover:shadow-xl"
              >
                <amb.icon size={32} className="text-wood-500 group-hover:text-white transition-colors mb-3" />
                <h3 className="font-heading font-semibold text-dark-700 group-hover:text-white transition-colors">{amb.nome}</h3>
                <p className="text-sm text-dark-400 group-hover:text-wood-200 transition-colors mt-1">{amb.desc}</p>
              </a>
            ))}
          </div>
          {/* Assistência Técnica CTA */}
          <div className="mt-12 bg-gradient-to-r from-gold-50 to-wood-50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gold-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gold-100 rounded-xl flex items-center justify-center shrink-0">
                <Wrench size={28} className="text-gold-600" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-dark-700">Assistência Técnica Especializada</h3>
                <p className="text-dark-400 text-sm mt-1">Reparos, troca de ferragens, ajustes em portas, dobradiças e corrediças</p>
              </div>
            </div>
            <a
              href={generateWhatsAppLink({ tipo_servico: 'assistencia' })}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-3 rounded-full font-semibold hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg whitespace-nowrap"
            >
              <Phone size={18} />
              Solicitar Assistência
            </a>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="section-padding bg-gradient-to-b from-wood-50/50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent-600 font-semibold text-sm uppercase tracking-wider">Processo</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark-800 mt-2">
              Como <span className="gradient-text">funciona</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {etapas.map((etapa, i) => (
              <div key={etapa.num} className="text-center relative">
                {i < 3 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-wood-300 to-transparent" />
                )}
                <div className="w-16 h-16 bg-gradient-to-br from-wood-500 to-wood-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="font-heading text-white font-bold text-xl">{etapa.num}</span>
                </div>
                <h3 className="font-heading font-semibold text-dark-700 text-lg">{etapa.titulo}</h3>
                <p className="text-dark-400 text-sm mt-2">{etapa.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="section-padding bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-600 font-semibold text-sm uppercase tracking-wider">Por que nos escolher</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark-800 mt-2">
              Nossos <span className="gradient-text">Diferenciais</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {diferenciais.map((d) => (
              <div
                key={d.titulo}
                className="flex items-start gap-4 p-6 bg-gradient-to-br from-wood-50 to-gold-50 rounded-2xl border border-wood-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <d.icon size={24} className="text-accent-500" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-dark-700">{d.titulo}</h3>
                  <p className="text-sm text-dark-400 mt-1">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="section-padding bg-gradient-to-b from-dark-800 to-dark-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-semibold text-sm uppercase tracking-wider">Depoimentos</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-2">
              O que nossos <span className="text-gold-400">clientes</span> dizem
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {depoimentos.map((d, i) => (
              <div
                key={i}
                className="bg-dark-700/50 backdrop-blur-sm p-6 rounded-2xl border border-dark-600 hover:border-gold-500/30 transition-colors"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(d.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-dark-100 text-sm leading-relaxed mb-4">&ldquo;{d.texto}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-wood-500 to-gold-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {d.nome[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{d.nome}</p>
                    <p className="text-xs text-dark-300">{d.cidade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-wood-500 font-semibold text-sm uppercase tracking-wider">Dúvidas Frequentes</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dark-800 mt-2">
              Perguntas <span className="gradient-text">Frequentes</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="group bg-wood-50 rounded-xl border border-wood-100 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-heading font-medium text-dark-700 hover:text-wood-600 transition-colors list-none">
                  <span>{item.p}</span>
                  <ChevronDown size={20} className="text-wood-400 group-open:rotate-180 transition-transform shrink-0 ml-4" />
                </summary>
                <div className="px-5 pb-5 text-sm text-dark-400 leading-relaxed">
                  {item.r}
                </div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/faq" className="text-wood-600 hover:text-wood-700 font-semibold text-sm inline-flex items-center gap-1">
              Ver todas as dúvidas <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section-padding bg-gradient-to-r from-wood-700 via-wood-800 to-dark-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Pronto para transformar seus ambientes?
          </h2>
          <p className="text-wood-200 text-lg mb-8 max-w-xl mx-auto">
            Entre em contato agora pelo WhatsApp e receba um orçamento personalizado sem compromisso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl hover:from-accent-600 hover:to-accent-700 transition-all"
            >
              <Phone size={22} />
              Falar no WhatsApp Agora
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/orcamento"
              className="flex items-center gap-2 text-wood-200 hover:text-white px-6 py-4 rounded-full text-lg font-medium border border-wood-500 hover:border-white transition-all"
            >
              Preencher Formulário Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
