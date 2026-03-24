import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";

const Index = () => (
  <div className="min-h-screen bg-background">
    <LandingNav />
    <HeroSection />
    <HowItWorksSection />
    <footer className="py-12 text-center border-t border-border">
      <p className="text-sm text-muted-foreground">© 2026 Living Health DNA — Patient-Owned Healthcare Intelligence</p>
    </footer>
  </div>
);

export default Index;
