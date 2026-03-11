import { Calendar, Users, CreditCard, BarChart3, Sparkles, Clock } from "lucide-react";
import { landingContent } from "./landing-content";

const featureIconMap = {
  agenda: Calendar,
  clients: Users,
  plans: CreditCard,
  reports: BarChart3,
  automations: Sparkles,
  no-shows: Clock,
};

export function FeaturesGridSection() {
  const { title, subtitle, items } = landingContent.features;

  return (
    <section className="border-b border-border/40 bg-white px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = featureIconMap[item.key];
            return (
              <div
                key={item.key}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-muted/30 p-5 shadow-sm"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

