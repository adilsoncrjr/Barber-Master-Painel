"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Copy, Power, Pencil, ExternalLink, Ban, RotateCw, Archive, AlertTriangle } from "lucide-react";
import { PurgeConfirmModal } from "@/components/purge-confirm-modal";

type Props = {
  barbershopId: string;
  barbershopName: string;
  status: string;
  slug: string;
  tenantUrl: string;
};

export function BarbershopActions({ barbershopId, barbershopName, status, slug, tenantUrl }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [purgeModalOpen, setPurgeModalOpen] = useState(false);

  const apiPatch = async (body: Record<string, unknown>) => {
    const res = await fetch(`/api/barbershops/${barbershopId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) router.refresh();
    return res;
  };

  const toggleStatus = async () => {
    setLoading("status");
    try {
      await fetch(`/api/barbershops/${barbershopId}/status`, { method: "PATCH" });
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  const setStatus = async (newStatus: string) => {
    setLoading("status");
    try {
      await apiPatch({ status: newStatus });
    } finally {
      setLoading(null);
    }
  };

  const archive = async () => {
    if (!confirm("Arquivar esta barbearia? Ela sairá da lista ativa mas poderá ser restaurada depois.")) return;
    setLoading("archive");
    try {
      await apiPatch({ softDelete: true });
      router.push("/barbershops");
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  const onPurgeSuccess = () => {
    router.push("/barbershops");
    router.refresh();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(tenantUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex flex-wrap gap-2 pt-4 border-t">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/barbershops/${barbershopId}/edit`}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={tenantUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          Acessar no app
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={copyLink}>
        <Copy className="mr-2 h-4 w-4" />
        {copied ? "Copiado!" : "Copiar link"}
      </Button>
      {(status === "active" || status === "inactive") && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleStatus}
          disabled={loading !== null}
        >
          <Power className="mr-2 h-4 w-4" />
          {loading === "status" ? "…" : status === "active" ? "Desativar" : "Ativar"}
        </Button>
      )}
      {status === "active" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStatus("suspended")}
          disabled={loading !== null}
        >
          <Ban className="mr-2 h-4 w-4" />
          Suspender
        </Button>
      )}
      {(status === "suspended" || status === "inactive") && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStatus("active")}
          disabled={loading !== null}
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Reativar
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={archive}
        disabled={loading !== null}
      >
        <Archive className="mr-2 h-4 w-4" />
        {loading === "archive" ? "…" : "Arquivar"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPurgeModalOpen(true)}
        disabled={loading !== null}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Excluir definitivamente
      </Button>
      <PurgeConfirmModal
        open={purgeModalOpen}
        onClose={() => setPurgeModalOpen(false)}
        slug={slug}
        barbershopName={barbershopName}
        barbershopId={barbershopId}
        onSuccess={onPurgeSuccess}
      />
    </div>
  );
}
