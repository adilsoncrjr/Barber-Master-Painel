import type { NextApiRequest, NextApiResponse } from "next";
import { loginSuperAdmin, setSessionCookieApi } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    const admin = await loginSuperAdmin(email, password);

    if (!admin) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    setSessionCookieApi(res, admin.id);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Erro ao processar login." });
  }
}
