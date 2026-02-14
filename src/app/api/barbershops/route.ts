import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { slugFromName } from "@/lib/slug";

/** Encontra um slug disponível: se o base já existir, tenta base-2, base-3, ... */
async function findAvailableSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let n = 1;
  while (true) {
    const existing = await prisma.barbershop.findUnique({ where: { slug } });
    if (!existing) return slug;
    n += 1;
    slug = `${baseSlug}-${n}`;
  }
}

function isPrismaError(e: unknown): e is { code?: string; meta?: unknown; message?: string } {
  return typeof e === "object" && e !== null && "message" in e;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    let slugInput = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const status = body.status === "inactive" ? "inactive" : "active";
    const plan = ["trial", "start", "pro"].includes(body.plan) ? body.plan : "trial";
    const adminName = typeof body.adminName === "string" ? body.adminName.trim() : "";
    const adminPhone = typeof body.adminPhone === "string" ? body.adminPhone.trim().replace(/\D/g, "") : "";
    const adminPassword = typeof body.adminPassword === "string" ? body.adminPassword : "";

    if (!name) {
      return NextResponse.json({ error: "Nome da barbearia é obrigatório." }, { status: 400 });
    }
    const baseSlug = slugInput || slugFromName(name);
    if (!baseSlug) {
      return NextResponse.json({ error: "Não foi possível gerar um slug a partir do nome." }, { status: 400 });
    }
    if (!/^[a-z0-9-]+$/.test(baseSlug)) {
      return NextResponse.json({ error: "Slug inválido. Use apenas letras minúsculas, números e hífens." }, { status: 400 });
    }
    if (!adminName) {
      return NextResponse.json({ error: "Nome do admin é obrigatório." }, { status: 400 });
    }
    if (!adminPhone) {
      return NextResponse.json({ error: "Telefone do admin é obrigatório." }, { status: 400 });
    }
    if (!adminPassword || adminPassword.length < 6) {
      return NextResponse.json({ error: "Senha do admin deve ter no mínimo 6 caracteres." }, { status: 400 });
    }

    const slug = await findAvailableSlug(baseSlug);

    const passwordHash = await hashPassword(adminPassword);

    const barbershop = await prisma.barbershop.create({
      data: {
        name,
        slug,
        status,
        plan,
        users: {
          create: {
            role: "admin",
            name: adminName,
            phone: adminPhone,
            passwordHash,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        id: barbershop.id,
        name: barbershop.name,
        slug: barbershop.slug,
        status: barbershop.status,
        plan: barbershop.plan,
        createdAt: barbershop.createdAt,
      },
      { status: 201 }
    );
  } catch (e) {
    if (isPrismaError(e) && e.code === "P2002") {
      return NextResponse.json(
        { error: "Já existe uma barbearia com este slug.", code: e.code, target: e.meta },
        { status: 409 }
      );
    }

    const message = isPrismaError(e) ? e.message : e instanceof Error ? e.message : "Erro desconhecido";
    const code = isPrismaError(e) ? e.code : undefined;
    const meta = isPrismaError(e) ? e.meta : undefined;

    console.error("[POST /api/barbershops]", { message, code, meta, error: e });

    return NextResponse.json(
      {
        error: "Erro ao criar barbearia.",
        details: message,
        ...(code && { code }),
        ...(meta && { meta }),
      },
      { status: 500 }
    );
  }
}
