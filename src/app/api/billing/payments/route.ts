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
    const barbershopId = searchParams.get("barbershopId");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "100", 10), 500);

    const where: { barbershopId?: string } = {};
    if (barbershopId) where.barbershopId = barbershopId;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        barbershop: { select: { id: true, name: true, slug: true } },
        invoice: { select: { id: true, periodStart: true, periodEnd: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(jsonSafe(payments));
  } catch (err) {
    console.error("GET /api/billing/payments failed:", err);
    return NextResponse.json(
      { error: "Erro ao buscar pagamentos." },
      { status: 500 }
    );
  }
}
