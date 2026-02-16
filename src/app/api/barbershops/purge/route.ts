import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * POST /api/barbershops/purge
 * Exclusão total (purge): remove barbearia e todos os dados vinculados.
 * Body: { id: string, slug: string } — slug para confirmação.
 * Rota alternativa a /api/barbershops/[id]/purge para evitar 404 em rotas aninhadas.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return jsonError("Não autorizado.", 401);

  let body: { id?: string; slug?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Body JSON inválido.", 400);
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!id) return jsonError("ID da barbearia é obrigatório.", 400);

  const prisma = getPrisma();
  const barbershop = await prisma.barbershop.findUnique({
    where: { id },
    select: { id: true, slug: true, name: true },
  });

  if (!barbershop) return jsonError("Barbearia não encontrada.", 404);

  const confirmedSlug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  if (confirmedSlug !== barbershop.slug) {
    return jsonError("Slug de confirmação não confere. Digite o slug exato da barbearia.", 400);
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.deleteMany({ where: { barbershopId: id } });
      await tx.barbershop.delete({ where: { id } });
    });
  } catch (err) {
    console.error("Purge barbershop failed:", err);
    return jsonError("Erro ao excluir barbearia e dados vinculados.", 500);
  }

  return NextResponse.json({ ok: true, message: "Barbearia excluída permanentemente." });
}
