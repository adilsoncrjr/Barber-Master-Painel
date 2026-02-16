import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function jsonSafe<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, v) => {
      if (typeof v === "bigint") return v.toString();
      if (v != null && typeof v === "object" && "toNumber" in v)
        return Number((v as { toNumber: () => number }).toNumber());
      return v;
    })
  );
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q")?.trim();
    const periodStart = searchParams.get("periodStart");
    const periodEnd = searchParams.get("periodEnd");

    const where: {
      status?: string;
      barbershop?: { name?: { contains: string; mode: "insensitive" } };
      dueDate?: { gte?: Date; lte?: Date };
    } = {};

    if (status && ["open", "paid", "overdue", "canceled"].includes(status)) {
      where.status = status;
    }
    if (q) {
      where.barbershop = { name: { contains: q, mode: "insensitive" } };
    }
    if (periodStart || periodEnd) {
      where.dueDate = {};
      if (periodStart) where.dueDate.gte = new Date(periodStart);
      if (periodEnd) where.dueDate.lte = new Date(periodEnd);
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        barbershop: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { dueDate: "desc" },
    });

    return NextResponse.json(jsonSafe(invoices));
  } catch (err) {
    console.error("GET /api/billing/invoices failed:", err);
    return NextResponse.json(
      { error: "Erro ao buscar faturas." },
      { status: 500 }
    );
  }
}
