import type { NextApiRequest, NextApiResponse } from "next";
import { clearSessionCookieApi } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido." });
  }
  try {
    clearSessionCookieApi(res);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return res.status(500).json({ error: "Erro ao processar logout." });
  }
}
