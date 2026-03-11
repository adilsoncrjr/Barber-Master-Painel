import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_PRICES, PLAN_VALUES, getPlanLabel } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function PlansSection() {
  return (
    <section
      id="planos"
      className="border-b border-border/40 bg-white px-4 py-20 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Planos simples para crescer com você.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Escolha o plano ideal hoje e ajuste conforme a sua barbearia evolui.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {PLAN_VALUES.map((planValue) => {
            const isPro = planValue === "pro";
            const price = PLAN_PRICES[planValue];

            return (
              <div
                key={planValue}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-6 shadow-sm sm:p-8",
                  isPro
                    ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/15"
                    : "border-border/60 bg-card"
                )}
              >
                {isPro && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Mais escolhido
                  </span>
                )}

                <h3 className="text-lg font-semibold text-foreground">
                  {getPlanLabel(planValue)}
                </h3>

                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight">
                    R$ {price}
                  </span>
                  <span className="text-xs text-muted-foreground">/mês</span>
                </p>

                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  {["Agenda inteligente", "Planos mensais", "Relatórios", "Suporte por email"].map(
                    (feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                  {planValue !== "basico" && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>WhatsApp e automações</span>
                    </li>
                  )}
                  {planValue === "master" && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Suporte prioritário e recursos avançados</span>
                    </li>
                  )}
                </ul>

                <Link href={`/cadastro?plano=${planValue}`} className="mt-8 block">
                  <Button
                    className="w-full rounded-full text-sm font-medium"
                    variant={isPro ? "default" : "outline"}
                    size="lg"
                  >
                    Assinar agora
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

