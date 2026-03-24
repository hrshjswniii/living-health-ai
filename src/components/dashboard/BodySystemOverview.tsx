import { motion } from "framer-motion";
import { Heart, Brain as BrainIcon, Bone, Wind, Droplets, Eye } from "lucide-react";

const systems = [
  { name: "Cardiovascular", icon: Heart, risk: "Moderate", confidence: 72, color: "text-dna-rose" },
  { name: "Neurological", icon: BrainIcon, risk: "Low", confidence: 91, color: "text-dna-violet" },
  { name: "Musculoskeletal", icon: Bone, risk: "Low", confidence: 85, color: "text-dna-warm" },
  { name: "Respiratory", icon: Wind, risk: "Low", confidence: 94, color: "text-dna-teal" },
  { name: "Metabolic", icon: Droplets, risk: "Moderate", confidence: 68, color: "text-dna-blue" },
  { name: "Vision", icon: Eye, risk: "Low", confidence: 89, color: "text-dna-green" },
];

const riskBg: Record<string, string> = {
  Low: "bg-risk-low/15 text-risk-low",
  Moderate: "bg-risk-moderate/15 text-risk-moderate",
  High: "bg-risk-high/15 text-risk-high",
};

export const BodySystemOverview = () => (
  <div className="bg-card rounded-2xl border border-border shadow-card p-6">
    <h3 className="font-display font-bold text-lg mb-1">Living Health Twin</h3>
    <p className="text-sm text-muted-foreground mb-5">Your body systems with risk markers and confidence</p>
    <div className="grid grid-cols-2 gap-3">
      {systems.map((sys, i) => (
        <motion.div
          key={sys.name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08 }}
          className="p-3 rounded-xl border border-border bg-background flex items-center gap-3"
        >
          <sys.icon className={`h-5 w-5 ${sys.color} shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{sys.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${riskBg[sys.risk]}`}>{sys.risk}</span>
              <span className="text-[10px] text-muted-foreground">{sys.confidence}%</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);
