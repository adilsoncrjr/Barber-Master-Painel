import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** GET não permitido; evita 404 ao acessar a URL por engano. */
export async function GET() {
  return NextResponse.json(
    { error: "Use POST para excluir (purge)." },
    { status: 405, headers: { Allow: "POST" } }
  );
}

/**
 * POST /api/barbershops/[id]/purge
 * Exclusão total (purge): remove barbearia e todos os dados vinculados.
 * Ordem: users (FK para barbershop) -> barbershop.
 * Requer confirmação no client (slug digitado).
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return jsonError("Não autorizado.", 401);

  const { id } = await params;
  if (!id) return jsonError("ID inválido.", 400);

  let body: { slug?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Body JSON inválido.", 400);
  }

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
