"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { slugFromName } from "@/lib/slug";
import { PLAN_OPTIONS, PLAN_PRICES, getPlanLabel, type PlanValue } from "@/lib/plans";
import { Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Dados da barbearia" },
  { id: 2, title: "Dados do responsável" },
  { id: 3, title: "Plano e pagamento" },
  { id: 4, title: "Sucesso" },
];

export function SignupFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Etapa 1
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  // Etapa 2
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Etapa 3
  const [plan, setPlan] = useState<PlanValue>("basico");

  useEffect(() => {
    const p = searchParams.get("plano");
    if (p && ["basico", "pro", "master"].includes(p)) setPlan(p as PlanValue);
  }, [searchParams]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setName(v);
    if (!slug || slug === slugFromName(name)) setSlug(slugFromName(v));
  };

  const canStep1 = name.trim().length > 0 && slug.trim().length > 0;
  const canStep2 =
    adminName.trim().length > 0 &&
    adminPhone.replace(/\D/g, "").length >= 10 &&
    adminPassword.length >= 6;

  const goNext = () => {
    setError(null);
    if (step < 4) setStep(step + 1);
  };

  const goBack = () => {
    setError(null);
    if (step > 1) setStep(step - 1);
  };

  const submitSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/public/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim().toLowerCase() || slugFromName(name),
          phone: phone.trim() || undefined,
          city: city.trim() || undefined,
          adminName: adminName.trim(),
          adminEmail: adminEmail.trim() || undefined,
          adminPhone: adminPhone.replace(/\D/g, ""),
          adminPassword,
          plan,
          status: "active",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.error as string) || "Erro ao criar conta. Tente novamente.");
        setLoading(false);
        return;
      }
      setStep(4);
      setLoading(false);
      setTimeout(() => {
        router.push("/areadocliente");
        router.refresh();
      }, 3000);
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      {/* Progress */}
      {step < 4 && (
        <div className="mb-10">
          <div className="flex items-center justify-between gap-2">
            {STEPS.slice(0, 3).map((s, i) => (
              <div key={s.id} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => s.id < step && setStep(s.id)}
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    step >= s.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {step > s.id ? <Check className="h-5 w-5" /> : s.id}
                </button>
                {i < 2 && <div className="h-0.5 flex-1 bg-border" />}
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">{STEPS[step - 1].title}</p>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Dados da barbearia</CardTitle>
            <CardDescription>Informe o nome e como sua barbearia aparecerá na URL.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da barbearia *</Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Ex: Barbearia do João"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="barbearia-do-joao"
              />
              <p className="text-xs text-muted-foreground">
                Seu painel ficará em: trivor.com.br/app/{slug || "sua-barbearia"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone da barbearia</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="São Paulo"
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={goNext} disabled={!canStep1}>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do responsável</CardTitle>
            <CardDescription>Este será o usuário administrador (dono) da barbearia.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">Nome do responsável *</Label>
              <Input
                id="adminName"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="João Silva"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">E-mail</Label>
              <Input
                id="adminEmail"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="joao@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPhone">Telefone / login *</Label>
              <Input
                id="adminPhone"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="11999999999"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Senha *</Label>
              <Input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button onClick={goNext} disabled={!canStep2}>
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Plano e pagamento</CardTitle>
            <CardDescription>Escolha o plano e finalize. O pagamento pode ser integrado em seguida.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Plano</Label>
              <Select value={plan} onValueChange={(v) => setPlan(v as PlanValue)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label} — R$ {PLAN_PRICES[o.value]}/mês
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="font-medium text-foreground">Resumo</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {getPlanLabel(plan)} — R$ {PLAN_PRICES[plan]}/mês
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Forma de pagamento: em breve integração com gateway. Por enquanto o cadastro será criado e o acesso liberado.
              </p>
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button onClick={submitSignup} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta…
                  </>
                ) : (
                  <>
                    Assinar e criar conta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4 - Sucesso */}
      {step === 4 && (
        <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <Check className="h-6 w-6" />
              Cadastro realizado com sucesso
            </CardTitle>
            <CardDescription>
              Sua barbearia foi criada e seu acesso está liberado. Redirecionando para a área do cliente…
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Se não for redirecionado em alguns segundos,{" "}
              <Link href="/areadocliente" className="font-medium text-primary underline">
                clique aqui para acessar a área do cliente
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/areadocliente" className="font-medium text-primary hover:underline">
          Acessar área do cliente
        </Link>
      </p>
    </div>
  );
}
