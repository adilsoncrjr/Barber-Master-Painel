import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const q = searchParams.get("q")?.trim();

    const where: {
      status?: string;
      priority?: string;
      barbershop?: { name?: { contains: string; mode: "insensitive" } };
    } = {};

    if (
      status &&
      ["open", "in_progress", "waiting_customer", "closed"].includes(status)
    ) {
      where.status = status;
    }
    if (
      priority &&
      ["low", "medium", "high", "urgent"].includes(priority)
    ) {
      where.priority = priority;
    }
    if (q) {
      where.barbershop = { name: { contains: q, mode: "insensitive" } };
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        barbershop: {
          select: { id: true, name: true, slug: true },
        },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    const serialized = tickets.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));

    return NextResponse.json(serialized);
  } catch (err) {
    console.error("GET /api/support/tickets failed:", err);
    return NextResponse.json(
      { error: "Erro ao buscar tickets." },
      { status: 500 }
    );
  }
}
