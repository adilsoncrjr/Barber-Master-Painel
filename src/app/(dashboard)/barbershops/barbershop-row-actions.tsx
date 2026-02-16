"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";

type Props = {
  barbershopId: string;
  slug: string;
  tenantUrl: string;
};

export function BarbershopRowActions({ barbershopId, tenantUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(tenantUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="sm" asChild className="h-8">
        <Link href={`/barbershops/${barbershopId}`}>Ver</Link>
      </Button>
      <Button variant="ghost" size="sm" className="h-8 px-2" onClick={copyLink}>
        <Copy className="h-3.5 w-3.5" />
        <span className="sr-only">{copied ? "Copiado" : "Copiar link"}</span>
      </Button>
      {copied && <span className="text-xs text-muted-foreground">Copiado!</span>}
      <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
        <a href={tenantUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="sr-only">Acessar app</span>
        </a>
      </Button>
    </div>
  );
}
