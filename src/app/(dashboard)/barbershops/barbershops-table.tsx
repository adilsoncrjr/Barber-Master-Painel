import Link from "next/link";
import { Barbershop } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import {
  DataTable,
  DataTableHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
} from "@/components/data-table";
import { BarbershopRowActions } from "./barbershop-row-actions";
import { getPlanLabel } from "@/lib/plans";
import { Store, Plus } from "lucide-react";

type BarbershopWithCount = Barbershop & { _count: { users: number } };
type BarbershopWithUrl = BarbershopWithCount & { tenantUrl: string };

const STATUS_LABEL: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  suspended: "Suspenso",
  cancelled: "Cancelado",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "secondary",
  suspended: "outline",
  cancelled: "destructive",
};

export function BarbershopsTable({ barbershops }: { barbershops: BarbershopWithUrl[] }) {
  if (barbershops.length === 0) {
    return (
      <EmptyState
        icon={<Store className="h-12 w-12" />}
        title="Nenhuma barbearia encontrada"
        description="Ajuste os filtros ou cadastre uma nova barbearia."
        action={
          <Link
            href="/barbershops/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova barbearia
          </Link>
        }
      />
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 border-b bg-muted/40">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">Nome</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Slug</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Plano</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Últ. cobrança</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Total faturado</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Usuários</th>
              <th className="text-right p-4 font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {barbershops.map((b) => (
              <tr
                key={b.id}
                className="border-t transition-colors hover:bg-muted/30"
              >
                <td className="p-4 font-medium">
                  <Link
                    href={`/barbershops/${b.id}`}
                    className="text-primary hover:underline"
                  >
                    {b.name}
                  </Link>
                </td>
                <td className="p-4 font-mono text-muted-foreground text-xs">{b.slug}</td>
                <td className="p-4">
                  <Badge variant={STATUS_VARIANT[b.status] ?? "secondary"} className="rounded-md">
                    {STATUS_LABEL[b.status] ?? b.status}
                  </Badge>
                </td>
                <td className="p-4">{getPlanLabel(b.plan)}</td>
                <td className="p-4 text-muted-foreground">
                  {b.lastBillingAt
                    ? new Date(String(b.lastBillingAt)).toLocaleDateString("pt-BR")
                    : "—"}
                </td>
                <td className="p-4 tabular-nums">
                  {b.totalBilled != null
                    ? Number(b.totalBilled).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                    : "—"}
                </td>
                <td className="p-4">{b._count.users}</td>
                <td className="p-4 text-right">
                  <BarbershopRowActions barbershopId={b.id} slug={b.slug} tenantUrl={b.tenantUrl} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
