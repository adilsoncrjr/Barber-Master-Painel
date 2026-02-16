import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportFilters } from "./support-filters";
import { SupportTicketsTable } from "./support-tickets-table";

export const dynamic = "force-dynamic";

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; priority?: string }>;
}) {
  const { q, status, priority } = await searchParams;

  const where: {
    status?: string;
    priority?: string;
    barbershop?: { name?: { contains: string; mode: "insensitive" } };
  } = {};

  if (
    status &&
    ["open", "in_progress", "waiting_customer", "closed"].includes(status)
  ) {
    where.status = status;
  }
  if (
    priority &&
    ["low", "medium", "high", "urgent"].includes(priority)
  ) {
    where.priority = priority;
  }
  if (q?.trim()) {
    where.barbershop = { name: { contains: q.trim(), mode: "insensitive" } };
  }

  let tickets: any[] = [];
  let error: string | null = null;

  try {
    tickets = await prisma.ticket.findMany({
      where,
      include: {
        barbershop: { select: { id: true, name: true, slug: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  } catch (e) {
    error = e instanceof Error ? e.message : "Erro ao carregar tickets.";
    tickets = [];
  }

  const serialized = tickets.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Suporte"
        description="Tickets de suporte por barbearia. Responda, altere status e prioridade."
      />

      <Card className="overflow-hidden rounded-xl border shadow-[var(--shadow-card)]">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Tickets</CardTitle>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Suspense
            fallback={
              <div className="h-10 w-full max-w-md animate-pulse rounded bg-muted" />
            }
          >
            <SupportFilters />
          </Suspense>
        </CardHeader>
        <CardContent>
          <SupportTicketsTable tickets={serialized} />
        </CardContent>
      </Card>
    </div>
  );
}
