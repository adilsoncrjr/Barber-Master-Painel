import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { BillingFilters } from "./billing-filters";
import { BillingInvoicesTable } from "./billing-invoices-table";
import { CreditCard, Receipt } from "lucide-react";

export const dynamic = "force-dynamic";

async function getBillingData(searchParams: {
  q?: string;
  status?: string;
}) {
  const { q, status } = searchParams;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const where: {
    status?: string;
    barbershop?: { name?: { contains: string; mode: "insensitive" } };
  } = {};
  if (status && ["open", "paid", "overdue", "canceled"].includes(status)) {
    where.status = status;
  }
  if (q?.trim()) {
    where.barbershop = { name: { contains: q.trim(), mode: "insensitive" } };
  }

  const [
    mrrResult,
    monthRevenueResult,
    overdueResult,
    monthPaymentsResult,
    invoices,
    payments,
  ] = await Promise.all([
    prisma.invoice.aggregate({
      where: {
        status: "paid",
        paidAt: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: {
        status: "paid",
        paidAt: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { status: "overdue" },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        status: "completed",
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.invoice.findMany({
      where,
      include: {
        barbershop: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { dueDate: "desc" },
      take: 100,
    }),
    prisma.payment.findMany({
      include: {
        barbershop: { select: { id: true, name: true, slug: true } },
        invoice: { select: { id: true, periodStart: true, periodEnd: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const mrr = Number(mrrResult._sum.amount ?? 0);
  const monthRevenue = Number(monthRevenueResult._sum.amount ?? 0);
  const overdueTotal = Number(overdueResult._sum.amount ?? 0);
  const monthPaymentsAmount = Number(monthPaymentsResult._sum.amount ?? 0);
  const monthPaymentsCount = monthPaymentsResult._count ?? 0;

  const invoicesSerialized = invoices.map((i) => ({
    ...i,
    amount: Number(i.amount),
    dueDate: i.dueDate.toISOString(),
    paidAt: i.paidAt?.toISOString() ?? null,
    periodStart: i.periodStart.toISOString(),
    periodEnd: i.periodEnd.toISOString(),
    createdAt: i.createdAt.toISOString(),
  }));

  const paymentsSerialized = payments.map((p) => ({
    ...p,
    amount: Number(p.amount),
    createdAt: p.createdAt.toISOString(),
    invoice: p.invoice
      ? {
          ...p.invoice,
          periodStart: p.invoice.periodStart.toISOString(),
          periodEnd: p.invoice.periodEnd.toISOString(),
        }
      : null,
  }));

  return {
    kpis: {
      mrr,
      monthRevenue,
      overdueTotal,
      monthPaymentsAmount,
      monthPaymentsCount,
    },
    invoices: invoicesSerialized,
    payments: paymentsSerialized,
  };
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  let data;
  let error: string | null = null;
  try {
    data = await getBillingData(await searchParams);
  } catch (e) {
    error = e instanceof Error ? e.message : "Erro ao carregar dados.";
    data = null;
  }

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Billing"
          description="MRR, faturamento, inadimplência e histórico de pagamentos."
        />
        <Card className="rounded-xl border border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Verifique se as tabelas invoices e payments existem no banco
              (execute a migration) e se o Prisma client está atualizado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const { kpis, invoices, payments } = data;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        description="MRR, faturamento, inadimplência e histórico de pagamentos."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={
            <span
              className="cursor-help"
              title="MRR = somatório das faturas pagas no mês corrente (definição prática)"
            >
              MRR (mês atual)
            </span>
          }
          value={formatCurrency(kpis.mrr)}
          hint="Soma das faturas pagas no mês"
        />
        <StatCard
          title="Receita do mês"
          value={formatCurrency(kpis.monthRevenue)}
          hint="Faturas pagas no mês"
        />
        <StatCard
          title="Inadimplência total"
          value={formatCurrency(kpis.overdueTotal)}
          hint="Faturas vencidas"
        />
        <StatCard
          title="Pagamentos (mês)"
          value={`${kpis.monthPaymentsCount} (${formatCurrency(kpis.monthPaymentsAmount)})`}
          hint="Transações recebidas"
        />
      </div>

      <Card className="overflow-hidden rounded-xl border shadow-[var(--shadow-card)]">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Faturas</CardTitle>
          <Suspense
            fallback={
              <div className="h-10 w-full max-w-md animate-pulse rounded bg-muted" />
            }
          >
            <BillingFilters />
          </Suspense>
        </CardHeader>
        <CardContent>
          <BillingInvoicesTable invoices={invoices} />
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-xl border shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-lg">Pagamentos recentes</CardTitle>
          <p className="text-muted-foreground text-sm">
            Últimos 50 pagamentos registrados.
          </p>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <EmptyState
              icon={<Receipt className="h-12 w-12" />}
              title="Nenhum pagamento"
              description="Os pagamentos aparecerão aqui quando forem registrados."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 border-b bg-muted/40">
                  <tr>
                    <th className="p-4 text-left font-medium text-muted-foreground">
                      Barbearia
                    </th>
                    <th className="p-4 text-left font-medium text-muted-foreground">
                      Valor
                    </th>
                    <th className="p-4 text-left font-medium text-muted-foreground">
                      Método
                    </th>
                    <th className="p-4 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="p-4 text-left font-medium text-muted-foreground">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t transition-colors hover:bg-muted/30"
                    >
                      <td className="p-4 font-medium">
                        <Link
                          href={`/barbershops/${p.barbershop.id}`}
                          className="text-primary hover:underline"
                        >
                          {p.barbershop.name}
                        </Link>
                      </td>
                      <td className="p-4 tabular-nums">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="p-4 capitalize">{p.method}</td>
                      <td className="p-4 capitalize">{p.status}</td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
