"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

function buildParams(
  current: URLSearchParams,
  updates: { q?: string; status?: string }
): URLSearchParams {
  const next = new URLSearchParams(current.toString());
  if (updates.q !== undefined)
    updates.q ? next.set("q", updates.q) : next.delete("q");
  if (updates.status !== undefined)
    updates.status ? next.set("status", updates.status) : next.delete("status");
  return next;
}

export function BillingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() ?? "");
  const q = params.get("q") ?? "";
  const status = params.get("status") ?? "all";

  return (
    <form
      method="get"
      action="/billing"
      className="flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const qVal = (form.querySelector('input[name="q"]') as HTMLInputElement)
          ?.value ?? "";
        router.push(
          `/billing?${buildParams(params, { q: qVal || undefined }).toString()}`
        );
      }}
    >
      <input type="hidden" name="status" value={status === "all" ? "" : status} />
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          name="q"
          placeholder="Buscar por barbearia..."
          defaultValue={q}
          className="pl-9"
        />
      </div>
      <Select
        value={status}
        onValueChange={(v) =>
          router.push(
            `/billing?${buildParams(params, { status: v === "all" ? undefined : v }).toString()}`
          )
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos status</SelectItem>
          <SelectItem value="open">Aberta</SelectItem>
          <SelectItem value="paid">Paga</SelectItem>
          <SelectItem value="overdue">Vencida</SelectItem>
          <SelectItem value="canceled">Cancelada</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" variant="secondary">
        Filtrar
      </Button>
    </form>
  );
}
