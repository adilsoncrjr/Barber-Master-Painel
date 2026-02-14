import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const barbershop = await prisma.barbershop.findUnique({ where: { id } });
  if (!barbershop) {
    return NextResponse.json({ error: "Barbearia não encontrada." }, { status: 404 });
  }
  const newStatus = barbershop.status === "active" ? "inactive" : "active";
  await prisma.barbershop.update({
    where: { id },
    data: { status: newStatus },
  });
  return NextResponse.json({ status: newStatus });
}
