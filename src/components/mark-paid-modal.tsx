"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  invoiceId: string;
  barbershopName: string;
  amount: string;
  onSuccess: () => void;
};

export function MarkPaidModal({
  open,
  onClose,
  invoiceId,
  barbershopName,
  amount,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/billing/invoices/${invoiceId}/mark-paid`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({} as Record<string, string>));
      if (!res.ok) {
        setError(data?.error ?? "Erro ao marcar fatura como paga.");
        return;
      }
      onSuccess();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mark-paid-modal-title"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-xl border bg-card p-6 shadow-xl"
        )}
      >
        <h2 id="mark-paid-modal-title" className="text-lg font-semibold">
          Marcar fatura como paga
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Confirma que a fatura de <strong>{amount}</strong> da barbearia{" "}
          <strong>{barbershopName}</strong> foi paga? Será registrado um
          pagamento manual e a fatura será atualizada.
        </p>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={loading}>
            {loading ? "Confirmando…" : "Confirmar pagamento"}
          </Button>
        </div>
      </div>
    </div>
  );
}
