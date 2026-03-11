import Image from "next/image";
import { landingContent } from "./landing-content";
import { landingImages } from "./landing-images";

const productImageMap: Record<string, string> = {
  agenda: landingImages.product.agenda,
  clients: landingImages.product.clients,
  controls: landingImages.product.controls,
  dashboard: landingImages.product.dashboard,
};

export function ProductShowcaseSection() {
  const { title, subtitle, blocks } = landingContent.product;

  return (
    <section className="border-b border-border/40 bg-muted/20 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-14">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="space-y-10 sm:space-y-12">
          {blocks.map((block, index) => {
            const imageSrc = productImageMap[block.imageKey];
            const isReversed = index % 2 === 1;

            return (
              <div
                key={block.id}
                className="grid items-center gap-8 rounded-3xl border border-border/60 bg-white px-4 py-6 shadow-sm sm:px-8 sm:py-8 md:grid-cols-2"
              >
                <div className={isReversed ? "order-2 md:order-1" : "order-1"}>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1} · Produto
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">
                    {block.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    {block.description}
                  </p>
                </div>

                <div
                  className={
                    isReversed
                      ? "order-1 md:order-2"
                      : "order-2 md:order-1"
                  }
                >
                  <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-slate-950/90 p-3 shadow-xl shadow-black/25">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-900">
                      <Image
                        src={imageSrc}
                        alt={block.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

