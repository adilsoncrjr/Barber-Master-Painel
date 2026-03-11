/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";

type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled";

type InvoiceStatus = "paid" | "pending" | "overdue";

type SectionId =
  | "dashboard"
  | "subscription"
  | "invoices"
  | "usage"
  | "integrations"
  | "barbershop"
  | "support"
  | "account";

const sections: { id: SectionId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "subscription", label: "Assinatura" },
  { id: "invoices", label: "Faturas" },
  { id: "usage", label: "Consumo" },
  { id: "integrations", label: "Integrações" },
  { id: "barbershop", label: "Barbearia" },
  { id: "support", label: "Suporte" },
  { id: "account", label: "Conta" },
];

const mockClientPortalData = {
  barbershopName: "Barbearia do Adilson",
  slug: "barbearia-do-adilson",
  subscription: {
    planName: "Trivor Barber Pro",
    status: "active" as SubscriptionStatus,
    renewalDate: "2026-04-15",
    billingInterval: "Mensal",
    amount: 14990, // em centavos
    currency: "BRL",
    trialEndsAt: null as string | null,
  },
  account: {
    ownerName: "Adilson Silva",
    email: "contato@barbeariadoadilson.com",
    phone: "(11) 99999-0000",
  },
  invoices: [
    {
      id: "inv_001",
      date: "2026-03-10",
      amount: 14990,
      status: "paid" as InvoiceStatus,
      url: "#",
    },
    {
      id: "inv_002",
      date: "2026-02-10",
      amount: 14990,
      status: "paid" as InvoiceStatus,
      url: "#",
    },
    {
      id: "inv_003",
      date: "2026-01-10",
      amount: 14990,
      status: "paid" as InvoiceStatus,
      url: "#",
    },
  ],
  usage: {
    whatsappMessagesThisMonth: 320,
    whatsappMessagesLimit: 2000,
    planFeatures: [
      "Agendamentos ilimitados",
      "Gestão da barbearia multi-dispositivo",
      "Painel administrativo completo",
      "Integração WhatsApp (em breve consumo detalhado)",
    ],
  },
  integrations: {
    whatsapp: {
      status: "not_connected" as "connected" | "not_connected" | "coming_soon",
    },
  },
};

function formatCurrency(amountInCents: number, currency: string) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
    }).format(amountInCents / 100);
  } catch {
    return `R$ ${(amountInCents / 100).toFixed(2)}`;
  }
}

function getSubscriptionStatusLabel(status: SubscriptionStatus) {
  switch (status) {
    case "active":
      return "Ativa";
    case "trialing":
      return "Em período de testes";
    case "past_due":
      return "Pagamento em atraso";
    case "canceled":
      return "Cancelada";
    default:
      return status;
  }
}

function getInvoiceStatusBadgeClasses(status: InvoiceStatus) {
  if (status === "paid") {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  }
  if (status === "overdue") {
    return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
  }
  return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
}

