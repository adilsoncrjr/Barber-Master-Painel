import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTenantUrl } from "@/lib/tenant-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { BarbershopActions } from "./barbershop-actions";
import { AdminList } from "./admin-list";

export default async function BarbershopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const barbershop = await prisma.barbershop.findUnique({
    where: { id },
    include: {
      users: { where: { role: "admin" }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!barbershop) notFound();
  const tenantUrl = getTenantUrl(barbershop.slug);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/barbershops">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{barbershop.name}</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dados</CardTitle>
            <CardDescription>Informações da barbearia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="text-muted-foreground">Slug:</span> {barbershop.slug}</p>
            <p>
              <span className="text-muted-foreground">Status:</span>{" "}
              <Badge variant={barbershop.status === "active" ? "default" : "secondary"}>
                {barbershop.status === "active" ? "Ativo" : "Inativo"}
              </Badge>
            </p>
            <p><span className="text-muted-foreground">Plano:</span> {barbershop.plan}</p>
            <p className="text-muted-foreground text-sm">
              Criado em {new Date(barbershop.createdAt).toLocaleDateString("pt-BR")}
            </p>
            <BarbershopActions barbershopId={id} status={barbershop.status} slug={barbershop.slug} tenantUrl={tenantUrl} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admins</CardTitle>
            <CardDescription>Administradores desta barbearia</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminList admins={barbershop.users} barbershopId={barbershop.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
