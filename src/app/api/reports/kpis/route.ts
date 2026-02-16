import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * KPIs agregados para Relatórios SaaS.
 * range: 6m = últimos 6 meses
 */
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") ?? "6m";

    const now = new Date();
    const months = range === "6m" ? 6 : 6;

    const startDate = new Date(now.getFullYear(), now.getMonth() - months, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      activeBarbershops,
      newThisMonth,
      cancelledThisMonth,
      activeAtStartOfMonth,
      mrrResult,
      monthlyData,
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
          paidAt: { gte: startOfMonth, lte: endDate },
        },
        _sum: { amount: true },
      }),
      getMonthlyAggregates(startDate, endDate),
    ]);

    const mrr = Number(mrrResult._sum.amount ?? 0);
    const churnRate =
      activeAtStartOfMonth > 0
        ? ((cancelledThisMonth / activeAtStartOfMonth) * 100).toFixed(1)
        : "0";

    return NextResponse.json({
      activeBarbershops,
      newThisMonth,
      cancelledThisMonth,
      churnRate: String(churnRate),
      mrr,
      monthly: monthlyData,
    });
  } catch (err) {
    console.error("GET /api/reports/kpis failed:", err);
    return NextResponse.json(
      { error: "Erro ao buscar KPIs." },
      { status: 500 }
    );
  }
}

async function getMonthlyAggregates(
  start: Date,
  end: Date
): Promise<
  Array<{
    month: string;
    year: number;
    mrr: number;
    newBarbershops: number;
    cancelled: number;
  }>
> {
  const result: Array<{
    month: string;
    year: number;
    mrr: number;
    newBarbershops: number;
    cancelled: number;
  }> = [];

  const monthNames = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];

  for (let i = 0; i < 6; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    if (d > end) break;

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

    result.push({
      month: monthNames[d.getMonth()],
      year: d.getFullYear(),
      mrr: Number(mrrAgg._sum.amount ?? 0),
      newBarbershops: newAgg,
      cancelled: cancelAgg,
    });
  }

  return result;
}
