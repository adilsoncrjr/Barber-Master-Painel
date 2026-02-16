import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
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

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        barbershop: {
          select: { id: true, name: true, slug: true },
        },
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket não encontrado." },
        { status: 404 }
      );
    }

    const serialized = {
      ...ticket,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      messages: ticket.messages.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(serialized);
  } catch (err) {
    console.error("GET /api/support/tickets/[id] failed:", err);
    return NextResponse.json(
      { error: "Erro ao buscar ticket." },
      { status: 500 }
    );
  }
}
