import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_VALUES = ["active", "inactive", "suspended", "cancelled"] as const;
const PLAN_VALUES = ["free", "trial", "basic", "start", "pro", "enterprise"] as const;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** GET /api/barbershops/[id] - retorna uma barbearia (para edição/consulta). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return jsonError("Não autorizado.", 401);

  const { id } = await params;
  if (!id) return jsonError("ID inválido.", 400);

  const prisma = getPrisma();
  const barbershop = await prisma.barbershop.findFirst({
    where: { id, deletedAt: null },
    include: { _count: { select: { users: true } } },
  });
  if (!barbershop) return jsonError("Barbearia não encontrada.", 404);

  return NextResponse.json({
    ...barbershop,
    totalBilled: barbershop.totalBilled != null ? Number(barbershop.totalBilled) : null,
  });
}

/** PATCH /api/barbershops/[id] - atualiza barbearia (nome, slug, status, plano, observações, soft delete). */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return jsonError("Não autorizado.", 401);

  const { id } = await params;
  if (!id) return jsonError("ID inválido.", 400);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError("Body JSON inválido.", 400);
  }

  const prisma = getPrisma();
  const existing = await prisma.barbershop.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Barbearia não encontrada.", 404);

  const updates: {
    name?: string;
    slug?: string;
    status?: string;
    plan?: string;
    internalNotes?: string | null;
    deletedAt?: Date | null;
    lastBillingAt?: Date | null;
    totalBilled?: { set: number } | null;
  } = {};

  if (typeof body.name === "string" && body.name.trim()) updates.name = body.name.trim();
  if (typeof body.slug === "string" && body.slug.trim()) {
    const slug = body.slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(slug)) return jsonError("Slug inválido.");
    const other = await prisma.barbershop.findFirst({
      where: { slug, id: { not: id }, deletedAt: null },
    });
    if (other) return jsonError("Slug já em uso.", 409);
    updates.slug = slug;
  }
  if (typeof body.status === "string" && STATUS_VALUES.includes(body.status as any))
    updates.status = body.status;
  if (typeof body.plan === "string" && PLAN_VALUES.includes(body.plan as any))
    updates.plan = body.plan;
  if ("internalNotes" in body)
    updates.internalNotes = typeof body.internalNotes === "string" ? body.internalNotes : null;
  if (body.softDelete === true) updates.deletedAt = new Date();
  if (body.restore === true) updates.deletedAt = null;
  if (body.lastBillingAt != null)
    updates.lastBillingAt = body.lastBillingAt ? new Date(body.lastBillingAt as string) : null;
  if (typeof body.totalBilled === "number") updates.totalBilled = { set: body.totalBilled };

  if (Object.keys(updates).length === 0)
    return NextResponse.json(existing);

  const updated = await prisma.barbershop.update({
    where: { id },
    data: updates,
  });

  return NextResponse.json({
    ...updated,
    totalBilled: updated.totalBilled != null ? Number(updated.totalBilled) : null,
  });
}
