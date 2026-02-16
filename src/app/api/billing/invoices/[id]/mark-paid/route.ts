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

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { barbershop: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Fatura não encontrada." }, { status: 404 });
    }

    if (invoice.status === "paid") {
      return NextResponse.json(
        { error: "Fatura já está paga." },
        { status: 400 }
      );
    }

    if (invoice.status === "canceled") {
      return NextResponse.json(
        { error: "Não é possível marcar fatura cancelada como paga." },
        { status: 400 }
      );
    }

    const now = new Date();

    await prisma.$transaction([
      prisma.invoice.update({
        where: { id },
        data: { status: "paid", paidAt: now },
      }),
      prisma.payment.create({
        data: {
          barbershopId: invoice.barbershopId,
          invoiceId: invoice.id,
          amount: invoice.amount,
          method: "manual",
          status: "completed",
        },
      }),
      prisma.barbershop.update({
        where: { id: invoice.barbershopId },
        data: {
          lastBillingAt: now,
          totalBilled: { increment: invoice.amount },
        },
      }),
    ]);

    const updated = await prisma.invoice.findUnique({
      where: { id },
      include: { barbershop: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json(jsonSafe(updated));
  } catch (err) {
    console.error("POST /api/billing/invoices/[id]/mark-paid failed:", err);
    return NextResponse.json(
      { error: "Erro ao marcar fatura como paga." },
      { status: 500 }
    );
  }
}
