import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * KPIs de billing.
 * MRR = somatório das invoices pagas no mês corrente (definição prática).
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const [
      mrrResult,
      monthRevenueResult,
      overdueResult,
      monthPaymentsResult,
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
        where: {
          status: "overdue",
        },
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
    ]);

    const mrr = Number(mrrResult._sum.amount ?? 0);
    const monthRevenue = Number(monthRevenueResult._sum.amount ?? 0);
    const overdueTotal = Number(overdueResult._sum.amount ?? 0);
    const monthPaymentsAmount = Number(monthPaymentsResult._sum.amount ?? 0);
    const monthPaymentsCount = monthPaymentsResult._count ?? 0;

    return NextResponse.json({
      mrr,
      monthRevenue,
      overdueTotal,
      monthPaymentsAmount,
      monthPaymentsCount,
    });
  } catch (err) {
    console.error("GET /api/billing/kpis failed:", err);
    return NextResponse.json(
      { error: "Erro ao buscar KPIs." },
      { status: 500 }
    );
  }
}
