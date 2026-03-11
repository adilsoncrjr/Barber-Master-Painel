import { LandingHeader } from "./landing-header";
import { HeroSection } from "./hero-section";
import { ProblemSection } from "./problem-section";
import { ProductShowcaseSection } from "./product-showcase-section";
import { FeaturesGridSection } from "./features-grid-section";
import { HowItWorksSection } from "./how-it-works-section";
import { PlansSection } from "./plans-section";
import { FinalCTASection } from "./final-cta-section";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-foreground">
      <LandingHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <ProductShowcaseSection />
        <FeaturesGridSection />
        <HowItWorksSection />
        <PlansSection />
        <FinalCTASection />
      </main>
      <footer className="border-t border-border/60 bg-muted/20 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row sm:text-sm sm:px-6">
          <span className="font-medium text-foreground">TRIVOR</span>
          <span>© {new Date().getFullYear()} TRIVOR. Painel para barbearias.</span>
        </div>
      </footer>
    </div>
  );
}

