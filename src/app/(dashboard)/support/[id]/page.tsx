import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TicketDetailClient } from "./ticket-detail-client";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em progresso",
  waiting_customer: "Aguardando cliente",
  closed: "Fechado",
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      barbershop: { select: { id: true, name: true, slug: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!ticket) notFound();

  const serialized = {
    ...ticket,
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
    messages: ticket.messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={ticket.subject}
        description={`Ticket #${ticket.id.slice(-8)} • ${ticket.barbershop.name}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/support">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Badge variant="outline" className="rounded-md">
              {STATUS_LABEL[ticket.status] ?? ticket.status}
            </Badge>
            <Badge variant="secondary" className="rounded-md">
              {PRIORITY_LABEL[ticket.priority] ?? ticket.priority}
            </Badge>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden rounded-xl border shadow-[var(--shadow-card)] lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Conversa</CardTitle>
            <p className="text-muted-foreground text-sm">
              Histórico de mensagens do ticket.
            </p>
          </CardHeader>
          <CardContent>
            <TicketDetailClient
              ticketId={ticket.id}
              initialMessages={serialized.messages}
              status={ticket.status}
              priority={ticket.priority}
            />
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-lg">Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <span className="text-muted-foreground text-sm">Barbearia:</span>{" "}
              <Link
                href={`/barbershops/${ticket.barbershop.id}`}
                className="text-primary hover:underline"
              >
                {ticket.barbershop.name}
              </Link>
            </p>
            <p className="text-muted-foreground text-sm">
              Criado em{" "}
              {new Date(ticket.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-muted-foreground text-sm">
              Atualizado em{" "}
              {new Date(ticket.updatedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
