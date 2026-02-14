import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Converte BigInt em string caso algum objeto acabe indo pro JSON.
 * (Mesmo que aqui a gente retorne só { status }, fica como proteção.)
 */
function jsonSafe<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_k, v) => (typeof v === "bigint" ? v.toString() : v))
  );
}

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const barbershop = await prisma.barbershop.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!barbershop) {
      return NextResponse.json(
        { error: "Barbearia não encontrada." },
        { status: 404 }
      );
    }

    const newStatus = barbershop.status === "active" ? "inactive" : "active";

    await prisma.barbershop.update({
      where: { id },
      data: { status: newStatus },
      select: { id: true }, // evita retornar objeto grande/BigInt por acidente
    });

    return NextResponse.json(jsonSafe({ ok: true, status: newStatus }));
  } catch (err) {
    console.error("PATCH /api/barbershops/[id]/status failed:", err);
    return NextResponse.json(
      { error: "Erro interno ao atualizar status." },
      { status: 500 }
    );
  }
}