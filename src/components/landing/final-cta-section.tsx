import Link from "next/link";
import { Button } from "@/components/ui/button";
import { landingContent } from "./landing-content";

export function FinalCTASection() {
  const { title, subtitle, primaryCta } = landingContent.finalCta;

  return (
    <section className="bg-primary px-4 py-20 text-primary-foreground sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          {title}
        </h2>
        <p className="mt-4 text-sm text-primary-foreground/90 sm:text-base">
          {subtitle}
        </p>
        <div className="mt-8 flex justify-center">
          <Link href={primaryCta.href}>
            <Button
              size="lg"
              variant="secondary"
              className="h-11 rounded-full px-8 text-sm font-medium"
            >
              {primaryCta.label}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

