import { landingContent } from "./landing-content";

export function HowItWorksSection() {
  const { id, title, subtitle, steps } = landingContent.howItWorks;

  return (
    <section
      id={id}
      className="border-b border-border/40 bg-muted/20 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.step}
              className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-white p-5 text-center shadow-sm"
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {step.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground sm:text-base">
                  {step.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

