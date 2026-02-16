import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsCharts } from "./reports-charts";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  let kpis;
  let monthlyData: Array<{
    month: string;
    year: number;
    mrr: number;
    newBarbershops: number;
    cancelled: number;
  }> = [];
  let error: string | null = null;

  try {
    const [
      activeBarbershops,
      newThisMonth,
      cancelledThisMonth,
      activeAtStartOfMonth,
      mrrResult,
    ] = await Promise.all([
      prisma.barbershop.count({
        where: { deletedAt: null, status: "active" },
      }),
      prisma.barbershop.count({
        where: {
          deletedAt: null,
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.barbershop.count({
        where: {
          status: "cancelled",
          updatedAt: { gte: startOfMonth },
        },
      }),
      prisma.barbershop.count({
        where: {
          deletedAt: null,
          status: "active",
          createdAt: { lt: startOfMonth },
        },
      }),
      prisma.invoice.aggregate({
        where: {
          status: "paid",
          paidAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
    ]);

    const mrr = Number(mrrResult._sum.amount ?? 0);
    const churnRate =
      activeAtStartOfMonth > 0
        ? ((cancelledThisMonth / activeAtStartOfMonth) * 100).toFixed(1)
        : "0";

    kpis = {
      activeBarbershops,
      newThisMonth,
      cancelledThisMonth,
      churnRate: String(churnRate),
      mrr,
    };

    const monthNames = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ];

    for (let i = 0; i < 6; i++) {
      const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      if (d > now) break;

      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);

      const [mrrAgg, newAgg, cancelAgg] = await Promise.all([
        prisma.invoice.aggregate({
          where: {
            status: "paid",
            paidAt: { gte: monthStart, lte: monthEnd },
          },
          _sum: { amount: true },
        }),
        prisma.barbershop.count({
          where: {
            deletedAt: null,
            createdAt: { gte: monthStart, lte: monthEnd },
          },
        }),
        prisma.barbershop.count({
          where: {
            status: "cancelled",
            updatedAt: { gte: monthStart, lte: monthEnd },
          },
        }),
      ]);

      monthlyData.push({
        month: monthNames[d.getMonth()],
        year: d.getFullYear(),
        mrr: Number(mrrAgg._sum.amount ?? 0),
        newBarbershops: newAgg,
        cancelled: cancelAgg,
      });
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Erro ao carregar relatórios.";
    kpis = {
      activeBarbershops: 0,
      newThisMonth: 0,
      cancelledThisMonth: 0,
      churnRate: "0",
      mrr: 0,
    };
  }

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Relatórios SaaS"
        description="KPIs, MRR, churn, barbearias ativas e gráficos dos últimos 6 meses."
      />

      {error && (
        <Card className="rounded-xl border border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Barbearias ativas"
          value={kpis?.activeBarbershops ?? 0}
        />
        <StatCard
          title="Novas no mês"
          value={kpis?.newThisMonth ?? 0}
        />
        <StatCard
          title="Canceladas no mês"
          value={kpis?.cancelledThisMonth ?? 0}
        />
        <StatCard
          title="Churn rate (%)"
          value={`${kpis?.churnRate ?? "0"}%`}
          hint="Canceladas / ativas no início do mês"
        />
        <StatCard
          title={
            <span
              className="cursor-help"
              title="MRR = somatório das faturas pagas no mês corrente"
            >
              MRR
            </span>
          }
          value={formatCurrency(kpis?.mrr ?? 0)}
        />
      </div>

      <Card className="overflow-hidden rounded-xl border shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-lg">Gráficos - Últimos 6 meses</CardTitle>
          <p className="text-muted-foreground text-sm">
            MRR mensal, novas barbearias e cancelamentos.
          </p>
        </CardHeader>
        <CardContent>
          <ReportsCharts monthlyData={monthlyData} />
        </CardContent>
      </Card>
    </div>
  );
}
