import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "barber_master_session";
const SESSION_MAX_AGE = Number(process.env.SESSION_MAX_AGE ?? 86400); // 24h

export type SessionSuperAdmin = {
  id: string;
  email: string;
};

export async function getSession(): Promise<SessionSuperAdmin | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.superAdmin.findUnique({
    where: { id: token },
    select: { id: true, email: true },
  });
  return session;
}

export async function loginSuperAdmin(email: string, password: string): Promise<SessionSuperAdmin | null> {
  const admin = await prisma.superAdmin.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  return { id: admin.id, email: admin.email };
}

export async function setSessionCookie(adminId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
