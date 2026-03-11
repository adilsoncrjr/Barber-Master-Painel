import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignupFlow } from "./signup-flow";
import { Suspense } from "react";

export const metadata = {
  title: "Cadastro | TRIVOR",
  description: "Crie sua conta e comece a usar o TRIVOR na sua barbearia.",
};

function SignupFlowFallback() {
  return (
    <div className="mx-auto max-w-xl rounded-lg border bg-card p-8 text-center text-muted-foreground">
      Carregando…
    </div>
  );
}

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-border/60 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-bold text-xl tracking-tight text-foreground">
            TRIVOR
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Voltar à landing
              </Button>
            </Link>
            <Link href="/areadocliente">
              <Button variant="outline" size="sm">
                Área do cliente
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Crie sua conta TRIVOR
            </h1>
            <p className="mt-2 text-muted-foreground">
              Preencha os passos abaixo e em poucos minutos sua barbearia estará no ar.
            </p>
          </div>
          <Suspense fallback={<SignupFlowFallback />}>
            <SignupFlow />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
