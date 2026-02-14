import { cookies } from "next/headers";
import cookie from "cookie";
import { getPrisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/** Resposta com setHeader (Pages Router NextApiResponse ou similar). */
export type ResponseWithSetHeader = {
  setHeader(name: string, value: string | string[]): unknown;
};

export type SessionSuperAdmin = {
  id: string;
  email: string;
};

function getSessionConfig(): { cookieName: string; maxAge: number } {
  return {
    cookieName: process.env.SESSION_COOKIE_NAME ?? "barber_master_session",
    maxAge: Number(process.env.SESSION_MAX_AGE ?? 86400),
  };
}

function assertAuthEnv(): void {
  if (!process.env.DATABASE_URL) {
    throw new Error("Auth: DATABASE_URL não está definida. Configure no .env ou nas variáveis de ambiente da Vercel.");
  }
}

export async function getSession(): Promise<SessionSuperAdmin | null> {
  assertAuthEnv();
  const { cookieName } = getSessionConfig();
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;
  const prisma = getPrisma();
  const session = await prisma.superAdmin.findUnique({
    where: { id: token },
    select: { id: true, email: true },
  });
  return session;
}

export async function loginSuperAdmin(
  email: string,
  password: string
): Promise<SessionSuperAdmin | null> {
  assertAuthEnv();
  console.error("AUTH ENV CHECK", {
    hasDb: !!process.env.DATABASE_URL,
    hasSecret: !!process.env.SESSION_SECRET,
  });
  const prisma = getPrisma();
  const admin = await prisma.superAdmin.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  return { id: admin.id, email: admin.email };
}

export async function setSessionCookie(adminId: string): Promise<void> {
  const { cookieName, maxAge } = getSessionConfig();
  const cookieStore = await cookies();
  cookieStore.set(cookieName, adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

/**
 * Define o cookie de sessão na resposta (Pages Router).
 * Use em pages/api/auth/login.ts para evitar import de next/headers no build.
 */
export function setSessionCookieApi(res: ResponseWithSetHeader, adminId: string): void {
  const { cookieName, maxAge } = getSessionConfig();
  const value = cookie.serialize(cookieName, adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
  res.setHeader("Set-Cookie", value);
}

export async function clearSessionCookie(): Promise<void> {
  const { cookieName } = getSessionConfig();
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

/**
 * Remove o cookie de sessão na resposta (Pages Router).
 */
export function clearSessionCookieApi(res: ResponseWithSetHeader): void {
  const { cookieName } = getSessionConfig();
  const value = cookie.serialize(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  res.setHeader("Set-Cookie", value);
}
