import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getTenantUrl } from "@/lib/tenant-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { ArrowLeft } from "lucide-react";
import { BarbershopActions } from "./barbershop-actions";
import { AdminList } from "./admin-list";

export default async function BarbershopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const barbershop = await prisma.barbershop.findFirst({
    where: { id, deletedAt: null },
    include: {
      users: { where: { role: "admin" }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!barbershop) notFound();
  const tenantUrl = getTenantUrl(barbershop.slug);

  return (
    <div className="space-y-8">
      <PageHeader
        title={barbershop.name}
        description={`Slug: ${barbershop.slug} • ${barbershop.plan}`}
        actions={
          <Button variant="ghost" size="icon" asChild>
            <Link href="/barbershops">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          />
        }
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-xl border shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Visão geral</CardTitle>
            <CardDescription>Informações da barbearia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="text-muted-foreground">Slug:</span> {barbershop.slug}</p>
            <div>
              <span className="text-muted-foreground">Status:</span>{" "}
              <Badge
                variant={
                  barbershop.status === "active"
                    ? "default"
                    : barbershop.status === "suspended"
                      ? "outline"
                      : barbershop.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                }
              >
                {barbershop.status === "active"
                  ? "Ativo"
                  : barbershop.status === "inactive"
                    ? "Inativo"
                    : barbershop.status === "suspended"
                      ? "Suspenso"
                      : barbershop.status === "cancelled"
                        ? "Cancelado"
                        : barbershop.status}
              </Badge>
            </div>
            <p><span className="text-muted-foreground">Plano:</span> {barbershop.plan}</p>
            {barbershop.lastBillingAt && (
              <p><span className="text-muted-foreground">Última cobrança:</span> {new Date(barbershop.lastBillingAt).toLocaleDateString("pt-BR")}</p>
            )}
            {barbershop.totalBilled != null && (
              <p><span className="text-muted-foreground">Total faturado:</span> {Number(barbershop.totalBilled).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
            )}
            <p className="text-muted-foreground text-sm">
              Criado em {new Date(barbershop.createdAt).toLocaleDateString("pt-BR")}
            </p>
            {barbershop.internalNotes && (
              <p className="text-muted-foreground text-sm border-t pt-2 mt-2"><span className="font-medium">Observações:</span> {barbershop.internalNotes}</p>
            )}
            <BarbershopActions
              barbershopId={id}
              barbershopName={barbershop.name}
              status={barbershop.status}
              slug={barbershop.slug}
              tenantUrl={tenantUrl}
            />
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-[var(--shadow-card)]">
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
