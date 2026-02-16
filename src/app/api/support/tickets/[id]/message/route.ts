import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
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

    const body = await request.json().catch(() => ({}));
    const message = String(body?.message ?? "").trim();
    if (!message) {
      return NextResponse.json(
        { error: "Mensagem obrigatória." },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket não encontrado." },
        { status: 404 }
      );
    }

    const created = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        authorType: "HUB",
        message,
      },
    });

    await prisma.ticket.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      ...created,
      createdAt: created.createdAt.toISOString(),
    });
  } catch (err) {
    console.error("POST /api/support/tickets/[id]/message failed:", err);
    return NextResponse.json(
      { error: "Erro ao enviar mensagem." },
      { status: 500 }
    );
  }
}