export default function AreaDoClientePage() {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");

  const appUrl = `/app/${mockClientPortalData.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/40 via-background to-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                TB
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight text-foreground">
                  Trivor Barber
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Área do Cliente
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-4 text-sm text-muted-foreground sm:flex">
            <Link
              href="/"
              className="font-medium transition-colors hover:text-foreground"
            >
              Landing
            </Link>
            <Link
              href="/checkout"
              className="font-medium transition-colors hover:text-foreground"
            >
              Checkout
            </Link>
            <Link
              href={appUrl}
              className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-muted/70"
            >
              Acessar app da barbearia
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Área do Cliente
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Gerencie sua assinatura, integrações e acesso à sua barbearia no TRIVOR.
              Este é o seu portal como assinante do SaaS, não o app do cliente final da barbearia.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/80">
              Os dados abaixo são ilustrativos e a interface já está preparada para receber informações
              reais de cobrança, consumo de mensagens e integrações.
            </p>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-border bg-card/80 p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Conta ativa
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {mockClientPortalData.barbershopName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Plano{" "}
                  <span className="font-medium">
                    {mockClientPortalData.subscription.planName}
                  </span>{" "}
                  — {getSubscriptionStatusLabel(mockClientPortalData.subscription.status)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Slug da barbearia:{" "}
                  <span className="font-mono text-[11px] text-foreground">
                    {mockClientPortalData.slug}
                  </span>
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-300">
                Assinatura ativa
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={appUrl}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Acessar app
              </Link>
              <Link
                href="#assinatura"
                className="inline-flex flex-[0.9] items-center justify-center rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection("subscription");
                }}
              >
                Ver assinatura
              </Link>
              <button
                type="button"
                className="inline-flex flex-[0.9] items-center justify-center rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:bg-muted"
                onClick={() => setActiveSection("support")}
              >
                Suporte
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[260px,1fr]">
          {/* Navegação lateral / topo */}
          <aside className="space-y-3 lg:space-y-4">
            <div className="rounded-2xl border border-border bg-card/80 p-2 shadow-sm sm:p-3">
              <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Navegação
              </p>
              <div className="flex gap-1 overflow-x-auto pb-1 text-sm lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={[
                      "whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition-colors lg:w-full lg:justify-start lg:text-sm",
                      activeSection === section.id
                        ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    ].join(" ")}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden rounded-2xl border border-dashed border-border/70 bg-muted/60 p-3 text-xs text-muted-foreground lg:block">
              <p className="font-semibold text-foreground">Pronto para crescer com você</p>
              <p className="mt-1">
                Essa área do cliente foi pensada para receber, no futuro, mais recursos como
                upgrade de plano em 1 clique, métricas em tempo real e central de ajuda.
              </p>
            </div>
          </aside>

          {/* Conteúdo principal por seção */}
          <div className="space-y-6">
            {activeSection === "dashboard" && (
              <DashboardSection appUrl={appUrl} />
            )}

            {activeSection === "subscription" && (
              <SubscriptionSection />
            )}

            {activeSection === "invoices" && (
              <InvoicesSection />
            )}

            {activeSection === "usage" && (
              <UsageSection />
            )}

            {activeSection === "integrations" && (
              <IntegrationsSection />
            )}

            {activeSection === "barbershop" && (
              <BarbershopSection appUrl={appUrl} />
            )}

            {activeSection === "support" && (
              <SupportSection />
            )}

            {activeSection === "account" && (
              <AccountSection />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function DashboardSection({ appUrl }: { appUrl: string }) {
  const { subscription, slug, barbershopName } = mockClientPortalData;

  return (
    <section className="space-y-5">
      <header>
        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          Visão geral
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumo rápido da sua assinatura no TRIVOR, status da conta e acesso ao app da barbearia.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Plano atual
          </p>
          <p className="mt-2 text-base font-semibold text-foreground">
            {subscription.planName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(subscription.amount, subscription.currency)}{" "}
            <span className="text-xs text-muted-foreground">
              / {subscription.billingInterval.toLowerCase()}
            </span>
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Renovação em{" "}
            <span className="font-medium">
              {new Date(subscription.renewalDate).toLocaleDateString("pt-BR")}
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Status da assinatura
          </p>
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-300">
            • Assinatura ativa
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Cobranças em dia. Caso precise alterar plano, esta área já está preparada para
            upgrades, downgrades e cancelamentos futuros.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm md:col-span-2 xl:col-span-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Acesso rápido
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            App da barbearia e URL pública prontos para uso com o slug configurado.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Slug da barbearia:
            {" "}
            <span className="font-mono text-[11px] text-foreground">
              {slug}
            </span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={appUrl}
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Acessar app da barbearia
            </Link>
            <button
              type="button"
              className="inline-flex flex-[0.9] items-center justify-center rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
            >
              Copiar URL pública
            </button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Quando conectado ao backend real, esta área pode exibir também links de instalação,
            QR Code e atalhos administrativos.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Próxima cobrança
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {new Date(subscription.renewalDate).toLocaleDateString("pt-BR")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            A cobrança será feita automaticamente no método de pagamento cadastrado.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Última fatura
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {new Date(mockClientPortalData.invoices[0].date).toLocaleDateString("pt-BR")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatCurrency(
              mockClientPortalData.invoices[0].amount,
              mockClientPortalData.subscription.currency,
            )}{" "}
            —{" "}
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              Paga
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Conta da barbearia
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {barbershopName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Admin principal com acesso já provisionado via painel do TRIVOR.
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionShell(props: { title: string; description: string; children: React.ReactNode }) {
  const { title, description, children } = props;

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SubscriptionSection() {
  const { subscription } = mockClientPortalData;

  return (
    <SectionShell
      title="Assinatura"
      description="Detalhes do seu plano TRIVOR, status da assinatura e estrutura preparada para upgrades, downgrades e cancelamentos."
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm md:p-5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Plano atual
          </p>
          <p className="mt-2 text-base font-semibold text-foreground">
            {subscription.planName}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatCurrency(subscription.amount, subscription.currency)}{" "}
            <span className="text-xs text-muted-foreground">
              / {subscription.billingInterval.toLowerCase()}
            </span>
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium text-emerald-600 dark:text-emerald-400">
                {getSubscriptionStatusLabel(subscription.status)}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-muted-foreground">Próxima renovação</dt>
              <dd className="font-medium">
                {new Date(subscription.renewalDate).toLocaleDateString("pt-BR")}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-muted-foreground">Tipo</dt>
              <dd className="font-medium">{subscription.billingInterval}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-muted-foreground">Moeda</dt>
              <dd className="font-medium">{subscription.currency}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/60 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Gestão de plano em breve</p>
            <p className="mt-1">
              Esta área já está preparada para permitir ações como upgrade, downgrade, pausa de
              cobrança e cancelamento direto pelo cliente TRIVOR, assim que o backend de cobrança
              estiver conectado.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Ações da assinatura
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary/90 px-3 text-xs font-semibold text-primary-foreground shadow-sm opacity-60"
                disabled
              >
                Upgrade de plano (em breve)
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground opacity-60"
                disabled
              >
                Downgrade / alterar plano
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/5 px-3 text-xs font-semibold text-amber-600 opacity-60 dark:text-amber-400"
                disabled
              >
                Pausar cobrança
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-red-500/40 bg-red-500/5 px-3 text-xs font-semibold text-red-600 opacity-60 dark:text-red-400"
                disabled
              >
                Cancelar assinatura
              </button>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Os botões acima são apenas interface neste momento. Assim que a lógica de cobrança
              estiver integrada (Stripe, Asaas, etc.), os fluxos de alteração de plano serão
              conectados aqui.
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function InvoicesSection() {
  const { invoices, subscription } = mockClientPortalData;

  return (
    <SectionShell
      title="Faturas e cobranças"
      description="Histórico de cobranças da sua assinatura TRIVOR. Estruturado para receber faturas em tempo real do gateway de pagamento."
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 text-xs text-muted-foreground sm:px-5">
          <p>
            Mostrando{" "}
            <span className="font-medium text-foreground">
              {invoices.length} faturas recentes
            </span>
          </p>
          <p className="hidden sm:block">
            Valores em{" "}
            <span className="font-medium">{subscription.currency}</span>
          </p>
        </div>

        <div className="divide-y divide-border/80 text-xs sm:text-sm">
          <div className="grid grid-cols-3 gap-2 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:grid-cols-[1.5fr,1.2fr,1fr,1fr] sm:px-5">
            <span>Data</span>
            <span>Valor</span>
            <span className="hidden text-center sm:inline">Status</span>
            <span className="text-right">Ações</span>
          </div>

          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="grid grid-cols-3 items-center gap-2 px-4 py-3 sm:grid-cols-[1.5fr,1.2fr,1fr,1fr] sm:px-5"
            >
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  {new Date(invoice.date).toLocaleDateString("pt-BR")}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Fatura #{invoice.id.slice(-4)}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">
                  {formatCurrency(invoice.amount, subscription.currency)}
                </span>
              </div>
              <div className="hidden justify-center sm:flex">
                <span
                  className={[
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                    getInvoiceStatusBadgeClasses(invoice.status),
                  ].join(" ")}
                >
                  {invoice.status === "paid"
                    ? "Paga"
                    : invoice.status === "overdue"
                      ? "Em atraso"
                      : "Pendente"}
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-muted/70 px-3 text-[11px] font-semibold text-foreground opacity-80"
                  disabled
                >
                  Ver fatura
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Quando a integração de cobrança estiver ativa, essa tabela pode mostrar links reais para
        segunda via, nota fiscal, boletos e botões de pagamento quando houver faturas pendentes.
      </p>
    </SectionShell>
  );
}

function UsageSection() {
  const { usage } = mockClientPortalData;
  const usagePercentage = Math.min(
    100,
    Math.round((usage.whatsappMessagesThisMonth / usage.whatsappMessagesLimit) * 100),
  );

  return (
    <SectionShell
      title="Consumo e limites"
      description="Acompanhe o consumo de mensagens WhatsApp e recursos do seu plano TRIVOR. Área pronta para métricas em tempo real."
    >
      <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm md:p-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Consumo de WhatsApp (exemplo)
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Mensagens no mês</span>
            <span className="font-medium text-foreground">
              {usage.whatsappMessagesThisMonth} / {usage.whatsappMessagesLimit}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Estes dados são ilustrativos. Quando a integração de mensagens estiver conectada, o
            gráfico acima refletirá o consumo real da sua barbearia.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Recursos do plano
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {usage.planFeatures.map((feature) => (
              <li key={feature} className="flex gap-2">
                <span className="mt-0.5 text-base leading-none text-primary">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/60 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Métricas avançadas em breve</p>
          <p className="mt-1">
            Esta seção está pronta para receber dashboards de consumo mais avançados: mensagens por
            funcionário, canais, limites de disparo, alertas de quase estouro de franquia e muito
            mais.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

function IntegrationsSection() {
  const { integrations } = mockClientPortalData;

  const whatsappStatus = integrations.whatsapp.status;

  return (
    <SectionShell
      title="Integrações"
      description="Gerencie as integrações da sua barbearia com WhatsApp Business e outros canais conectados ao TRIVOR."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                WhatsApp Business
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                Integração oficial
              </p>
            </div>
            <span
              className={[
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1",
                whatsappStatus === "connected"
                  ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
                  : whatsappStatus === "not_connected"
                    ? "bg-amber-500/10 text-amber-600 ring-amber-500/20"
                    : "bg-muted text-muted-foreground ring-border/60",
              ].join(" ")}
            >
              {whatsappStatus === "connected"
                ? "Conectado"
                : whatsappStatus === "not_connected"
                  ? "Não conectado"
                  : "Em breve"}
            </span>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Configure o número oficial da barbearia para notificações automáticas de agendamentos,
            lembretes e mensagens transacionais via WhatsApp.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm opacity-60"
              disabled
            >
              Conectar WhatsApp (em breve)
            </button>
            <button
              type="button"
              className="inline-flex h-9 flex-[0.9] items-center justify-center rounded-lg border border-border bg-card px-3 text-xs font-semibold text-foreground opacity-60"
              disabled
            >
              Configurações avançadas
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/60 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Outras integrações</p>
          <p className="mt-1">
            Esta área está preparada para receber futuras integrações como gateways de pagamento,
            plataformas de CRM, ferramentas de marketing e muito mais, mantendo tudo centralizado
            no portal do cliente TRIVOR.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

function BarbershopSection({ appUrl }: { appUrl: string }) {
  const { barbershopName, slug } = mockClientPortalData;

  return (
    <SectionShell
      title="Barbearia"
      description="Informações da barbearia conectada à sua assinatura TRIVOR: slug, links de acesso e status da conta."
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm md:p-5">
          <dl className="grid gap-4 text-sm md:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground">Nome da barbearia</dt>
              <dd className="text-base font-semibold text-foreground">
                {barbershopName}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground">Slug / identificador</dt>
              <dd className="font-mono text-xs text-foreground">
                {slug}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground">Status da conta</dt>
              <dd className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Conta ativa
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground">Admin principal</dt>
              <dd className="text-sm font-medium">
                {mockClientPortalData.account.ownerName}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-[11px] text-muted-foreground">
            A criação do slug e do admin principal já é feita automaticamente pelo painel TRIVOR.
            Esta interface apenas consolida e apresenta essas informações para o assinante.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Acesso ao app
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Use o link abaixo para abrir o app multi-tenant da barbearia em uma nova aba. Essa
            navegação leva para o app da barbearia, não para a área do cliente TRIVOR.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href={appUrl}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Abrir app da barbearia
            </Link>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-muted/60 px-4 text-[11px] font-semibold text-foreground opacity-80"
              disabled
            >
              Copiar link de instalação (em breve)
            </button>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function SupportSection() {
  return (
    <SectionShell
      title="Suporte"
      description="Canais de suporte e orientação rápida para o cliente TRIVOR, dono da barbearia."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Fale com o suporte TRIVOR
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Central de atendimento exclusiva para donos de barbearia que utilizam o TRIVOR. Tire
            dúvidas sobre cobrança, configurações da barbearia e integrações.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm opacity-80"
            >
              Entrar em contato
            </button>
            <button
              type="button"
              className="inline-flex h-10 flex-[0.9] items-center justify-center rounded-xl border border-border bg-card px-4 text-[11px] font-semibold text-foreground opacity-80"
            >
              Enviar e-mail para suporte
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/60 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Central de ajuda (futuro)</p>
          <p className="mt-1">
            Aqui você poderá acessar artigos, passo a passos e vídeos explicando as principais
            funcionalidades do TRIVOR. A estrutura já está pensada para uma base de conhecimento
            completa.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

function AccountSection() {
  const { account } = mockClientPortalData;

  return (
    <SectionShell
      title="Dados da conta"
      description="Informações do responsável pela assinatura TRIVOR. Use estes dados para identificar o dono da barbearia no portal."
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr),minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm md:p-5">
          <dl className="grid gap-4 text-sm md:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground">Nome do responsável</dt>
              <dd className="text-base font-semibold text-foreground">
                {account.ownerName}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground">E-mail</dt>
              <dd className="text-sm font-medium">{account.email}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs text-muted-foreground">Telefone</dt>
              <dd className="text-sm font-medium">{account.phone}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/60 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Gestão de conta em breve</p>
          <p className="mt-1">
            No futuro, esta seção poderá incluir troca de e-mail de login, alteração de telefone,
            ajustes de notificações e gerenciamento de acessos adicionais ao portal do cliente
            TRIVOR.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}

