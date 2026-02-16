import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Store, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [totalBarbershops, activeBarbershops] = await Promise.all([
    prisma.barbershop.count({ where: { deletedAt: null } }),
    prisma.barbershop.count({
      where: { deletedAt: null, status: "active" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Visão geral da plataforma e acesso rápido aos módulos."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Barbearias ativas"
          value={activeBarbershops}
          hint="Status: ativo"
        />
        <StatCard
          title="Total de barbearias"
          value={totalBarbershops}
          hint="Excluindo deletadas"
        />
      </div>
      <Card className="rounded-xl border shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="text-lg">Acesso rápido</CardTitle>
          <CardDescription>
            Painel de gestão global da plataforma. Use o menu ao lado para
            acessar cada módulo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" size="lg">
            <Link href="/barbershops" className="gap-2">
              <Store className="h-4 w-4" />
              Barbearias
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
