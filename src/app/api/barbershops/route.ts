import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { slugFromName } from "@/lib/slug";

export const revalidate = 0;

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.BACKEND_API_URL;

function jsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return jsonError("Não autorizado.", 401);

  if (!API_BASE_URL) {
    return jsonError("API_BASE_URL não configurado no painel.", 500);
  }

  try {
    const body = await request.json();

    const name = String(body?.name ?? "").trim();
    const status = body?.status === "inactive" ? "inactive" : "active";
    const plan = ["trial", "start", "pro"].includes(body?.plan) ? body.plan : "trial";

    const adminName = String(body?.adminName ?? "").trim();
    const adminPhone = String(body?.adminPhone ?? "").replace(/\D/g, "");
    const adminPassword = String(body?.adminPassword ?? "");

    if (!name) return jsonError("Nome obrigatório", 400);
    if (!adminName) return jsonError("Nome do admin obrigatório", 400);
    if (!adminPhone) return jsonError("Telefone admin obrigatório", 400);
    if (!adminPassword || adminPassword.length < 6) return jsonError("Senha mínimo 6 caracteres", 400);

    const slugInput = String(body?.slug ?? "").trim().toLowerCase();
    const slug = slugInput || slugFromName(name);

    const payload = { ...body, name, slug, status, plan, adminName, adminPhone, adminPassword };

    const upstream = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/barbershops`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": process.env.INTERNAL_API_KEY ?? "",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (e) {
    console.error("POST /api/barbershops (panel proxy) failed:", e);
    return jsonError("Erro ao criar barbearia", 500);
  }
}