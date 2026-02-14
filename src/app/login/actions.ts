"use server";

import { redirect } from "next/navigation";
import { loginSuperAdmin, setSessionCookie } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim() ?? "";
  const password = (formData.get("password") as string) ?? "";
  if (!email || !password) {
    return { error: "E-mail e senha são obrigatórios." };
  }
  const admin = await loginSuperAdmin(email, password);
  if (!admin) {
    return { error: "E-mail ou senha inválidos." };
  }
  await setSessionCookie(admin.id);
  redirect("/barbershops");
}
