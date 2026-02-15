import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { slugFromName } from "@/lib/slug";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { barbershops, appUsers } from "@/shared/schema-saas";
import { eq } from "drizzle-orm";

export const revalidate = 0;

// conexão drizzle
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const db = drizzle(pool);

// gerar slug único
async function findAvailableSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let n = 1;

  while (true) {
    const existing = await db
      .select()
      .from(barbershops)
      .where(eq(barbershops.slug, slug))
      .limit(1);

    if (existing.length === 0) return slug;

    n++;
    slug = `${baseSlug}-${n}`;
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();

    const name = body.name?.trim();
    let slugInput = body.slug?.trim()?.toLowerCase() || "";
    const status = body.status === "inactive" ? "inactive" : "active";
    const plan = ["trial", "start", "pro"].includes(body.plan) ? body.plan : "trial";

    const adminName = body.adminName?.trim();
    const adminPhone = body.adminPhone?.replace(/\D/g, "");
    const adminPassword = body.adminPassword;

    if (!name) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
    if (!adminName) return NextResponse.json({ error: "Nome do admin obrigatório" }, { status: 400 });
    if (!adminPhone) return NextResponse.json({ error: "Telefone admin obrigatório" }, { status: 400 });
    if (!adminPassword || adminPassword.length < 6)
      return NextResponse.json({ error: "Senha mínimo 6 caracteres" }, { status: 400 });

    const baseSlug = slugInput || slugFromName(name);
    const slug = await findAvailableSlug(baseSlug);

    const passwordHash = await hashPassword(adminPassword);

    // 1️⃣ cria barbearia
    const [shop] = await db
      .insert(barbershops)
      .values({
        name,
        slug,
        status,
        plan,
      })
      .returning();

    // 2️⃣ cria admin
    await db.insert(appUsers).values({
      barbershopId: shop.id,
      name: adminName,
      phone: adminPhone,
      role: "admin",
      passwordHash,
    });

    return NextResponse.json(
      {
        id: shop.id,
        name: shop.name,
        slug: shop.slug,
        status: shop.status,
        plan: shop.plan,
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("ERRO CRIAR BARBEARIA:", e);
    return NextResponse.json({ error: "Erro ao criar barbearia" }, { status: 500 });
  }
}