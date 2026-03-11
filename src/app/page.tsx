import Link from "next/link";
import {
  Calendar,
  CreditCard,
  MessageCircle,
  BarChart3,
  Users,
  Clock,
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_PRICES, PLAN_VALUES, getPlanLabel } from "@/lib/plans";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Calendar,
    title: "Agenda inteligente",
    description: "Agendamentos online, bloqueio de horários e sincronização em tempo real.",
  },
  {
    icon: CreditCard,
    title: "Planos mensais",
    description: "Controle de planos recorrentes dos clientes e cobrança automática.",
  },
  {
    icon: Clock,
    title: "Fila de espera",
    description: "Preencha horários vazios com clientes em espera automaticamente.",
  },
  {
    icon: BarChart3,
    title: "Financeiro e relatórios",
    description: "Visão clara de faturamento, inadimplência e métricas da barbearia.",
  },
  {
    icon: Users,
    title: "Controle de faltas",
    description: "Reduza faltas com lembretes e políticas de cancelamento.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp e automações",
    description: "Mensagens automáticas, confirmações e lembretes por WhatsApp.",
  },
];

const STEPS = [
  { step: 1, title: "Escolha o plano", desc: "Selecione o que cabe no seu negócio." },
  { step: 2, title: "Cadastre sua barbearia", desc: "Dados da sua empresa em poucos campos." },
  { step: 3, title: "Crie o admin", desc: "Seu usuário de acesso ao painel." },
  { step: 4, title: "Libere seu acesso", desc: "Ativação imediata após o pagamento." },
  { step: 5, title: "Comece a usar", desc: "Entre no painel e configure tudo." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-bold text-xl tracking-tight text-foreground">
            TRIVOR
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="#planos"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Planos
            </Link>
            <Link
              href="#funcionalidades"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Funcionalidades
            </Link>
            <Link href="/areadocliente" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Área do cliente
            </Link>
            <Link href="/cadastro">
              <Button size="sm" className="rounded-full px-5">
                Começar agora
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-white to-muted/20 px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div>
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  Sistema completo para barbearias
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-[1.15]">
                  O sistema que organiza sua barbearia, aumenta seus agendamentos e reduz faltas automaticamente.
                </h1>
                <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                  Agenda online, planos mensais, financeiro, relatórios, fila de espera e automações em um só lugar.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link href="/cadastro">
                    <Button size="lg" className="h-12 rounded-xl px-8 text-base shadow-lg transition-all hover:shadow-xl">
                      Começar agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#funcionalidades">
                    <Button size="lg" variant="outline" className="h-12 rounded-xl px-8 text-base">
                      Ver demonstração
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/5 overflow-hidden aspect-[4/3] flex items-center justify-center">
                  <div className="w-full max-w-md rounded-xl bg-muted/50 p-8 text-center">
                    <Calendar className="mx-auto h-16 w-16 text-primary/70" />
                    <p className="mt-4 font-semibold text-foreground">Agenda TRIVOR</p>
                    <p className="mt-1 text-sm text-muted-foreground">Mockup do sistema — sua barbearia organizada em um clique</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dores */}
        <section className="border-b border-border/40 bg-white px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Acabou com os problemas que atrasam sua barbearia
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              O TRIVOR foi feito para resolver as dores reais do dia a dia.
            </p>
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Agenda bagunçada e horários perdidos",
                "Horários vazios sem preenchimento inteligente",
                "Faltas de clientes sem controle",
                "Dificuldade em organizar a equipe",
                "Falta de controle financeiro e recorrência",
                "Tempo perdido com confirmações manuais",
              ].map((pain, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    ✕
                  </span>
                  <span className="font-medium text-foreground">{pain}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Benefícios */}
        <section className="border-b border-border/40 bg-muted/20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Tudo o que sua barbearia precisa para crescer
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Mais resultado com menos esforço.
            </p>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Zap, label: "Mais organização" },
                { icon: Shield, label: "Mais profissionalismo" },
                { icon: BarChart3, label: "Mais controle" },
                { icon: TrendingUp, label: "Mais recorrência" },
                { icon: Users, label: "Menos faltas" },
                { icon: Clock, label: "Mais praticidade" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-xl border border-border/60 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-semibold text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Funcionalidades */}
        <section id="funcionalidades" className="scroll-mt-20 border-b border-border/40 bg-white px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Funcionalidades que fazem a diferença
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Tudo integrado em uma única plataforma.
            </p>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section className="border-b border-border/40 bg-muted/20 px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Como funciona
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Em poucos passos você está no ar.
            </p>
            <div className="mt-14 flex flex-wrap justify-center gap-8 sm:gap-12">
              {STEPS.map(({ step, title, desc }) => (
                <div key={step} className="flex flex-col items-center text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary text-lg font-bold text-primary-foreground">
                    {step}
                  </span>
                  <p className="mt-3 font-semibold text-foreground">{title}</p>
                  <p className="mt-1 max-w-[160px] text-sm text-muted-foreground">{desc}</p>
                  {step < STEPS.length && (
                    <ArrowRight className="mt-4 hidden h-6 w-6 text-muted-foreground lg:block" aria-hidden />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-14 text-center">
              <Link href="/cadastro">
                <Button size="lg" className="rounded-xl px-8">
                  Começar agora
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Planos */}
        <section id="planos" className="scroll-mt-20 border-b border-border/40 bg-white px-4 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Planos para cada etapa da sua barbearia
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Escolha o plano e comece hoje. Cancele quando quiser.
            </p>
            <div className="mt-14 grid gap-8 lg:grid-cols-3">
              {PLAN_VALUES.map((planValue) => {
                const isPro = planValue === "pro";
                const price = PLAN_PRICES[planValue];
                return (
                  <div
                    key={planValue}
                    className={cn(
                      "relative flex flex-col rounded-2xl border p-6 shadow-sm sm:p-8",
                      isPro
                        ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
                        : "border-border/60 bg-card"
                    )}
                  >
                    {isPro && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                        Recomendado
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-foreground">{getPlanLabel(planValue)}</h3>
                    <p className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold tracking-tight">R$ {price}</span>
                      <span className="text-muted-foreground">/mês</span>
                    </p>
                    <ul className="mt-6 space-y-3">
                      {["Agenda inteligente", "Planos mensais", "Relatórios", "Suporte por email"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                          {f}
                        </li>
                      ))}
                      {planValue !== "basico" && (
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                          WhatsApp e automações
                        </li>
                      )}
                      {planValue === "master" && (
                        <li className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 shrink-0 text-primary" />
                          Recursos avançados e prioridade
                        </li>
                      )}
                    </ul>
                    <Link href={`/cadastro?plano=${planValue}`} className="mt-8 block">
                      <Button
                        className="w-full rounded-xl"
                        variant={isPro ? "default" : "outline"}
                        size="lg"
                      >
                        Assinar agora
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-primary px-4 py-20 text-primary-foreground sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Pronto para organizar sua barbearia?
            </h2>
            <p className="mt-4 text-primary-foreground/90">
              Junte-se a centenas de barbearias que já usam o TRIVOR.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/cadastro">
                <Button size="lg" variant="secondary" className="h-12 rounded-xl px-8 text-base">
                  Começar agora
                </Button>
              </Link>
              <Link href="/areadocliente">
                <Button size="lg" variant="outline" className="h-12 rounded-xl border-primary-foreground/30 bg-transparent px-8 text-base text-primary-foreground hover:bg-primary-foreground/10">
                  Área do cliente
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-muted/30 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="font-semibold text-foreground">TRIVOR</span>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#planos" className="hover:text-foreground">Planos</Link>
              <Link href="#funcionalidades" className="hover:text-foreground">Funcionalidades</Link>
              <Link href="/areadocliente" className="hover:text-foreground">Área do cliente</Link>
            </nav>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground sm:text-left">
            © {new Date().getFullYear()} TRIVOR. Painel e site institucional.
          </p>
        </div>
      </footer>
    </div>
  );
}
