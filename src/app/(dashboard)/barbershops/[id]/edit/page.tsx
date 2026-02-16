import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { BarbershopEditForm } from "./barbershop-edit-form";

export const dynamic = "force-dynamic";

export default async function BarbershopEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const barbershop = await prisma.barbershop.findFirst({
    where: { id, deletedAt: null },
  });
  if (!barbershop) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/barbershops/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Editar barbearia</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dados da barbearia</CardTitle>
          <CardDescription>Altere nome, slug, status, plano e observações internas.</CardDescription>
        </CardHeader>
        <CardContent>
          <BarbershopEditForm
            barbershopId={id}
            initial={{
              name: barbershop.name,
              slug: barbershop.slug,
              status: barbershop.status,
              plan: barbershop.plan,
              internalNotes: barbershop.internalNotes ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
