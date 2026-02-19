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
import { PLAN_OPTIONS } from "@/lib/plans";

function buildParams(
  current: URLSearchParams,
  updates: { q?: string; status?: string; plan?: string }
): URLSearchParams {
  const next = new URLSearchParams(current.toString());
  if (updates.q !== undefined) (updates.q ? next.set("q", updates.q) : next.delete("q"));
  if (updates.status !== undefined) (updates.status ? next.set("status", updates.status) : next.delete("status"));
  if (updates.plan !== undefined) (updates.plan ? next.set("plan", updates.plan) : next.delete("plan"));
  return next;
}

function toURLSearchParams(sp: ReturnType<typeof useSearchParams>): URLSearchParams {
  if (sp == null) return new URLSearchParams();
  return new URLSearchParams(sp.toString());
}

export function BarbershopsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = toURLSearchParams(searchParams);
  const q = params.get("q") ?? "";
  const status = params.get("status") ?? "all";
  const plan = params.get("plan") ?? "all";

  return (
    <form
      method="get"
      action="/barbershops"
      className="flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const qVal = (form.querySelector('input[name="q"]') as HTMLInputElement)?.value ?? "";
        router.push(`/barbershops?${buildParams(params, { q: qVal || undefined }).toString()}`);
      }}
    >
      <input type="hidden" name="status" value={status === "all" ? "" : status} />
      <input type="hidden" name="plan" value={plan === "all" ? "" : plan} />
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input name="q" placeholder="Buscar por nome..." defaultValue={q} className="pl-9" />
      </div>
      <Select
        value={status}
        onValueChange={(v) =>
          router.push(`/barbershops?${buildParams(params, { status: v === "all" ? undefined : v }).toString()}`)
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos status</SelectItem>
          <SelectItem value="active">Ativo</SelectItem>
          <SelectItem value="inactive">Inativo</SelectItem>
          <SelectItem value="suspended">Suspenso</SelectItem>
          <SelectItem value="cancelled">Cancelado</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={plan}
        onValueChange={(v) =>
          router.push(`/barbershops?${buildParams(params, { plan: v === "all" ? undefined : v }).toString()}`)
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Plano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos planos</SelectItem>
          {PLAN_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" variant="secondary">
        Filtrar
      </Button>
    </form>
  );
}
