import { motion } from "framer-motion";
import { FloatingAgentNodes } from "./FloatingAgentNodes";
import { Shield, Brain, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();

  const handleEnter = () => {
    navigate(isAuthenticated ? "/dashboard" : "/auth");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      <FloatingAgentNodes />
      <div className="container relative z-10 flex flex-col items-center text-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-accent/60 border border-border"
        >
          <div className="w-2 h-2 rounded-full bg-dna-green animate-agent-pulse" />
          <span className="text-sm font-medium text-accent-foreground">Multi-Agent AI System Active</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[1.1] max-w-4xl mb-6"
        >
          Your Health,{" "}
          <span className="text-gradient-dna">Decoded by AI</span>
          <br />
          Controlled by You
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
        >
          Living Health DNA is a patient-owned, compliance-safe healthcare intelligence system.
          Five specialized AI agents work together to understand your body — transparently and safely.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" className="text-base px-8 py-6" onClick={handleEnter}>
            <Brain className="mr-2 h-5 w-5" />
            Enter Health Dashboard
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8 py-6" onClick={() => {
            document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
          }}>
            <Activity className="mr-2 h-5 w-5" />
            See How It Works
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 flex items-center gap-8 text-muted-foreground"
        >
          {[
            { icon: Shield, label: "HIPAA Compliant" },
            { icon: Brain, label: "5 AI Agents" },
            { icon: Activity, label: "Full Audit Trail" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <Icon className="h-4 w-4 text-dna-green" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
