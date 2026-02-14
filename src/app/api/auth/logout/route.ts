import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
export const revalidate = 0;

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
