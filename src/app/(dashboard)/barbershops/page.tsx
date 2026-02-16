import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getTenantUrl } from "@/lib/tenant-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Plus } from "lucide-react";
import { BarbershopsFilters } from "./barbershops-filters";
import { BarbershopsTable } from "./barbershops-table";

export const dynamic = "force-dynamic";

export default async function BarbershopsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; plan?: string }>;
}) {
  const { q, status, plan } = await searchParams;
  const where: {
    name?: { contains: string; mode: "insensitive" };
    status?: string;
    plan?: string;
    deletedAt?: null;
  } = { deletedAt: null };
  if (q?.trim()) where.name = { contains: q.trim(), mode: "insensitive" };
  if (status && ["active", "inactive", "suspended", "cancelled"].includes(status)) where.status = status;
  if (plan && ["free", "trial", "basic", "start", "pro", "enterprise"].includes(plan)) where.plan = plan;

  const list = await prisma.barbershop.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { users: true } },
    },
  });
  const barbershops = list.map((b) => ({ ...b, tenantUrl: getTenantUrl(b.slug) }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Barbearias"
        description="Gerencie as barbearias da plataforma."
        actions={
          <Button asChild>
            <Link href="/barbershops/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova barbearia
            </Link>
          </Button>
        }
      />
      <Card className="overflow-hidden rounded-xl border shadow-[var(--shadow-card)]">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Lista</CardTitle>
          <Suspense fallback={<div className="h-10 w-full max-w-md animate-pulse rounded bg-muted" />}>
            <BarbershopsFilters />
          </Suspense>
        </CardHeader>
        <CardContent>
          <BarbershopsTable barbershops={barbershops} />
        </CardContent>
      </Card>
    </div>
  );
}
