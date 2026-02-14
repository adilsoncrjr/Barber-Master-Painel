import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateRandomPassword } from "@/lib/password";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const { id: barbershopId, userId } = await params;
  const user = await prisma.user.findFirst({
    where: { id: userId, barbershopId, role: "admin" },
  });
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }
  const newPassword = generateRandomPassword(10);
  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
  return NextResponse.json({ newPassword });
}
