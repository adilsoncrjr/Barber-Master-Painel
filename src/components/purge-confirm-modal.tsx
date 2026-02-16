"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;

  /** slug real da barbearia (ex: "barbearia-do-adilson") */
  slug: string;

  barbershopName: string;
  barbershopId: string;

  /** chamado quando o purge deu certo (ex: router.push + refresh) */
  onSuccess: () => void;
};

export function PurgeConfirmModal({
  open,
  onClose,
  slug,
  barbershopName,
  barbershopId,
  onSuccess,
}: Props) {
  const [typedSlug, setTypedSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedSlug = useMemo(() => slug.trim().toLowerCase(), [slug]);

  const canConfirm = useMemo(() => {
    return typedSlug.trim().toLowerCase() === normalizedSlug && !loading;
  }, [typedSlug, normalizedSlug, loading]);

  useEffect(() => {
    if (!open) {
      setTypedSlug("");
      setError(null);
      setLoading(false);
    }
  }, [open]);

  async function handlePurge() {
    if (!canConfirm) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/barbershops/purge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: barbershopId, slug }),
      });

      // tenta ler JSON, mas não quebra se vier vazio/HTML
      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        setError(data?.error ?? "Erro ao excluir. Verifique o console/servidor.");
        return;
      }

      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Erro inesperado ao excluir.");
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
      aria-labelledby="purge-modal-title"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-md rounded-xl border border-red-200 bg-card p-6 shadow-xl",
          "dark:border-red-900/50"
        )}
      >
        <h2 id="purge-modal-title" className="text-lg font-semibold text-destructive">
          Excluir barbearia definitivamente
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Isso apagará <strong>todos os dados</strong> vinculados a &quot;{barbershopName}&quot;:
          barbearia, usuários e relacionamentos. <strong>Não pode ser desfeito.</strong>
        </p>

        <div className="mt-4 space-y-2">
          <Label htmlFor="purge-slug">
            Digite o slug{" "}
            <strong className="font-mono text-foreground">{slug}</strong> para confirmar:
          </Label>

          <Input
            id="purge-slug"
            type="text"
            value={typedSlug}
            onChange={(e) => setTypedSlug(e.target.value)}
            placeholder="ex: barbearia-do-joao"
            className="font-mono"
            autoComplete="off"
            disabled={loading}
          />
        </div>

        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handlePurge}
            disabled={!canConfirm}
          >
            {loading ? "Excluindo…" : "Excluir definitivamente"}
          </Button>
        </div>
      </div>
    </div>
  );
}