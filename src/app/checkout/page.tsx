import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-semibold text-foreground hover:text-primary">
            Trivor Barber
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Início
            </Link>
            <Link
              href="/areadocliente"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Área do cliente
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <section className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)] sm:p-12">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Checkout
          </h1>
          <p className="mt-3 text-muted-foreground">
            Página placeholder. Em breve: fluxo de pagamento e assinatura.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-muted/50 px-5 font-medium text-foreground transition-colors hover:bg-muted"
            >
              Voltar ao início
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
