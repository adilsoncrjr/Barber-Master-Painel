import { NextResponse } from "next/server";
import { slugFromName } from "@/lib/slug";

export const revalidate = 0;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.BACKEND_API_URL;

function jsonError(message: string, status = 500, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...(extra ?? {}) }, { status });
}

function normalizeApiBaseUrl(url: string) {
  const trimmed = url.trim().replace(/\/$/, "");
  return trimmed.replace(/\/api$/i, "");
}

/**
 * Cadastro público (landing): cria barbearia + admin sem sessão.
 * Encaminha para o mesmo backend que POST /api/barbershops (com x-internal-key).
 * Recomenda-se rate limit e/ou captcha em produção.
 */
export async function POST(request: Request) {
  if (!API_BASE_URL) {
    return jsonError("API não configurada.", 500);
  }

  const base = normalizeApiBaseUrl(API_BASE_URL);
  const upstreamUrl = `${base}/api/barbershops`;

  try {
    const body = await request.json();

    const name = String(body?.name ?? "").trim();
    const status = body?.status === "inactive" ? "inactive" : "active";
    const plan = ["basico", "pro", "master"].includes(body?.plan) ? body.plan : "basico";

    const adminName = String(body?.adminName ?? "").trim();
    const adminPhone = String(body?.adminPhone ?? "").replace(/\D/g, "");
    const adminPassword = String(body?.adminPassword ?? "");

    if (!name) return jsonError("Nome da barbearia obrigatório", 400);
    if (!adminName) return jsonError("Nome do responsável obrigatório", 400);
    if (!adminPhone || adminPhone.length < 10) return jsonError("Telefone do responsável obrigatório (mín. 10 dígitos)", 400);
    if (!adminPassword || adminPassword.length < 6)
      return jsonError("Senha deve ter no mínimo 6 caracteres", 400);

    const slugInput = String(body?.slug ?? "").trim().toLowerCase();
    const slug = slugInput || slugFromName(name);

    const payload = {
      name,
      slug,
      status,
      plan,
      adminName,
      adminPhone,
      adminPassword,
      ...(body?.phone != null && { phone: String(body.phone).trim() }),
      ...(body?.city != null && { city: String(body.city).trim() }),
      ...(body?.adminEmail != null && { adminEmail: String(body.adminEmail).trim() }),
    };

    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": process.env.INTERNAL_API_KEY ?? "",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const raw = await upstream.text();
    let data: Record<string, unknown> = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = { message: raw };
    }

    if (!upstream.ok) {
      return jsonError(
        (data?.error as string) || (data?.message as string) || "Falha ao criar conta no backend.",
        upstream.status,
        { upstream: data }
      );
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (e: unknown) {
    const err = e as Error;
    console.error("POST /api/public/signup failed:", e);
    return jsonError("Erro ao processar cadastro", 500, {
      detail: err?.message ?? String(e),
    });
  }
}
