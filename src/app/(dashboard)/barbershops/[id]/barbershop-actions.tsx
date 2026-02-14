"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, Power } from "lucide-react";

type Props = {
  barbershopId: string;
  status: string;
  slug: string;
  tenantUrl: string;
};

export function BarbershopActions({ barbershopId, status, tenantUrl }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleStatus = async () => {
    setLoading("status");
    try {
      const res = await fetch(`/api/barbershops/${barbershopId}/status`, { method: "PATCH" });
      if (res.ok) router.refresh();
    } finally {
      setLoading(null);
    }
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
      <Button
        variant="outline"
        size="sm"
        onClick={toggleStatus}
        disabled={loading !== null}
      >
        <Power className="mr-2 h-4 w-4" />
        {loading === "status" ? "…" : status === "active" ? "Desativar" : "Ativar"}
      </Button>
      <Button variant="outline" size="sm" onClick={copyLink}>
        <Copy className="mr-2 h-4 w-4" />
        {copied ? "Copiado!" : "Copiar link do tenant"}
      </Button>
    </div>
  );
}
