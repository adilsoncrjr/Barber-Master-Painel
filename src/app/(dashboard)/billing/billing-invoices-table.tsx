"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { MarkPaidModal } from "@/components/mark-paid-modal";
import { Button } from "@/components/ui/button";
import { CreditCard, Check } from "lucide-react";

type InvoiceWithBarbershop = {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
  paidAt: string | null;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  barbershop: { id: string; name: string; slug: string };
};

const STATUS_LABEL: Record<string, string> = {
  open: "Aberta",
  paid: "Paga",
  overdue: "Vencida",
  canceled: "Cancelada",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  open: "outline",
  paid: "default",
  overdue: "destructive",
  canceled: "secondary",
};

export function BillingInvoicesTable({
  invoices,
}: {
  invoices: InvoiceWithBarbershop[];
}) {
  const router = useRouter();
  const [modalInvoice, setModalInvoice] = useState<InvoiceWithBarbershop | null>(null);

  const formatAmount = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={<CreditCard className="h-12 w-12" />}
        title="Nenhuma fatura encontrada"
        description="Ajuste os filtros ou não há faturas no período."
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 border-b bg-muted/40">
            <tr>
              <th className="p-4 text-left font-medium text-muted-foreground">
                Barbearia
              </th>
              <th className="p-4 text-left font-medium text-muted-foreground">
                Período
              </th>
              <th className="p-4 text-left font-medium text-muted-foreground">
                Vencimento
              </th>
              <th className="p-4 text-left font-medium text-muted-foreground">
                Valor
              </th>
              <th className="p-4 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="p-4 text-right font-medium text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr
                key={inv.id}
                className="border-t transition-colors hover:bg-muted/30"
              >
                <td className="p-4 font-medium">
                  <Link
                    href={`/barbershops/${inv.barbershop.id}`}
                    className="text-primary hover:underline"
                  >
                    {inv.barbershop.name}
                  </Link>
                </td>
                <td className="p-4 text-muted-foreground">
                  {formatDate(inv.periodStart)} — {formatDate(inv.periodEnd)}
                </td>
                <td className="p-4 text-muted-foreground">
                  {formatDate(inv.dueDate)}
                </td>
                <td className="p-4 tabular-nums">
                  {formatAmount(inv.amount)}
                </td>
                <td className="p-4">
                  <Badge
                    variant={STATUS_VARIANT[inv.status] ?? "secondary"}
                    className="rounded-md"
                  >
                    {STATUS_LABEL[inv.status] ?? inv.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  {(inv.status === "open" || inv.status === "overdue") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setModalInvoice(inv)}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Marcar paga
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalInvoice && (
        <MarkPaidModal
          open={!!modalInvoice}
          onClose={() => setModalInvoice(null)}
          invoiceId={modalInvoice.id}
          barbershopName={modalInvoice.barbershop.name}
          amount={formatAmount(modalInvoice.amount)}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}
