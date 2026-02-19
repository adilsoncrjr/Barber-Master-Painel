"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLAN_OPTIONS, PLAN_VALUES, type PlanValue } from "@/lib/plans";

const STATUS_OPTIONS = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
  { value: "suspended", label: "Suspenso" },
  { value: "cancelled", label: "Cancelado" },
];

type Props = {
  barbershopId: string;
  initial: {
    name: string;
    slug: string;
    status: string;
    plan: string;
    internalNotes: string;
  };
};

export function BarbershopEditForm({ barbershopId, initial }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(initial.status);
  const [plan, setPlan] = useState<PlanValue>(
    PLAN_VALUES.includes(initial.plan as PlanValue) ? (initial.plan as PlanValue) : "basico"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim() ?? "";
    const slug = (formData.get("slug") as string)?.trim().toLowerCase() ?? "";
    const internalNotes = (formData.get("internalNotes") as string)?.trim() ?? "";

    if (!name) {
      setError("Nome é obrigatório.");
      setLoading(false);
      return;
    }
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      setError("Slug inválido. Use apenas letras minúsculas, números e hífens.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/barbershops/${barbershopId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          status: status || initial.status,
          plan: plan || initial.plan,
          internalNotes: internalNotes || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Erro ao salvar.");
        return;
      }
      router.push(`/barbershops/${barbershopId}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            name="name"
            defaultValue={initial.name}
            required
            placeholder="Nome da barbearia"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={initial.slug}
            required
            placeholder="barbearia-do-joao"
            pattern="[a-z0-9-]+"
            title="Apenas letras minúsculas, números e hífens"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Plano</Label>
          <Select value={plan} onValueChange={setPlan}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLAN_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="internalNotes">Observações internas</Label>
        <Input
          id="internalNotes"
          name="internalNotes"
          defaultValue={initial.internalNotes}
          placeholder="Notas apenas para o painel"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando…" : "Salvar"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
