import { landingContent } from "./landing-content";

export function ProblemSection() {
  const { title, items, closing } = landingContent.problem;

  return (
    <section className="border-b border-border/40 bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-4 sm:text-base">
          {items.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3"
            >
              {item}
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground sm:text-base">
          {closing}
        </p>
      </div>
    </section>
  );
}

