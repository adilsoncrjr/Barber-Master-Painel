import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { BarbershopsFilters } from "./barbershops-filters";
import { BarbershopsTable } from "./barbershops-table";

export default async function BarbershopsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; plan?: string }>;
}) {
  const { q, status, plan } = await searchParams;
  const where: { name?: { contains: string; mode: "insensitive" }; status?: string; plan?: string } = {};
  if (q?.trim()) where.name = { contains: q.trim(), mode: "insensitive" };
  if (status === "active" || status === "inactive") where.status = status;
  if (plan === "trial" || plan === "start" || plan === "pro") where.plan = plan;

  const barbershops = await prisma.barbershop.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { users: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Barbearias</h1>
        <Button asChild>
          <Link href="/barbershops/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova barbearia
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Lista</CardTitle>
          <Suspense fallback={<div className="h-10 animate-pulse rounded bg-muted" />}>
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
