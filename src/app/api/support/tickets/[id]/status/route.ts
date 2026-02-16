import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const VALID_STATUS = [
  "open",
  "in_progress",
  "waiting_customer",
  "closed",
] as const;
const VALID_PRIORITY = ["low", "medium", "high", "urgent"] as const;

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
    const status = body?.status;
    const priority = body?.priority;

    const updateData: { status?: string; priority?: string } = {};
    if (status && VALID_STATUS.includes(status)) {
      updateData.status = status;
    }
    if (priority && VALID_PRIORITY.includes(priority)) {
      updateData.priority = priority;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Informe status ou priority válido." },
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

    const updated = await prisma.ticket.update({
      where: { id },
      data: updateData,
      include: {
        barbershop: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json({
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error("POST /api/support/tickets/[id]/status failed:", err);
    return NextResponse.json(
      { error: "Erro ao atualizar ticket." },
      { status: 500 }
    );
  }
}
