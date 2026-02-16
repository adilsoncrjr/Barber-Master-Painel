import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { MessageSquare } from "lucide-react";

type TicketWithCount = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  barbershop: { id: string; name: string; slug: string };
  _count: { messages: number };
};

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

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  open: "default",
  in_progress: "outline",
  waiting_customer: "secondary",
  closed: "secondary",
};

const PRIORITY_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  low: "secondary",
  medium: "outline",
  high: "default",
  urgent: "destructive",
};

export function SupportTicketsTable({
  tickets,
}: {
  tickets: TicketWithCount[];
}) {
  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (tickets.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="h-12 w-12" />}
        title="Nenhum ticket encontrado"
        description="Ajuste os filtros ou não há tickets no momento."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 border-b bg-muted/40">
          <tr>
            <th className="p-4 text-left font-medium text-muted-foreground">
              Assunto
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              Barbearia
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              Status
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              Prioridade
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              Mensagens
            </th>
            <th className="p-4 text-left font-medium text-muted-foreground">
              Atualizado
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr
              key={t.id}
              className="border-t transition-colors hover:bg-muted/30"
            >
              <td className="p-4 font-medium">
                <Link
                  href={`/support/${t.id}`}
                  className="text-primary hover:underline"
                >
                  {t.subject}
                </Link>
              </td>
              <td className="p-4">
                <Link
                  href={`/barbershops/${t.barbershop.id}`}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  {t.barbershop.name}
                </Link>
              </td>
              <td className="p-4">
                <Badge
                  variant={STATUS_VARIANT[t.status] ?? "secondary"}
                  className="rounded-md"
                >
                  {STATUS_LABEL[t.status] ?? t.status}
                </Badge>
              </td>
              <td className="p-4">
                <Badge
                  variant={PRIORITY_VARIANT[t.priority] ?? "outline"}
                  className="rounded-md"
                >
                  {PRIORITY_LABEL[t.priority] ?? t.priority}
                </Badge>
              </td>
              <td className="p-4">{t._count.messages}</td>
              <td className="p-4 text-muted-foreground">
                  {formatDate(t.updatedAt)}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
