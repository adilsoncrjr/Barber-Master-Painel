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
import { slugFromName } from "@/lib/slug";

const SUCCESS_MESSAGE_DURATION_MS = 2000;

export function NewBarbershopForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [plan, setPlan] = useState<"trial" | "start" | "pro">("trial");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setName(v);
    if (!slug || slug === slugFromName(name)) setSlug(slugFromName(v));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await fetch("/api/barbershops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        slug: formData.get("slug"),
        status,
        plan,
        adminName: formData.get("adminName"),
        adminPhone: formData.get("adminPhone"),
        adminPassword: formData.get("adminPassword"),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      const msg = data.details ?? data.error ?? "Erro ao criar barbearia.";
      setError(msg);
      return;
    }
    setSuccess(true);
    setError(null);
    window.setTimeout(() => {
      router.push("/barbershops");
      router.refresh();
    }, SUCCESS_MESSAGE_DURATION_MS);
  }

  if (success) {
    return (
      <div
        className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-green-800"
        role="alert"
      >
        <p className="font-semibold">BARBEARIA CRIADA COM SUCESSO</p>
        <p className="mt-1 text-sm">Redirecionando para a listagem…</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Barbearia</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Barbearia do João"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="barbearia-do-joao"
              required
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as "active" | "inactive")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Plano</Label>
            <Select value={plan} onValueChange={(v) => setPlan(v as "trial" | "start" | "pro")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Admin (dono)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="adminName">Nome</Label>
            <Input
              id="adminName"
              name="adminName"
              placeholder="João Silva"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminPhone">Telefone</Label>
            <Input
              id="adminPhone"
              name="adminPhone"
              placeholder="11999999999"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="adminPassword">Senha</Label>
          <Input
            id="adminPassword"
            name="adminPassword"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} aria-busy={loading}>
        {loading ? "Criando…" : "Criar barbearia"}
      </Button>
    </form>
  );
}
