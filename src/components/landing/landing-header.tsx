import Link from "next/link";
import { Button } from "@/components/ui/button";
import { landingContent } from "./landing-content";

export function LandingHeader() {
  const { logo, links, cta } = landingContent.header;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground sm:text-lg"
        >
          {logo}
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link href={cta.href}>
            <Button size="sm" className="rounded-full px-5 text-xs sm:text-sm">
              {cta.label}
            </Button>
          </Link>
        </nav>

        <Link href={cta.href} className="sm:hidden">
          <Button size="sm" className="rounded-full px-4 text-xs">
            {cta.label}
          </Button>
        </Link>
      </div>
    </header>
  );
}

