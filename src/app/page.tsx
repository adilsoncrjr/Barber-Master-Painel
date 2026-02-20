import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="font-semibold text-foreground">Trivor Barber</span>
          <nav className="flex gap-4">
            <Link
              href="/checkout"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Checkout
            </Link>
            <Link
              href="/areadocliente"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Área do cliente
            </Link>
            <Link
              href="/app/barbearia-do-adilson"
              className="text-sm font-medium text-primary hover:underline"
            >
              Acessar app
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <section className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Trivor Barber
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            Landing placeholder — domínio principal trivorbarber.com.br
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/checkout"
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Ir para Checkout
            </Link>
            <Link
              href="/areadocliente"
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-xl border-2 border-primary bg-transparent px-6 text-base font-semibold text-primary transition-colors hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Área do cliente
            </Link>
            <Link
              href="/app/barbearia-do-adilson"
              className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-xl border border-border bg-card px-6 text-base font-semibold text-foreground shadow-sm transition-all hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              App — Barbearia do Adilson
            </Link>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-border/60 py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          Trivor Barber — Painel principal
        </div>
      </footer>
    </div>
  );
}
