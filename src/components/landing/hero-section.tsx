import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { landingContent } from "./landing-content";
import { landingImages } from "./landing-images";

export function HeroSection() {
  const { eyebrow, title, subtitle, primaryCta, secondaryCta } = landingContent.hero;

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-white via-white to-muted/30 px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_55%)]" />

      <div className="mx-auto flex max-w-6xl flex-col gap-14">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1 text-xs font-medium text-primary sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {eyebrow}
          </span>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-[1.1]">
            {title}
          </h1>

          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href={primaryCta.href}>
              <Button
                size="lg"
                className="h-11 rounded-full px-7 text-sm font-medium shadow-md shadow-primary/20 hover:shadow-lg"
              >
                {primaryCta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href={secondaryCta.href}>
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-full px-6 text-sm font-medium"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                {secondaryCta.label}
              </Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
          <div className="relative order-2 md:order-1">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-3 shadow-2xl shadow-black/20">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 sm:p-4">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900/80">
                  <Image
                    src={landingImages.hero.primary}
                    alt="Tela principal do painel TRIVOR"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-4 -bottom-6 hidden w-48 translate-y-4 rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-xl shadow-black/30 sm:block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-900">
                <Image
                  src={landingImages.hero.secondary}
                  alt="Visão complementar do app TRIVOR"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="order-1 flex flex-col gap-4 text-sm text-muted-foreground md:order-2">
            <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80">
                Pensado para barbearias
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                O TRIVOR coloca a rotina da barbearia no centro: horários, planos,
                clientes e resultado em um painel leve e objetivo.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-foreground">Agenda em tempo real</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Horários sempre atualizados, sem planilhas ou improviso.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-foreground">Planos organizados</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Recorrência, presença e faturamento sob controle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

